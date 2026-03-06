'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft, MessageSquare, MapPin, ChevronRight, Globe, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function GroupsPage() {
  const router = useRouter();
  const { currentUser } = useAppStore();

  const groups = [
    {
      id: '1',
      name: `${currentUser?.district || 'Dhaka'} Blood Donor Network`,
      members: '12.4k',
      location: currentUser?.district || 'Dhaka',
      type: 'District Group',
      image: 'https://picsum.photos/seed/dhaka/400/400',
    },
    {
      id: '2',
      name: `${currentUser?.thana || 'Gulshan'} Blood Donors`,
      members: '2.8k',
      location: currentUser?.thana || 'Gulshan',
      type: 'Local Group',
      image: 'https://picsum.photos/seed/gulshan/400/400',
    },
    {
      id: '3',
      name: 'Life Saver Global Community',
      members: '150k',
      location: 'Global',
      type: 'Official Group',
      image: 'https://picsum.photos/seed/global/400/400',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-black">Community Groups</h1>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {groups.map((group) => (
            <motion.div 
              key={group.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6 group cursor-pointer"
            >
              <div className="relative w-20 h-20 rounded-3xl overflow-hidden border-2 border-slate-100">
                <Image src={group.image} alt={group.name} fill className="object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-display font-black text-slate-900 group-hover:text-red-600 transition-colors">{group.name}</h3>
                  {group.type === 'Official Group' && (
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {group.members} Members
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {group.location}
                  </div>
                  <div className="bg-slate-100 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                    {group.type}
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-red-600 font-black text-sm">
                Join Group <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 bg-slate-900 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <Globe className="w-12 h-12 text-red-600 mx-auto mb-6" />
            <h2 className="text-3xl font-display font-black mb-4">Can&apos;t find your local group?</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">Start a new community group for your Thana and help organize local blood donation drives.</p>
            <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200">
              Create Local Group
            </button>
          </div>
          <Users className="absolute left-[-20px] bottom-[-20px] w-64 h-64 text-white/5 -rotate-12" />
        </div>
      </main>
    </div>
  );
}
