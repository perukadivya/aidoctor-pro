// ==========================================
// AI Health Pro - Authentication Service (Firebase)
// ==========================================

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    updateProfile,
    User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import type { PatientProfile, ConsultationSession } from '../types';

// User type that wraps Firebase User
export interface User {
    id: string;
    email: string;
    name: string;
    photoURL?: string;
    createdAt: string;
}

// Convert Firebase User to our User type
const firebaseUserToUser = (firebaseUser: FirebaseUser): User => ({
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    photoURL: firebaseUser.photoURL || undefined,
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
});

// Auth result type
export interface AuthResult {
    success: boolean;
    user?: User;
    error?: string;
}

// ==========================================
// Authentication Functions
// ==========================================

/**
 * Register a new user with email and password
 */
export const register = async (email: string, password: string, name: string): Promise<AuthResult> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Update the user's display name
        await updateProfile(userCredential.user, { displayName: name });

        const user = firebaseUserToUser(userCredential.user);
        user.name = name; // Use the provided name

        // Initialize empty user data in localStorage
        initializeUserData(user.id);

        return { success: true, user };
    } catch (error: any) {
        console.error('Registration error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

/**
 * Sign in with email and password
 */
export const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = firebaseUserToUser(userCredential.user);

        // Ensure user data exists
        initializeUserData(user.id);

        return { success: true, user };
    } catch (error: any) {
        console.error('Login error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        const user = firebaseUserToUser(userCredential.user);

        // Initialize user data if new user
        initializeUserData(user.id);

        return { success: true, user };
    } catch (error: any) {
        console.error('Google sign-in error:', error);
        return {
            success: false,
            error: getErrorMessage(error.code)
        };
    }
};

/**
 * Sign out the current user
 */
export const logout = async (): Promise<void> => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error('Logout error:', error);
    }
};

/**
 * Get the current user (synchronous check)
 */
export const getCurrentUser = (): User | null => {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
        return firebaseUserToUser(firebaseUser);
    }
    return null;
};

/**
 * Subscribe to auth state changes
 */
export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
    return onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
            callback(firebaseUserToUser(firebaseUser));
        } else {
            callback(null);
        }
    });
};

// ==========================================
// User Data Functions (localStorage for now)
// ==========================================

interface UserData {
    profile: PatientProfile | null;
    consultations: ConsultationSession[];
}

const STORAGE_KEY_PREFIX = 'aihealth_user_';

const initializeUserData = (userId: string): void => {
    const key = `${STORAGE_KEY_PREFIX}${userId}`;
    if (!localStorage.getItem(key)) {
        const initialData: UserData = {
            profile: null,
            consultations: []
        };
        localStorage.setItem(key, JSON.stringify(initialData));
    }
};

export const getUserData = (userId: string): UserData => {
    const key = `${STORAGE_KEY_PREFIX}${userId}`;
    const data = localStorage.getItem(key);
    if (data) {
        try {
            return JSON.parse(data);
        } catch {
            return { profile: null, consultations: [] };
        }
    }
    return { profile: null, consultations: [] };
};

export const saveUserProfile = (userId: string, profile: PatientProfile): void => {
    const key = `${STORAGE_KEY_PREFIX}${userId}`;
    const data = getUserData(userId);
    data.profile = profile;
    localStorage.setItem(key, JSON.stringify(data));
};

export const saveConsultation = (userId: string, consultation: ConsultationSession): void => {
    const key = `${STORAGE_KEY_PREFIX}${userId}`;
    const data = getUserData(userId);
    data.consultations.unshift(consultation);
    localStorage.setItem(key, JSON.stringify(data));
};

export const deleteConsultation = (userId: string, consultationId: string): void => {
    const key = `${STORAGE_KEY_PREFIX}${userId}`;
    const data = getUserData(userId);
    data.consultations = data.consultations.filter(c => c.id !== consultationId);
    localStorage.setItem(key, JSON.stringify(data));
};

// ==========================================
// Error Messages
// ==========================================

const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please sign in instead.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Contact support.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in was cancelled. Please try again.';
        case 'auth/popup-blocked':
            return 'Sign-in popup was blocked. Please allow popups for this site.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        default:
            return 'An error occurred. Please try again.';
    }
};
