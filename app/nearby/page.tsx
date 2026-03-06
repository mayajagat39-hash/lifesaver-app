'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppStore, User } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowLeft, Navigation, Phone, MessageSquare, Search, List, Map as MapIcon } from 'lucide-react';
import { calculateDistance } from '@/lib/utils';
import Image from 'next/image';
import toast from 'react-hot-toast';
import GoogleMapReact from 'google-map-react';
import DonorCard from '@/components/DonorCard';

const AnyReactComponent = ({ text, donor, lat, lng }: { text: string; donor: User; lat: number; lng: number }) => (
  <div className="relative group">
    <div className="bg-red-600 text-white px-2 py-1 rounded-lg text-[10px] font-black shadow-lg cursor-pointer hover:scale-110 transition-transform">
      {text}
    </div>
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block z-50">
      <DonorCard donor={donor} />
    </div>
  </div>
);

const UserMarker = ({ lat, lng }: { lat: number; lng: number }) => (
  <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse" />
);

export default function NearbyDonorsPage() {
  const router = useRouter();
  const { users, currentUser } = useAppStore();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(10); // Default 10km
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          toast.error('Failed to get your location. Please enable location services.');
          // Fallback to Dhaka
          setUserLocation({ lat: 23.8103, lng: 90.4125 });
        }
      );
    }
  }, []);

  const nearbyDonors = React.useMemo(() => {
    return users
      .filter(u => u.role === 'donor' && u.id !== currentUser?.id)
      .map(donor => {
        // Use a stable seed based on donor ID for "random" coordinates if not present
        const seed = parseInt(donor.id.slice(-4), 16) || 0;
        const donorLat = donor.lat || (userLocation?.lat || 23.8103) + ((seed % 100) / 1000 - 0.05);
        const donorLng = donor.lng || (userLocation?.lng || 90.4125) + ((seed % 100) / 1000 - 0.05);
        
        const distance = userLocation 
          ? calculateDistance(userLocation.lat, userLocation.lng, donorLat, donorLng)
          : 0;
          
        return { ...donor, distance, lat: donorLat, lng: donorLng };
      })
      .filter(donor => donor.distance <= radius)
      .sort((a, b) => a.distance - b.distance);
  }, [users, currentUser, userLocation, radius]);

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-xl font-display font-black">Nearby Donors</h1>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
              >
                <List className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-white shadow-sm text-red-600' : 'text-slate-500'}`}
              >
                <MapIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Radius Selector */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-emerald-50 p-3 rounded-2xl">
                <Navigation className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Set Search Radius</h2>
                <p className="text-xs text-slate-500">Find donors within a specific distance from you.</p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
              {[1, 5, 10, 25, 50].map(r => (
                <button 
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                    radius === r ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nearbyDonors.length > 0 ? (
              nearbyDonors.map((donor) => (
                <DonorCard key={donor.id} donor={donor} distance={`${donor.distance.toFixed(1)} km`} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Navigation className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Donors Nearby</h3>
                <p className="text-slate-500">Try increasing the search radius to find more donors.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden h-[600px] relative">
            {userLocation && (
              <GoogleMapReact
                bootstrapURLKeys={{ key: "" }} // User can add key here
                defaultCenter={userLocation}
                defaultZoom={12}
                yesIWantToUseGoogleMapApiInternals
              >
                <UserMarker
                  lat={userLocation.lat}
                  lng={userLocation.lng}
                />
                {nearbyDonors.map(donor => (
                  <AnyReactComponent
                    key={donor.id}
                    lat={donor.lat}
                    lng={donor.lng}
                    text={donor.bloodGroup}
                    donor={donor}
                  />
                ))}
              </GoogleMapReact>
            )}
            {!userLocation && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <Navigation className="w-12 h-12 text-slate-300 mx-auto mb-4 animate-bounce" />
                  <p className="text-slate-500 font-bold">Detecting your location...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
