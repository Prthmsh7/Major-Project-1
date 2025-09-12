import { useState } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const { theme } = useTheme()

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I understand you\'re asking about: "' + inputMessage + '". This is a placeholder response. The AI assistant feature will be fully implemented in a future update.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className={`max-w-4xl mx-auto h-full flex flex-col p-4 ${theme === 'light' ? 'text-light-text-primary' : 'text-dark-text-primary'}`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-light mb-2 ${theme === 'light' ? 'text-light-text-primary' : 'text-gradient'}`}>AI Assistant</h1>
        <p className={`${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>Your intelligent companion for productivity and assistance.</p>
      </div>

      <div className={`flex-1 flex flex-col rounded-xl shadow-md overflow-hidden ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
        
        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm
                  ${message.type === 'user'
                    ? `${theme === 'light' ? 'bg-light-accent text-white' : 'bg-dark-accent text-white'}`
                    : `${theme === 'light' ? 'bg-gray-200 text-light-text-primary' : 'bg-dark-input-background text-dark-text-primary'}`
                  }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-dark-text-secondary'}`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className={`px-4 py-3 rounded-2xl border shadow-sm ${theme === 'light' ? 'bg-gray-200 border-gray-300' : 'bg-dark-input-background border-dark-input-border'}`}>
                <div className="flex space-x-1">
                  <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'light' ? 'bg-gray-500' : 'bg-dark-text-secondary'}`}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'light' ? 'bg-gray-500' : 'bg-dark-text-secondary'}`} style={{ animationDelay: '0.1s' }}></div>
                  <div className={`w-2 h-2 rounded-full animate-bounce ${theme === 'light' ? 'bg-gray-500' : 'bg-dark-text-secondary'}`} style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className={`p-6 border-t ${theme === 'light' ? 'border-light-border' : 'border-dark-border'}`}>
          <form onSubmit={handleSendMessage} className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className={`w-full p-3 rounded-lg ${theme === 'light' ? 'bg-light-input-background border border-light-input-border text-light-text-primary focus:ring-2 focus:ring-light-accent focus:border-light-accent' : 'bg-dark-input-background border border-dark-input-border text-dark-text-primary focus:ring-2 focus:ring-dark-accent focus:border-dark-accent'}`}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${theme === 'light' ? 'bg-light-accent text-white hover:bg-opacity-90' : 'bg-dark-accent text-white hover:bg-opacity-90'}`}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Feature notice */}
      <div className={`mt-6 p-4 rounded-xl shadow-md ${theme === 'light' ? 'bg-light-card-background border border-light-border' : 'bg-dark-card-background border border-dark-border'}`}>
        <div className="flex items-start space-x-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-900 bg-opacity-20 text-blue-400'}`}>
            <span className="text-sm">ℹ️</span>
          </div>
          <div>
            <p className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-light-accent' : 'text-dark-accent'}`}>Coming Soon</p>
            <p className={`text-sm ${theme === 'light' ? 'text-light-text-secondary' : 'text-dark-text-secondary'}`}>
              The AI Assistant feature is currently in development. Full functionality including natural language processing, 
              context awareness, and advanced capabilities will be available in future updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Assistant
