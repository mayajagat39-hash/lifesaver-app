'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore, Message, User } from '@/lib/store';
import { useRouter, useParams } from 'next/navigation';
import { Send, ArrowLeft, MoreVertical, Phone, Info, User as UserIcon } from 'lucide-react';
import Image from 'next/image';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ChatPage() {
  const router = useRouter();
  const params = useParams();
  const { currentUser, users } = useAppStore();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const otherUserId = params?.id as string;
  const otherUser = users.find(u => u.id === otherUserId);
  const room = [currentUser?.id, otherUserId].sort().join('-');

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }

    const q = query(
      collection(db, 'messages'),
      where('room', '==', room),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as Timestamp)?.toDate().toISOString() || new Date().toISOString()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [currentUser, room, router]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;

    try {
      const messageData = {
        senderId: currentUser.id,
        senderName: currentUser.fullName,
        room,
        text: inputText,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'messages'), messageData);
      setInputText('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!otherUser) return null;

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-slate-100">
              <Image src={otherUser.photo || `https://picsum.photos/seed/${otherUser.id}/100/100`} alt={otherUser.fullName} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-none">{otherUser.fullName}</h1>
              <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.location.href = `tel:${otherUser.phone}`} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
            <Phone className="w-6 h-6" />
          </button>
          <button className="p-2 text-slate-400 hover:text-red-600 transition-colors">
            <Info className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        <div className="text-center py-8">
          <div className="inline-block bg-slate-200/50 px-4 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Encryption Enabled
          </div>
          <p className="text-xs text-slate-400 mt-4 max-w-xs mx-auto">
            This is the beginning of your conversation with {otherUser.fullName}.
          </p>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                  isMe ? 'bg-red-600 text-white rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`text-[9px] mt-1 font-bold uppercase tracking-wider ${isMe ? 'text-red-200' : 'text-slate-400'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4">
        <form onSubmit={handleSendMessage} className="max-w-7xl mx-auto flex gap-3">
          <input 
            type="text" 
            placeholder="Type a message..."
            className="flex-grow px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-red-500 outline-none transition-all"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-red-600 text-white p-4 rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
}
