# PHP Learning Editor-1

An interactive PHP code editor with a simulated terminal and web view, powered by Gemini. Write PHP code, see the console output, and view the rendered HTML side-by-side.

## Features

### 1. Code Editing & Execution
- **Live PHP Code Editor**: Write and edit PHP code in a modern, syntax-highlighted editor.
- **Run PHP Code**: Execute PHP code instantly and view both terminal output (e.g., `echo`, `var_dump`) and rendered HTML output.
- **Multiple Files & Folders**: Create, rename, and delete files and folders in a virtual workspace.
- **Tabbed Interface**: Open multiple files in tabs for easy navigation.
- **Import/Export**: Import files into the workspace or export the entire workspace as a ZIP file.

### 2. Simulated Terminal
- **Command Support**: Run commands like `run`, `php [filename]`, `ls`, `cat [path]`, `composer require`, `npm install`, and more.
- **Output Panel**: View command results, errors, and PHP output in a dedicated terminal panel.
- **Multiple Terminals**: Open and manage multiple terminal instances.

### 3. Web View
- **Live HTML Preview**: See the rendered output of your PHP code in a web view panel, side-by-side with the editor.
- **Full-Screen Mode**: Expand the web view for focused previewing.

### 4. AI-Powered Assistance (Gemini)
- **AI Chatbot**: Get help, explanations, and code suggestions from an AI assistant.
- **Multiple AI Agents**:
  - **Codebase Agent**: General-purpose assistant with workspace context.
  - **Agent Builder**: Scaffolds and modifies projects.
  - **Code Writer**: Writes new code from scratch.
  - **Bug Fixer**: Finds and fixes errors in your code.
  - **Doc Writer**: Generates comments and documentation.
  - **PHP Tutor**: Explains PHP concepts and answers questions.
- **Inline AI Diff Viewer**: View and apply AI-suggested code changes inline.

### 5. Learning Path
- **PHP Topics**: Browse a curated list of PHP learning topics, each with explanations and code examples.
- **Daily Progression**: Topics are organized by day for structured learning.

### 6. Notes
- **Notion-Style Notes**: Take notes, jot down ideas, or save code snippets. Notes are saved automatically in local storage.

### 7. Problems Panel
- **Linting & Error Detection**: Automatic PHP code linting with error/warning display.
- **Auto-Fix**: Apply AI-powered fixes to detected problems.

### 8. Customization & UX
- **Resizable Panels**: Drag to resize editor, terminal, and side panels.
- **Dark/Light Theme**: Toggle between dark and light modes.
- **Responsive Design**: Works on desktop and mobile browsers.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open in your browser:**
   Navigate to the local server URL (usually `http://localhost:5173`).

## Project Structure

- `App.tsx` — Main application entry point.
- `components/` — UI components (editor, terminal, panels, etc.).
- `data/phpTopics.ts` — PHP learning topics and code examples.
- `services/geminiService.ts` — AI integration and code execution logic.
- `hooks/` — Custom React hooks.
- `types.ts` — TypeScript types and interfaces.

## Requirements
- Node.js 18+
- npm 9+
- (Optional) Google Gemini API key for AI features (set in `.env.local` as `API_KEY`)

## Usage Tips
- Use the terminal for advanced commands (see `help` in the terminal for a full list).
- Switch between AI agents for different types of help.
- Explore the Learning Path for structured PHP lessons.
- Take notes in the Notes panel; they persist in your browser.

## License
MIT

---

**Versioning:**
- Use semantic versioning for releases.
- Tag releases with `vX.Y.Z` and include a summary of changes in the tag description. 