import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { userService } from '../services/userService';
import { Event as ApiEvent } from '../types/api';
import RegisterForm from './RegisterForm';
import TeamRegistrationModal from './TeamRegistrationModal';
import MyRegistrations from './MyRegistrations';
import EventDetailsModal from './EventDetailsModal';
import ProfileModal from './ProfileModal';



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
            id: 'locked-in-hackathon.js',
            name: 'locked-in-hackathon.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "Locked In Hackathon",
  description: "24-hour high-intensity coding marathon to build functional prototypes for real-world problems.",
  date: "2026-02-16",
  time: "10:00",
  duration: "24 hours",
  type: "Paid",
  teamAllowed: true,
  teamSize: 4,
  venue: "AIC/TnP",
  inCharge: "IEEE Technical Team",
  capacity: 200,
  reward: "Prize: Rs. 12,000",
  status: "Ongoing"
};`
          },
          {
            id: 'podcast.js',
            name: 'podcast.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "Podcast",
  description: "Live session with industry leaders discussing technology and career growth.",
  date: "2026-02-16",
  time: "14:00",
  duration: "2 hours",
  type: "Free",
  venue: "E-Block Seminar Hall",
  inCharge: "IEEE Media Team",
  capacity: 500,
  reward: "Gifts: Rs. 4,000",
  status: "Ongoing"
};`
          },
          {
            id: 'imagium.js',
            name: 'imagium.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "Imagium",
  description: "Photography competition capturing the essence of campus life and technology.",
  date: "2026-02-16",
  time: "09:00",
  duration: "All Day",
  type: "Free",
  venue: "Campus Wide",
  inCharge: "IEEE Fine Arts",
  capacity: 1000,
  reward: "Rs. 2,000 Total",
  status: "Ongoing"
};`
          },
          {
            id: 'designathon.js',
            name: 'designathon.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "Designathon",
  date: "2026-02-17",
  venue: "AIC/TnP",
  reward: "Prizes: Rs. 3,000",
  type: "Paid",
  teamAllowed: true,
  teamSize: 2
};`
          },
          {
            id: 'gaming-event.js',
            name: 'gaming-event.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "Gaming Event",
  date: "2026-02-17",
  venue: "AIC",
  reward: "Prize: Rs. 3,000"
};`
          },
          {
            id: 'earthwear.js',
            name: 'earthwear.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "EarthWear",
  date: "2026-02-18",
  venue: "Amphi Theatre",
  reward: "Rewards: Rs. 14,200",
  teamAllowed: true,
  teamSize: 3
};`
          },
          {
            id: 'framesync.js',
            name: 'framesync.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "FrameSync",
  date: "2026-02-18",
  venue: "Campus",
  reward: "Prizes: Rs. 5,000"
};`
          },
          {
            id: 'spin-the-wheel.js',
            name: 'spin-the-wheel.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "Spin the Wheel",
  date: "2026-02-18",
  venue: "Amphi Theatre",
  reward: "Gifts: Rs. 8,000"
};`
          },
          {
            id: 'startup-sprint.js',
            name: 'startup-sprint.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "IEEE Startup Sprint",
  date: "2026-02-19",
  venue: "AIC",
  reward: "Prizes: Rs. 22,500",
  teamAllowed: true,
  teamSize: 3
};`
          },
          {
            id: 'ipl-auction.js',
            name: 'ipl-auction.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "IPL Auction",
  date: "2026-02-19",
  venue: "E-Block Seminar Hall",
  reward: "Prize: Rs. 3,000",
  teamAllowed: true,
  teamSize: 5
};`
          },
          {
            id: 'treasure-hunt.js',
            name: 'treasure-hunt.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "Treasure Hunt",
  date: "2026-02-20",
  venue: "TnP Area",
  reward: "Prize: Rs. 2,000",
  teamAllowed: true,
  teamSize: 3
};`
          },
          {
            id: 'stock-trading.js',
            name: 'stock-trading.js',
            type: 'file',
            parentId: 'events',
            content: `export const event = {
  name: "Stock Trading",
  date: "2026-02-20",
  venue: "TnP Area",
  reward: "Prizes: Rs. 3,000"
};`
          }
        ]
      },
      {
        id: 'full-schedule.js',
        name: 'full-schedule.js',
        type: 'file',
        parentId: 'root',
        content: `export const schedule = [
  { name: "Locked In Hackathon", date: "16 Feb", venue: "AIC/TnP" },
  { name: "Podcast", date: "16 Feb", venue: "E-Block" },
  { name: "Imagium", date: "16 Feb", venue: "Campus Wide" },
  { name: "Designathon", date: "17 Feb", venue: "AIC/TnP" },
  { name: "Gaming Event", date: "17 Feb", venue: "AIC" },
  { name: "EarthWear", date: "18 Feb", venue: "Amphi Theatre" },
  { name: "FrameSync", date: "18 Feb", venue: "Campus" },
  { name: "Spin the Wheel", date: "18 Feb", venue: "Amphi Theatre" },
  { name: "IEEE Startup Sprint", date: "19 Feb", venue: "AIC" },
  { name: "IPL Auction", date: "19 Feb", venue: "E-Block" },
  { name: "Treasure Hunt", date: "20 Feb", venue: "TnP Area" },
  { name: "Stock Trading", date: "20 Feb", venue: "TnP Area" }
];`
      },
      {
        id: 'readme.js',
        name: 'readme.js',
        type: 'file',
        parentId: 'root',
        content: `export default {
  project: "Synapse 2026",
  description: "Official timeline and rewards hub.",
  navigation: {
    details: "/events",
    prizes: "rewards.js"
  }
};`
      },
      {
        id: 'rewards.js',
        name: 'rewards.js',
        type: 'file',
        parentId: 'root',
        content: `export const rewards = {
  hackathon: "Rs. 12,000",
  startup_sprint: "Rs. 22,500",
  earthwear: "Rs. 14,200",
  spin_the_wheel: "Rs. 8,000",
  framesync: "Rs. 5,000",
  podcast: "Rs. 4,000",
  designathon: "Rs. 3,000",
  gaming: "Rs. 3,000",
  ipl_auction: "Rs. 3,000",
  stock_trading: "Rs. 3,000",
  treasure_hunt: "Rs. 2,000",
  imagium: "Rs. 2,000"
};`
      },
      {
        id: 'docs',
        name: 'docs',
        type: 'folder',
        content: '',
        parentId: 'root',
        isOpen: true,
        children: [
          {
            id: 'API_CONTRACTS.md',
            name: 'API_CONTRACTS.md',
            type: 'file',
            parentId: 'docs',
            content: `# Synapse 2026 - Backend API Contracts

## User Schema (Pydantic Model)
\`\`\`python
class UserCreate(BaseModel): 
    name: str
    email: EmailStr
    phone_number: str
    college_or_university: str
    course: str
    year: Literal[1, 2, 3, 4]
    gender: Literal["M", "F", "O"]
    github_profile: Optional[HttpUrl] = None
    linkedin_profile: Optional[HttpUrl] = None
\`\`\`

## Event Schema
\`\`\`python
class EventCreate(BaseModel):
    event_name: str
    event_description: Optional[str] = None
    event_date: Optional[date] = None
    event_time: Optional[time] = None
    duration: Optional[str] = None
    last_date_to_register: Optional[date] = None
    event_capacity: Optional[int] = None
    event_type: Optional[Literal["Free", "Paid"]] = None
    event_team_allowed: Optional[bool] = None
    event_team_size: Optional[int] = None
    venue: Optional[str] = None
    person_incharge: Optional[str] = None
    event_status: Optional[Literal["Ongoing", "Completed"]]
\`\`\`

## API Endpoints
### User Authorization
- \`POST /auth/user\`: Returns JWT token containing user_id, email, and IST expiry.
- \`POST /users/register\`: Signs up user with \`UserCreate\` data.
- \`POST /users/register-event\`: Adds event to user's registered list.
- \`POST /users/unregister-event\`: Removes event from user/event registry.

### Team Management
- \`POST /team/register\`: Create a team (Leader).
- \`POST /team/join\`: Join existing team (Member).
- \`DELETE /team/delete\`: Disband team (Leader).

### Administrative (Superadmin/Admin)
- \`POST /root/events\`: CRUD for event management.
- \`POST /root/remarks\`: Add/Delete remarks for users/teams/events.`
          }
        ]
      }
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
  const [openFiles, setOpenFiles] = useState<string[]>(['readme.js']);
  const [activeFileId, setActiveFileId] = useState<string | null>('readme.js');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('root'); // Default selection for new files
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registeringFor, setRegisteringFor] = useState<string | null>(null);
  const [showEventList, setShowEventList] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTerminal, setShowTerminal] = useState(true);
  const [showMyRegistrations, setShowMyRegistrations] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [availableEvents, setAvailableEvents] = useState<ApiEvent[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [profileRes, events, registered] = await Promise.all([
        userService.getProfile(),
        userService.getAllEvents(),
        userService.getRegistered()
      ]);

      const profile = profileRes.data || profileRes;

      // Augment profile with email from token if missing
      const token = localStorage.getItem('synapse_auth_token');
      let finalProfile = profile;
      if (token && (!profile || !profile.email)) {
        try {
          const decoded: any = jwtDecode(token);
          finalProfile = { ...profile, email: decoded.email };
        } catch (e) {
          console.error("Failed to decode token for email", e);
        }
      }

      setUser(finalProfile);

      // 1. Normalize availableEvents (handle MongoDB _id and common wrappers)
      let eventsArray: any[] = [];
      if (Array.isArray(events)) {
        eventsArray = events;
      } else if (events && typeof events === 'object') {
        eventsArray = events.events || events.data || events.items || [];
      }

      // Map _id to id if needed for internal consistency
      const normalizedEvents = eventsArray.map((e: any) => ({
        ...e,
        id: e.id || e._id || (typeof e === 'string' ? e : null)
      })).filter((e: any) => e.id);

      setAvailableEvents(normalizedEvents);

      // 2. Normalize registeredEventIds
      let regArray: any[] = [];
      if (Array.isArray(registered)) {
        regArray = registered;
      } else if (registered && typeof registered === 'object') {
        regArray = registered.registered_event || registered.registered || registered.data || registered.items || [];
      }

      setRegisteredEventIds(regArray.map((r: any) => {
        if (typeof r === 'string') return r;
        return r.event_id || r.id || r._id || (r.event ? (r.event.id || r.event._id) : null);
      }).filter(Boolean));

      return finalProfile;
    } catch (err: any) {
      console.error('Failed to fetch IDE data:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('synapse_auth_token');
        setUser(null);
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem('synapse_auth_token');
    if (token) {
      fetchData();
    }
  }, []);


  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('synapse_auth_token');
    setUser(null);
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };


  const handleRegister = async (eventId: string) => {
    if (!user) {
      showNotification('Please login first to register for events.', 'error');
      return;
    }

    // Fetch latest profile to ensure we have up-to-date info
    let currentUser = user;
    try {
      const profileRes = await userService.getProfile();
      const profile = profileRes.data || profileRes;
      currentUser = { ...user, ...profile };
      setUser(currentUser);
    } catch (err) {
      console.warn("Could not refresh profile, using cached data.");
    }

    // Check if user has fundamental profile fields (name, phone, etc.)
    // If user exists but fields are missing, they need to complete signup
    if (!currentUser.name || !currentUser.phone_number || !currentUser.college_or_university) {
      setRegisteringFor(eventId);
      setShowRegisterModal(true);
      return;
    }

    try {
      setIsLoading(true);

      // Register for the event first (if not already registered)
      if (!registeredEventIds.includes(eventId)) {
        console.log('Registering for event:', eventId);
        await userService.registerEvent(eventId);
        setRegisteredEventIds(prev => [...prev, eventId]);
        await fetchData();
      }

      // Check if event allows teams
      const event = availableEvents.find(e => e.id === eventId);
      if (event?.event_team_allowed) {
        console.log('Event allows teams, showing team modal');
        setRegisteringFor(eventId);
        setShowTeamModal(true);
        return;
      }

      setRegistrationSuccess(true);
      setTimeout(() => {
        setRegistrationSuccess(false);
      }, 3000);
    } catch (err: any) {
      showNotification(err.response?.data?.detail || 'Failed to register for event.', 'error');
    } finally {
      setIsLoading(true);
      setShowEventList(false);
    }
  };


  const submitRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationSuccess(true);
    setTimeout(() => {
      setShowRegisterModal(false);
      setRegistrationSuccess(false);
    }, 2000);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        setShowPalette(prev => !prev);
        setPaletteIndex(0);
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
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        setShowTerminal(prev => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'h' && !showPalette) {
        e.preventDefault();
        const hackathonFile = findNode(files, 'locked-in-hackathon.js');
        if (hackathonFile) openFile(hackathonFile);
      }
      if (e.key === 'Escape' && showPalette) {
        setShowPalette(false);
      }

      if (showPalette) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setPaletteIndex(prev => (prev + 1) % 7);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setPaletteIndex(prev => (prev - 1 + 7) % 7);
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          const commands = document.querySelectorAll('.palette-command');
          if (commands[paletteIndex]) (commands[paletteIndex] as HTMLButtonElement).click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showPalette, paletteIndex, files]);

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
      <header className="flex items-center justify-between whitespace-nowrap border-b border-[#213a4a] bg-editor-bg px-2 sm:px-4 py-2 h-12 shrink-0 z-10">
        <div className="flex items-center gap-2 sm:gap-4 text-white">
          <Link to="/" className="size-6 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined">hub</span>
          </Link>
          <div className="hidden lg:flex flex-col justify-center">
            <span className="text-xs text-slate-400 leading-none mb-0.5">Workspace</span>
            <h2 className="text-white text-sm font-bold leading-none tracking-wide">SYNAPSE 2026</h2>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
          <button
            onClick={() => setShowMyRegistrations(true)}
            className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded transition-colors text-xs font-bold tracking-wide text-slate-400 hover:text-white bg-[#1a2630] hover:bg-[#213a4a]"
            title="My Registrations"
          >
            <span className="material-symbols-outlined text-[18px]">event_available</span>
            <span className="hidden md:inline">MY REGISTRATIONS</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowEventList(!showEventList)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded transition-colors text-xs font-bold tracking-wide ${showEventList ? 'bg-primary text-white' : 'text-slate-400 hover:text-white bg-[#1a2630]'}`}
              title="Register for Events"
            >
              <span className="material-symbols-outlined text-[18px]">app_registration</span>
              <span className="hidden md:inline">REGISTER FOR EVENTS</span>
              <span className="material-symbols-outlined text-sm">{showEventList ? 'expand_less' : 'expand_more'}</span>
            </button>

            {showEventList && (
              <div className="absolute top-full mt-2 right-0 w-64 sm:w-72 md:w-80 bg-[#1a262f] border border-[#2b3e4d] rounded-lg shadow-2xl py-2 z-[100] animate-fadeIn max-w-[calc(100vw-1rem)]">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-[#2b3e4d] mb-1">Select Event</div>
                <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto custom-scrollbar">
                  {availableEvents.length > 0 ? (
                    availableEvents.map(event => {
                      const isRegistered = registeredEventIds.includes(event.id);
                      return (
                        <button
                          key={event.id}
                          disabled={!isRegistered && isLoading}
                          onClick={() => {
                            if (isRegistered) {
                              setSelectedEventId(event.id);
                              setShowEventList(false);
                            } else {
                              handleRegister(event.id);
                            }
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between group ${isRegistered ? 'text-emerald-400 hover:bg-emerald-500/10 cursor-pointer' : 'text-slate-300 hover:bg-primary/20 hover:text-white'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`size-1.5 rounded-full ${isRegistered ? 'bg-emerald-500' : 'bg-primary/40 group-hover:bg-primary'} transition-colors`}></span>
                            {event.event_name}
                          </div>
                          {isRegistered && <span className="material-symbols-outlined text-sm">visibility</span>}
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-center">
                      {!user ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="material-symbols-outlined text-slate-500 text-2xl">login</span>
                          <p className="text-xs text-slate-400">Please login to register for events</p>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 italic">No events found</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div id="save-indicator" className="text-xs text-emerald-400 font-mono opacity-0 transition-opacity duration-300">Saved</div>
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Logout"
              >
                <span className="material-symbols-outlined text-[20px]">logout</span>
              </button>
              <button
                onClick={() => setShowProfileModal(true)}
                className="bg-primary/20 rounded-full size-8 flex items-center justify-center border border-primary/30 text-primary hover:bg-primary/30 transition-colors cursor-pointer"
                title="Profile Settings"
              >
                <span className="material-symbols-outlined text-[18px]">person</span>
              </button>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  try {
                    const synapseToken = await userService.authenticate(credentialResponse.credential);
                    localStorage.setItem('synapse_auth_token', synapseToken);
                    fetchData();
                  } catch (err) {
                    console.error('Auth error in IDE:', err);
                    showNotification('Authentication failed.', 'error');
                  }
                }
              }}
              onError={() => console.log('Login Failed')}
              theme="filled_blue"
              size="medium"
              text="signin_with"
              shape="rectangular"
            />
          )}
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 flex flex-col items-center py-2 sm:py-3 bg-sidebar-bg border-r border-[#2b3e4d]/30 z-20 shrink-0">
          <div className="flex flex-col gap-4 sm:gap-6 w-full">
            <div onClick={() => setSidebarVisible(!sidebarVisible)} className="relative group flex justify-center cursor-pointer w-full" title="Toggle Sidebar">
              <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${sidebarVisible || window.innerWidth >= 768 ? 'bg-primary' : 'bg-transparent'}`}></div>
              <span className="material-symbols-outlined text-white text-[24px] sm:text-[28px]">folder_open</span>
            </div>
            <div onClick={() => setShowPalette(true)} className="flex justify-center cursor-pointer text-slate-500 hover:text-white transition-colors" title="Search (Ctrl+P)">
              <span className="material-symbols-outlined text-[24px] sm:text-[28px]">search</span>
            </div>
            <div className="flex justify-center cursor-pointer text-slate-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined text-[24px] sm:text-[28px]">alt_route</span>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-4 sm:gap-6 w-full pb-2">
            <div 
              onClick={() => user ? setShowProfileModal(true) : showNotification('Please login to access settings', 'info')} 
              className="flex justify-center cursor-pointer text-slate-500 hover:text-white transition-colors"
              title={user ? "Profile Settings" : "Login to access settings"}
            >
              <span className="material-symbols-outlined text-[24px] sm:text-[28px]">settings</span>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarVisible && (
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden" 
            onClick={() => setSidebarVisible(false)}
          />
        )}

        {/* Explorer Sidebar */}
        <div className={`w-64 bg-sidebar-bg flex flex-col border-r border-[#2b3e4d]/30 shrink-0 md:flex ${sidebarVisible ? 'fixed md:relative z-30 h-full' : 'hidden'}`}>
          <div className="h-9 flex items-center justify-between px-4 text-xs font-bold tracking-widest text-slate-400 flex-shrink-0 bg-[#0b141a]">
            <span>EXPLORER</span>
            <div className="flex gap-2">
              <button onClick={() => setSidebarVisible(false)} className="md:hidden hover:text-white" title="Close Sidebar">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
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
              <div className="text-slate-200 font-medium">{activeNode.name}</div>

              {activeNode.parentId === 'events' && (
                <button
                  onClick={() => {
                    const eventName = activeNode.name
                      .replace('.js', '')
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');

                    const event = availableEvents.find(e => e.event_name.toLowerCase().includes(eventName.toLowerCase()));
                    if (event) {
                      handleRegister(event.id);
                    } else {
                      showNotification(`Event "${eventName}" not found in database.`, 'error');
                    }
                  }}
                  disabled={isLoading || (() => {
                    const eventName = activeNode.name
                      .replace('.js', '')
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    const event = availableEvents.find(e => e.event_name.toLowerCase().includes(eventName.toLowerCase()));
                    return event && registeredEventIds.includes(event.id);
                  })()}
                  className={`ml-auto flex items-center gap-2 px-4 py-1.5 rounded-md border transition-all font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(5,121,199,0.3)] hover:shadow-[0_0_20px_rgba(5,121,199,0.5)] active:scale-95 group ${(() => {
                    const eventName = activeNode.name
                      .replace('.js', '')
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    const event = availableEvents.find(e => e.event_name.toLowerCase().includes(eventName.toLowerCase()));
                    return event && registeredEventIds.includes(event.id);
                  })()
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 cursor-default'
                    : 'bg-primary hover:bg-primary-hover text-white border-primary/50'
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">
                    {(() => {
                      const eventName = activeNode.name
                        .replace('.js', '')
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
                      const event = availableEvents.find(e => e.event_name.toLowerCase().includes(eventName.toLowerCase()));
                      return event && registeredEventIds.includes(event.id);
                    })()
                      ? 'check_circle' : 'app_registration'}
                  </span>
                  {(() => {
                    const eventName = activeNode.name
                      .replace('.js', '')
                      .split('-')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ');
                    const event = availableEvents.find(e => e.event_name.toLowerCase().includes(eventName.toLowerCase()));
                    return event && registeredEventIds.includes(event.id);
                  })()
                    ? 'REGISTERED' : 'REGISTER NOW'}
                </button>
              )}
            </div>
          )}

          {/* Editor Content */}
          <div className="flex-1 relative flex overflow-hidden">
            {activeNode ? (
              <>
                {/* Line Numbers */}
                <div className="w-12 flex flex-col items-end pr-3 py-4 text-slate-600 select-none shrink-0 bg-editor-bg text-xs/6 border-r border-[#2b3e4d]/20 font-mono">
                  {Array.from({ length: activeNode.content.split('\n').length + 5 }, (_, i) => <div key={i}>{i + 1}</div>)}
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
          {showTerminal && (
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
                    drwxr-xr-x   5 user  staff   160 Oct 24 10:00 events<br />
                    -rw-r--r--   1 user  staff  1240 Oct 24 10:05 README.md<br />
                    -rw-r--r--   1 user  staff   450 Oct 24 09:30 schedule.json
                  </div>
                  <div className="flex items-center text-slate-300 mt-1">
                    <span className="text-accent-green font-bold mr-2">➜</span>
                    <span className="text-sky-400 font-bold mr-2">synapse-project</span>
                    <span className="text-slate-500 mr-2">git:(<span className="text-red-400">main</span>)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Footer */}
      <footer className="h-6 bg-primary items-center justify-between px-2 sm:px-3 text-xs text-white shrink-0 z-10 hidden sm:flex">
        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-1 hover:bg-white/10 px-1 rounded cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">schema</span>
            <span>main*</span>
          </Link>
          <div className="hidden md:flex items-center gap-1 hover:bg-white/10 px-1 rounded cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">sync</span>
            <span>0</span>
            <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
            <span>2</span>
          </div>
          <div className="hidden lg:flex items-center gap-1 hover:bg-white/10 px-1 rounded cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">error</span>
            <span>0</span>
            <span className="material-symbols-outlined text-[14px]">warning</span>
            <span>0</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {activeNode ? (
            <>
              <div className="hidden md:block hover:bg-white/10 px-1 rounded cursor-pointer">Ln {activeNode.content.split('\n').length}, Col 1</div>
              <div className="hidden lg:block hover:bg-white/10 px-1 rounded cursor-pointer">Spaces: 2</div>
              <div className="hidden lg:block hover:bg-white/10 px-1 rounded cursor-pointer">UTF-8</div>
              <div className="hover:bg-white/10 px-1 rounded cursor-pointer font-bold flex items-center gap-1">
                {activeIconInfo && <span className={`material-symbols-outlined text-[14px] ${activeIconInfo.color}`}>{activeIconInfo.icon}</span>}
                {activeNode.name.split('.').pop()?.toUpperCase() || 'TXT'}
              </div>
            </>
          ) : (
            <div>Ready</div>
          )}
          <div className="hidden sm:block hover:bg-white/10 px-1 rounded cursor-pointer">
            <span className="material-symbols-outlined text-[14px]">notifications</span>
          </div>
        </div>
      </footer>

      {/* COMMAND PALETTE OVERLAY */}
      {showPalette && (
        <div onClick={() => setShowPalette(false)} className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex justify-center items-start pt-[12vh] px-4 animate-fadeIn">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[600px] bg-[#1c2128] rounded-xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] border border-slate-700/40 flex flex-col overflow-hidden ring-1 ring-white/5">
            <div className="p-3">
              <div className="flex items-center bg-[#2d333b] rounded-lg border border-primary/40 h-11 px-4 ring-2 ring-primary/5 transition-all focus-within:ring-primary/20">
                <span className="material-symbols-outlined text-slate-500 mr-3 text-xl">search</span>
                <input
                  autoFocus
                  className="bg-transparent border-none text-white w-full focus:ring-0 focus:outline-none placeholder-slate-500 font-display text-sm tracking-wide"
                  placeholder="Type a command to search..."
                  type="text"
                />
              </div>
            </div>

            <div className="flex flex-col pb-2 max-h-[420px] overflow-y-auto custom-scrollbar">
              {[
                { label: 'Open Hackathon Details', sub: 'Synapse: View event info', key: 'Ctrl+H', icon: 'info', action: () => { const f = findNode(files, 'locked-in-hackathon.js'); if (f) openFile(f); } },
                { label: 'View Schedule', sub: 'Synapse: Agenda & Timeline', key: 'Ctrl+S', icon: 'calendar_month', action: () => { const f = findNode(files, 'full-schedule.js'); if (f) openFile(f); } },
                { label: 'My Registrations', sub: 'Synapse: View & manage your events/teams', key: '', icon: 'event_available', action: () => setShowMyRegistrations(true) },
                { label: 'Register Team', sub: 'Synapse: Manage participants', key: '', icon: 'person_add', action: () => handleRegister('TEAM') },
                { label: 'Toggle Terminal', sub: 'View: Toggle Integrated Terminal', key: 'Ctrl+`', icon: 'terminal', action: () => setShowTerminal(!showTerminal) },
                { label: 'Contact Organizers', sub: 'Help: Get support', key: '', icon: 'mail', action: () => alert('Connecting to organisers...') },
                { label: 'Download Resources', sub: 'Synapse: API Docs & Assets', key: '', icon: 'cloud_download', action: () => { const f = findNode(files, 'API_CONTRACTS.md'); if (f) openFile(f); } },
                { label: 'Open Settings (JSON)', sub: 'Preferences: Open Settings', key: '', icon: 'settings', action: () => alert('Loading settings.json...') }
              ].map((cmd, i) => (
                <button
                  key={cmd.label}
                  onClick={() => { cmd.action(); setShowPalette(false); }}
                  onMouseEnter={() => setPaletteIndex(i)}
                  className={`palette-command group flex items-center justify-between px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 ${paletteIndex === i ? 'bg-primary shadow-lg shadow-primary/20 scale-[1.01] z-10' : 'hover:bg-white/5 text-slate-300'}`}
                >
                  <div className="flex items-center gap-4 overflow-hidden">
                    <span className={`material-symbols-outlined text-[20px] transition-colors ${paletteIndex === i ? 'text-white' : 'text-slate-500'}`}>
                      {cmd.icon}
                    </span>
                    <div className="flex flex-col items-start truncate text-left">
                      <span className={`text-sm font-bold leading-none mb-1 tracking-tight ${paletteIndex === i ? 'text-white' : 'text-slate-200'}`}>
                        {cmd.label}
                      </span>
                      <span className={`text-[11px] font-medium leading-none ${paletteIndex === i ? 'text-white/80' : 'text-slate-500 group-hover:text-slate-400'}`}>
                        {cmd.sub}
                      </span>
                    </div>
                  </div>
                  {cmd.key && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border font-mono ml-4 shrink-0 transition-colors ${paletteIndex === i ? 'text-white border-white/30' : 'text-slate-600 border-slate-700/50'}`}>
                      {cmd.key}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="px-4 py-2 bg-[#12161c] border-t border-slate-700/30 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><span className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">↑↓</span> to navigate</span>
                <span className="flex items-center gap-1.5"><span className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">↵</span> to select</span>
              </div>
              <span className="text-primary/60">Synapse Shell v2.0</span>
            </div>
          </div>
        </div>
      )}
      {/* REGISTRATION MODAL */}
      {showRegisterModal && user && (
        <RegisterForm
          user={user}
          onSuccess={async () => {
            setShowRegisterModal(false);
            const updatedProfile = await fetchData();
            if (registeringFor) {
              // If profile is now complete (or was already), proceed
              if (updatedProfile?.name && updatedProfile?.college_or_university) {
                try {
                  // Refresh events locally just in case
                  const event = availableEvents.find(e => e.id === registeringFor);
                  const isTeamEvent = event?.event_team_allowed;

                  // 1. Register for event if not known
                  if (!registeredEventIds.includes(registeringFor)) {
                    await userService.registerEvent(registeringFor);
                    setRegisteredEventIds(prev => [...prev, registeringFor]);
                  }

                  // 2. Setup next step
                  if (isTeamEvent) {
                    setShowTeamModal(true);
                  } else {
                    setRegistrationSuccess(true);
                    setTimeout(() => setRegistrationSuccess(false), 3000);
                  }
                } catch (err: any) {
                  showNotification(err.response?.data?.detail || 'Failed to complete registration flow.', 'error');
                }
              } else {
                // Still missing info? Should ideally not happen if form is "required"
                showNotification("Profile incomplete. Please fill all required fields.", 'error');
              }
            }
          }}
          onCancel={() => setShowRegisterModal(false)}
        />
      )}
      {showTeamModal && registeringFor && (
        <TeamRegistrationModal
          eventId={registeringFor}
          eventName={availableEvents.find(e => e.id === registeringFor)?.event_name || 'Event'}
          onSuccess={() => {
            setShowTeamModal(false);
            setRegistrationSuccess(true);
            fetchData();
            setTimeout(() => setRegistrationSuccess(false), 3000);
          }}
          onCancel={async () => {
            setShowTeamModal(false);
            // Unregister from event if team creation was cancelled
            if (registeringFor && registeredEventIds.includes(registeringFor)) {
              try {
                await userService.unregisterEvent(registeringFor);
                setRegisteredEventIds(prev => prev.filter(id => id !== registeringFor));
                await fetchData();
                showNotification('Event registration cancelled', 'info');
              } catch (err: any) {
                console.error('Failed to unregister after team cancel:', err);
              }
            }
          }}
        />
      )}
      {showMyRegistrations && (
        <MyRegistrations
          onClose={() => setShowMyRegistrations(false)}
          onUpdate={() => {
            fetchData();
          }}
          onNotify={showNotification}
        />
      )}
      {selectedEventId && (
        <EventDetailsModal
          eventId={selectedEventId}
          onClose={() => setSelectedEventId(null)}
        />
      )}
      {showProfileModal && user && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onUpdate={fetchData}
          onNotify={showNotification}
        />
      )}
      {notification && (
        <div className={`fixed top-4 right-4 z-[200] animate-fadeIn ${
          notification.type === 'success' ? 'bg-green-500/90' :
          notification.type === 'error' ? 'bg-red-500/90' :
          'bg-blue-500/90'
        } text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 max-w-md`}>
          <span className="material-symbols-outlined text-xl">
            {notification.type === 'success' ? 'check_circle' :
             notification.type === 'error' ? 'error' : 'info'}
          </span>
          <p className="text-sm font-medium">{notification.message}</p>
          <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 rounded p-1 transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default IdeScreen;