'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore, BloodRequest, User, DonationHistory } from '@/lib/store';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, MessageSquare, Droplets, Calendar, Activity, CheckCircle, User as UserIcon, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { doc, updateDoc, addDoc, collection, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function BloodRequestDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { requests, setRequests, users, setUsers, currentUser, donationHistory, setDonationHistory } = useAppStore();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState('');
  
  const request = React.useMemo(() => {
    return requests.find(r => r.id === id) || null;
  }, [id, requests]);

  useEffect(() => {
    if (!request && id) {
      toast.error('Request not found');
      router.push('/dashboard');
    }
  }, [request, id, router]);

  if (!request) return null;

  const isRequester = currentUser?.id === request.requesterId;

  const handleConfirmDonation = async () => {
    if (!selectedDonorId || !id) return toast.error('Please select a donor');

    const donor = users.find(u => u.id === selectedDonorId);
    if (!donor) return toast.error('Donor not found');

    try {
      // 1. Update donor stats in Firestore
      const donorRef = doc(db, 'users', selectedDonorId);
      await updateDoc(donorRef, {
        totalDonations: increment(1),
        livesSaved: increment(3),
        lastDonationDate: new Date().toISOString().split('T')[0]
      });

      // 2. Update request status in Firestore
      const requestRef = doc(db, 'bloodRequests', id as string);
      await updateDoc(requestRef, {
        status: 'Fulfilled'
      });

      // 3. Add to donation history in Firestore
      const newHistory = {
        donorId: selectedDonorId,
        receiverName: request.patientName,
        date: new Date().toISOString().split('T')[0],
        location: request.hospitalName,
        bloodGroup: request.bloodGroup
      };
      await addDoc(collection(db, 'donationHistory'), newHistory);

      toast.success('Donation confirmed! Thank you for saving lives.');
      setShowConfirmModal(false);
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Error confirming donation:", error);
      toast.error('Failed to confirm donation.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-black">Request Details</h1>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className={`p-8 ${
            request.urgency === 'Critical' ? 'bg-red-600' : 
            request.urgency === 'Urgent' ? 'bg-orange-500' : 'bg-blue-500'
          } text-white`}>
            <div className="flex justify-between items-start mb-6">
              <div className="bg-white/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                {request.urgency} Request
              </div>
              <div className="bg-white text-slate-900 px-4 py-2 rounded-2xl font-black text-xl">
                {request.bloodGroup}
              </div>
            </div>
            <h2 className="text-3xl font-display font-black mb-2">Needs {request.bloodGroup} for {request.patientName}</h2>
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <MapPin className="w-4 h-4" />
              {request.hospitalName}, {request.thana}
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Hospital</div>
                <div className="font-bold text-slate-900">{request.hospitalName}</div>
                <div className="text-sm text-slate-500">{request.hospitalLocation}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Contact</div>
                <div className="font-bold text-slate-900">{request.phone}</div>
                <div className="text-sm text-slate-500">Call for immediate coordination</div>
              </div>
            </div>

            <div>
              <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" />
                Patient Notes
              </h3>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-slate-600 leading-relaxed">
                {request.notes || "No additional notes provided."}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => window.location.href = `tel:${request.phone}`}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6" />
                Call Now
              </button>
              {isRequester && request.status === 'Open' && (
                <button 
                  onClick={() => setShowConfirmModal(true)}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3"
                >
                  <CheckCircle className="w-6 h-6" />
                  Confirm Donation
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-display font-black text-slate-900 text-center mb-2">Confirm Donation</h3>
              <p className="text-slate-500 text-center mb-8">Who fulfilled this blood request? Their profile will be updated with a life-saving badge.</p>
              
              <div className="space-y-4">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Select Donor</label>
                <select 
                  value={selectedDonorId}
                  onChange={(e) => setSelectedDonorId(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold"
                >
                  <option value="">Choose a donor...</option>
                  {users.filter(u => u.role === 'donor').map(u => (
                    <option key={u.id} value={u.id}>{u.fullName} ({u.bloodGroup})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-slate-100 text-slate-900 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmDonation}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
