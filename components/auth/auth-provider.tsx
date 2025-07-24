"use client"

import { createContext, useContext, ReactNode } from "react"
import { useAuth } from "@/hooks/useAuth"

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  isAuthenticated: boolean | null
}

// 인증 컨텍스트 생성
const AuthContext = createContext<AuthContextType | null>(null)

// 인증 컨텍스트 사용을 위한 커스텀 훅
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }
  return context
}

// 로딩 컴포넌트
function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}

// 인증 프로바이더 컴포넌트
export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()

  // 인증 상태 확인 중
  if (isAuthenticated === null) {
    return <LoadingScreen message="로딩 중..." />
  }

  // 인증되지 않은 경우
  if (isAuthenticated === false) {
    return <LoadingScreen message="인증 중..." />
  }

  // 인증된 경우 children 렌더링
  return (
    <AuthContext.Provider value={{ isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
} 