'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAppStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Trophy, ArrowLeft, Medal, Star, Crown } from 'lucide-react';
import Image from 'next/image';

export default function LeaderboardPage() {
  const router = useRouter();
  const [category, setCategory] = React.useState<'Monthly' | '6 Months' | 'Yearly' | 'All Time'>('All Time');
  const { users } = useAppStore();

  const sortedDonors = React.useMemo(() => {
    return users
      .filter(u => u.role === 'donor')
      .sort((a, b) => b.totalDonations - a.totalDonations);
  }, [users]);

  const categories = ['Monthly', '6 Months', 'Yearly', 'All Time'] as const;

  const getBadge = (count: number) => {
    if (count >= 25) return { label: 'Hero', icon: Crown, color: 'text-red-600 bg-red-50' };
    if (count >= 10) return { label: 'Gold', icon: Medal, color: 'text-amber-500 bg-amber-50' };
    if (count >= 6) return { label: 'Silver', icon: Medal, color: 'text-slate-400 bg-slate-50' };
    if (count >= 3) return { label: 'Bronze', icon: Medal, color: 'text-orange-600 bg-orange-50' };
    return null;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-black">Top Donors</h1>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                category === cat 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-200' 
                  : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-12 items-end pt-12">
          {/* 2nd Place */}
          {sortedDonors[1] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-slate-200 shadow-xl">
                  <Image src={sortedDonors[1].photo || `https://picsum.photos/seed/${sortedDonors[1].id}/200/200`} alt={sortedDonors[1].fullName} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-200 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white text-sm">2</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-[100px]">{sortedDonors[1].fullName.split(' ')[0]}</div>
                <div className="text-xs font-black text-red-600">{sortedDonors[1].totalDonations} Donations</div>
              </div>
              <div className="w-full h-24 bg-slate-200/50 rounded-t-2xl mt-4"></div>
            </motion.div>
          )}

          {/* 1st Place */}
          {sortedDonors[0] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2">
                  <Crown className="w-10 h-10 text-amber-400 drop-shadow-lg" />
                </div>
                <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl scale-110">
                  <Image src={sortedDonors[0].photo || `https://picsum.photos/seed/${sortedDonors[0].id}/200/200`} alt={sortedDonors[0].fullName} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-black border-2 border-white text-lg">1</div>
              </div>
              <div className="text-center">
                <div className="font-black text-slate-900 text-base sm:text-xl truncate max-w-[120px]">{sortedDonors[0].fullName.split(' ')[0]}</div>
                <div className="text-sm font-black text-red-600">{sortedDonors[0].totalDonations} Donations</div>
              </div>
              <div className="w-full h-32 bg-amber-400/10 rounded-t-2xl mt-4 border-x border-t border-amber-400/20"></div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {sortedDonors[2] && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-orange-200 shadow-xl">
                  <Image src={sortedDonors[2].photo || `https://picsum.photos/seed/${sortedDonors[2].id}/200/200`} alt={sortedDonors[2].fullName} fill className="object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-orange-200 text-orange-600 w-8 h-8 rounded-full flex items-center justify-center font-black border-2 border-white text-sm">3</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-900 text-sm sm:text-base truncate max-w-[100px]">{sortedDonors[2].fullName.split(' ')[0]}</div>
                <div className="text-xs font-black text-red-600">{sortedDonors[2].totalDonations} Donations</div>
              </div>
              <div className="w-full h-16 bg-orange-200/50 rounded-t-2xl mt-4"></div>
            </motion.div>
          )}
        </div>

        {/* List View */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-xl font-display font-black text-slate-900">{category} Rankings</h2>
            <div className="bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-widest">Global</div>
          </div>
          <div className="divide-y divide-slate-50">
            {sortedDonors.map((donor, idx) => {
              const badge = getBadge(donor.totalDonations);
              return (
                <motion.div 
                  key={donor.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/profile/${donor.id}`)}
                >
                  <div className="w-8 text-center font-black text-slate-400 text-sm">
                    {idx + 1}
                  </div>
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100">
                    <Image src={donor.photo || `https://picsum.photos/seed/${donor.id}/100/100`} alt={donor.fullName} fill className="object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-grow">
                    <div className="font-bold text-slate-900">{donor.fullName}</div>
                    <div className="text-xs text-slate-500">{donor.thana}, {donor.district}</div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    {badge && (
                      <div className={`hidden sm:flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${badge.color}`}>
                        <badge.icon className="w-3 h-3" />
                        {badge.label}
                      </div>
                    )}
                    <div className="text-sm font-black text-red-600">{donor.totalDonations} <span className="text-[10px] text-slate-400 uppercase">Donations</span></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
