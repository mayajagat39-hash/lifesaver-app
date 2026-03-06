'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore, User, BloodRequest } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  Droplets, 
  Search, 
  PlusCircle, 
  Users, 
  MessageSquare, 
  Trophy, 
  History, 
  Bell, 
  User as UserIcon,
  MapPin,
  ChevronRight,
  Activity,
  LogOut,
  Settings,
  ShieldCheck,
  Hospital,
  Star,
  Heart
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Dashboard() {
  const { 
    currentUser, 
    setCurrentUser, 
    users, 
    requests, 
    fetchInitialData, 
    syncRequests, 
    syncUsers 
  } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Initial fetch
    fetchInitialData();

    // Set up real-time listeners
    const unsubRequests = syncRequests();
    const unsubUsers = syncUsers();

    return () => {
      unsubRequests();
      unsubUsers();
    };
  }, [currentUser, router, fetchInitialData, syncRequests, syncUsers]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="bg-red-600 p-4 rounded-full"
        >
          <Droplets className="text-white w-8 h-8" />
        </motion.div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Search Donors', icon: Search, color: 'bg-blue-50 text-blue-600', path: '/search' },
    { label: 'Emergency Request', icon: PlusCircle, color: 'bg-red-50 text-red-600', path: '/request' },
    { label: 'Nearby Donors', icon: MapPin, color: 'bg-emerald-50 text-emerald-600', path: '/nearby' },
    { label: 'Group Chat', icon: MessageSquare, color: 'bg-purple-50 text-purple-600', path: '/chat' },
    { label: 'Leaderboard', icon: Trophy, color: 'bg-amber-50 text-amber-600', path: '/leaderboard' },
    { label: 'Donation History', icon: History, color: 'bg-slate-50 text-slate-600', path: '/history' },
  ];

  const recentRequests = requests
    .filter(r => r.status === 'Open')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Droplets className="text-red-600 w-6 h-6" />
              <span className="font-display font-bold text-lg tracking-tight">Life Saver</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-red-600 relative">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border-2 border-white"></span>
              </button>
              <button 
                onClick={() => signOut(auth)}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-6 h-6" />
              </button>
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => router.push('/profile')}
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-slate-900">{currentUser.fullName}</div>
                  <div className="text-xs text-slate-500">{currentUser.bloodGroup} Donor</div>
                </div>
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-red-600 transition-colors">
                  <Image 
                    src={currentUser.photo || `https://picsum.photos/seed/${currentUser.id}/100/100`} 
                    alt="Profile" 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden mb-8"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-display font-black mb-2">Hello, {currentUser.fullName.split(' ')[0]}!</h1>
            <p className="text-slate-400 max-w-md">Your contribution helps save lives. Check nearby requests or update your availability.</p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Blood Group</div>
                <div className="text-2xl font-black text-red-500">{currentUser.bloodGroup}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Donations</div>
                <div className="text-2xl font-black">{currentUser.totalDonations}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/10">
                <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Status</div>
                <div className={`text-sm font-bold px-2 py-1 rounded-lg ${currentUser.isAvailable ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                  {currentUser.isAvailable ? 'Available' : 'Not Available'}
                </div>
              </div>
            </div>
          </div>
          <Activity className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/5 -rotate-12" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-display font-black text-slate-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {menuItems.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(item.path)}
                  className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all text-left flex flex-col items-start gap-4"
                >
                  <div className={`p-3 rounded-2xl ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Emergency Requests Feed */}
            <div className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-display font-black text-slate-900">Emergency Requests</h2>
                <button onClick={() => router.push('/requests')} className="text-red-600 font-bold text-sm hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                {recentRequests.length > 0 ? (
                  recentRequests.map((req) => (
                    <motion.div 
                      key={req.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6"
                    >
                      <div className="w-16 h-16 bg-red-50 rounded-2xl flex flex-col items-center justify-center border border-red-100">
                        <span className="text-red-600 font-black text-xl">{req.bloodGroup}</span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-slate-900">{req.patientName}</h3>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            req.urgency === 'Critical' ? 'bg-red-600 text-white' : 
                            req.urgency === 'Urgent' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                          }`}>
                            {req.urgency}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {req.hospitalName}, {req.thana}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push(`/requests/${req.id}`)}
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
                      >
                        Help
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-200 text-center">
                    <Droplets className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No active requests in your area.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Community Updates */}
            <div className="mt-12">
              <h2 className="text-xl font-display font-black text-slate-900 mb-6">Community Updates</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-blue-600 p-6 rounded-[2rem] text-white relative overflow-hidden group cursor-pointer">
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg mb-4 inline-block">New Partner</span>
                    <h3 className="text-lg font-bold mb-2">Dhaka Medical College Hospital</h3>
                    <p className="text-blue-100 text-sm">Official partnership for emergency blood supply management.</p>
                  </div>
                  <Hospital className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
                </div>
                <div className="bg-emerald-600 p-6 rounded-[2rem] text-white relative overflow-hidden group cursor-pointer">
                  <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-1 rounded-lg mb-4 inline-block">Campaign</span>
                    <h3 className="text-lg font-bold mb-2">World Blood Donor Day</h3>
                    <p className="text-emerald-100 text-sm">Join our mega donation drive on June 14th at Central Plaza.</p>
                  </div>
                  <Star className="absolute right-[-10px] bottom-[-10px] w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Donor Stats Card */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-display font-black text-slate-900 mb-6">Your Impact</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-pink-50 rounded-xl">
                      <Heart className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-600">Lives Saved</span>
                  </div>
                  <span className="text-sm font-black text-red-600">{currentUser.totalDonations * 3}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-600">Verification</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${currentUser.isVerified ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                    {currentUser.isVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl">
                      <Trophy className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm font-bold text-slate-600">Current Badge</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {currentUser.totalDonations >= 25 ? 'Hero' : 
                     currentUser.totalDonations >= 10 ? 'Gold' : 
                     currentUser.totalDonations >= 6 ? 'Silver' : 
                     currentUser.totalDonations >= 3 ? 'Bronze' : 'Newbie'}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => router.push('/profile/edit')}
                className="w-full mt-8 py-3 rounded-2xl border-2 border-slate-100 text-slate-600 font-bold text-sm hover:border-red-600 hover:text-red-600 transition-all flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
            </div>

            {/* Leaderboard Preview */}
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-lg font-display font-black text-slate-900 mb-6">Top Donors</h3>
              <div className="space-y-4">
                {users.sort((a, b) => b.totalDonations - a.totalDonations).slice(0, 3).map((user, idx) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">
                      #{idx + 1}
                    </div>
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image src={user.photo || `https://picsum.photos/seed/${user.id}/100/100`} alt={user.fullName} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm font-bold text-slate-900">{user.fullName}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-black">{user.totalDonations} Donations</div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/leaderboard')} className="w-full mt-6 text-red-600 font-bold text-sm hover:underline">View Full Leaderboard</button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50">
        <button onClick={() => router.push('/dashboard')} className="p-2 text-red-600"><Activity className="w-6 h-6" /></button>
        <button onClick={() => router.push('/search')} className="p-2 text-slate-400"><Search className="w-6 h-6" /></button>
        <button onClick={() => router.push('/request')} className="p-4 bg-red-600 rounded-full -mt-12 shadow-xl shadow-red-200 text-white"><PlusCircle className="w-6 h-6" /></button>
        <button onClick={() => router.push('/chat')} className="p-2 text-slate-400"><MessageSquare className="w-6 h-6" /></button>
        <button onClick={() => router.push('/profile')} className="p-2 text-slate-400"><UserIcon className="w-6 h-6" /></button>
      </nav>
    </div>
  );
}
