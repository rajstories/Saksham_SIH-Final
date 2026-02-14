import { Bot, SendHorizonal, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// ⚠️ REPLACE THIS WITH YOUR NEW API KEY
const GEMINI_API_KEY = "AIzaSyDBMTlvTDIkGGTNliBrv107OCQt48o1Ve4"

const SYSTEM_CONTEXT =
  'You are the AI assistant for SAKSHAM, a monitoring platform for the National Disaster Management Authority (NDMA). You assist trainees and officers during disaster drills (Earthquakes, Floods). You can help with logging activities, explaining drill protocols, and navigating the app. Keep answers concise and professional.'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  open: boolean
  onClose: () => void
}

export function ChatWidget({ open, onClose }: Props) {
  // Initial state
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi, I am the Saksham AI Assistant. How can I help you?' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input.trim() }
    
    // 1. Update UI immediately
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // 2. Format history for Gemini API
      // The API requires 'model' instead of 'assistant', and NO 'system' role in contents
      const apiHistory = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // Add the new user message to the payload
      apiHistory.push({ role: 'user', parts: [{ text: userMessage.content }] });

      const payload = {
        // System instructions go here for Gemini 1.5
        systemInstruction: {
          parts: [{ text: SYSTEM_CONTEXT }]
        },
        contents: apiHistory,
        generationConfig: {
            maxOutputTokens: 200, // Keep responses concise
        }
      }

      // 3. Make the API Call (Using URL param for Key, and 1.5-flash model)
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData); // Look at console if it fails
        throw new Error('Gemini request failed')
      }

      const data = await response.json()
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'I am sorry, I did not understand that.'

      setMessages((prev) => [...prev, { role: 'assistant', content: text }])

    } catch (err: any) {
      console.error("Network/Code Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection error. Please check your API Key and Internet.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed bottom-24 right-4 z-50 w-80 max-w-[90vw] rounded-2xl border border-borderGray bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b border-borderGray px-3 py-2">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-indianBlue" />
          <p className="text-sm font-semibold text-gray-800">Saksham AI Assistant</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={listRef} className="max-h-80 overflow-y-auto px-3 py-3 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`rounded-2xl px-3 py-2 text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indianBlue text-white'
                  : 'bg-slate-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-slate-100 rounded-2xl px-3 py-2 text-xs text-gray-500 italic">
                Analyzing...
             </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-borderGray px-3 py-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about drills..."
          disabled={loading}
          className="h-10 flex-1 rounded-lg border border-borderGray px-3 text-sm focus:border-indianBlue focus:outline-none focus:ring-2 focus:ring-indianBlue/20"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="flex h-10 items-center justify-center rounded-lg bg-indianBlue px-3 text-white shadow-button active:scale-95 disabled:opacity-60"
        >
          <SendHorizonal className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}