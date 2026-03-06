'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore, User, BloodGroup } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Droplets, Mail, Lock, User as UserIcon, Phone, MapPin, Calendar, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function RegisterPage() {
  const router = useRouter();
  const { setCurrentUser } = useAppStore();
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    password: '',
    bloodGroup: 'A+' as BloodGroup,
    hemoglobin: 14,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '',
    district: '',
    thana: '',
    location: '',
    isAvailable: true,
    lat: 23.8103, // Default to Dhaka
    lng: 90.4125,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      setIsVerifying(true);
      toast.success('Verification code sent to ' + formData.phone);
      setStep(1.5); // Verification step
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleVerify = () => {
    if (verificationCode === '1234') {
      toast.success('Phone verified successfully!');
      setIsVerifying(false);
      setStep(2);
      
      // Get geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setFormData(prev => ({
            ...prev,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }));
          toast.success('Location detected!');
        });
      }
    } else {
      toast.error('Invalid code. Use 1234 for demo.');
    }
  };
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const firebaseUser = userCredential.user;

      // 2. Prepare user profile data (excluding password)
      const { password, ...profileData } = formData;
      const newUser: User = {
        ...profileData,
        id: firebaseUser.uid,
        role: 'donor',
        isVerified: false,
        isApproved: false,
        totalDonations: 0,
        livesSaved: 0,
        photo: `https://picsum.photos/seed/${formData.fullName}/200/200`,
      };

      // 3. Save profile to Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      
      setCurrentUser(newUser);
      toast.success('Registration successful!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100"
      >
        <div className="bg-red-600 p-8 text-white text-center">
          <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
            <Droplets className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-black">Join the Network</h1>
          <p className="text-red-100 mt-2">Create your donor profile and start saving lives.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" name="fullName" placeholder="Full Name" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    value={formData.fullName} onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" name="email" placeholder="Email Address" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    value={formData.email} onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" name="phone" placeholder="Phone Number" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="password" name="password" placeholder="Password" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
                    value={formData.password} onChange={handleChange}
                  />
                </div>
              </div>
              <button 
                type="button" onClick={handleNext}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold mt-8 hover:bg-slate-800 transition-all"
              >
                Next Step
              </button>
            </motion.div>
          )}

          {step === 1.5 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-2">Verify Phone</h2>
              <p className="text-sm text-slate-500 mb-6">We&apos;ve sent a 4-digit code to {formData.phone}. Enter it below to continue.</p>
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Enter 4-digit code" maxLength={4}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none text-center text-2xl font-black tracking-[1em]"
                  value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button" onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
                <button 
                  type="button" onClick={handleVerify}
                  className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Verify
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 mt-4">Demo code: 1234</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Medical Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Blood Group</label>
                  <select 
                    name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Hemoglobin (g/dL)</label>
                  <input 
                    type="number" name="hemoglobin" step="0.1" required
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                    value={formData.hemoglobin} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Gender</label>
                  <select 
                    name="gender" value={formData.gender} onChange={handleChange}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 ml-1">Date of Birth</label>
                  <input 
                    type="date" name="dob" required
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                    value={formData.dob} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button" onClick={handleBack}
                  className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
                <button 
                  type="button" onClick={handleNext}
                  className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Location & Availability</h2>
              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" name="district" placeholder="District" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                    value={formData.district} onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" name="thana" placeholder="Thana / Area" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                    value={formData.thana} onChange={handleChange}
                  />
                </div>
                <textarea 
                  name="location" placeholder="Exact Location (e.g., Street, Landmark)" required
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none h-24 resize-none"
                  value={formData.location} onChange={handleChange}
                />
                <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all">
                  <input 
                    type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange}
                    className="w-5 h-5 rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="font-medium text-slate-700">I am available for donations now</span>
                </label>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  type="button" onClick={handleBack}
                  className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Complete Registration
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </motion.div>
      <p className="mt-8 text-slate-500 text-sm">
        Already have an account? <button onClick={() => router.push('/login')} className="text-red-600 font-bold hover:underline">Login here</button>
      </p>
    </div>
  );
}
