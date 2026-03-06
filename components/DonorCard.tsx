'use client';

import React from 'react';
import { motion } from 'motion/react';
import { User, useAppStore } from '@/lib/store';
import { MapPin, Phone, MessageCircle, ShieldCheck, Droplets, Heart, ChevronRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface DonorCardProps {
  donor: User;
  distance?: string;
}

export default function DonorCard({ donor, distance }: DonorCardProps) {
  const router = useRouter();
  const { currentUser, users, setUsers } = useAppStore();

  const handleVerify = (e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedUsers = users.map(u => u.id === donor.id ? { ...u, isVerified: true } : u);
    setUsers(updatedUsers);
    toast.success(`${donor.fullName} verified!`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-red-600 transition-colors">
            <Image 
              src={donor.photo || `https://picsum.photos/seed/${donor.id}/200/200`} 
              alt={donor.fullName} 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-black text-slate-900 text-lg">{donor.fullName}</h3>
              {donor.isVerified && (
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <MapPin className="w-3 h-3" />
              {donor.thana}, {donor.district}
              {distance && <span className="text-red-600 ml-2">• {distance} away</span>}
            </div>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex flex-col items-center justify-center border border-red-100">
            <span className="text-red-600 font-black text-lg leading-none">{donor.bloodGroup}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Donations</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-red-600" />
              {donor.totalDonations}
            </div>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Lives Saved</div>
            <div className="text-sm font-black text-red-600 flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {donor.livesSaved || donor.totalDonations * 3}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {currentUser?.role === 'admin' && !donor.isVerified && (
            <button 
              onClick={handleVerify}
              className="flex-1 bg-blue-600 text-white py-3 rounded-2xl text-xs font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-3 h-3" />
              Verify
            </button>
          )}
          <button 
            onClick={() => window.location.href = `tel:${donor.phone}`}
            className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-xs font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-3 h-3" />
            Call
          </button>
          <button 
            onClick={() => router.push(`/profile/${donor.id}`)}
            className="flex-1 bg-white text-slate-900 border-2 border-slate-100 py-3 rounded-2xl text-xs font-bold hover:border-red-600 hover:text-red-600 transition-all flex items-center justify-center gap-2"
          >
            Profile
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
