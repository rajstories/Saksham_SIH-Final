import { useEffect, useRef, useState } from 'react'

type Recognition =
  | (SpeechRecognition & { lang: string })
  | (webkitSpeechRecognition & { lang: string })
  | null

const LANGS = ['hi-IN', 'en-IN']

export function useVoiceInput() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<Recognition>(null)

  const supported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    if (!supported) return
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec: Recognition = new SpeechRec()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = LANGS[0]
    rec.onresult = (event: SpeechRecognitionEvent) => {
      const text = Array.from(event.results as any)
        .map((res: any) => (res[0] as any).transcript)
        .join('')
      setTranscript(text.trim())
    }
    rec.onerror = (e: SpeechRecognitionErrorEvent) => {
      setError(e.error)
      setListening(false)
    }
    rec.onend = () => setListening(false)
    recognitionRef.current = rec
    return () => rec.abort()
  }, [supported])

  const start = (lang?: string) => {
    if (!supported || !recognitionRef.current) return
    recognitionRef.current.lang = lang || LANGS[0]
    setTranscript('')
    setError(null)
    recognitionRef.current.start()
    setListening(true)
  }

  const stop = () => {
    recognitionRef.current?.stop()
    setListening(false)
  }

  return {
    listening,
    transcript,
    error,
    supported,
    start,
    stop,
  }
}
