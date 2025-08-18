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
  Sparkles,
  User,
  Settings,
  Volume2,
  Copy,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  RefreshCw,
  Mic,
  MicOff,
  Smile,
  Image,
  Paperclip
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'system';
  isLoading?: boolean;
}

interface AIAssistantProps {
  context?: string;
}

const contextSuggestions: Record<string, string[]> = {
  dashboard: [
    "📊 Show me today's performance overview",
    "📈 What are the weekly trends?", 
    "💰 Revenue analysis for this month",
    "⚠️ Any alerts I should know about?"
  ],
  sales: [
    "💼 Sales performance this week",
    "🎯 Top performing products",
    "📋 Pending invoices summary",
    "💰 Revenue by client type"
  ],
  finance: [
    "💳 Cash flow analysis",
    "📊 Expense breakdown",
    "🏦 Account balances",
    "📈 Profit margins report"
  ],
  warehouse: [
    "📦 Low stock items",
    "📋 Recent movements",
    "🚚 Pending shipments",
    "📊 Inventory turnover"
  ],
  employees: [
    "👥 Team performance metrics",
    "📅 Attendance summary",
    "💼 Department overview",
    "📊 HR analytics"
  ],
  clients: [
    "🎯 Client satisfaction metrics",
    "💰 Top customers by revenue",
    "📞 Recent interactions",
    "🔄 Client retention analysis"
  ]
};

const aiContextResponses: Record<string, Record<string, string>> = {
  dashboard: {
    "performance": "📊 **Today's Performance Overview**\n\n✅ **Revenue**: $15,234 (+12% vs yesterday)\n✅ **Sales**: 47 transactions\n✅ **New Clients**: 3 signups\n✅ **Active Users**: 234 online\n\n🎯 **Key Insights**: Sales momentum is strong, particularly in electronics category. Consider promoting accessories to boost average order value.",
    "trends": "📈 **Weekly Trends Analysis**\n\n📊 **Sales Growth**: +18% week-over-week\n💰 **Revenue Trend**: Consistent upward trajectory\n🎯 **Best Days**: Tuesday & Thursday\n📱 **Top Category**: Electronics (45% of sales)\n\n💡 **Recommendation**: Increase inventory for electronics and plan targeted campaigns for Monday/Wednesday.",
    "revenue": "💰 **Monthly Revenue Analysis**\n\n💵 **Total Revenue**: $456,789\n📈 **Growth**: +23% vs last month\n🎯 **Target Progress**: 89% of monthly goal\n🏆 **Best Performer**: Premium products\n\n🚀 **Forecast**: On track to exceed monthly target by 8-12%"
  },
  sales: {
    "performance": "💼 **Sales Performance This Week**\n\n🎯 **Total Sales**: $89,234\n📦 **Units Sold**: 567\n💰 **Average Order**: $157.45\n🔥 **Best Day**: Thursday ($18,456)\n\n🏆 **Top Performers**:\n• Sarah Chen: $23,456\n• Michael Rodriguez: $19,234\n• Jennifer Patel: $16,789",
    "products": "🎯 **Top Performing Products**\n\n🥇 **iPhone 15 Pro**: 45 units ($40,455)\n🥈 **MacBook Air M3**: 23 units ($29,877)\n🥉 **Samsung Galaxy S24**: 38 units ($34,162)\n\n📊 **Category Leaders**:\n• Smartphones: 67% market share\n• Laptops: 23% of total revenue\n• Accessories: 15% high-margin items"
  }
};

const defaultResponse = "🤖 **AI Assistant**\n\nI understand you're asking about: \"{query}\"\n\n✨ **I can help you with**:\n• 📊 Business analytics & insights\n• 📈 Performance metrics\n• 💰 Financial analysis\n• 📋 Data summaries\n• 🎯 Strategic recommendations\n\n💡 **Try asking** about specific metrics or click the suggestions below!";

export default function AIAssistant({ context = 'dashboard' }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `👋 **Hello! I'm your ${context} AI Assistant**\n\nI'm here to help you analyze data, get insights, and answer questions about your ${context} operations. How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const suggestions = contextSuggestions[context] || contextSuggestions.dashboard;

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    const contextResponses = aiContextResponses[context] || {};
    
    // Check for context-specific responses
    for (const [key, response] of Object.entries(contextResponses)) {
      if (lowerQuery.includes(key)) {
        return response;
      }
    }
    
    // Check for general keywords
    if (lowerQuery.includes('performance') || lowerQuery.includes('overview')) {
      return contextResponses.performance || defaultResponse.replace('{query}', query);
    }
    if (lowerQuery.includes('trend') || lowerQuery.includes('weekly')) {
      return contextResponses.trends || defaultResponse.replace('{query}', query);
    }
    if (lowerQuery.includes('revenue') || lowerQuery.includes('money')) {
      return contextResponses.revenue || defaultResponse.replace('{query}', query);
    }
    
    return defaultResponse.replace('{query}', query);
  };

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
    setInputValue('');
    setIsTyping(true);

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      sender: 'ai',
      timestamp: new Date(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    // Simulate AI response with realistic delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: getAIResponse(messageText),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => prev.filter(msg => !msg.isLoading).concat(aiMessage));
      setIsTyping(false);
    }, 1200 + Math.random() * 800); // 1.2-2s delay for realism
  }, [inputValue, isTyping, context]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text.replace(/\*\*/g, '').replace(/[📊📈💰🎯🔥🥇🥈🥉✅⚠️💡🚀👋🤖✨]/g, ''));
    toast({
      title: "Copied to clipboard",
      description: "Message text has been copied.",
    });
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: `🔄 **Chat Reset**\n\nI'm ready to help you with fresh ${context} insights. What would you like to explore?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'system'
      }
    ]);
    toast({
      title: "Chat cleared",
      description: "Starting fresh conversation"
    });
  };

  const toggleMic = () => {
    setIsMicActive(!isMicActive);
    toast({
      title: isMicActive ? "Voice input disabled" : "Voice input enabled",
      description: isMicActive ? "Switched back to text input" : "Speak your message"
    });
  };

  const ChatInterface = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              AI Assistant
              <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                {context}
              </Badge>
            </div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online & Ready
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleMic}
            className={cn("h-8 w-8 rounded-lg", isMicActive && "bg-red-100 text-red-600")}
          >
            {isMicActive ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 rounded-lg"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearChat}
            className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 rounded-lg hover:bg-red-100 hover:text-red-600 md:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Enhanced Messages Area */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 group",
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.sender === 'ai' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div className={cn(
                    "max-w-[85%] relative",
                    message.sender === 'user' ? 'order-1' : 'order-2'
                  )}>
                    {message.isLoading ? (
                      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md p-4 shadow-md border">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "rounded-2xl p-4 shadow-md transition-all duration-300 hover:shadow-lg",
                          message.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md'
                            : message.type === 'system'
                            ? 'bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/50 dark:to-blue-950/50 text-foreground border border-purple-200 dark:border-purple-800 rounded-bl-md'
                            : 'bg-white dark:bg-gray-800 text-foreground border rounded-bl-md'
                        )}
                      >
                        <div className="text-sm whitespace-pre-line leading-relaxed">
                          {message.text}
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className={cn(
                            "text-xs opacity-70",
                            message.sender === 'user' 
                              ? 'text-blue-100' 
                              : 'text-muted-foreground'
                          )}>
                            {message.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                          
                          {message.sender === 'ai' && !message.isLoading && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyMessage(message.text)}
                                className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0 mt-1 order-2">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Enhanced Quick Suggestions */}
          <div className="p-4 border-t bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <div className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Sparkles className="h-3 w-3" />
              Quick actions for {context}:
            </div>
            <div className="grid grid-cols-1 gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto py-2 px-3 justify-start hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950/20 transition-all duration-200 border-gray-200 dark:border-gray-700"
                  onClick={() => sendMessage(suggestion)}
                  disabled={isTyping}
                >
                  <span className="truncate">{suggestion}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Enhanced Input Area */}
          <div className="p-4 bg-white dark:bg-gray-900 border-t">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isMicActive ? "🎤 Listening..." : "Ask me anything about your business..."}
                  className="pr-20 min-h-[44px] rounded-xl border-gray-200 dark:border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                  disabled={isTyping || isMicActive}
                />
                <div className="absolute right-2 top-2 flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Smile className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button 
                onClick={() => sendMessage()}
                disabled={(!inputValue.trim() && !isMicActive) || isTyping}
                size="sm"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200 h-11 w-11 rounded-xl"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                AI is analyzing your request...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Version */}
      <div className="md:hidden">
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-business-lg hover:shadow-business-xl transition-all duration-300 hover:scale-110 z-50 group"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="w-full h-full max-w-none max-h-none m-0 p-0 border-0">
            <DialogHeader className="sr-only">
              <DialogTitle>AI Assistant Chat</DialogTitle>
            </DialogHeader>
            <div className="h-full">
              <ChatInterface />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop Version */}
      <div className="hidden md:block fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-business-lg hover:shadow-business-xl transition-all duration-300 hover:scale-110 group"
          >
            <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          </Button>
        )}

        {isOpen && (
          <div className="relative animate-slide-in">
            <Card className="w-96 shadow-business-xl bg-white dark:bg-gray-900 border-0 overflow-hidden">
              <div className={cn(
                "transition-all duration-300",
                isMinimized ? "h-16" : "h-[600px]"
              )}>
                <ChatInterface />
              </div>
            </Card>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 -right-3 h-8 w-8 rounded-full bg-white dark:bg-gray-800 border shadow-business hover:shadow-business-md transition-all duration-200 hover:scale-110"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
