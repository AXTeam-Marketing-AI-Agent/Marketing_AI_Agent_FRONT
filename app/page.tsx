/**
 * 마케팅 전략 AI 서비스 메인 페이지
 * 
 * 이 페이지는 팩트북 라이브러리의 메인 대시보드로,
 * 사용자가 브랜드별 마케팅 전략 팩트북을 관리하고 탐색할 수 있는 인터페이스를 제공합니다.
 * 
 * 주요 기능:
 * 1. 팩트북 목록 조회 및 필터링
 * 2. 통계 대시보드
 * 3. 최근 활동 내역
 * 4. 팩트북 검색 및 정렬
 * 
 * 페이지 흐름:
 * 1. 사용자가 페이지에 접속하면 전체 팩트북 목록이 표시됩니다.
 * 2. 상단의 통계 카드에서 전체 현황을 한눈에 파악할 수 있습니다.
 * 3. 검색, 필터링, 정렬 기능을 통해 원하는 팩트북을 찾을 수 있습니다.
 * 4. 각 팩트북 카드를 클릭하면 해당 팩트북의 상세 페이지로 이동합니다.
 * 5. "새 팩트북 생성" 버튼을 통해 새로운 팩트북을 만들 수 있습니다.
 */

"use client"

import React, { useState, MouseEvent, useEffect, useMemo, useCallback, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Plus, Search, Target, TrendingUp, Building2, MoreHorizontal, Eye, Edit3, Copy, Share2, Trash2, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { Toaster, toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"

/**
 * 팩트북 데이터 타입 정의
 */
interface Factbook {
  id: number
  brand_name: string
  industry: string
  description: string
  creator_name: string
  created_at: string
  updated_at: string
  views: number
  downloads: number
  shares: number
  strategy_count: number
}

/**
 * 최근 활동 데이터 타입 정의
 */
interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  time: string
  user: string
  entity_id: number
  entity_type: string
}

// 디바운스 훅 정의
function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debounced
}

/**
 * HomePage 컴포넌트
 * 
 * 메인 페이지의 전체 레이아웃과 기능을 구현합니다.
 * 
 * 상태 관리:
 * - searchTerm: 검색어
 * - industryFilter: 업종 필터
 * - sortBy: 정렬 기준
 * 
 * 주요 기능:
 * 1. 팩트북 필터링 및 정렬
 * 2. 통계 데이터 계산
 * 3. 반응형 레이아웃
 * 
 * @returns {JSX.Element} 메인 페이지 컴포넌트
 */
export default function HomePage() {
  const router = useRouter()
  
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 250)
  const [industryFilter, setIndustryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [factbooks, setFactbooks] = useState<Factbook[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [activitiesOffset, setActivitiesOffset] = useState(0)
  const [activitiesHasMore, setActivitiesHasMore] = useState(true)
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  const ACTIVITIES_LIMIT = 30
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [visibleActivities, setVisibleActivities] = useState(6)
  const [newActivityIds, setNewActivityIds] = useState<string[]>([])
  const activityRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // 페이지별 데이터와 전체 카운트 상태 추가
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 9

  // 팩트북 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 팩트북 데이터만 먼저 로드 (메인 데이터)
        const factbooksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/factbooks`, {
          cache: 'no-store' // 항상 최신 데이터 사용
        })
        
        if (!factbooksResponse.ok) {
          throw new Error(`HTTP error! status: ${factbooksResponse.status}`)
        }
        
        const factbooksData = await factbooksResponse.json()
        setFactbooks(factbooksData)
        setLoading(false) // 팩트북 로드 완료 시 즉시 화면 표시
        
        // 활동 데이터는 백그라운드에서 로드
        setActivitiesLoading(true)
        try {
          const activitiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/activities/recent?limit=${ACTIVITIES_LIMIT}`)
          if (activitiesResponse.ok) {
            const activitiesData = await activitiesResponse.json()
            setActivities(activitiesData)
            setActivitiesHasMore(activitiesData.length === ACTIVITIES_LIMIT)
            setActivitiesOffset(activitiesData.length)
          }
        } catch (activityError) {
          console.warn('Failed to load activities:', activityError)
        } finally {
          setActivitiesLoading(false)
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('데이터를 불러오는데 실패했습니다.')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 최근 활동 점진적 로딩 (더보기 버튼용)
  const fetchRecentActivities = async (offset = 0) => {
    if (offset === 0) return // 초기 로딩은 fetchData에서 처리
    
    setActivitiesLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/activities/recent?offset=${offset}&limit=${ACTIVITIES_LIMIT}`)
      if (!res.ok) throw new Error("활동 데이터를 불러오지 못했습니다.")
      const data = await res.json()
      
      setActivities(prev => {
        const newIds = data.map((a: any) => a.id)
        setNewActivityIds(newIds)
        return [...prev, ...data]
      })
      // highlight 후 1초 뒤 해제
      setTimeout(() => setNewActivityIds([]), 1000)
      // 새로 추가된 첫 항목으로 스크롤
      setTimeout(() => {
        if (data.length > 0) {
          const firstId = data[0].id
          const el = activityRefs.current[firstId]
          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
      
      setActivitiesHasMore(data.length === ACTIVITIES_LIMIT)
      setActivitiesOffset(offset + data.length)
    } catch (e) {
      toast.error("활동 데이터를 불러오지 못했습니다.")
    } finally {
      setActivitiesLoading(false)
    }
  }

  // 초기 활동 로딩 제거 (fetchData에서 처리됨)
  // useEffect(() => {
  //   fetchRecentActivities(0)
  // }, [])

  /**
   * 팩트북 필터링 및 정렬 로직
   */
  const filteredFactbooks = useMemo(() => {
    return factbooks
    .filter((factbook) => {
      const matchesSearch =
          factbook.brand_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          factbook.industry.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          factbook.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      const matchesIndustry = industryFilter === "all" || factbook.industry === industryFilter

      return matchesSearch && matchesIndustry
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        case "popular":
          return b.views - a.views
        case "strategies":
            return (b.strategy_count || 0) - (a.strategy_count || 0)
        case "alphabetical":
            return a.brand_name.localeCompare(b.brand_name)
        default:
          return 0
      }
    })
  }, [factbooks, debouncedSearchTerm, industryFilter, sortBy])

  // 1. 팩트북 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1)

  // 현재 페이지에 표시할 팩트북들
  const pagedFactbooks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredFactbooks.slice(startIndex, startIndex + pageSize)
  }, [filteredFactbooks, currentPage, pageSize])

  // 총 페이지 수 계산
  const totalPagesCount = Math.ceil(filteredFactbooks.length / pageSize)

  // 검색/필터/정렬 변경 시 페이지 리셋
  useEffect(() => { 
    setCurrentPage(1)
  }, [searchTerm, industryFilter, sortBy])

  /**
   * 통계 데이터 계산
   * 
   * - totalFactbooks: 전체 팩트북 수
   * - totalBrands: 고유 브랜드 수
   * - totalStrategies: 전체 생성된 전략 수
   * - totalFactbookViews: 팩트북 조회수 (전략 조회수 제외)
   */
  const totalFactbooks = factbooks.length
  const totalBrands = new Set(factbooks.map((f) => f.brand_name)).size
  const totalStrategies = factbooks.reduce((sum, f) => sum + (f.strategy_count || 0), 0)
  const totalFactbookViews = factbooks.reduce((sum, f) => sum + f.views, 0)

  // 팩트북 삭제 처리
  const handleDeleteFactbook = useCallback(async (factbookId: string) => {
    if (!confirm("정말로 이 팩트북을 삭제하시겠습니까?\n연관된 모든 전략도 함께 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.")) {
      return
    }
    
    setIsDeleting(factbookId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/factbooks/${factbookId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // 삭제 성공 시 목록에서 제거
      setFactbooks(prev => prev.filter(f => f.id.toString() !== factbookId))
      toast.success("팩트북이 삭제되었습니다.")
    } catch (error) {
      console.error('Error deleting factbook:', error)
      toast.error("팩트북 삭제에 실패했습니다.")
    } finally {
      setIsDeleting(null)
    }
  }, [])

  // 팩트북 복제 처리
  const handleDuplicateFactbook = async (factbookId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/factbooks/${factbookId}/duplicate`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const duplicatedFactbook = await response.json()
      setFactbooks(prev => [...prev, duplicatedFactbook])
      toast.success("팩트북이 복제되었습니다.")
    } catch (error) {
      console.error('Error duplicating factbook:', error)
      toast.error("팩트북 복제에 실패했습니다.")
    }
  }

  // 팩트북 공유 처리
  const handleShareFactbook = useCallback((factbookId: string) => {
    const url = `${window.location.origin}/factbook/${factbookId}`
    navigator.clipboard.writeText(url)
    toast.success("공유 링크가 클립보드에 복사되었습니다.")
  }, [])

  // 카드 클릭 핸들러 useCallback
  const handleFactbookClick = useCallback((factbookId: string) => {
    router.push(`/factbook/${factbookId}`)
  }, [router])

  // 이벤트 전파 중단 처리
  const handleClick = useCallback((e: MouseEvent) => {
    e.stopPropagation()
  }, [])

  // 날짜 형식 변환 함수
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  // 활동 필터링을 useMemo로 최적화
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => 
      activity.entity_type === "factbook" && 
      factbooks.some(f => f.id === activity.entity_id)
    )
  }, [activities, factbooks])

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster />
      {/* 
        헤더 섹션
        - 로고 및 서비스명
        - 새 팩트북 생성 버튼
      */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center">
                <Image
                  src="/daehong-logo.png"
                  alt="대홍기획 로고"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">마케팅 전략 AI Agent</h1>
                <p className="text-sm text-gray-500">팩트북 라이브러리</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
                <Link href="/manual" prefetch={true} className="text-gray-400 hover:text-gray-600 transition-colors font-semibold flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                서비스 가이드북
              </Link>
              <span className="text-gray-600 font-semibold">팩트북 라이브러리</span>
              <Link href="/strategy-library" prefetch={true} className="text-gray-400 hover:text-gray-600 transition-colors font-semibold">
                전략 라이브러리
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 
          통계 개요 섹션
          - 총 팩트북 수
          - 브랜드 수
          - 생성된 전략 수
          - 총 조회수
        */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">총 팩트북</p>
                  <p className="text-2xl font-bold text-blue-900">{totalFactbooks}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">브랜드 수</p>
                  <p className="text-2xl font-bold text-green-900">{totalBrands}</p>
                </div>
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">생성된 전략</p>
                  <p className="text-2xl font-bold text-purple-900">{totalStrategies}</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">팩트북 조회수</p>
                  <p className="text-2xl font-bold text-orange-900">{totalFactbookViews}</p>
                </div>
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 
            메인 컨텐츠 영역
            - 검색 및 필터링
            - 팩트북 그리드
          */}
          <div className="lg:col-span-3">
            {/* 
              필터 섹션
              - 검색 입력창
              - 업종 필터 드롭다운
              - 정렬 기준 드롭다운
            */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="팩트북 검색 (브랜드명)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="업종 필터" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 업종</SelectItem>
                  <SelectItem value="식품/음료">식품/음료</SelectItem>
                  <SelectItem value="패션/뷰티">패션/뷰티</SelectItem>
                  <SelectItem value="기술/IT">기술/IT</SelectItem>
                  <SelectItem value="자동차">자동차</SelectItem>
                  <SelectItem value="금융">금융</SelectItem>
                  <SelectItem value="의료/헬스케어">의료/헬스케어</SelectItem>
                  <SelectItem value="교육">교육</SelectItem>
                  <SelectItem value="엔터테인먼트/미디어">엔터테인먼트/미디어</SelectItem>
                  <SelectItem value="부동산/건설">부동산/건설</SelectItem>
                  <SelectItem value="여행/호텔">여행/호텔</SelectItem>
                  <SelectItem value="유통/이커머스">유통/이커머스</SelectItem>
                  <SelectItem value="화장품/뷰티">화장품/뷰티</SelectItem>
                  <SelectItem value="스포츠/레저">스포츠/레저</SelectItem>
                  <SelectItem value="가전/전자제품">가전/전자제품</SelectItem>
                  <SelectItem value="식당/외식">식당/외식</SelectItem>
                  <SelectItem value="커피/음료">커피/음료</SelectItem>
                  <SelectItem value="주류/술">주류/술</SelectItem>
                  <SelectItem value="건강기능식품">건강기능식품</SelectItem>
                  <SelectItem value="기타">기타</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">최근 업데이트</SelectItem>
                  <SelectItem value="popular">인기순</SelectItem>
                  <SelectItem value="strategies">전략 생성순</SelectItem>
                  <SelectItem value="alphabetical">가나다순</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 
              팩트북 그리드
              - 반응형 그리드 레이아웃
              - 호버 효과
              - 팩트북 카드 컴포넌트
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {loading ? (
                // 로딩 상태일 때 스켈레톤 UI
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))
              ) : filteredFactbooks.length > 0 ? (
                pagedFactbooks.map((factbook) => (
                  <FactbookCard
                    key={factbook.id}
                    factbook={factbook}
                    onClick={handleFactbookClick}
                    isDeleting={isDeleting}
                    handleClick={handleClick}
                    handleShareFactbook={handleShareFactbook}
                    handleDeleteFactbook={handleDeleteFactbook}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">팩트북이 없습니다</h3>
                  <p className="text-gray-500 mb-4">새로운 브랜드 팩트북을 생성해보세요.</p>
                  <Link href="/create-factbook">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />첫 번째 팩트북 만들기
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            {/* 페이지네이션 UI */}
            {totalPagesCount > 1 && (
              <div className="flex justify-center mt-6 gap-1">
                {Array.from({length: totalPagesCount}, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i+1 ? "default" : "outline"}
                    size="sm"
                    className={`cursor-pointer rounded-lg transition-all duration-150 font-semibold min-w-[36px] h-9
                      ${currentPage === i+1 ? "bg-primary text-primary-foreground shadow-lg border border-primary" : "bg-white/90 text-gray-700 border hover:shadow-lg hover:bg-white"}
                    `}
                    onClick={() => setCurrentPage(i+1)}
                    style={{ boxShadow: currentPage === i+1 ? '0 2px 8px 0 rgba(37,99,235,0.10)' : undefined }}
                  >
                    {i+1}
                  </Button>
                ))}
              </div>
            )}

            {filteredFactbooks.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">팩트북이 없습니다</h3>
                <p className="text-gray-500 mb-4">새로운 브랜드 팩트북을 생성해보세요.</p>
                <Link href="/create-factbook">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />첫 번째 팩트북 만들기
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* 
            사이드바
            - 최근 활동 내역
            - 활동 유형별 아이콘
            - 시간순 정렬
          */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">빠른 실행</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/create-factbook">
                  <Button className="w-full justify-start">
                    <Plus className="w-4 h-4 mr-2" />새 팩트북 생성
                  </Button>
                </Link>
                {/* <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  인기 팩트북
                </Button> */}
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">최근 활동</CardTitle>
                  {activitiesLoading && (
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                      불러오는 중...
                    </div>
                  )}
                </div>
                <CardDescription>전체 유저 최근 팩트북 활동</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity, idx) => {
                      let link = `/factbook/${activity.entity_id}`;
                      // highlight-fade 적용
                      const isHighlighted = newActivityIds.includes(activity.id)
                      // 브랜드명만 추출 (콜론 앞)
                      let brand = activity.title.split(":")[0].trim()
                      // description 생성
                      let desc = `${brand} 팩트북 생성`
                      return (
                        <Link href={link} prefetch={true} key={activity.id}>
                          <div
                            ref={el => { activityRefs.current[activity.id] = el }}
                            className={`flex items-start space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors${isHighlighted ? " highlight-fade" : ""}`}
                          >
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{brand}</p>
                              <p className="text-xs text-gray-500 truncate">{desc}</p>
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-400">{formatDate(activity.time)}</p>
                                <p className="text-xs text-gray-400">{activity.user}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : activitiesLoading ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-sm text-gray-500">활동 내역을 불러오고 있습니다...</p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">아직 팩트북 활동이 없습니다</p>
                      <p className="text-xs text-gray-400 mt-1">새로운 팩트북을 생성해보세요</p>
                    </div>
                  )}
                </div>
                {/* 더보기 버튼 */}
                {activitiesHasMore && (
                  <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => fetchRecentActivities(activitiesOffset)} disabled={activitiesLoading}>
                    {activitiesLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        불러오는 중...
                      </span>
                    ) : (
                      "더보기"
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-xs text-gray-400">
              Made by Daehong AXTeam
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

// FactbookCard 컴포넌트 분리 + React.memo
const FactbookCard = React.memo(function FactbookCard({ factbook, onClick, isDeleting, handleClick, handleShareFactbook, handleDeleteFactbook, formatDate }: any) {
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(factbook.id.toString())}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{factbook.brand_name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleClick}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e: MouseEvent) => {
                handleClick(e)
                handleShareFactbook(factbook.id.toString())
              }}>
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteFactbook(factbook.id.toString())
                }}
                className="text-red-600"
                disabled={isDeleting === factbook.id.toString()}
              >
                {isDeleting === factbook.id.toString() ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                    삭제 중...
                  </div>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{factbook.industry}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{factbook.description}</p>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">생성 전략</p>
            <p className="text-sm font-medium">{factbook.strategy_count || 0}개</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">조회수</p>
            <p className="text-sm font-medium">{factbook.views}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">작성자</p>
            <p className="text-sm font-medium">{factbook.creator_name}</p>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>생성: {formatDate(factbook.created_at)}</span>
            <span>수정: {formatDate(factbook.updated_at)}</span>
          </div>
        </div>
        <div className="flex space-x-2" onClick={handleClick}>
          <Link href={`/strategy-selection?factbook=${factbook.id}`} prefetch={true} className="w-full">
            <Button size="sm" className="w-full">
              <Target className="w-3 h-3 mr-1" />
              전략 생성
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
})