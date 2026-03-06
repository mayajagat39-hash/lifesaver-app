'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore, User, BloodGroup } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Droplets, Phone, MessageSquare, ArrowLeft, Filter, Activity } from 'lucide-react';
import Image from 'next/image';
import DonorCard from '@/components/DonorCard';

export default function SearchPage() {
  const router = useRouter();
  const { users } = useAppStore();
  const [filters, setFilters] = useState({
    bloodGroup: '' as BloodGroup | '',
    district: '',
    thana: '',
    availability: 'all' as 'all' | 'available'
  });

  const filteredDonors = users.filter(user => {
    if (user.role !== 'donor') return false;
    if (filters.bloodGroup && user.bloodGroup !== filters.bloodGroup) return false;
    if (filters.district && !user.district.toLowerCase().includes(filters.district.toLowerCase())) return false;
    if (filters.thana && !user.thana.toLowerCase().includes(filters.thana.toLowerCase())) return false;
    if (filters.availability === 'available' && !user.isAvailable) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-display font-black">Search Donors</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6 text-slate-900">
            <Filter className="w-5 h-5 text-red-600" />
            <h2 className="font-bold">Filter Donors</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Blood Group</label>
              <select 
                value={filters.bloodGroup} onChange={(e) => setFilters({...filters, bloodGroup: e.target.value as BloodGroup})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="">All Groups</option>
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">District</label>
              <input 
                type="text" placeholder="e.g., Dhaka"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                value={filters.district} onChange={(e) => setFilters({...filters, district: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Thana / Area</label>
              <input 
                type="text" placeholder="e.g., Gulshan"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
                value={filters.thana} onChange={(e) => setFilters({...filters, thana: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Availability</label>
              <select 
                value={filters.availability} onChange={(e) => setFilters({...filters, availability: e.target.value as any})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
              >
                <option value="all">All Donors</option>
                <option value="available">Available Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.length > 0 ? (
            filteredDonors.map((donor) => (
              <DonorCard key={donor.id} donor={donor} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No Donors Found</h3>
              <p className="text-slate-500">Try adjusting your filters to find more donors.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
