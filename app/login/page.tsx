'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore, User } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Droplets, Mail, Lock, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser } = useAppStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;
      
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = { id: userDoc.id, ...userDoc.data() } as User;
        setCurrentUser(userData);
        toast.success(`Welcome back, ${userData.fullName}!`);
        router.push('/dashboard');
      } else {
        toast.error('User profile not found in database.');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100"
      >
        <div className="bg-red-600 p-8 text-white text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
            <Droplets className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-black">Welcome Back</h1>
          <p className="text-red-100 mt-2">Sign in to your Life Saver account.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="email" placeholder="Email Address" required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" placeholder="Password" required
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </form>
      </motion.div>
      <p className="mt-8 text-slate-500 text-sm">
        Don&apos;t have an account? <button onClick={() => router.push('/register')} className="text-red-600 font-bold hover:underline">Register as Donor</button>
      </p>
    </div>
  );
}
