"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

const AUTH_DURATION = 8 * 60 * 60 * 1000 // 8시간

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 인증 페이지는 체크하지 않음
    if (pathname === "/auth") {
      setIsAuthenticated(true)
      return
    }

    const checkAuth = () => {
      if (typeof window === "undefined") return

      const authVerified = localStorage.getItem("auth_verified")
      const authTimestamp = localStorage.getItem("auth_timestamp")

      if (!authVerified || !authTimestamp) {
        setIsAuthenticated(false)
        return
      }

      const now = Date.now()
      const authTime = parseInt(authTimestamp)
      
      // 8시간이 지났으면 재인증 필요
      if (now - authTime > AUTH_DURATION) {
        localStorage.removeItem("auth_verified")
        localStorage.removeItem("auth_timestamp")
        setIsAuthenticated(false)
        return
      }

      // 만료 시간이 1시간 미만으로 남았으면 자동 연장
      if (now - authTime > AUTH_DURATION - (60 * 60 * 1000)) {
        localStorage.setItem("auth_timestamp", now.toString())
      }

      setIsAuthenticated(true)
    }

    checkAuth()

    // 다른 탭에서의 변경사항을 감지
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "auth_verified" || e.key === "auth_timestamp") {
        checkAuth()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [pathname])

  useEffect(() => {
    if (isAuthenticated === false && pathname !== "/auth") {
      // 현재 페이지를 returnUrl로 전달
      const returnUrl = encodeURIComponent(pathname)
      router.push(`/auth?returnUrl=${returnUrl}`)
    }
  }, [isAuthenticated, pathname, router])

  return { isAuthenticated }
}

// 인증 상태 초기화 (로그아웃)
export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_verified")
    localStorage.removeItem("auth_timestamp")
  }
} 