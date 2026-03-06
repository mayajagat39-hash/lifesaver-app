'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAppStore, BloodGroup, UrgencyLevel, BloodRequest } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Droplets, MapPin, Phone, Hospital, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function EmergencyRequestPage() {
  const router = useRouter();
  const { currentUser, requests, setRequests } = useAppStore();
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'A+' as BloodGroup,
    hospitalName: '',
    hospitalLocation: '',
    district: '',
    thana: '',
    phone: '',
    urgency: 'Normal' as UrgencyLevel,
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const newRequest = {
        ...formData,
        requesterId: currentUser.id,
        createdAt: new Date().toISOString(),
        status: 'Open',
      };

      await addDoc(collection(db, 'bloodRequests'), newRequest);
      
      toast.success('Emergency request posted successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error posting request:", error);
      toast.error('Failed to post emergency request.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-black">Emergency Request</h1>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100"
        >
          <div className="bg-red-600 p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 p-3 rounded-2xl">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-display font-black">Post a Request</h2>
                <p className="text-red-100 text-sm">Fill in the details to notify nearby donors.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Patient Name</label>
                <input 
                  type="text" name="patientName" required
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.patientName} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Blood Group Needed</label>
                <select 
                  name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Hospital Name</label>
              <div className="relative">
                <Hospital className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" name="hospitalName" required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.hospitalName} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">District</label>
                <input 
                  type="text" name="district" required
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.district} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Thana / Area</label>
                <input 
                  type="text" name="thana" required
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                  value={formData.thana} onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" name="phone" required
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-600 ml-1">Urgency Level</label>
                <select 
                  name="urgency" value={formData.urgency} onChange={handleChange}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 ml-1">Additional Notes</label>
              <textarea 
                name="notes" placeholder="Any specific requirements or instructions..."
                className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none h-32 resize-none"
                value={formData.notes} onChange={handleChange}
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-2"
            >
              <Send className="w-6 h-6" />
              Post Emergency Request
            </button>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
