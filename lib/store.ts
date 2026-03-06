import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  getDocs,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UserRole = 'donor' | 'seeker' | 'admin';
export type UrgencyLevel = 'Normal' | 'Urgent' | 'Critical';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  password?: string;
  bloodGroup: BloodGroup;
  hemoglobin: number;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  photo?: string;
  district: string;
  thana: string;
  location: string;
  lastDonationDate?: string;
  isAvailable: boolean;
  role: UserRole;
  isVerified: boolean;
  isApproved: boolean;
  totalDonations: number;
  livesSaved: number;
  lat?: number;
  lng?: number;
}

export interface DonationHistory {
  id: string;
  donorId: string;
  receiverName: string;
  date: string;
  location: string;
  bloodGroup: BloodGroup;
}

export interface BloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  hospitalName: string;
  hospitalLocation: string;
  district: string;
  thana: string;
  phone: string;
  urgency: UrgencyLevel;
  notes: string;
  requesterId: string;
  createdAt: string;
  status: 'Open' | 'Fulfilled' | 'Closed';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId?: string; // For direct messages
  room?: string; // For group chat
  text: string;
  timestamp: string;
  senderName: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  requests: BloodRequest[];
  messages: Message[];
  donationHistory: DonationHistory[];
  isLoading: boolean;
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  setRequests: (requests: BloodRequest[]) => void;
  setMessages: (messages: Message[]) => void;
  setDonationHistory: (history: DonationHistory[]) => void;
  setIsLoading: (loading: boolean) => void;
  
  // Firebase Actions
  fetchInitialData: () => Promise<void>;
  syncRequests: () => () => void;
  syncUsers: () => () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      requests: [],
      messages: [],
      donationHistory: [],
      isLoading: false,
      setCurrentUser: (user) => set({ currentUser: user }),
      setUsers: (users) => set({ users }),
      setRequests: (requests) => set({ requests }),
      setMessages: (messages) => set({ messages }),
      setDonationHistory: (history) => set({ donationHistory: history }),
      setIsLoading: (isLoading) => set({ isLoading }),

      fetchInitialData: async () => {
        set({ isLoading: true });
        try {
          const usersSnap = await getDocs(collection(db, 'users'));
          const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
          
          const requestsSnap = await getDocs(collection(db, 'bloodRequests'));
          const requests = requestsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BloodRequest));
          
          set({ users, requests, isLoading: false });
        } catch (error) {
          console.error("Error fetching initial data:", error);
          set({ isLoading: false });
        }
      },

      syncRequests: () => {
        const q = query(collection(db, 'bloodRequests'));
        return onSnapshot(q, (snapshot) => {
          const requests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BloodRequest));
          set({ requests });
        });
      },

      syncUsers: () => {
        const q = query(collection(db, 'users'));
        return onSnapshot(q, (snapshot) => {
          const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
          set({ users });
        });
      },
    }),
    {
      name: 'life-saver-storage',
      partialize: (state) => ({ currentUser: state.currentUser }), // Only persist currentUser
    }
  )
);
