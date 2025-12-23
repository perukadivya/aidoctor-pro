// ==========================================
// AIDoctor Pro - Authentication Service
// ==========================================

import type { PatientProfile, ConsultationSession } from '../types';

export interface User {
    id: string;
    email: string;
    name: string;
    passwordHash: string; // Simple hash for demo purposes
    createdAt: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface UserData {
    profile: PatientProfile | null;
    consultations: ConsultationSession[];
}

const USERS_KEY = 'aidoctor_users';
const CURRENT_USER_KEY = 'aidoctor_current_user';
const USER_DATA_PREFIX = 'aidoctor_data_';

// Simple hash function for demo (NOT for production use)
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
};

// Get all users from localStorage
const getUsers = (): User[] => {
    try {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    } catch {
        return [];
    }
};

// Save users to localStorage
const saveUsers = (users: User[]): void => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Register a new user
export const register = (email: string, password: string, name: string): { success: boolean; error?: string; user?: User } => {
    const users = getUsers();

    // Check if email already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'An account with this email already exists' };
    }

    // Validate inputs
    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
    }
    if (password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
    }
    if (!name.trim()) {
        return { success: false, error: 'Please enter your name' };
    }

    // Create new user
    const newUser: User = {
        id: crypto.randomUUID(),
        email: email.toLowerCase(),
        name: name.trim(),
        passwordHash: simpleHash(password),
        createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    // Auto-login after registration
    setCurrentUser(newUser);

    return { success: true, user: newUser };
};

// Login user
export const login = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
    const users = getUsers();

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
        return { success: false, error: 'No account found with this email' };
    }

    if (user.passwordHash !== simpleHash(password)) {
        return { success: false, error: 'Incorrect password' };
    }

    setCurrentUser(user);
    return { success: true, user };
};

// Logout user
export const logout = (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
};

// Set current user
const setCurrentUser = (user: User): void => {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

// Get current user
export const getCurrentUser = (): User | null => {
    try {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
};

// Get auth state
export const getAuthState = (): AuthState => {
    const user = getCurrentUser();
    return {
        user,
        isAuthenticated: user !== null,
    };
};

// ==========================================
// User Data Management
// ==========================================

// Get user data
export const getUserData = (userId: string): UserData => {
    try {
        const data = localStorage.getItem(USER_DATA_PREFIX + userId);
        if (data) {
            return JSON.parse(data);
        }
    } catch {
        // Fall through to default
    }
    return { profile: null, consultations: [] };
};

// Save user data
export const saveUserData = (userId: string, data: UserData): void => {
    localStorage.setItem(USER_DATA_PREFIX + userId, JSON.stringify(data));
};

// Save user profile
export const saveUserProfile = (userId: string, profile: PatientProfile): void => {
    const data = getUserData(userId);
    data.profile = profile;
    saveUserData(userId, data);
};

// Get user profile
export const getUserProfile = (userId: string): PatientProfile | null => {
    return getUserData(userId).profile;
};

// Save consultation
export const saveConsultation = (userId: string, consultation: ConsultationSession): void => {
    const data = getUserData(userId);
    // Add to beginning so newest is first
    data.consultations = [consultation, ...data.consultations];
    // Keep only last 50 consultations
    if (data.consultations.length > 50) {
        data.consultations = data.consultations.slice(0, 50);
    }
    saveUserData(userId, data);
};

// Get user consultations
export const getUserConsultations = (userId: string): ConsultationSession[] => {
    return getUserData(userId).consultations;
};

// Delete consultation
export const deleteConsultation = (userId: string, consultationId: string): void => {
    const data = getUserData(userId);
    data.consultations = data.consultations.filter(c => c.id !== consultationId);
    saveUserData(userId, data);
};
