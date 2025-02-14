import React, { useState, useRef, useEffect } from 'react';

export const TOKEN = process.env["REACT_APP_BEARER_TOKEN"];
export const BASE_URL = process.env["REACT_APP_BASE_URL"];

const ChatWidget = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAPI = async (message) => {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add any required authentication headers
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({
            query: message,
            session_id : "a72a538d-ef96-4b4c-82a3-ad072ad7e65c"
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

        const data = await response.json();
        console.log(data, "data");
        
      return data; // Adjust based on your API response structure
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, there was an error processing your request.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputText.trim() === "" || isLoading) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: "user",
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Get bot response from API
        const botResponse = await sendMessageToAPI(inputText);
        
        console.log(botResponse, "botResponse");
        
      console.log(botResponse?.data?.content, "content");
      
      const botMessage = {
        id: Math.random(),
        text: botResponse?.data?.content,
        sender: "bot",
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        id: Math.random(),
        text: "Sorry, there was an error sending your message.",
        sender: "bot",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold">Chat Support</h2>
      </div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id + Math.random()}
            className={`mb-4 flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-gray-200 text-gray-800 rounded-lg p-3">
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`p-2 rounded-lg transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={isLoading}
          >
           <p>SEND</p>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWidget;