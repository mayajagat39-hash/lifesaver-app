'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore, User } from '@/lib/store';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Droplets, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Activity, 
  Calendar, 
  ShieldCheck, 
  Trophy, 
  Medal, 
  Star, 
  Crown,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { users, currentUser } = useAppStore();
  const profileId = params?.id as string;
  
  const profileUser = React.useMemo(() => {
    if (profileId) {
      return users.find(u => u.id === profileId) || null;
    }
    return currentUser;
  }, [profileId, users, currentUser]);

  if (!profileUser) return null;

  const getBadge = (count: number) => {
    if (count >= 25) return { label: 'Hero Donor', icon: Crown, color: 'text-red-600 bg-red-50', border: 'border-red-100' };
    if (count >= 10) return { label: 'Gold Donor', icon: Medal, color: 'text-amber-500 bg-amber-50', border: 'border-amber-100' };
    if (count >= 6) return { label: 'Silver Donor', icon: Medal, color: 'text-slate-400 bg-slate-50', border: 'border-slate-100' };
    if (count >= 3) return { label: 'Bronze Donor', icon: Medal, color: 'text-orange-600 bg-orange-50', border: 'border-orange-100' };
    return null;
  };

  const badge = getBadge(profileUser.totalDonations);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-black">Donor Profile</h1>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100"
        >
          {/* Cover Area */}
          <div className="h-48 bg-slate-900 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50"></div>
            <Activity className="absolute right-4 bottom-4 w-32 h-32 text-white/5 -rotate-12" />
          </div>

          <div className="px-8 pb-8 relative">
            {/* Profile Image */}
            <div className="relative -mt-20 mb-6 inline-block">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] overflow-hidden border-8 border-white shadow-2xl bg-white">
                <Image src={profileUser.photo || `https://picsum.photos/seed/${profileUser.id}/200/200`} alt={profileUser.fullName} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute bottom-4 -right-4 bg-red-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-4 border-white shadow-lg">
                {profileUser.bloodGroup}
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-3xl font-display font-black text-slate-900">{profileUser.fullName}</h2>
                  {profileUser.isVerified && (
                    <div className="bg-blue-50 p-1 rounded-full border border-blue-100">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profileUser.thana}, {profileUser.district}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Born {new Date(profileUser.dob).toLocaleDateString()}
                  </div>
                </div>
                {!profileUser.isVerified && currentUser?.id === profileUser.id && (
                  <button 
                    onClick={() => toast.success('Verification request sent to admin!')}
                    className="mt-4 bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-blue-100 hover:bg-blue-100 transition-all flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Request Verification
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto">
                <div className="flex gap-3">
                  <button 
                    onClick={() => window.location.href = `tel:${profileUser.phone}`}
                    className="flex-1 md:flex-none bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-2"
                  >
                    <Phone className="w-5 h-5" />
                    Call Now
                  </button>
                  <button 
                    onClick={() => router.push(`/chat/${profileUser.id}`)}
                    className="flex-1 md:flex-none bg-white border-2 border-slate-100 text-slate-900 px-8 py-4 rounded-2xl font-bold hover:border-red-600 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Message
                  </button>
                </div>
                <button 
                  onClick={() => window.open(`https://wa.me/${profileUser.whatsapp}`, '_blank')}
                  className="w-full bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Chat
                </button>
              </div>
            </div>

            {/* Floating Call Button for Mobile */}
            <div className="fixed bottom-8 right-8 z-50 md:hidden">
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => window.location.href = `tel:${profileUser.phone}`}
                className="bg-red-600 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center border-4 border-white"
              >
                <Phone className="w-8 h-8" />
              </motion.button>
            </div>

            <hr className="my-10 border-slate-100" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Total Donations</div>
                <div className="text-2xl font-black text-slate-900">{profileUser.totalDonations}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Lives Saved</div>
                <div className="text-2xl font-black text-red-600">{profileUser.totalDonations * 3}</div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Last Donation</div>
                <div className="text-sm font-black text-slate-900">
                  {profileUser.lastDonationDate ? new Date(profileUser.lastDonationDate).toLocaleDateString() : 'Never'}
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Hemoglobin</div>
                <div className="text-2xl font-black text-slate-900">{profileUser.hemoglobin} <span className="text-xs font-bold text-slate-400">g/dL</span></div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Availability</div>
                <div className={`text-sm font-black px-2 py-1 rounded-lg inline-block ${profileUser.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {profileUser.isAvailable ? 'Available' : 'Busy'}
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Gender</div>
                <div className="text-2xl font-black text-slate-900">{profileUser.gender}</div>
              </div>
            </div>

            {/* Badge Section */}
            {badge && (
              <div className={`mt-8 p-6 rounded-3xl border ${badge.border} ${badge.color} flex items-center gap-6`}>
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <badge.icon className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-lg font-black">{badge.label}</h3>
                  <p className="text-sm opacity-80">Awarded for completing {profileUser.totalDonations} life-saving donations.</p>
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="mt-12">
              <h3 className="text-xl font-display font-black text-slate-900 mb-6">Contact Information</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <Phone className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Phone Number</div>
                    <div className="font-bold text-slate-900">{profileUser.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="bg-white p-2 rounded-xl shadow-sm">
                    <ExternalLink className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">WhatsApp</div>
                    <a href={`https://wa.me/${profileUser.whatsapp}`} target="_blank" className="font-bold text-red-600 hover:underline">Chat on WhatsApp</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
