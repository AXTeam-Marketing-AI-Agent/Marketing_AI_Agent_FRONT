"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Send, MessageSquare } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// 메시지 타입 정의
interface Message {
  id: number
  type: "user" | "assistant"
  content: string
}

// ChatPanel Props 타입 정의
interface ChatPanelProps {
  strategy?: any
  factbook?: any
}

export function ChatPanel({ strategy, factbook }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: "assistant", content: "전략이 생성되었습니다! 어떤 부분에 대해 더 자세히 알고 싶으신가요?" },
  ])
  const [input, setInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  // 스트리밍 API 호출 함수
  const streamChat = async (input: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/chat/stream`, {
      method: "POST",
      body: JSON.stringify({ 
        input,
        strategy_id: strategy?.id 
      }),
      headers: { "Content-Type": "application/json" },
    })
    if (!res.body) return

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    // AI 응답 메시지 초기화
    const aiMessage: Message = { id: Date.now(), type: "assistant", content: "" }
    setMessages(prev => [...prev, aiMessage])

    // 스트림 읽기
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      
      // 상태 업데이트 최적화: 마지막 메시지 내용에 chunk 추가
      setMessages(prev => 
        prev.map((msg, index) => {
          // 배열의 마지막 요소(현재 스트리밍 중인 AI 답변)인 경우
          if (index === prev.length - 1) {
            // 기존 객체를 직접 수정하는 대신, 새로운 객체를 반환
            return { ...msg, content: msg.content + chunk };
          }
          // 다른 메시지들은 그대로 반환
          return msg;
        })
        );
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = { id: Date.now() + 1, type: "user", content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsStreaming(true)

    try {
      await streamChat(input)
    } catch (error) {
      console.error("Streaming error:", error)
      // 에러 처리 UI 추가 가능 (e.g., toast)
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white border rounded-xl shadow-sm p-4 sticky top-24">
      <div className="flex items-center mb-4">
        <MessageSquare className="w-5 h-5 text-blue-500 mr-2" />
        <span className="font-semibold text-lg">Daehong AI</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`rounded-lg px-4 py-2 text-sm max-w-[80%] ${msg.type === "user" ? "bg-blue-100 text-blue-900" : "bg-gray-100 text-gray-800"}`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // 마크다운 스타일 커스터마이징
                  p: ({node, ...props}) => <p {...props} className="mb-1 last:mb-0" />,
                  ul: ({node, ...props}) => <ul {...props} className="mb-1 pl-4 list-disc" />,
                  ol: ({node, ...props}) => <ol {...props} className="mb-1 pl-4 list-decimal" />,
                  li: ({node, ...props}) => <li {...props} className="mb-0.5" />,
                  h3: ({node, ...props}) => <h3 {...props} className="text-sm font-semibold mb-1" />,
                  h4: ({node, ...props}) => <h4 {...props} className="text-sm font-medium mb-1" />,
                  code: ({node, ...props}) => <code {...props} className="px-1 py-0.5 bg-gray-200 rounded text-xs" />,
                  table: ({node, ...props}) => (
                    <div className="overflow-x-auto my-2">
                      <table {...props} className="min-w-full border-collapse border border-gray-300" />
                    </div>
                  ),
                  th: ({node, ...props}) => <th {...props} className="border border-gray-300 px-2 py-1 bg-gray-100" />,
                  td: ({node, ...props}) => <td {...props} className="border border-gray-300 px-2 py-1" />,
                  a: ({node, ...props}) => (
                    <a {...props} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" />
                  ),
                  strong: ({node, ...props}) => <strong {...props} className="font-semibold" />,
                  em: ({node, ...props}) => <em {...props} className="italic" />,
                  blockquote: ({node, ...props}) => (
                    <blockquote {...props} className="border-l-2 border-gray-300 pl-2 my-1 text-gray-600" />
                  ),
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !isStreaming) handleSendMessage() }}
          placeholder="전략에 대해 궁금한 점을 입력하세요"
          className="flex-1"
          disabled={isStreaming}
        />
        <Button onClick={handleSendMessage} disabled={!input.trim() || isStreaming}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}