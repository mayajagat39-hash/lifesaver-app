'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Phone,
  Activity,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Hospital,
  Star,
  Heart,
  ShieldCheck
} from 'lucide-react';
import { useAppStore, User, BloodRequest } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LandingPage() {
  const { currentUser, users, requests } = useAppStore();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Calculate real-time stats
  const totalDonors = users.length;
  const totalRequests = requests.length;
  const livesSaved = users.reduce((acc, user) => acc + (user.livesSaved || 0), 0);

  const stats = [
    { label: 'Registered Donors', value: `${totalDonors.toLocaleString()}+`, icon: Users, color: 'text-blue-600' },
    { label: 'Lives Saved', value: `${livesSaved.toLocaleString()}+`, icon: Activity, color: 'text-red-600' },
    { label: 'Blood Requests', value: `${totalRequests.toLocaleString()}+`, icon: Droplets, color: 'text-orange-600' },
  ];

  const features = [
    {
      title: 'Emergency Search',
      description: 'Find donors near your location instantly during emergencies.',
      icon: Search,
      path: '/search'
    },
    {
      title: 'Blood Requests',
      description: 'Post an emergency request and notify all matching donors nearby.',
      icon: PlusCircle,
      path: '/request'
    },
    {
      title: 'Community Groups',
      description: 'Join your local Thana group for community support and updates.',
      icon: Users,
      path: '/groups'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 p-2 rounded-xl">
                <Droplets className="text-white w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900">Life Saver</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">Features</a>
              <a href="#stats" className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors">Impact</a>
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => router.push('/dashboard')}
                    className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Dashboard
                  </button>
                  <button onClick={() => signOut(auth)} className="text-slate-400 hover:text-red-600">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => router.push('/login')}
                    className="text-sm font-medium text-slate-600 hover:text-red-600"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => router.push('/register')}
                    className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Register as Donor
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-slate-200 absolute top-16 left-0 w-full z-40 p-4 space-y-4 shadow-xl"
          >
            <a href="#features" className="block text-lg font-medium text-slate-700">Features</a>
            <a href="#stats" className="block text-lg font-medium text-slate-700">Impact</a>
            <hr />
            {currentUser ? (
              <button onClick={() => router.push('/dashboard')} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">Dashboard</button>
            ) : (
              <>
                <button onClick={() => router.push('/login')} className="w-full text-slate-700 py-3 font-bold">Login</button>
                <button onClick={() => router.push('/register')} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">Register as Donor</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold mb-6 border border-red-100">
                  <Activity className="w-4 h-4" />
                  <span>Emergency Blood Network</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-display font-black text-slate-900 leading-[1.1] mb-6">
                  Every Drop <span className="text-red-600">Saves</span> a Life.
                </h1>
                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg">
                  Connect with thousands of voluntary blood donors in your area instantly. Simple, fast, and life-saving.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => router.push('/search')}
                    className="bg-red-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Find Donors Now
                  </button>
                  <button 
                    onClick={() => router.push('/request')}
                    className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl text-lg font-bold hover:border-red-600 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Emergency Request
                  </button>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden lg:block"
              >
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-red-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                  <Image 
                    src="https://picsum.photos/seed/blood-donation/800/800" 
                    alt="Blood Donation" 
                    fill 
                    className="object-cover rounded-3xl shadow-2xl rotate-3"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-white/10 mb-6`}>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-display font-black mb-2">{stat.value}</div>
                  <div className="text-slate-400 font-medium uppercase tracking-wider text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl lg:text-5xl font-display font-black text-slate-900 mb-6">How It Works</h2>
              <p className="text-lg text-slate-600">Our platform is designed for speed and reliability, ensuring you get help when you need it most.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <motion.div 
                  key={idx}
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200 transition-all group"
                  onClick={() => router.push(feature.path)}
                >
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-md flex items-center justify-center mb-8 group-hover:bg-red-600 transition-colors">
                    <feature.icon className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed mb-6">{feature.description}</p>
                  <div className="flex items-center text-red-600 font-bold text-sm gap-1">
                    Learn More <ChevronRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        {/* Partners & Future Section */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl lg:text-5xl font-display font-black text-slate-900 mb-8">Our Network Partners</h2>
                <p className="text-lg text-slate-600 mb-10">We collaborate with leading healthcare institutions and NGOs to ensure a seamless blood supply chain.</p>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { name: 'DMC Hospital', type: 'Hospital', icon: Hospital },
                    { name: 'Red Crescent', type: 'NGO', icon: ShieldCheck },
                    { name: 'City Blood Bank', type: 'Blood Bank', icon: Droplets },
                    { name: 'Health Care NGO', type: 'NGO', icon: Heart },
                  ].map((partner, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 flex items-center gap-4 shadow-sm">
                      <div className="bg-red-50 p-3 rounded-2xl">
                        <partner.icon className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{partner.name}</div>
                        <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">{partner.type}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-display font-black mb-6">Future Roadmap</h3>
                  <ul className="space-y-6">
                    {[
                      { title: 'Mobile App', desc: 'Native iOS & Android apps for faster alerts.', icon: Activity },
                      { title: 'SMS Alerts', desc: 'Instant SMS notifications for emergency requests.', icon: Bell },
                      { title: 'AI Donor Suggestion', desc: 'Smart matching based on donor behavior.', icon: Star },
                      { title: 'Bank Integration', desc: 'Real-time blood bank inventory tracking.', icon: Hospital },
                    ].map((item, idx) => (
                      <li key={idx} className="flex gap-4">
                        <div className="bg-white/10 p-2 rounded-xl h-fit">
                          <item.icon className="w-5 h-5 text-red-500" />
                        </div>
                        <div>
                          <div className="font-bold">{item.title}</div>
                          <div className="text-sm text-slate-400">{item.desc}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <Droplets className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/5 -rotate-12" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Droplets className="text-red-600 w-6 h-6" />
            <span className="font-display font-bold text-xl tracking-tight text-slate-900">Life Saver</span>
          </div>
          <p className="text-slate-500 text-sm mb-8">© 2026 Life Saver Emergency Blood Donor Network. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-slate-400 hover:text-red-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-slate-400 hover:text-red-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-slate-400 hover:text-red-600 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
