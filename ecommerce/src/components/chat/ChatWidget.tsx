"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Minus,
  Maximize2,
  Bot,
  User,
} from "lucide-react";
import { ChatMessage } from "@/types";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi! I'm Accutite's AI assistant. I can help you with:\n\n" +
    "\u2022 Finding products\n" +
    "\u2022 Checking stock\n" +
    "\u2022 Getting quotes\n" +
    "\u2022 Tracking orders\n" +
    "\u2022 Technical specifications\n" +
    "\u2022 And more!\n\n" +
    "How can I help?",
  timestamp: new Date().toISOString(),
};

function generateResponse(input: string): string {
  const lower = input.toLowerCase();

  if (/product|find|search/.test(lower)) {
    return "I can help you find the right fastener! You can browse our categories such as Bolts, Nuts, Screws, Washers, and Anchors, or use the search bar at the top of any page. If you tell me the type, size, or material you need, I can point you in the right direction.";
  }
  if (/price|cost|quote/.test(lower)) {
    return "Our pricing is tiered based on quantity:\n\n\u2022 1-99 units: Standard pricing\n\u2022 100-499 units: 10% discount\n\u2022 500-999 units: 15% discount\n\u2022 1,000+ units: 20% or more\n\nFor custom quotes on large orders, you can submit a Request for Quote (RFQ) from any product page or your dashboard. Our sales team typically responds within 24 hours.";
  }
  if (/ship|delivery|track/.test(lower)) {
    return "We offer multiple shipping options:\n\n\u2022 UPS Ground (3-5 business days)\n\u2022 FedEx Express (1-2 business days)\n\u2022 DHL International (5-10 business days)\n\nOrders placed before 2 PM PST ship same day. You can track your order from your dashboard or by using the tracking number in your confirmation email.";
  }
  if (/order|status/.test(lower)) {
    return "You can check your order status in your account dashboard under \"Orders\". If you have your order number, I can help you look it up. You can also view invoices, shipping details, and reorder previous items from your dashboard.";
  }
  if (/spec|technical|material|grade/.test(lower)) {
    return "Here's a quick guide to common fastener materials and grades:\n\n\u2022 Grade 2 Steel: General purpose, low-stress applications\n\u2022 Grade 5 Steel: Medium carbon, automotive & machinery\n\u2022 Grade 8 Steel: High-strength, heavy-duty applications\n\u2022 18-8 Stainless (SS304): Corrosion resistant, general use\n\u2022 SS316: Marine & chemical environments\n\u2022 Brass: Decorative, low-friction, non-sparking\n\u2022 Aluminum: Lightweight, corrosion resistant\n\nVisit our Resources page for full specification charts, torque tables, and material comparison guides.";
  }
  if (/account|dashboard|invoice/.test(lower)) {
    return "Your dashboard gives you access to:\n\n\u2022 Order history & tracking\n\u2022 Invoices & payment records\n\u2022 Saved addresses\n\u2022 RFQ submissions & responses\n\u2022 Volume pricing (for Full-Time Client accounts)\n\nLog in or create an account to get started!";
  }
  if (/human|agent|representative/.test(lower)) {
    return "I'd be happy to connect you with our sales team!\n\n\u2022 Phone: 1-800-555-BOLT (2658)\n\u2022 Email: sales@accutite.com\n\u2022 Hours: Mon-Fri, 7 AM - 6 PM PST\n\u2022 Sat: 8 AM - 1 PM PST\n\nYou can also use the Contact page to send a message, and a representative will get back to you within one business day.";
  }
  if (/bulk|volume|discount/.test(lower)) {
    return "We offer aggressive volume pricing for bulk orders:\n\n\u2022 100-499 units: 10% off list price\n\u2022 500-999 units: 15% off\n\u2022 1,000-4,999 units: 20% off\n\u2022 5,000+ units: Custom pricing available\n\nFull-Time Client accounts get additional discounts and net payment terms. Contact our sales team or submit an RFQ for a custom quote.";
  }
  if (/return|refund|warranty/.test(lower)) {
    return "Our return policy:\n\n\u2022 Standard items: 30-day return window, unused and in original packaging\n\u2022 Custom/cut-to-length items: Non-returnable\n\u2022 Defective items: Full replacement or refund, no time limit\n\u2022 Restocking fee: 15% for non-defective returns over $500\n\nContact our support team to initiate a return. Refunds are processed within 5-7 business days.";
  }

  return "I can help you with many things! Here are some topics:\n\n\u2022 Finding products and checking availability\n\u2022 Pricing and quotes\n\u2022 Shipping and order tracking\n\u2022 Technical specifications and materials\n\u2022 Account and billing questions\n\u2022 Bulk/volume discounts\n\u2022 Returns and refunds\n\nJust ask me about any of these, or type your question!";
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(trimmed);
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-800 hover:bg-blue-900 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-[90vw] max-w-[400px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
        isMinimized ? "h-14" : "h-[500px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 gradient-navy text-white shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold text-sm">Accutite AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-blue-800 text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
