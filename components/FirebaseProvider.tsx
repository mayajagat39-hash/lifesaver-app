'use client';

import React, { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser, syncRequests, syncUsers, fetchInitialData } = useAppStore();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: userDoc.id, ...userDoc.data() } as any);
        }
      } else {
        setCurrentUser(null);
      }
    });

    // Initial data fetch
    fetchInitialData();

    // Real-time sync
    const unsubRequests = syncRequests();
    const unsubUsers = syncUsers();

    return () => {
      unsubscribeAuth();
      unsubRequests();
      unsubUsers();
    };
  }, [setCurrentUser, syncRequests, syncUsers, fetchInitialData]);

  return <>{children}</>;
}
