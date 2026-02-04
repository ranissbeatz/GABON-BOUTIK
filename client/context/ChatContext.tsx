"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import axios from 'axios';

interface Message {
  _id: string;
  conversationId: string;
  sender: { _id: string; name: string; email: string };
  text: string;
  createdAt: string;
}

interface Conversation {
  _id: string;
  participants: { _id: string; name: string; storeName?: string }[];
  lastMessage: string;
  lastMessageDate: string;
}

interface ChatContextType {
  socket: Socket | null;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  setCurrentConversation: (conversation: Conversation | null) => void;
  startConversation: (receiverId: string) => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // Use a ref to keep track of the current conversation ID for the socket event listener
  // This avoids stale closures in the event handler
  const currentConversationIdRef = useRef<string | null>(null);

  useEffect(() => {
    currentConversationIdRef.current = currentConversation ? currentConversation._id : null;
  }, [currentConversation]);

  // Initialize Socket
  useEffect(() => {
    if (token && user) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      // Remove /api from the end if it exists for the socket URL, assuming socket is at root
      // But usually socket.io client handles the path automatically if we just give the domain
      const socketUrl = apiUrl.replace('/api', ''); 
      
      const newSocket = io(socketUrl, {
        query: { token } // Optional: Send token for server-side auth if implemented
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      newSocket.on('receive_message', (newMessage: Message) => {
        // Update messages if we are in the conversation
        if (currentConversationIdRef.current === newMessage.conversationId) {
          setMessages((prev) => {
            // Prevent duplicates
            if (prev.some(m => m._id === newMessage._id)) return prev;
            return [...prev, newMessage];
          });
        }
        
        // Update conversation list (last message)
        setConversations((prev) => {
          return prev.map(conv => {
            if (conv._id === newMessage.conversationId) {
              return {
                ...conv,
                lastMessage: newMessage.text,
                lastMessageDate: newMessage.createdAt
              };
            }
            return conv;
          }).sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime());
        });
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, user]);

  const loadConversations = async () => {
    if (!token) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data);
    } catch (error) {
      console.error("Error loading conversations", error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!token) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${apiUrl}/api/chat/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
      
      // Join socket room
      socket?.emit('join_conversation', conversationId);
    } catch (error) {
      console.error("Error loading messages", error);
    }
  };

  const startConversation = async (receiverId: string) => {
    if (!token) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/chat/start`, 
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const conversation = res.data;
      
      // Check if it already exists in list
      if (!conversations.find(c => c._id === conversation._id)) {
        setConversations([conversation, ...conversations]);
      }
      
      setCurrentConversation(conversation);
      await loadMessages(conversation._id);
    } catch (error) {
      console.error("Error starting conversation", error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!token || !currentConversation) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${apiUrl}/api/chat/message`, 
        { conversationId: currentConversation._id, text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Optimistically add message (or wait for socket? Let's just add it)
      // Actually the socket event will come back to us if we broadcast to room, 
      // but usually we exclude sender. My server implementation broadcasts to room using `socket.to(room)`, 
      // which usually excludes sender. Let's check server code.
      // Server: socket.to(data.conversationId).emit... -> This excludes sender.
      // So we must manually add the message to our own state.
      
      setMessages((prev) => [...prev, res.data]);
      
      // Update conversation list
      setConversations((prev) => {
        return prev.map(conv => {
          if (conv._id === currentConversation._id) {
            return {
              ...conv,
              lastMessage: text,
              lastMessageDate: new Date().toISOString()
            };
          }
          return conv;
        }).sort((a, b) => new Date(b.lastMessageDate).getTime() - new Date(a.lastMessageDate).getTime());
      });
      
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <ChatContext.Provider value={{
      socket,
      conversations,
      currentConversation,
      messages,
      setCurrentConversation,
      startConversation,
      sendMessage,
      loadConversations,
      loadMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
