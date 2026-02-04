"use client";

import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useRouter } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

interface ContactVendorButtonProps {
  vendorId: string;
  vendorName: string;
}

export default function ContactVendorButton({ vendorId, vendorName }: ContactVendorButtonProps) {
  const { user } = useAuth();
  const { startConversation } = useChat();
  const router = useRouter();

  const handleContact = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Don't let vendor contact themselves
    if (user._id === vendorId) {
      alert("C'est votre propre boutique !");
      return;
    }

    try {
      await startConversation(vendorId);
      router.push('/messages');
    } catch (error) {
      console.error("Error contacting vendor:", error);
    }
  };

  return (
    <button 
      onClick={handleContact}
      className="bg-gabon-green text-white px-6 py-2 rounded-full font-bold shadow hover:bg-green-700 transition flex items-center gap-2"
    >
      <MessageCircle size={18} />
      Contacter
    </button>
  );
}
