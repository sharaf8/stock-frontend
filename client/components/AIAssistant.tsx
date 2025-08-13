import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { 
  MessageCircle, 
  Send, 
  Bot, 
  X,
  Minimize2, 
  Maximize2,
  Brain,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIAssistantProps {
  context?: string;
}

const quickSuggestions = [
  "📊 Show today's performance",
  "💰 Revenue insights", 
  "📈 Weekly trends",
  "⚠️ Important alerts"
];

const aiResponses: Record<string, string> = {
  default: "🤖 **AI Assistant Here!**\n\nI understand you're asking about: \"{query}\"\n\n✨ I can help you with:\n• 📊 Business analytics\n• 📈 Performance insights  \n• 💰 Financial reports\n• 📋 Data analysis\n\n💡 Try asking about specific metrics or use the suggestions below!"
};

export default function AIAssistant({ context = 'dashboard' }: AIAssistantProps) {
  // Simple state - no complex logic
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 **Hello! I\'m your AI Assistant**\n\nI can help you analyze your business data and answer questions. What would you like to know?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto scroll to bottom when new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Simple input change handler - NO complex logic
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  // Simple send message function
  const sendMessage = useCallback(async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isTyping) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue(''); // Clear input
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponses.default.replace('{query}', messageText),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  }, [inputValue, isTyping]);

  // Handle Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        text: '🔄 **Chat cleared!**\n\nI\'m ready to help you with fresh insights. What would you like to explore?',
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
    toast({
      title: "Chat cleared",
      description: "Starting fresh conversation"
    });
  }, [toast]);

  // Chat interface component
  const ChatInterface = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-blue-50 dark:bg-blue-950/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm">AI Assistant</div>
            <div className="text-xs text-green-600">● Online</div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-7 w-7"
          >
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="h-7 w-7"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-3 h-64" ref={scrollRef}>
            <div className="space-y-3">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-foreground border'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-line">
                      {message.text}
                    </div>
                    <div className={`text-xs mt-1 opacity-70 ${
                      message.sender === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border">
                    <div className="flex items-center gap-2">
                      <Bot className="h-3 w-3 text-blue-500" />
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick suggestions */}
          <div className="p-3 border-t border-b bg-gray-50 dark:bg-gray-900/50">
            <div className="text-xs text-muted-foreground mb-2">Quick actions:</div>
            <div className="grid grid-cols-2 gap-1">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-1 px-2 justify-start"
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={isTyping}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Input - MOST IMPORTANT PART */}
          <div className="p-3 bg-white dark:bg-gray-900">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isTyping}
                autoFocus
              />
              <Button 
                onClick={() => sendMessage()}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg z-50"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0">
            <DialogHeader className="sr-only">
              <DialogTitle>AI Assistant Chat</DialogTitle>
            </DialogHeader>
            <div className="h-full">
              <ChatInterface />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop */}
      <div className="hidden md:block fixed bottom-4 right-4 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-lg"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        )}

        {isOpen && (
          <div className="relative">
            <Card className="w-80 shadow-xl bg-white dark:bg-gray-900">
              <ChatInterface />
            </Card>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white dark:bg-gray-800 border shadow"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
