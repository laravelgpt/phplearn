export enum MessageType {
  COMMAND,
  OUTPUT,
  ERROR,
  SYSTEM,
  PHP_OUTPUT,
}

export interface TerminalMessage {
  type: MessageType;
  text: string;
  timestamp: string;
}

export interface TerminalInstance {
  id: string;
  name: string;
  history: TerminalMessage[];
}

export type FileSystemNode = FileNode | DirectoryNode;

export interface FileNode {
  id: string;
  name: string;
  content: string;
  type: 'file';
}

export interface DirectoryNode {
  id: string;
  name: string;
  type: 'folder';
  children: FileSystemNode[];
}

export type AgentType = 'agent' | 'writer' | 'fixer' | 'documenter' | 'tutor' | 'builder';

export interface AgentAction {
  type: 'CREATE_FILE' | 'UPDATE_FILE' | 'DELETE_FILE' | 'CREATE_FOLDER' | 'DELETE_FOLDER';
  path: string;
  content?: string;
}

export interface AgentResponse {
  explanation: string;
  actions: AgentAction[];
}

export type AgentResponseStatus = 'pending' | 'applied' | 'rejected';


export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  isStreaming?: boolean;
  imageUrl?: string;
  agentResponse?: AgentResponse;
  agentResponseStatus?: AgentResponseStatus;
}

export type BottomTabId = string;

export interface CodeProblem {
    line: number;
    message: string;
    severity: 'error' | 'warning';
}