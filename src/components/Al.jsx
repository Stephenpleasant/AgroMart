import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Phone, Video, MoreVertical, Search, ArrowLeft, Users } from 'lucide-react';

const AgroMartChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const [userType, setUserType] = useState('buyer'); // buyer or seller
  const [isTyping, setIsTyping] = useState(false);

  // Sample chat data - empty initially
  const [chats] = useState([]);

  // Initialize empty messages
  useEffect(() => {
    setMessages({});
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedChat]);

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage]
    }));

    setMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message, selectedChat);
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [...prev[selectedChat.id], aiResponse]
      }));
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userMessage, chat) => {
    const responses = {
      price: [
        "Based on current market rates, I can help you get competitive pricing. Let me connect you with the best offers.",
        "I've found several price options for you. The average market price is competitive right now.",
        "Let me fetch the latest pricing information from our verified sellers."
      ],
      quality: [
        "Our AI quality assurance system ensures all products meet high standards. I can provide quality certificates.",
        "Quality is our priority. All sellers are verified and rated by our community.",
        "I can arrange a quality inspection before delivery if needed."
      ],
      delivery: [
        "Delivery options include same-day, next-day, and scheduled delivery. What works best for you?",
        "I can coordinate with logistics partners for optimal delivery timing and cost.",
        "Based on your location, I recommend our express delivery service."
      ],
      default: [
        "I'm here to help facilitate your trade. What specific information do you need?",
        "As your AI assistant, I can help with pricing, quality checks, delivery coordination, and payment processing.",
        "Let me analyze your request and connect you with the best options available."
      ]
    };

    let category = 'default';
    if (userMessage.toLowerCase().includes('price') || userMessage.toLowerCase().includes('cost')) {
      category = 'price';
    } else if (userMessage.toLowerCase().includes('quality') || userMessage.toLowerCase().includes('fresh')) {
      category = 'quality';
    } else if (userMessage.toLowerCase().includes('delivery') || userMessage.toLowerCase().includes('ship')) {
      category = 'delivery';
    }

    const responseText = responses[category][Math.floor(Math.random() * responses[category].length)];

    return {
      id: Date.now() + 1,
      sender: 'ai',
      text: responseText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: true
    };
  };

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Sidebar */}
      <div className={`w-full md:w-80 bg-white border-r border-gray-200 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 capitalize">{userType}</span>
              <Users size={20} className="text-gray-400" />
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-green-50 border-green-200' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-xl">
                      {chat.avatar}
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="bg-green-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 capitalize">{chat.type}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} className="text-gray-400" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">No conversations yet</h3>
                <p className="text-xs text-gray-400">Your chats with buyers and sellers will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${selectedChat ? 'flex' : 'hidden md:flex'}`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedChat(null)}
                    className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-lg">
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.online ? 'Online' : 'Last seen 2h ago'} • {selectedChat.type}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Phone size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Video size={20} className="text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages[selectedChat.id]?.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-green-500 text-white'
                      : msg.isAI
                      ? 'bg-blue-100 text-blue-900 border border-blue-200'
                      : 'bg-white text-gray-900 shadow'
                  }`}>
                    {msg.isAI && (
                      <div className="flex items-center space-x-1 mb-1">
                        <Bot size={14} className="text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">AI Assistant</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
              
              {/* AI Features */}
              <div className="mt-2 flex items-center text-xs text-gray-500">
                <Bot size={14} className="mr-1" />
                AI assistant active - helping with pricing, quality checks, and logistics
              </div>
            </div>
          </>
        ) : (
          /* No Chat Selected */
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot size={48} className="text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">AgroMart AI Chat</h3>
              <p className="text-gray-500 mb-4">Select a conversation to start chatting</p>
              <p className="text-sm text-gray-400">AI-powered assistance for buyers and sellers</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgroMartChat;