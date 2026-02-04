"use client";

import { useEffect, useState, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Send, User } from 'lucide-react';
import { format } from 'date-fns';

export default function ChatInterface() {
  const { 
    conversations, 
    currentConversation, 
    setCurrentConversation, 
    messages, 
    sendMessage, 
    loadConversations,
    loadMessages
  } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleConversationClick = (conv: any) => {
    setCurrentConversation(conv);
    loadMessages(conv._id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage);
    setNewMessage('');
  };

  const getOtherParticipant = (conv: any) => {
    return conv.participants.find((p: any) => p._id !== user?._id);
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
      {/* Sidebar - Conversation List */}
      <div className={`w-full md:w-1/3 border-r border-gray-200 flex flex-col ${currentConversation ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <h2 className="font-bold text-gray-700">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-500">Aucune conversation</div>
          ) : (
            conversations.map((conv) => {
              const other = getOtherParticipant(conv);
              return (
                <div 
                  key={conv._id}
                  onClick={() => handleConversationClick(conv)}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${currentConversation?._id === conv._id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gabon-green text-white flex items-center justify-center font-bold">
                      {other?.name.charAt(0) || <User size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {other?.storeName || other?.name || 'Utilisateur'}
                      </h4>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage || 'Nouvelle conversation'}</p>
                    </div>
                    {conv.lastMessageDate && (
                       <span className="text-xs text-gray-400 whitespace-nowrap">
                         {format(new Date(conv.lastMessageDate), 'HH:mm')}
                       </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`w-full md:w-2/3 flex flex-col ${!currentConversation ? 'hidden md:flex' : 'flex'}`}>
        {currentConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
              <button 
                className="md:hidden text-gray-500"
                onClick={() => setCurrentConversation(null)}
              >
                ←
              </button>
              <div className="font-bold text-gray-800">
                {(() => {
                    const other = getOtherParticipant(currentConversation);
                    return other?.storeName || other?.name || 'Discussion';
                })()}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
              {messages.map((msg) => {
                const isMe = msg.sender._id === user?._id;
                return (
                  <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div 
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isMe 
                          ? 'bg-gabon-green text-white rounded-br-none' 
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className={`text-[10px] block mt-1 ${isMe ? 'text-green-100' : 'text-gray-400'}`}>
                        {format(new Date(msg.createdAt), 'HH:mm')}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-gabon-green"
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="bg-gabon-green text-white p-2 rounded-full hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
            <User size={64} className="mb-4 opacity-20" />
            <p>Sélectionnez une conversation pour commencer à discuter</p>
          </div>
        )}
      </div>
    </div>
  );
}
