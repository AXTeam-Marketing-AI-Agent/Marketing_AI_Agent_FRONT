// hooks/useChatStream.ts
import { useCallback, useRef, useState } from "react"

type Message = {
  id: number
  type: "user" | "assistant"
  content: string
}

export function useChatStream() {
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { id: 1, type: "assistant", content: "전략이 생성되었습니다! 어떤 부분에 대해 더 자세히 알고 싶으신가요?" },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  const aiMsgRef = useRef<Message | null>(null)

  // 스트리밍 함수
  const streamChat = async (input: string, onChunk: (text: string) => void) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    })

    if (!res.body) return
    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      onChunk(decoder.decode(value))
    }
  }

  // 메시지 전송 함수
  const sendMessage = useCallback(async () => {
    const trimmed = chatInput.trim()
    if (!trimmed) return

    const userMsg: Message = { id: chatMessages.length + 1, type: "user", content: trimmed }
    const aiMsg: Message = { id: userMsg.id + 1, type: "assistant", content: "" }

    setChatMessages(prev => [...prev, userMsg, aiMsg])
    setChatInput("")
    setIsStreaming(true)
    aiMsgRef.current = aiMsg

    let buffer = ""

    await streamChat(trimmed, (chunk) => {
      buffer += chunk
      // 실시간 업데이트
      if (aiMsgRef.current) {
        aiMsgRef.current.content += buffer
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgRef.current!.id
              ? { ...msg, content: aiMsgRef.current!.content }
              : msg
          )
        )
        buffer = ""
      }
    })

    setIsStreaming(false)
  }, [chatInput, chatMessages])

  return {
    chatMessages,
    chatInput,
    setChatInput,
    isStreaming,
    sendMessage,
  }
}
