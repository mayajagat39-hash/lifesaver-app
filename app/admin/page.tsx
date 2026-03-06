'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore, User, BloodRequest } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Users, 
  Droplets, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  ArrowLeft,
  BarChart3,
  Search,
  MoreVertical,
  Activity,
  Hospital,
  MapPin,
  Heart
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminPanel() {
  const router = useRouter();
  const { currentUser, users, requests, setUsers, setRequests } = useAppStore();
  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'analytics'>('users');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      // For demo purposes, if no admin exists, we'll allow access if the user is the first one
      // In a real app, this would be strictly enforced
      if (currentUser?.email !== 'admin@lifesaver.com') {
        // router.push('/dashboard');
      }
    }
  }, [currentUser, router]);

  const handleVerifyUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isVerified: true });
      toast.success('User verified successfully');
    } catch (error) {
      toast.error('Failed to verify user');
    }
  };

  const handleToggleApprove = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isApproved: !currentStatus });
      toast.success(!currentStatus ? 'User approved' : 'User approval revoked');
    } catch (error) {
      toast.error('Failed to update approval status');
    }
  };

  const handleToggleAvailability = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), { isAvailable: !currentStatus });
      toast.success('User status updated');
    } catch (error) {
      toast.error('Failed to update availability');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        toast.success('User account deleted');
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const stats = {
    totalUsers: users.length,
    totalDonors: users.filter(u => u.role === 'donor').length,
    totalRequests: requests.length,
    successfulDonations: requests.filter(r => r.status === 'Fulfilled').length,
    livesSaved: users.reduce((acc, u) => acc + (u.totalDonations * 3), 0),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-2">
          <Droplets className="text-red-600 w-8 h-8" />
          <span className="font-display font-black text-xl tracking-tight">Admin Hub</span>
        </div>

        <nav className="flex-grow px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'analytics' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <Users className="w-5 h-5" />
            User Management
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'requests' ? 'bg-red-600 text-white' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <AlertCircle className="w-5 h-5" />
            Blood Requests
          </button>
        </nav>

        <div className="p-8 border-t border-white/5">
          <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-white font-bold text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-display font-black text-slate-900">
              {activeTab === 'analytics' ? 'System Overview' : 
               activeTab === 'users' ? 'User Directory' : 'Emergency Requests'}
            </h1>
            <p className="text-slate-500 mt-1">Manage and monitor the Life Saver network.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
        </header>

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50' },
                { label: 'Active Donors', value: stats.totalDonors, icon: Droplets, color: 'text-red-600 bg-red-50' },
                { label: 'Total Requests', value: stats.totalRequests, icon: AlertCircle, color: 'text-orange-600 bg-orange-50' },
                { label: 'Lives Saved', value: stats.livesSaved, icon: Heart, color: 'text-pink-600 bg-pink-50' },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm h-96 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="font-bold">Detailed Analytics Visualization</p>
                <p className="text-sm">Growth charts and location heatmaps would appear here.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Blood Group</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-100">
                          <Image src={user.photo || `https://picsum.photos/seed/${user.id}/100/100`} alt={user.fullName} fill className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{user.fullName}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-black text-sm border border-red-100">
                        {user.bloodGroup}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-700">{user.thana}</div>
                      <div className="text-xs text-slate-400">{user.district}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.isApproved ? (
                          <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Approved</span>
                        ) : (
                          <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Pending Approval</span>
                        )}
                        {user.isVerified ? (
                          <span className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Verified</span>
                        ) : (
                          <span className="bg-amber-100 text-amber-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Unverified</span>
                        )}
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${user.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {user.isAvailable ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleToggleApprove(user.id, user.isApproved)}
                          className={`p-2 rounded-xl transition-colors ${user.isApproved ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                          title={user.isApproved ? "Revoke Approval" : "Approve User"}
                        >
                          <ShieldCheck className="w-5 h-5" />
                        </button>
                        {!user.isVerified && (
                          <button 
                            onClick={() => handleVerifyUser(user.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Verify User"
                          >
                            <ShieldCheck className="w-5 h-5" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleToggleAvailability(user.id, user.isAvailable)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Toggle Status"
                        >
                          <Activity className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete Account"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="grid gap-6">
            {requests.map((req) => (
              <div key={req.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-8">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex flex-col items-center justify-center border border-red-100">
                  <Droplets className="text-red-600 w-8 h-8 mb-1" />
                  <span className="text-red-600 font-black text-xl">{req.bloodGroup}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-display font-black text-slate-900">{req.patientName}</h3>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                      req.urgency === 'Critical' ? 'bg-red-600 text-white' : 
                      req.urgency === 'Urgent' ? 'bg-orange-500 text-white' : 'bg-blue-500 text-white'
                    }`}>
                      {req.urgency}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Hospital className="w-4 h-4" />
                      {req.hospitalName}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <MapPin className="w-4 h-4" />
                      {req.thana}, {req.district}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => router.push(`/requests/${req.id}`)}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Mark Fulfilled
                  </button>
                  <button 
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to remove this request?')) {
                        try {
                          await deleteDoc(doc(db, 'bloodRequests', req.id));
                          toast.success('Request removed');
                        } catch (error) {
                          toast.error('Failed to remove request');
                        }
                      }
                    }}
                    className="bg-slate-100 text-slate-600 px-6 py-2 rounded-xl text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
