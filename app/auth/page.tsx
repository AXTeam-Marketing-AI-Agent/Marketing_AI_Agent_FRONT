"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Lock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

// 환경변수에서 인증코드 가져오기
const AUTH_CODE = process.env.NEXT_PUBLIC_AUTH_CODE || "daehong!@" // 기본값 설정

export default function AuthPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // 인증코드 확인 (대소문자 구분 없이)
    if (code.toLowerCase() === AUTH_CODE.toLowerCase()) {
      // 로컬 스토리지에 인증 상태 저장
      localStorage.setItem("auth_verified", "true")
      localStorage.setItem("auth_timestamp", Date.now().toString())
      
      toast.success("인증이 완료되었습니다.")
      
      // 이전 페이지로 리다이렉트 또는 메인 페이지로 이동
      const returnUrl = new URLSearchParams(window.location.search).get("returnUrl") || "/"
      router.push(returnUrl)
    } else {
      setError("잘못된 인증코드입니다.")
      setCode("")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 로고 및 서비스명 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mx-auto mb-4">
            <Image
              src="/daehong-logo.png"
              alt="대홍기획 로고"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">마케팅 전략 AI Agent</h1>
          <p className="text-gray-600 mt-2">대홍기획 사내 임직원 전용 서비스</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle>접근 인증</CardTitle>
            <CardDescription>
              대홍기획 사내 임직원만 이용 가능한 서비스입니다.<br />
              인증코드를 입력해주세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="password"
                  placeholder="인증코드를 입력하세요"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isLoading}
                  className={error ? "border-red-500" : ""}
                  autoFocus
                />
                {error && (
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !code.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    인증 중...
                  </div>
                ) : (
                  "인증하기"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* 문의 정보 */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            인증코드를 모르시나요?
          </p>
          <p className="text-sm text-gray-500 mt-1">
            AX팀에 문의해주세요.
          </p>
        </div>
      </div>
    </div>
  )
} 