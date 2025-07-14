import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { FileSystemNode, DirectoryNode } from '../types';
import { Icon } from './Icon';
import { ContextMenu } from './ContextMenu';

type EditingNode = {
    id: string; // for 'rename', it's the node id; for 'create', it's the parent id or 'root'
    type: 'rename' | 'create-file' | 'create-folder';
    parentId: string | null;
}

interface WorkspaceProps {
    workspace: FileSystemNode[];
    activeFileId: string | null;
    onFileSelect: (id: string) => void;
    onNodeCreate: (name: string, type: 'file' | 'folder', parentId: string | null) => boolean;
    onNodeRename: (nodeId: string, newName: string) => boolean;
    onNodeDelete: (nodeId: string) => void;
    onNodeExport: (nodeId: string) => void;
}

export interface WorkspaceHandle {
    triggerAdd: (type: 'file' | 'folder', parentId: string | null) => void;
}

type ContextMenuState = { x: number; y: number; nodeId: string };

const WorkspaceComponent: React.ForwardRefRenderFunction<WorkspaceHandle, WorkspaceProps> = ({ workspace, activeFileId, onFileSelect, onNodeCreate, onNodeRename, onNodeDelete, onNodeExport }, ref) => {
    const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ '2': true });
    const [editingNode, setEditingNode] = useState<EditingNode | null>(null);
    const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editingNode) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [editingNode]);
    
    useEffect(() => {
      const handleClickOutside = () => setContextMenu(null);
      if (contextMenu) {
        document.addEventListener('click', handleClickOutside);
      }
      return () => document.removeEventListener('click', handleClickOutside);
    }, [contextMenu]);

    useImperativeHandle(ref, () => ({
        triggerAdd: (type, parentId) => {
            setContextMenu(null);
            const id = parentId ?? 'root';
            if (parentId) setExpandedFolders(p => ({...p, [parentId]: true}));
            setEditingNode({ id, type: type === 'file' ? 'create-file' : 'create-folder', parentId });
        }
    }));

    const handleTriggerAdd = (type: 'file' | 'folder', parentId: string | null) => {
        setContextMenu(null);
        if (parentId) setExpandedFolders(p => ({...p, [parentId]: true}));
        setEditingNode({ id: parentId || 'root', type: type === 'file' ? 'create-file' : 'create-folder', parentId: parentId });
    };

    const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setContextMenu({ x: e.clientX, y: e.clientY, nodeId });
    };

    const handleRename = () => {
        if (!contextMenu) return;
        setEditingNode({ id: contextMenu.nodeId, type: 'rename', parentId: null /* not needed */ });
        setContextMenu(null);
    };

    const handleDelete = () => {
        if (!contextMenu) return;
        onNodeDelete(contextMenu.nodeId);
        setContextMenu(null);
    };
    
    const handleExport = () => {
        if (!contextMenu) return;
        onNodeExport(contextMenu.nodeId);
        setContextMenu(null);
    };

    const handleInputBlur = () => {
        setEditingNode(null);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Escape') {
            setEditingNode(null);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const input = e.currentTarget;
            const { value } = input;
            
            if (editingNode) {
                let success = false;
                if (editingNode.type === 'rename') {
                    success = onNodeRename(editingNode.id, value);
                } else { // create-file or create-folder
                    success = onNodeCreate(value, editingNode.type === 'create-file' ? 'file' : 'folder', editingNode.parentId);
                }
                if (success) {
                    setEditingNode(null);
                }
            }
        }
    };

    const renderNode = (node: FileSystemNode, level: number): React.ReactNode => {
        const isEditing = editingNode?.type === 'rename' && editingNode.id === node.id;
        
        if (node.type === 'folder') {
            const isExpanded = !!expandedFolders[node.id];
            return (
                <div key={node.id} onContextMenu={(e) => handleContextMenu(e, node.id)}>
                    <div
                        className="flex items-center space-x-1.5 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        onClick={() => setExpandedFolders(p => ({...p, [node.id]: !p[node.id]}))}
                        style={{ paddingLeft: `${level * 16 + 4}px` }}
                    >
                        <Icon icon={isExpanded ? 'chevron-down' : 'chevron-right'} className="h-4 w-4 flex-shrink-0 text-slate-500" />
                        <Icon icon="folder" className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                        {isEditing ? (
                             <input 
                                type="text" 
                                defaultValue={node.name}
                                className="bg-white dark:bg-slate-700 text-sm p-0.5 rounded -m-0.5 w-full"
                                ref={inputRef}
                                onKeyDown={handleInputKeyDown}
                                onBlur={handleInputBlur}
                                onClick={(e) => e.stopPropagation()}
                            />
                        ) : (
                            <span className="truncate">{node.name}</span>
                        )}
                    </div>
                    {isExpanded && (
                        <div>
                            {node.children.sort((a, b) => {
                                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                                return a.name.localeCompare(b.name);
                            }).map(child => renderNode(child, level + 1))}
                             {editingNode && (editingNode.type === 'create-file' || editingNode.type === 'create-folder') && editingNode.parentId === node.id && renderInput(level + 1)}
                        </div>
                    )}
                </div>
            );
        }

        // File node
        const isActive = activeFileId === node.id;
        return (
             <div
                key={node.id}
                className={`flex items-center space-x-1.5 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer border-l-2 ${isActive ? 'bg-sky-500/10 dark:bg-sky-500/20 border-sky-500' : 'border-transparent'}`}
                onClick={() => onFileSelect(node.id)}
                onContextMenu={(e) => handleContextMenu(e, node.id)}
                style={{ paddingLeft: `${level * 16 + 2}px`}}
            >
                <Icon icon="file" className="h-5 w-5 ml-2.5 text-slate-500 dark:text-slate-400" />
                 {isEditing ? (
                    <input 
                        type="text" 
                        defaultValue={node.name}
                        className="bg-white dark:bg-slate-700 text-sm p-0.5 rounded -m-0.5 w-full"
                        ref={inputRef}
                        onKeyDown={handleInputKeyDown}
                        onBlur={handleInputBlur}
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className={`truncate ${isActive ? 'text-sky-600 dark:text-sky-300 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>{node.name}</span>
                )}
            </div>
        )
    };
    
    const renderInput = (level: number) => (
        <div className="flex items-center space-x-1.5 p-1 border-l-2 border-transparent" style={{ paddingLeft: `${level * 16 + 2}px`}}>
            <Icon icon={editingNode?.type === 'create-file' ? 'file' : 'folder'} className="h-5 w-5 ml-2.5 text-slate-500 dark:text-slate-400" />
            <input
                type="text"
                ref={inputRef}
                onKeyDown={handleInputKeyDown}
                onBlur={handleInputBlur}
                className="bg-white dark:bg-slate-700 text-sm p-0.5 rounded -m-0.5 w-full"
            />
        </div>
    );
    
    return (
        <div className="flex flex-col h-full min-h-0 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-300 text-sm border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <div className="flex items-center space-x-2">
                    <Icon icon="folder" className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Workspace</h3>
                </div>
                <div className="flex items-center space-x-1">
                     <button onClick={() => handleTriggerAdd('file', null)} className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="New File">
                        <Icon icon="file-plus" className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleTriggerAdd('folder', null)} className="p-1 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded" title="New Folder">
                        <Icon icon="folder-plus" className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <div className="flex-grow overflow-y-auto p-1 pr-2 space-y-0.5" onClick={() => setContextMenu(null)}>
                {workspace.sort((a, b) => {
                    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                    return a.name.localeCompare(b.name);
                }).map(node => renderNode(node, 0))}
                {editingNode && (editingNode.type === 'create-file' || editingNode.type === 'create-folder') && editingNode.parentId === null && renderInput(0)}
            </div>
             {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu(null)}
                    items={[
                        { label: 'Rename', icon: 'edit', onClick: handleRename },
                        { label: 'Export', icon: 'download', onClick: handleExport },
                        { label: 'Delete', icon: 'trash-2', onClick: handleDelete, className: 'text-red-600 dark:text-red-500' },
                    ]}
                />
            )}
        </div>
    );
};

export const Workspace = forwardRef(WorkspaceComponent);