import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// --- Types & Constants ---

type FileType = 'file' | 'folder';

interface FileNode {
  id: string;
  name: string;
  type: FileType;
  content: string;
  isOpen?: boolean; // For folders
  children?: FileNode[]; // Recursive structure
  parentId?: string | null;
}

const INITIAL_FILES: FileNode[] = [
  {
    id: 'root',
    name: 'SYNAPSE-PROJECT',
    type: 'folder',
    content: '',
    isOpen: true,
    parentId: null,
    children: [
      {
        id: 'events',
        name: 'events',
        type: 'folder',
        content: '',
        isOpen: true,
        parentId: 'root',
        children: [
          { 
            id: 'hackathon.js', 
            name: 'hackathon.js', 
            type: 'file', 
            parentId: 'events',
            content: `// Synapse Hackathon Event Handler
const eventConfig = {
  name: "Synapse 2026",
  maxTeams: 100,
  duration: 24 * 60 * 60, // 24 hours
};

function initEvent() {
  console.log("Initializing " + eventConfig.name);
  // TODO: Connect to live API
  return true;
}

export default eventConfig;` 
          },
          { 
            id: 'workshop.py', 
            name: 'workshop.py', 
            type: 'file', 
            parentId: 'events',
            content: `# Workshop Setup Script
import synapse_core

def setup_environment():
    print("Setting up DeepMind workshop...")
    synapse_core.load_models(['gpt-4', 'claude-3'])
    
if __name__ == "__main__":
    setup_environment()` 
          },
          { 
            id: 'talks.md', 
            name: 'talks.md', 
            type: 'file', 
            parentId: 'events',
            content: `# Tech Talks Schedule

| Time | Speaker | Topic |
|------|---------|-------|
| 09:00| Dr. Smith| AI Futures |
| 11:00| Sarah J.| Quantum Dev |` 
          },
        ]
      },
      { 
        id: 'README.md', 
        name: 'README.md', 
        type: 'file', 
        parentId: 'root',
        content: `# Synapse 2026: The Future of Code

> "Innovation is not just about code, it's about connection."

Welcome to the **Synapse 2026** main repository. This project contains all the necessary resources, schedules, and starter kits for the upcoming global coding week.

## Getting Started

To initialize your environment, run the startup script located in the events folder.

\`\`\`bash
$ npm install @synapse/core
$ node events/hackathon.js --init
\`\`\`

## Key Events
- **[Mon]** Opening Keynote @ 09:00 AM UTC
- **[Wed]** AI Workshop with DeepMind
- **[Fri]** 24h Hackathon Finale` 
      },
      { 
        id: 'schedule.json', 
        name: 'schedule.json', 
        type: 'file', 
        parentId: 'root',
        content: `{\n  "events": [\n    { "id": 1, "name": "Opening" }\n  ]\n}` 
      },
    ]
  }
];

// --- Helpers ---

// Recursively find a node by ID
const findNode = (nodes: FileNode[], id: string): FileNode | null => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return null;
};

// Helper to get file icon color
const getFileIconInfo = (filename: string) => {
  if (filename.endsWith('.js') || filename.endsWith('.ts') || filename.endsWith('.tsx')) return { icon: 'javascript', color: 'text-yellow-400' };
  if (filename.endsWith('.py')) return { icon: 'code', color: 'text-blue-400' };
  if (filename.endsWith('.md')) return { icon: 'info', color: 'text-sky-400' };
  if (filename.endsWith('.json')) return { icon: 'data_object', color: 'text-yellow-400' };
  if (filename.endsWith('.css')) return { icon: 'css', color: 'text-blue-300' };
  if (filename.endsWith('.html')) return { icon: 'html', color: 'text-orange-500' };
  return { icon: 'description', color: 'text-slate-400' };
};

// --- Components ---

const FileTreeItem: React.FC<{
  node: FileNode;
  level: number;
  activeFileId: string | null;
  onToggle: (id: string) => void;
  onSelect: (node: FileNode) => void;
}> = ({ node, level, activeFileId, onToggle, onSelect }) => {
  const isFolder = node.type === 'folder';
  const isActive = node.id === activeFileId;
  const paddingLeft = level * 12 + 12; // Base padding

  if (isFolder) {
    return (
      <div className="flex flex-col">
        <div 
          className="flex items-center py-1 cursor-pointer hover:bg-[#2a3842] select-none text-slate-300 text-sm"
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
        >
          <span className={`material-symbols-outlined text-base mr-1 transition-transform ${node.isOpen ? 'rotate-90' : ''}`}>chevron_right</span>
          <span className="material-symbols-outlined text-lg mr-2 text-primary">folder</span>
          <span className="truncate">{node.name}</span>
        </div>
        {node.isOpen && node.children && node.children.map(child => (
          <FileTreeItem 
            key={child.id} 
            node={child} 
            level={level + 1} 
            activeFileId={activeFileId}
            onToggle={onToggle}
            onSelect={onSelect}
          />
        ))}
      </div>
    );
  }

  const { icon, color } = getFileIconInfo(node.name);

  return (
    <div 
      className={`flex items-center py-1 cursor-pointer select-none text-sm group ${isActive ? 'bg-[#374151] text-white' : 'hover:bg-[#2a3842] text-slate-400'}`}
      style={{ paddingLeft: `${paddingLeft + 18}px` }} // +18 to align with folder text (chevron width)
      onClick={(e) => { e.stopPropagation(); onSelect(node); }}
    >
      <span className={`material-symbols-outlined text-lg mr-2 ${color}`}>{icon}</span>
      <span className="truncate">{node.name}</span>
    </div>
  );
};

// --- Main Screen ---

const IdeScreen: React.FC = () => {
  const [showPalette, setShowPalette] = useState(false);
  const [files, setFiles] = useState<FileNode[]>(INITIAL_FILES);
  const [openFiles, setOpenFiles] = useState<string[]>(['README.md']);
  const [activeFileId, setActiveFileId] = useState<string | null>('README.md');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('root'); // Default selection for new files
  const navigate = useNavigate();

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setShowPalette(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        // Save simulation
        const saveBtn = document.getElementById('save-indicator');
        if (saveBtn) {
            saveBtn.classList.remove('opacity-0');
            setTimeout(() => saveBtn.classList.add('opacity-0'), 1000);
        }
      }
      if (e.key === 'Escape' && showPalette) {
        setShowPalette(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPalette]);

  // --- Actions ---

  const toggleFolder = (folderId: string) => {
    const newFiles = [...files];
    const toggleNode = (nodes: FileNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === folderId) {
          node.isOpen = !node.isOpen;
          return true;
        }
        if (node.children && toggleNode(node.children)) return true;
      }
      return false;
    };
    toggleNode(newFiles);
    setFiles(newFiles);
    setSelectedFolderId(folderId);
  };

  const openFile = (node: FileNode) => {
    if (!openFiles.includes(node.id)) {
      setOpenFiles([...openFiles, node.id]);
    }
    setActiveFileId(node.id);
  };

  const closeFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newOpenFiles = openFiles.filter(fid => fid !== id);
    setOpenFiles(newOpenFiles);
    
    if (activeFileId === id) {
      if (newOpenFiles.length > 0) {
        setActiveFileId(newOpenFiles[newOpenFiles.length - 1]);
      } else {
        setActiveFileId(null);
      }
    }
  };

  const updateFileContent = (content: string) => {
    if (!activeFileId) return;
    const newFiles = [...files];
    const updateNode = (nodes: FileNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === activeFileId) {
          node.content = content;
          return true;
        }
        if (node.children && updateNode(node.children)) return true;
      }
      return false;
    };
    updateNode(newFiles);
    setFiles(newFiles);
  };

  const createItem = (type: FileType) => {
    const name = window.prompt(`Enter ${type} name:`);
    if (!name) return;

    // Ensure unique ID (simple implementation)
    const id = name; 
    
    const newItem: FileNode = {
      id,
      name,
      type,
      content: type === 'file' ? '' : undefined,
      children: type === 'folder' ? [] : undefined,
      isOpen: true,
      parentId: selectedFolderId
    } as FileNode;

    const newFiles = [...files];
    
    // Add to the selected folder (or root if not found/root)
    const addToFolder = (nodes: FileNode[]): boolean => {
      for (const node of nodes) {
        if (node.id === selectedFolderId && node.type === 'folder') {
          if (!node.children) node.children = [];
          node.children.push(newItem);
          node.isOpen = true; // Auto open
          return true;
        }
        if (node.children && addToFolder(node.children)) return true;
      }
      return false;
    };

    // If root is selected or not found, try adding to root directly if selectedFolderId is 'root'
    // Since 'root' is the top level container in INITIAL_FILES array but represented as a folder object
    let added = addToFolder(newFiles);
    
    // If we couldn't find the selected folder (shouldn't happen with correct logic), default to root children
    if (!added && files[0].id === 'root') {
        files[0].children?.push(newItem);
    }

    setFiles(newFiles);
    if (type === 'file') {
      openFile(newItem);
    }
  };

  const activeNode = activeFileId ? findNode(files, activeFileId) : null;
  const activeIconInfo = activeNode ? getFileIconInfo(activeNode.name) : null;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background-dark text-slate-300 font-display flex flex-col antialiased relative">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-[#213a4a] bg-editor-bg px-4 py-2 h-12 shrink-0 z-10">
          <div className="flex items-center gap-4 text-white">
            <Link to="/" className="size-6 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">hub</span>
            </Link>
            <div className="flex flex-col justify-center">
              <span className="text-xs text-slate-400 leading-none mb-0.5">Workspace</span>
              <h2 className="text-white text-sm font-bold leading-none tracking-wide">SYNAPSE 2026</h2>
            </div>
          </div>
          <div className="hidden md:flex flex-1 justify-center gap-6">
              {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map(item => (
                 <span key={item} className="text-slate-400 hover:text-white text-xs cursor-pointer">{item}</span>
              ))}
          </div>
          <div className="flex items-center gap-3">
            <div id="save-indicator" className="text-xs text-emerald-400 font-mono opacity-0 transition-opacity duration-300">Saved</div>
            <div className="bg-center bg-no-repeat bg-cover rounded-full size-6 ring-2 ring-primary/20" style={{backgroundImage: "linear-gradient(135deg, #0579c7 0%, #0f1b23 100%)"}}></div>
          </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 flex flex-col items-center py-3 bg-sidebar-bg border-r border-[#2b3e4d]/30 z-20 shrink-0">
          <div className="flex flex-col gap-6 w-full">
            <div className="relative group flex justify-center cursor-pointer w-full">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary"></div>
              <span className="material-symbols-outlined text-white text-[28px]">folder_open</span>
            </div>
            <div onClick={() => setShowPalette(true)} className="flex justify-center cursor-pointer text-slate-500 hover:text-white transition-colors" title="Search (Ctrl+P)">
              <span className="material-symbols-outlined text-[28px]">search</span>
            </div>
            <div className="flex justify-center cursor-pointer text-slate-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[28px]">alt_route</span>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-6 w-full">
            <div className="flex justify-center cursor-pointer text-slate-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[28px]">settings</span>
            </div>
          </div>
        </div>

        {/* Explorer Sidebar */}
        <div className="w-64 bg-sidebar-bg flex flex-col border-r border-[#2b3e4d]/30 shrink-0 hidden md:flex">
          <div className="h-9 flex items-center justify-between px-4 text-xs font-bold tracking-widest text-slate-400 flex-shrink-0 bg-[#0b141a]">
            <span>EXPLORER</span>
            <div className="flex gap-2">
              <button onClick={() => createItem('file')} className="hover:text-white" title="New File">
                <span className="material-symbols-outlined text-lg">note_add</span>
              </button>
              <button onClick={() => createItem('folder')} className="hover:text-white" title="New Folder">
                <span className="material-symbols-outlined text-lg">create_new_folder</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {files.map(node => (
              <FileTreeItem 
                key={node.id} 
                node={node} 
                level={0}
                activeFileId={activeFileId}
                onToggle={toggleFolder}
                onSelect={openFile}
              />
            ))}
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-editor-bg">
          {/* Tab Bar */}
          <div className="flex bg-sidebar-bg overflow-x-auto no-scrollbar flex-shrink-0 h-9 border-b border-[#2b3e4d]/30">
            {openFiles.map(fid => {
              const node = findNode(files, fid);
              if (!node) return null;
              const { icon, color } = getFileIconInfo(node.name);
              const isTabActive = activeFileId === fid;
              
              return (
                <div 
                  key={fid}
                  onClick={() => setActiveFileId(fid)}
                  className={`group flex items-center px-3 min-w-[120px] max-w-[200px] border-r border-[#2b3e4d]/30 cursor-pointer select-none ${isTabActive ? 'bg-editor-bg border-t-2 border-t-primary text-white' : 'bg-[#162129] border-t-2 border-t-transparent text-slate-400 hover:bg-[#1a2630]'}`}
                >
                  <span className={`material-symbols-outlined text-sm mr-2 ${color}`}>{icon}</span>
                  <span className={`text-sm truncate flex-1 font-medium ${isTabActive ? 'text-white' : 'text-slate-400'} ${node.name.endsWith('.js') && !isTabActive ? 'italic' : ''}`}>{node.name}</span>
                  <span 
                    onClick={(e) => closeFile(e, fid)}
                    className={`material-symbols-outlined text-sm ml-2 p-0.5 rounded hover:bg-slate-700 ${isTabActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    close
                  </span>
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          {activeNode && (
            <div className="h-6 flex items-center px-4 bg-editor-bg text-xs text-slate-500 border-b border-[#2b3e4d]/20 select-none flex-shrink-0">
              <span className="hover:text-slate-300 cursor-pointer">synapse-project</span>
              {activeNode.parentId && activeNode.parentId !== 'root' && (
                <>
                  <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
                  <span className="hover:text-slate-300 cursor-pointer">{activeNode.parentId}</span>
                </>
              )}
              <span className="material-symbols-outlined text-sm mx-1">chevron_right</span>
              <span className="text-slate-200 font-medium">{activeNode.name}</span>
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 relative flex overflow-hidden">
            {activeNode ? (
              <>
                {/* Line Numbers */}
                <div className="w-12 flex flex-col items-end pr-3 py-4 text-slate-600 select-none shrink-0 bg-editor-bg text-xs/6 border-r border-[#2b3e4d]/20 font-mono">
                  {Array.from({length: activeNode.content.split('\n').length + 5}, (_, i) => <div key={i}>{i+1}</div>)}
                </div>
                
                {/* Text Area */}
                <textarea
                  className="flex-1 bg-editor-bg text-slate-300 p-4 font-mono text-sm leading-6 resize-none focus:outline-none border-none w-full h-full"
                  value={activeNode.content}
                  onChange={(e) => updateFileContent(e.target.value)}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  autoCorrect="off"
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
                 <span className="material-symbols-outlined text-6xl mb-4 opacity-20">code_off</span>
                 <p className="text-sm">Select a file to start editing</p>
                 <p className="text-xs opacity-50 mt-2">Use Ctrl+P to search files</p>
              </div>
            )}
          </div>
          
          {/* Integrated Terminal */}
          <div className="h-48 bg-panel-bg border-t border-[#2b3e4d]/40 flex flex-col shrink-0 hidden md:flex">
            <div className="flex items-center px-4 h-8 gap-6 text-xs font-bold text-slate-500 border-b border-[#2b3e4d]/20">
              <span className="cursor-pointer hover:text-slate-300">PROBLEMS</span>
              <span className="cursor-pointer hover:text-slate-300">OUTPUT</span>
              <span className="cursor-pointer hover:text-slate-300">DEBUG CONSOLE</span>
              <span className="cursor-pointer text-primary border-b border-primary h-full flex items-center">TERMINAL</span>
            </div>
            <div className="flex-1 p-3 font-mono text-sm overflow-y-auto">
              <div className="text-slate-400 mb-1">Welcome to Synapse Shell v2.0</div>
              <div className="text-slate-500 mb-2 text-xs">Last login: Tue Oct 24 14:03:12 on ttys001</div>
              <div className="flex flex-col">
                <div className="flex items-center text-slate-300">
                  <span className="text-accent-green font-bold mr-2">➜</span>
                  <span className="text-sky-400 font-bold mr-2">synapse-project</span>
                  <span className="text-slate-500 mr-2">git:(<span className="text-red-400">main</span>)</span>
                  <span className="text-slate-200">ls -la</span>
                </div>
                <div className="text-slate-400 pl-4 py-1 text-xs opacity-80">
                  drwxr-xr-x   5 user  staff   160 Oct 24 10:00 events<br/>
                  -rw-r--r--   1 user  staff  1240 Oct 24 10:05 README.md<br/>
                  -rw-r--r--   1 user  staff   450 Oct 24 09:30 schedule.json
                </div>
                <div className="flex items-center text-slate-300 mt-1">
                  <span className="text-accent-green font-bold mr-2">➜</span>
                  <span className="text-sky-400 font-bold mr-2">synapse-project</span>
                  <span className="text-slate-500 mr-2">git:(<span className="text-red-400">main</span>)</span>
                  <span className="w-2 h-4 bg-slate-400 cursor-blink inline-block align-middle"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <footer className="h-6 bg-primary flex items-center justify-between px-3 text-xs text-white shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-1 hover:bg-white/10 px-1 rounded cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">schema</span>
            <span>main*</span>
          </Link>
          <div className="flex items-center gap-1 hover:bg-white/10 px-1 rounded cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">sync</span>
            <span>0</span>
            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            <span>2</span>
          </div>
          <div className="flex items-center gap-1 hover:bg-white/10 px-1 rounded cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>0</span>
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {activeNode ? (
            <>
              <div className="hover:bg-white/10 px-1 rounded cursor-pointer">Ln {activeNode.content.split('\n').length}, Col 1</div>
              <div className="hover:bg-white/10 px-1 rounded cursor-pointer">Spaces: 2</div>
              <div className="hover:bg-white/10 px-1 rounded cursor-pointer">UTF-8</div>
              <div className="hover:bg-white/10 px-1 rounded cursor-pointer font-bold flex items-center gap-1">
                {activeIconInfo && <span className={`material-symbols-outlined text-[14px] ${activeIconInfo.color}`}>{activeIconInfo.icon}</span>}
                {activeNode.name.split('.').pop()?.toUpperCase() || 'TXT'}
              </div>
            </>
          ) : (
            <div>Ready</div>
          )}
          <div className="hover:bg-white/10 px-1 rounded cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">notifications</span>
          </div>
        </div>
      </footer>

      {/* COMMAND PALETTE OVERLAY */}
      {showPalette && (
        <div onClick={() => setShowPalette(false)} className="absolute inset-0 z-50 bg-background-dark/30 backdrop-blur-[3px] flex justify-center items-start pt-[12vh] px-4 animate-fadeIn">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[640px] bg-[#1e2329] rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-slate-700/50 flex flex-col overflow-hidden">
            <div className="p-2 border-b border-slate-700/50">
              <div className="flex items-center bg-[#282e36] rounded border border-primary/50 ring-1 ring-primary/20 h-10 px-3">
                <span className="text-slate-400 mr-2 font-mono text-lg">&gt;</span>
                <input autoFocus className="bg-transparent border-none text-white w-full focus:ring-0 focus:outline-none placeholder-slate-500 font-display text-sm h-full" placeholder="Type a command to search..." type="text"/>
              </div>
            </div>
            <div className="flex flex-col max-h-[400px] overflow-y-auto py-1 custom-scrollbar">
              <button onClick={() => { createItem('file'); setShowPalette(false); }} className="group flex items-center justify-between px-3 py-2 mx-1 rounded bg-primary text-white border-l-2 border-white/50 mb-0.5 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="material-symbols-outlined text-[20px]">note_add</span>
                  <div className="flex flex-col items-start truncate">
                    <span className="text-sm font-medium leading-tight">Create New File</span>
                    <span className="text-[10px] text-white/70 leading-tight">File: New...</span>
                  </div>
                </div>
              </button>
              
              <button onClick={() => { setShowPalette(false); alert('Use standard file save (Ctrl+S)'); }} className="group flex items-center justify-between px-3 py-2 mx-1 rounded hover:bg-white/5 text-slate-300 hover:text-white mb-0.5 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-white">save</span>
                  <div className="flex flex-col items-start truncate">
                    <span className="text-sm font-medium leading-tight">Save File</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-slate-400 leading-tight">File: Save currently open file</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-300 font-mono ml-4 shrink-0">Ctrl+S</span>
              </button>
              
              <div className="h-px bg-slate-700/50 my-1 mx-3"></div>
              
              <button onClick={() => setShowPalette(false)} className="group flex items-center justify-between px-3 py-2 mx-1 rounded hover:bg-white/5 text-slate-300 hover:text-white mb-0.5 transition-colors">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="material-symbols-outlined text-[20px] text-slate-400 group-hover:text-white">close</span>
                  <div className="flex flex-col items-start truncate">
                    <span className="text-sm font-medium leading-tight">Close Palette</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 group-hover:text-slate-300 font-mono ml-4 shrink-0">Esc</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IdeScreen;