import { useState, useEffect, useRef } from 'react'

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void
  onEnd?: () => void
  continuous?: boolean
  interimResults?: boolean
  lang?: string
}

interface UseSpeechRecognitionReturn {
  isListening: boolean
  isSupported: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
  error: string | null
}

export function useSpeechRecognition({
  onResult,
  onEnd,
  continuous = false,
  interimResults = true,
  lang = 'en-US'
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  // Check if browser supports Speech Recognition
  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.')
      return
    }

    // @ts-ignore - webkit prefix
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = lang

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' '
        } else {
          interimTranscript += transcriptPiece
        }
      }

      const newTranscript = (transcript + finalTranscript).trim()

      if (finalTranscript) {
        setTranscript(newTranscript)
        if (onResult) {
          onResult(newTranscript)
        }
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)

      const errorMessages: Record<string, string> = {
        'no-speech': 'No speech detected. Please try again.',
        'audio-capture': 'No microphone found. Please connect a microphone.',
        'not-allowed': 'Microphone access denied. Please allow microphone access.',
        'network': 'Network error. Please check your connection.',
        'aborted': 'Speech recognition aborted.',
      }

      setError(errorMessages[event.error] || `Error: ${event.error}`)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (onEnd) {
        onEnd()
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [isSupported, continuous, interimResults, lang])

  const startListening = () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.')
      return
    }

    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start()
      } catch (err) {
        console.error('Error starting recognition:', err)
        setError('Failed to start speech recognition. Please try again.')
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const resetTranscript = () => {
    setTranscript('')
  }

  return {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error
  }
}
