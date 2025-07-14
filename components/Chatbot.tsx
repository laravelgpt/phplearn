import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, AgentType, AgentAction, AgentResponse, AgentResponseStatus } from '../types';
import { Icon } from './Icon';

const MarkdownContent: React.FC<{ content: string }> = React.memo(({ content }) => {
    const parts = content.split(/(```[\s\S]*?```)/g).filter(Boolean);

    return (
        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-pre:my-2">
            {parts.map((part, index) => {
                if (part.startsWith('```')) {
                    const langMatch = part.match(/^```(\w*)\n/);
                    const language = langMatch ? langMatch[1] : 'text';
                    const code = part.replace(/^```(?:\w*\n)?/, '').replace(/```$/, '');

                    return (
                        <div key={index} className="bg-slate-200/50 dark:bg-slate-800/50 rounded-md my-2 overflow-hidden">
                            <div className="text-xs text-slate-500 dark:text-slate-400 px-4 py-1 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <span>{language}</span>
                            </div>
                            <pre className="p-4 text-sm overflow-x-auto bg-transparent mt-0">
                                <code>{code}</code>
                            </pre>
                        </div>
                    );
                }
                return <p key={index} className="whitespace-pre-wrap">{part}</p>;
            })}
        </div>
    );
});

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1 p-2">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
    </div>
);

const getActionIcon = (type: AgentAction['type']): React.ComponentProps<typeof Icon>['icon'] => {
    switch(type) {
        case 'CREATE_FILE': return 'file-plus';
        case 'CREATE_FOLDER': return 'folder-plus';
        case 'UPDATE_FILE': return 'edit';
        case 'DELETE_FILE':
        case 'DELETE_FOLDER':
            return 'trash-2';
        default: return 'file';
    }
};

const getActionColor = (type: AgentAction['type']): string => {
    switch(type) {
        case 'CREATE_FILE':
        case 'CREATE_FOLDER':
            return 'text-green-600 dark:text-green-500';
        case 'UPDATE_FILE':
            return 'text-sky-600 dark:text-sky-500';
        case 'DELETE_FILE':
        case 'DELETE_FOLDER':
            return 'text-red-600 dark:text-red-500';
        default: return 'text-slate-600 dark:text-slate-500';
    }
};

const AgentActions: React.FC<{ 
    response: AgentResponse, 
    status: AgentResponseStatus, 
    onApply: () => void, 
    onReject: () => void 
}> = ({ response, status, onApply, onReject }) => {
    return (
        <div className="mt-3 border-t border-slate-300/50 dark:border-slate-600/50 pt-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Proposed Changes</h4>
            <div className="space-y-1.5 bg-slate-100/50 dark:bg-slate-800/50 p-2 rounded-md border border-slate-200 dark:border-slate-600/50">
                {response.actions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                        <Icon icon={getActionIcon(action.type)} className={`h-4 w-4 flex-shrink-0 ${getActionColor(action.type)}`} />
                        <span className={`font-mono font-semibold px-1 py-0.5 rounded ${getActionColor(action.type)} bg-opacity-10`}>{action.type.replace('_', ' ')}</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300 truncate">{action.path}</span>
                    </div>
                ))}
            </div>
            {status === 'pending' && (
                <div className="flex gap-2 pt-1">
                    <button onClick={onApply} className="text-xs px-2.5 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-1.5">
                        <Icon icon="check-circle" className="h-3.5 w-3.5" />
                        Accept
                    </button>
                    <button onClick={onReject} className="text-xs px-2.5 py-1 rounded-md bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-800 dark:text-slate-100 font-semibold flex items-center gap-1.5">
                         <Icon icon="x-circle" className="h-3.5 w-3.5" />
                        Reject
                    </button>
                </div>
            )}
             {status === 'applied' && (
                <div className="flex items-center gap-2 pt-1 text-xs text-green-600 dark:text-green-500 font-semibold">
                    <Icon icon="check-circle" className="h-4 w-4" />
                    <span>Changes applied to workspace.</span>
                </div>
            )}
             {status === 'rejected' && (
                <div className="flex items-center gap-2 pt-1 text-xs text-red-600 dark:text-red-500 font-semibold">
                    <Icon icon="x-circle" className="h-4 w-4" />
                    <span>Changes rejected.</span>
                </div>
            )}
        </div>
    )
};

interface ChatbotProps {
    messages: ChatMessage[];
    onSendMessage: (message: string, imageFile: File | null) => void;
    isTyping: boolean;
    agentType: AgentType;
    onAgentChange: (agentType: AgentType) => void;
    onApplyChanges: (messageId: string) => void;
    onRejectChanges: (messageId: string) => void;
}

const AGENT_DETAILS: Record<AgentType, { name: string, description: string }> = {
    agent: { name: 'Codebase Agent', description: 'General-purpose AI assistant with full workspace context.' },
    builder: { name: 'Agent Builder', description: 'Builds projects, scaffolds apps, and modifies the workspace.' },
    writer: { name: 'Code Writer', description: 'Specialized in writing new code from scratch.' },
    fixer: { name: 'Bug Fixer', description: 'Helps find and fix errors in your code.' },
    documenter: { name: 'Doc Writer', description: 'Generates comments and documentation for your code.' },
    tutor: { name: 'PHP Tutor', description: 'Explains PHP concepts and answers questions.' },
};

export const Chatbot: React.FC<ChatbotProps> = ({ messages, onSendMessage, isTyping, agentType, onAgentChange, onApplyChanges, onRejectChanges }) => {
    const [input, setInput] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(imageFile);
        } else {
            setImagePreviewUrl(null);
        }
    }, [imageFile]);

    const handleSend = () => {
        if ((input.trim() || imageFile) && !isTyping) {
            onSendMessage(input.trim(), imageFile);
            setInput('');
            setImageFile(null);
            if(fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };
    
    const removeImage = () => {
        setImageFile(null);
        if(fileInputRef.current) fileInputRef.current.value = '';
    }

    return (
        <div className="flex flex-col h-full min-h-0 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between p-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                    <Icon icon="message-square" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">AI Assistant</h3>
                </div>
                 <select
                    value={agentType}
                    onChange={(e) => onAgentChange(e.target.value as AgentType)}
                    className="text-xs bg-slate-200 dark:bg-slate-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    title="Select an AI Agent"
                >
                    {Object.entries(AGENT_DETAILS).map(([key, value]) => (
                        <option key={key} value={key}>{value.name}</option>
                    ))}
                </select>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-sky-500 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>
                           {msg.imageUrl && (
                                <img src={msg.imageUrl} alt="User upload" className="max-w-xs rounded-md mb-2" />
                           )}
                           {msg.content ? <MarkdownContent content={msg.content} /> : (msg.isStreaming && <TypingIndicator />)}
                           {msg.agentResponse && msg.agentResponse.actions.length > 0 && (
                                <AgentActions 
                                    response={msg.agentResponse}
                                    status={msg.agentResponseStatus || 'pending'}
                                    onApply={() => onApplyChanges(msg.id)}
                                    onReject={() => onRejectChanges(msg.id)}
                                />
                           )}
                        </div>
                    </div>
                ))}
                 {isTyping && messages[messages.length-1]?.role !== 'model' && (
                    <div className="flex justify-start">
                         <div className="max-w-xl p-3 rounded-lg bg-slate-200 dark:bg-slate-700">
                            <TypingIndicator />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                {imagePreviewUrl && (
                    <div className="relative mb-2 w-24 h-24">
                        <img src={imagePreviewUrl} alt="Preview" className="rounded-md w-full h-full object-cover" />
                        <button onClick={removeImage} className="absolute -top-1 -right-1 bg-slate-600 hover:bg-slate-800 text-white rounded-full p-0.5" title="Remove image">
                            <Icon icon="x" className="h-3 w-3" />
                        </button>
                    </div>
                )}
                <div className="flex items-center space-x-2">
                    <input type="file" accept="image/*" capture="environment" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                     <button onClick={() => fileInputRef.current?.click()} disabled={isTyping} className="p-2 text-slate-500 dark:text-slate-400 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50">
                        <Icon icon="paperclip" className="h-5 w-5" />
                    </button>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={`Message ${AGENT_DETAILS[agentType].name}...`}
                        className="flex-1 resize-none bg-slate-100 dark:bg-slate-800 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        rows={1}
                        disabled={isTyping}
                    />
                    <button onClick={handleSend} disabled={isTyping || (!input.trim() && !imageFile)} className="p-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 disabled:bg-slate-400 dark:disabled:bg-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};