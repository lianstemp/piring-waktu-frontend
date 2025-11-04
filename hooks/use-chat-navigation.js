import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

export function useChatNavigation() {
  const router = useRouter()

  const navigateToChat = useCallback((sessionId, messageId = null) => {
    if (!sessionId) {
      console.warn('No session ID provided for navigation')
      return
    }

    // Navigate to the chat session
    let url = `/dapur-ai?session=${sessionId}`
    
    // If messageId is provided, add it as a hash to scroll to that message
    if (messageId) {
      url += `#message-${messageId}`
    }
    
    router.push(url)
  }, [router])

  const navigateToNewChat = useCallback(() => {
    router.push('/dapur-ai')
  }, [router])

  return {
    navigateToChat,
    navigateToNewChat
  }
}