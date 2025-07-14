



import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { FileSystemNode, CodeProblem, AgentType, AgentResponse } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const PHP_EXECUTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    terminalOutput: {
      type: Type.STRING,
      description: "The textual output from PHP commands like echo, print, var_dump. Should include any PHP errors or warnings.",
    },
    webOutput: {
      type: Type.STRING,
      description: "The raw HTML content rendered by the script, specifically content outside of <?php ?> tags. If no HTML is outside the tags, this should be an empty string.",
    },
  },
  required: ["terminalOutput", "webOutput"],
};

const PHP_LINTING_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        problems: {
            type: Type.ARRAY,
            description: "A list of problems found in the code.",
            items: {
                type: Type.OBJECT,
                properties: {
                    line: {
                        type: Type.INTEGER,
                        description: "The line number where the problem occurs."
                    },
                    message: {
                        type: Type.STRING,
                        description: "A description of the problem."
                    },
                    severity: {
                        type: Type.STRING,
                        enum: ['error', 'warning'],
                        description: "The severity of the problem."
                    }
                },
                 required: ["line", "message", "severity"]
            }
        }
    },
    required: ["problems"]
};

const PHP_FIX_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        fixedCode: {
            type: Type.STRING,
            description: "The complete, corrected PHP code as a single string. The code should be fully functional and ready to be placed into a file."
        },
    },
    required: ["fixedCode"],
};

const PHP_FIX_ALL_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        fixedCode: {
            type: Type.STRING,
            description: "The complete, corrected PHP code as a single string, with all identified problems fixed. The code should be fully functional and ready to be placed into a file."
        },
    },
    required: ["fixedCode"],
};


const AGENT_ACTION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        type: {
            type: Type.STRING,
            enum: ['CREATE_FILE', 'UPDATE_FILE', 'DELETE_FILE', 'CREATE_FOLDER', 'DELETE_FOLDER'],
            description: "The type of action to perform on the file system."
        },
        path: {
            type: Type.STRING,
            description: "The full path of the file or folder from the workspace root. e.g., 'src/components/Button.php'. When creating a new file/folder, this path should not exist."
        },
        content: {
            type: Type.STRING,
            description: "The full content of the file for CREATE_FILE and UPDATE_FILE actions. This field is ignored for DELETE_FILE and CREATE_FOLDER."
        }
    },
    required: ["type", "path"]
};

const AGENT_BUILDER_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        explanation: {
            type: Type.STRING,
            description: "A friendly, step-by-step explanation of the changes you are proposing. This will be shown to the user before they approve the changes. Use markdown for formatting."
        },
        actions: {
            type: Type.ARRAY,
            description: "A list of file system actions to be executed to fulfill the user's request. This can be empty if you are only answering a question.",
            items: AGENT_ACTION_SCHEMA
        }
    },
    required: ["explanation", "actions"]
};

const COMPOSER_PACKAGE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    packageName: {
      type: Type.STRING,
      description: "The full name of the package, e.g., 'monolog/monolog'."
    },
    latestVersion: {
      type: Type.STRING,
      description: "The latest stable version constraint, e.g., '^3.5'."
    },
  },
  required: ["packageName", "latestVersion"],
};

const NPM_PACKAGE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    packageName: {
      type: Type.STRING,
      description: "The name of the package, e.g., 'lodash'."
    },
    latestVersion: {
      type: Type.STRING,
      description: "The latest stable version constraint, e.g., '^4.17.21'."
    },
  },
  required: ["packageName", "latestVersion"],
};

const BULK_PACKAGE_SCHEMA_ITEM = {
    type: Type.OBJECT,
    properties: {
        packageName: {
          type: Type.STRING,
          description: "The full name of the package."
        },
        latestVersion: {
          type: Type.STRING,
          description: "The latest stable version constraint, e.g., '^3.5'."
        },
    },
    required: ["packageName", "latestVersion"],
};

const COMPOSER_BULK_PACKAGE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    packages: {
      type: Type.ARRAY,
      description: "A list of PHP packages and their latest versions.",
      items: BULK_PACKAGE_SCHEMA_ITEM
    }
  },
  required: ['packages']
};

const NPM_BULK_PACKAGE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    packages: {
      type: Type.ARRAY,
      description: "A list of NPM packages and their latest versions.",
      items: BULK_PACKAGE_SCHEMA_ITEM
    }
  },
  required: ['packages']
};

const PHP_GENERATE_INLINE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        code: {
            type: Type.STRING,
            description: "The generated PHP code snippet. The code should be concise and directly address the user's prompt. Do not include <?php or ?> tags unless the context explicitly requires a full script block. The snippet should be ready to be inserted directly into existing code."
        },
    },
    required: ["code"],
};

const PHP_EDIT_INLINE_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        code: {
            type: Type.STRING,
            description: "The modified PHP code snippet. This code will directly replace the user's original selection. Do not include explanations, markdown formatting, or any text other than the code itself."
        },
    },
    required: ["code"],
};


export const executePhpCode = async (code: string): Promise<{ terminalOutput: string; webOutput: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Execute the following PHP code:\n\n\`\`\`php\n${code}\n\`\`\``,
      config: {
        systemInstruction: `You are an expert PHP 8.2 interpreter. Execute the provided PHP code and return the result in a structured JSON format.
- Capture any output from functions like \`echo\`, \`print\`, \`print_r\`, and \`var_dump\` in the 'terminalOutput' field.
- Capture any raw HTML content outside of \`<?php ... ?>\` tags in the 'webOutput' field.
- If there is a fatal error in the PHP code, the 'terminalOutput' should contain the PHP error message, and 'webOutput' should be empty.
- Do not add any extra explanations or text outside of the requested JSON object.`,
        responseMimeType: "application/json",
        responseSchema: PHP_EXECUTION_SCHEMA,
        temperature: 0.0,
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    return {
      terminalOutput: result.terminalOutput || "",
      webOutput: result.webOutput || "",
    };
  } catch (error) {
    console.error("Error executing PHP code via Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return {
      terminalOutput: `// AI Execution Error //\n${errorMessage}`,
      webOutput: `<div style="padding:20px; font-family:sans-serif; color:red;"><h1>Execution Error</h1><p>Could not execute PHP code. Please check the console for details.</p></div>`,
    };
  }
};

export const lintPhpCode = async (code: string): Promise<CodeProblem[]> => {
    if (!code.trim() || !code.includes('<?php')) {
        return [];
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following PHP code and identify any potential problems, bugs, or style issues.
\`\`\`php
${code}
\`\`\`
`,
            config: {
                systemInstruction: `You are a PHP code linter. Your task is to analyze the given PHP code and return a list of problems in a structured JSON format.
- Identify potential bugs, syntax errors, and deviations from best practices.
- Do not comment on code that is correct.
- If no problems are found, return an empty array for the "problems" field.`,
                responseMimeType: "application/json",
                responseSchema: PHP_LINTING_SCHEMA,
                temperature: 0.1,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result.problems || [];

    } catch (error) {
        console.error("Error linting PHP code via Gemini:", error);
        // Don't bother the user with linter errors.
        return [];
    }
}

export const fixPhpCode = async (code: string, problem: CodeProblem): Promise<{ fixedCode: string } | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The following PHP code has a problem on line ${problem.line}: "${problem.message}". Please fix ONLY this specific problem and return the entire, complete, corrected code.\n\n\`\`\`php\n${code}\n\`\`\``,
            config: {
                systemInstruction: `You are an expert PHP code fixing tool. The user provides a PHP script with a known problem. Your task is to correct the single, specific problem described and return the entire, complete, corrected code.
- Do not make any other changes to the code.
- Do not add any explanations, apologies, or extra text outside of the requested JSON object.
- The returned code must be the full script, not just the fixed snippet.`,
                responseMimeType: "application/json",
                responseSchema: PHP_FIX_SCHEMA,
                temperature: 0.0,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        if (result.fixedCode) {
            return { fixedCode: result.fixedCode };
        }
        return null;

    } catch (error) {
        console.error("Error fixing PHP code via Gemini:", error);
        return null;
    }
};

export const fixAllPhpCode = async (code: string, problems: CodeProblem[]): Promise<{ fixedCode: string } | null> => {
    const problemDescriptions = problems.map(p => `- Line ${p.line}: ${p.message}`).join('\n');
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The following PHP code has multiple problems. Please fix all of them and return the entire, corrected code.

Problems:
${problemDescriptions}

Code with problems:
\`\`\`php
${code}
\`\`\`
`,
            config: {
                systemInstruction: `You are an expert PHP code fixing tool. The user provides a PHP script and a list of known problems. Your task is to correct all of the problems described and return the entire, complete, corrected code.
- Do not make any other changes to the code.
- Do not add any explanations, apologies, or extra text outside of the requested JSON object.
- The returned code must be the full script, not just fixed snippets.`,
                responseMimeType: "application/json",
                responseSchema: PHP_FIX_ALL_SCHEMA,
                temperature: 0.0,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        if (result.fixedCode) {
            return { fixedCode: result.fixedCode };
        }
        return null;

    } catch (error) {
        console.error("Error fixing all PHP code via Gemini:", error);
        return null;
    }
};

export const generateCodeInline = async (prompt: string, contextCode: string): Promise<{ code: string } | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The user wants to generate a PHP code snippet.
Context from their current file:
---
${contextCode}
---
User's prompt: "${prompt}"
Generate the code snippet now.`,
            config: {
                systemInstruction: `You are an AI code assistant. Your task is to generate a PHP code snippet based on the user's prompt and the surrounding code context.
- Return ONLY the raw code snippet.
- Do NOT include \`\`\`php markers or any other markdown.
- Do NOT include any explanations or conversational text.
- The snippet should be ready for direct insertion into the user's editor.`,
                responseMimeType: "application/json",
                responseSchema: PHP_GENERATE_INLINE_SCHEMA,
                temperature: 0.1,
            }
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result.code ? { code: result.code } : null;
    } catch (error) {
        console.error("Error generating inline PHP code via Gemini:", error);
        return null;
    }
};

export const editCodeInline = async (prompt: string, codeToEdit: string, contextCode: string): Promise<{ code: string } | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `The user wants to edit a PHP code snippet.
The code they have selected to edit is:
---
${codeToEdit}
---
The surrounding code for context is:
---
${contextCode}
---
User's instruction for the edit: "${prompt}"
Generate the modified code snippet now.`,
            config: {
                systemInstruction: `You are an AI code refactoring tool. The user provides a code snippet, surrounding context, and an instruction. Your task is to modify the snippet according to the instruction.
- Return ONLY the modified, raw code snippet. The result will replace the original selection.
- Do NOT include \`\`\`php markers or any other markdown.
- Do NOT include any explanations or conversational text.`,
                responseMimeType: "application/json",
                responseSchema: PHP_EDIT_INLINE_SCHEMA,
                temperature: 0.0,
            }
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result.code ? { code: result.code } : null;
    } catch (error) {
        console.error("Error editing inline PHP code via Gemini:", error);
        return null;
    }
};


export const getComposerPackageInfo = async (packageName: string): Promise<{ packageName: string; latestVersion: string } | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `What is the latest stable version for the PHP Composer package "${packageName}"?`,
            config: {
                systemInstruction: "You are a PHP package expert. Provide the package name and its latest stable version constraint in JSON format.",
                responseMimeType: "application/json",
                responseSchema: COMPOSER_PACKAGE_SCHEMA,
                temperature: 0.0,
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(`Error fetching composer package info for ${packageName}:`, error);
        return null;
    }
}

export const getNpmPackageInfo = async (packageName: string): Promise<{ packageName: string; latestVersion: string } | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `What is the latest stable version for the NPM package "${packageName}"?`,
            config: {
                systemInstruction: "You are a Node.js package expert. Provide the package name and its latest stable version constraint in JSON format.",
                responseMimeType: "application/json",
                responseSchema: NPM_PACKAGE_SCHEMA,
                temperature: 0.0,
            }
        });
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);
    } catch (error) {
        console.error(`Error fetching npm package info for ${packageName}:`, error);
        return null;
    }
}

export const getComposerBulkPackageInfo = async (packageNames: string[]): Promise<{ packageName: string; latestVersion: string }[] | null> => {
    if (packageNames.length === 0) return [];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `For the following list of PHP Composer packages, what are their latest stable versions? List: ${packageNames.join(', ')}`,
            config: {
                systemInstruction: "You are a PHP package expert. For the given list of packages, provide their latest stable version constraints in a JSON array.",
                responseMimeType: "application/json",
                responseSchema: COMPOSER_BULK_PACKAGE_SCHEMA,
                temperature: 0.0,
            }
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result.packages || [];
    } catch (error) {
        console.error(`Error fetching bulk composer package info:`, error);
        return null;
    }
};

export const getNpmBulkPackageInfo = async (packageNames: string[]): Promise<{ packageName: string; latestVersion: string }[] | null> => {
    if (packageNames.length === 0) return [];
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `For the following list of NPM packages, what are their latest stable versions? List: ${packageNames.join(', ')}`,
            config: {
                systemInstruction: "You are a Node.js package expert. For the given list of packages, provide their latest stable version constraints in a JSON array.",
                responseMimeType: "application/json",
                responseSchema: NPM_BULK_PACKAGE_SCHEMA,
                temperature: 0.0,
            }
        });
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result.packages || [];
    } catch (error) {
        console.error(`Error fetching bulk npm package info:`, error);
        return null;
    }
};


const serializeWorkspaceForAgent = (workspace: FileSystemNode[]): string => {
    const workspaceWithoutCircularDeps = JSON.stringify(workspace, (key, value) => {
        if (key === 'parent') return undefined; // remove parent refs if they exist
        return value;
    }, 2);
    return workspaceWithoutCircularDeps;
};

const AGENT_SYSTEM_INSTRUCTIONS: Record<AgentType, (workspaceJson: string, activeFile: string) => string> = {
    agent: (workspaceJson, activeFile) => `You are an expert programming agent and chatbot called Codebase Agent.
You are assisting a user in a web-based PHP learning editor.
You have been provided with the user's entire workspace as a JSON object, including the file structure and the content of each file.
The user currently has the file "${activeFile}" open. Prioritize this file in your analysis unless the user specifies otherwise.
Your main capabilities are:
1.  **Read Files**: You can understand the content of all files in the workspace.
2.  **Write and Suggest Code**: Provide code snippets or modifications relevant to the user's files.
3.  **Answer Questions**: Answer questions about the user's codebase or general programming topics.
4.  **Debug**: Help the user find and fix bugs in their code.

When responding, always:
- Base your answers on the provided workspace context.
- Be concise and helpful.
- Format your responses using markdown.
- Use code blocks for all code snippets (e.g., \`\`\`php ... \`\`\`).

The user's current workspace is:
\`\`\`json
${workspaceJson}
\`\`\`
`,
    writer: (workspaceJson, activeFile) => `You are an expert PHP code writer.
Your sole purpose is to write high-quality, efficient, and clean PHP code based on the user's request.
The user currently has "${activeFile}" open.
Analyze the user's request and provide only the code they asked for.
Do not add extra explanations, greetings, or sign-offs unless specifically asked.
Format all code within a \`\`\`php ... \`\`\` markdown block.
You have access to the user's workspace for context:
\`\`\`json
${workspaceJson}
\`\`\`
`,
    fixer: (workspaceJson, activeFile) => `You are a Bug Fixer bot. Your goal is to identify, diagnose, and suggest fixes for bugs in the user's PHP code.
The user currently has "${activeFile}" open.
1.  Analyze the user's code, which may be in their message, an uploaded image, or their workspace.
2.  Clearly explain the bug or error.
3.  Provide a corrected code snippet.
4.  Explain why the fix works.
Keep your response focused on fixing the issue.
You have access to the user's workspace for context:
\`\`\`json
${workspaceJson}
\`\`\`
`,
    documenter: (workspaceJson, activeFile) => `You are a documentation writing bot.
Your task is to write clear and concise documentation for the user's PHP code. This includes PHPDoc blocks, inline comments, and explanations of complex logic.
The user currently has "${activeFile}" open.
Produce code with the requested documentation. Do not add any conversational text outside of the code block.
You have access to the user's workspace for context:
\`\`\`json
${workspaceJson}
\`\`\`
`,
    tutor: (workspaceJson, activeFile) => `You are a friendly and encouraging PHP Tutor.
Your goal is to help the user learn PHP by explaining concepts, answering questions, and providing small, easy-to-understand examples.
The user currently has "${activeFile}" open.
Use analogies and simple language. Avoid overly technical jargon where possible.
Praise the user for asking good questions and encourage their learning journey.
You have access to the user's workspace for context when they ask questions about their code:
\`\`\`json
${workspaceJson}
\`\`\`
`,
    builder: (workspaceJson, activeFile) => `You are an expert AI software engineer called Agent Builder.
Your primary mission is to help users build and modify full-stack PHP applications by generating and proposing file system operations. You can handle complex requests like "scaffold a new CRUD application" or "refactor my project to use a class-based structure".

A typical full-stack PHP project might include:
- A public-facing 'index.php' as the entry point.
- A 'src' or 'includes' directory for PHP logic (classes, functions).
- A 'public' directory for assets like CSS ('style.css') and JavaScript ('app.js').
- Configuration files like 'config.php' for database credentials.
- Separate files for different parts of a CRUD application (e.g., 'create.php', 'read.php', 'update.php', 'delete.php').

You have been provided with the user's entire workspace as a JSON object. The user currently has "${activeFile}" open.

Analyze the user's request and the current workspace. Then, devise a comprehensive plan and propose a series of file system actions to accomplish the task.

**Your Capabilities:**
- \`CREATE_FOLDER\`: Create a new, empty folder.
- \`CREATE_FILE\`: Create a new file with specified content.
- \`UPDATE_FILE\`: Replace the entire content of an existing file.
- \`DELETE_FILE\`: Delete an existing file.
- \`DELETE_FOLDER\`: Delete an existing folder and all its contents.

**CRITICAL INSTRUCTIONS & BEST PRACTICES:**
1.  **Think and Plan First**: Before proposing actions, think about the entire project structure.
2.  **Explain Your Plan**: Your 'explanation' must be clear, user-friendly, and describe the high-level goal and the steps you will take. Use markdown for readability.
3.  **Structure Matters**: Always create parent directories with \`CREATE_FOLDER\` first before creating files inside them. Actions are executed sequentially.
4.  **Complete File Content**: For \`CREATE_FILE\` and \`UPDATE_FILE\`, you MUST provide the *entire* file content. Do not provide partial snippets or diffs.
5.  **Use Full Paths**: All file paths must be relative to the workspace root (e.g., 'public/css/style.css' or 'src/User.php').
6.  **Be Comprehensive**: For a request like "create a blog", you should create all the necessary files: the main page, the post detail page, the database connection logic, basic CSS, etc.
7.  **Respond in JSON**: Your entire output MUST be a single, valid JSON object conforming to the required schema. Do not add any text or markdown outside of this JSON object.
8.  **If Unsure, Ask**: If a request is ambiguous, you can provide an explanation asking for clarification and an empty 'actions' array.

The user's current workspace is:
\`\`\`json
${workspaceJson}
\`\`\`
`,
};


export const getChatResponseStream = async (
    message: string, 
    history: any[], 
    workspaceContext: FileSystemNode[],
    agentType: AgentType,
    activeFileName: string,
    image?: { mimeType: string; data: string; }
): Promise<AsyncGenerator<GenerateContentResponse>> => {
    
    const workspaceJson = serializeWorkspaceForAgent(workspaceContext);
    const systemInstruction = AGENT_SYSTEM_INSTRUCTIONS[agentType](workspaceJson, activeFileName);
    
    const textPart = { text: message ? `The user asks: "${message}"` : 'The user sent an image, please analyze it in the context of their workspace.' };
    const parts: any[] = [];

    if (image) {
        parts.push({
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            }
        });
    }
    parts.push(textPart);
    
    const response = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: { parts: parts },
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return response;
};

export const getAgentBuilderChanges = async (
    message: string,
    history: any[],
    workspaceContext: FileSystemNode[],
    activeFileName: string,
    image?: { mimeType: string; data: string; }
): Promise<AgentResponse> => {
    
    const workspaceJson = serializeWorkspaceForAgent(workspaceContext);
    const systemInstruction = AGENT_SYSTEM_INSTRUCTIONS['builder'](workspaceJson, activeFileName);
    
    const textPart = { text: message ? `The user's request is: "${message}"` : 'The user sent an image, please analyze it and propose changes to the workspace.' };
    const parts: any[] = [];

    if (image) {
        parts.push({
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            }
        });
    }
    parts.push(textPart);
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: parts },
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: AGENT_BUILDER_SCHEMA,
                temperature: 0.1,
            }
        });

        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as AgentResponse;

    } catch (error) {
        console.error("Error getting agent builder changes:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return {
            explanation: `I'm sorry, I encountered an error while trying to process your request.\n\n**Error:**\n\`\`\`\n${errorMessage}\n\`\`\``,
            actions: []
        };
    }
};