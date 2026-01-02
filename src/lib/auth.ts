// Authentication utility functions for client-side auth

export interface User {
  email: string;
  password: string; // In production, this would be hashed
  createdAt: string;
}

const USERS_STORAGE_KEY = "auth_users";
const SESSION_STORAGE_KEY = "session";

/**
 * Get all users from localStorage
 */
export const getUsers = (): User[] => {
  try {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch {
    return [];
  }
};

/**
 * Save users to localStorage
 */
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

/**
 * Check if a user with the given email already exists
 */
export const userExists = (email: string): boolean => {
  const users = getUsers();
  return users.some((user) => user.email.toLowerCase() === email.toLowerCase());
};

/**
 * Register a new user
 */
export const signUp = async (email: string, password: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase().trim();
  
  if (userExists(normalizedEmail)) {
    throw new Error("An account with this email already exists");
  }

  const users = getUsers();
  const newUser: User = {
    email: normalizedEmail,
    password, // In production, hash this password
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
};

/**
 * Sign in a user
 */
export const signIn = async (email: string, password: string): Promise<void> => {
  const normalizedEmail = email.toLowerCase().trim();
  const users = getUsers();
  
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  
  if (!user) {
    throw new Error("Invalid email or password");
  }

  if (user.password !== password) {
    throw new Error("Invalid email or password");
  }

  // Store session
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ 
    email: user.email,
    createdAt: user.createdAt 
  }));
};

/**
 * Get current session
 */
export const getSession = (): { email: string; createdAt: string } | null => {
  try {
    const sessionJson = localStorage.getItem(SESSION_STORAGE_KEY);
    return sessionJson ? JSON.parse(sessionJson) : null;
  } catch {
    return null;
  }
};

/**
 * Sign out current user
 */
export const signOut = (): void => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};

