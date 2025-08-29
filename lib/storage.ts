// Storage utility for localStorage management

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  type: 'youtube' | 'website';
  createdAt: string;
}

const STORAGE_KEYS = {
  TASKS: 'task-manager-tasks',
  LINKS: 'task-manager-links',
} as const;

// Legacy keys for backward compatibility (auto-migrate on read)
const LEGACY_KEYS = {
  TASKS: 'cmf-tasks',
  LINKS: 'cmf-links',
} as const;

// Task storage functions
export const getTasks = (): Task[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (stored) return JSON.parse(stored);

    // Migrate legacy data if found
    const legacy = localStorage.getItem(LEGACY_KEYS.TASKS);
    if (legacy) {
      localStorage.setItem(STORAGE_KEYS.TASKS, legacy);
      localStorage.removeItem(LEGACY_KEYS.TASKS);
      return JSON.parse(legacy);
    }
    return [];
  } catch (error) {
    console.error('Error loading tasks:', error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
  const newTask: Task = {
    ...task,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  const tasks = getTasks();
  const updatedTasks = [...tasks, newTask];
  saveTasks(updatedTasks);
  
  return newTask;
};

export const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) return null;
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  tasks[taskIndex] = updatedTask;
  saveTasks(tasks);
  
  return updatedTask;
};

export const deleteTask = (id: string): boolean => {
  const tasks = getTasks();
  const filteredTasks = tasks.filter(task => task.id !== id);
  
  if (filteredTasks.length === tasks.length) return false;
  
  saveTasks(filteredTasks);
  return true;
};

// Link storage functions
export const getLinks = (): Link[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.LINKS);
    if (stored) return JSON.parse(stored);

    // Migrate legacy data if found
    const legacy = localStorage.getItem(LEGACY_KEYS.LINKS);
    if (legacy) {
      localStorage.setItem(STORAGE_KEYS.LINKS, legacy);
      localStorage.removeItem(LEGACY_KEYS.LINKS);
      return JSON.parse(legacy);
    }
    return [];
  } catch (error) {
    console.error('Error loading links:', error);
    return [];
  }
};

export const saveLinks = (links: Link[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
  } catch (error) {
    console.error('Error saving links:', error);
  }
};

export const addLink = (link: Omit<Link, 'id' | 'createdAt'>): Link => {
  const newLink: Link = {
    ...link,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  
  const links = getLinks();
  const updatedLinks = [...links, newLink];
  saveLinks(updatedLinks);
  
  return newLink;
};

export const deleteLink = (id: string): boolean => {
  const links = getLinks();
  const filteredLinks = links.filter(link => link.id !== id);
  
  if (filteredLinks.length === links.length) return false;
  
  saveLinks(filteredLinks);
  return true;
};

// Utility functions
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isYouTubeUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};
