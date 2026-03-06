'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { History, ArrowLeft, CheckCircle, Clock, MapPin, User as UserIcon } from 'lucide-react';

export default function HistoryPage() {
  const router = useRouter();
  const { currentUser, donationHistory } = useAppStore();

  const userHistory = donationHistory.filter(h => h.donorId === currentUser?.id);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-black">Donation History</h1>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Summary */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 mb-8 text-white flex flex-col sm:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-2xl font-display font-black mb-1">Your Life-Saving Impact</h2>
            <p className="text-slate-400">Every donation saves up to 3 lives. Thank you for your service.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/10 px-6 py-4 rounded-3xl border border-white/10 text-center">
              <div className="text-3xl font-black text-red-500">{userHistory.length}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Donations</div>
            </div>
            <div className="bg-white/10 px-6 py-4 rounded-3xl border border-white/10 text-center">
              <div className="text-3xl font-black text-emerald-500">{userHistory.length * 3}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Lives Saved</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {userHistory.length > 0 ? (
            userHistory.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-8"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex flex-col items-center justify-center border border-emerald-100">
                  <CheckCircle className="text-emerald-600 w-8 h-8 mb-1" />
                  <span className="text-emerald-600 font-black text-xs uppercase tracking-widest">Done</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-display font-black text-slate-900">Donated to {item.receiverName}</h3>
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-black text-sm border border-red-100">
                      {item.bloodGroup}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Clock className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <MapPin className="w-4 h-4" />
                      {item.location}
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Impact</div>
                  <div className="text-emerald-600 font-black text-sm">+3 Lives</div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white p-20 rounded-[2.5rem] border border-dashed border-slate-200 text-center">
              <History className="w-16 h-16 text-slate-200 mx-auto mb-6" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No History Yet</h3>
              <p className="text-slate-500">Your life-saving donations will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function Calendar({ className }: { className?: string }) {
  return <Clock className={className} />;
}
