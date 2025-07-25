

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

// 전략 타입 매핑
const STRATEGY_TYPE_MAP: Record<string, { icon: string; label: string }> = {
  'tv-advertising': { icon: '📺', label: 'TV 광고 전략' },
  'performance-marketing': { icon: '📊', label: '퍼포먼스 마케팅 전략' },
  'sns-content': { icon: '📱', label: 'SNS 콘텐츠 전략' },
  'influencer-marketing': { icon: '👥', label: '인플루언서 마케팅 전략' },
  'brand-positioning': { icon: '🎨', label: '브랜드 포지셔닝 전략' },
}

/**
 * 전략 데이터 타입 정의
 */
interface Strategy {
  id: number
  factbook_id: number
  creator: string
  strategy_type: string
  title: string
  description?: string
  problem: any
  insight: any
  goal_target: any
  direction: any
  execution: any
  brand_name?: string
  industry?: string
  views?: number
  created_at: string
  updated_at: string
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

interface Factbook {
  id: number
  brand_name: string
  industry?: string
  // 필요시 다른 필드 추가
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
export default function StrategyLibraryPage() {
  const router = useRouter()
  
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 250)
  const [industryFilter, setIndustryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [activities, setActivities] = useState<RecentActivity[]>([])
  const [activitiesOffset, setActivitiesOffset] = useState(0)
  const [activitiesHasMore, setActivitiesHasMore] = useState(true)
  const [activitiesLoading, setActivitiesLoading] = useState(false)
  const ACTIVITIES_LIMIT = 6
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [visibleActivities, setVisibleActivities] = useState(6)
  const [newActivityIds, setNewActivityIds] = useState<string[]>([])
  const activityRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [factbooks, setFactbooks] = useState<Factbook[]>([])

  // 전략 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // 전략 데이터만 먼저 로드 (메인 데이터)
        const strategiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/strategies`, {
          cache: 'no-store' // 항상 최신 데이터 사용
        })
        
        if (!strategiesResponse.ok) {
          throw new Error(`HTTP error! status: ${strategiesResponse.status}`)
        }
        
        const strategiesData = await strategiesResponse.json()
        console.log('Fetched strategies:', strategiesData)
        setStrategies(strategiesData)
        setLoading(false) // 전략 로드 완료 시 즉시 화면 표시
        
        // 팩트북과 활동 데이터는 백그라운드에서 로드
        try {
          const [factbooksResponse, activitiesResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/factbooks/`, {
              cache: 'no-store'
            }),
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/activities/recent`)
          ])
          
          if (factbooksResponse.ok) {
            const factbooksData = await factbooksResponse.json()
            setFactbooks(factbooksData)
          }
          
          if (activitiesResponse.ok) {
            const activitiesData = await activitiesResponse.json()
            console.log('Fetched activities:', activitiesData)
            setActivities(activitiesData)
          }
        } catch (bgError) {
          console.warn('Failed to load background data:', bgError)
          // 백그라운드 데이터 로드 실패는 무시
        }
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('데이터를 불러오는데 실패했습니다.')
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 팩트북 전체 리스트 fetch
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/factbooks/`)
      .then(res => res.json())
      .then(data => setFactbooks(data))
  }, [])

  // 최근 활동 점진적 로딩
  const fetchRecentActivities = async (offset = 0) => {
    setActivitiesLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/activities/recent?offset=${offset}&limit=${ACTIVITIES_LIMIT}`)
      if (!res.ok) throw new Error("활동 데이터를 불러오지 못했습니다.")
      const data = await res.json()
      if (offset === 0) {
        setActivities(data)
        setNewActivityIds([])
      } else {
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
      }
      setActivitiesHasMore(data.length === ACTIVITIES_LIMIT)
      setActivitiesOffset(offset + data.length)
    } catch (e) {
      toast.error("활동 데이터를 불러오지 못했습니다.")
    } finally {
      setActivitiesLoading(false)
    }
  }

  useEffect(() => {
    fetchRecentActivities(0)
  }, [])

  // 브랜드/업종 매핑을 위해 strategies에 brand_name, industry를 factbooks에서 매핑
  const strategiesWithFactbook = useMemo(() => {
    if (!factbooks.length) return strategies
    return strategies.map(s => {
      const fb = factbooks.find(f => f.id === s.factbook_id)
      return {
        ...s,
        brand_name: s.brand_name || fb?.brand_name || '-',
        industry: fb?.industry || '-',
      }
    })
  }, [strategies, factbooks])

  // 검색/필터/정렬 적용
  const filteredStrategies = useMemo(() => {
    return strategiesWithFactbook
      .filter((strategy) => {
        const matchesSearch = (strategy.brand_name?.toLowerCase() ?? '').includes(debouncedSearchTerm.toLowerCase())
        const matchesIndustry = industryFilter === 'all' || strategy.industry === industryFilter
        return matchesSearch && matchesIndustry
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'recent':
            return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          case 'popular':
            return (b.views || 0) - (a.views || 0)
          case 'strategies':
            return b.id - a.id
          case 'alphabetical':
            return (a.brand_name ?? '').localeCompare(b.brand_name ?? '')
          default:
            return 0
        }
      })
  }, [strategiesWithFactbook, debouncedSearchTerm, industryFilter, sortBy])

  // 1. 전략 페이지네이션 상태 추가
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9

  // 현재 페이지에 표시할 전략들
  const pagedStrategies = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredStrategies.slice(startIndex, startIndex + pageSize)
  }, [filteredStrategies, currentPage])

  // 총 페이지 수 계산
  const totalPagesCount = Math.ceil(filteredStrategies.length / pageSize)

  // 검색/필터/정렬 변경 시 페이지 리셋
  useEffect(() => { setCurrentPage(1) }, [searchTerm, sortBy])

  /**
   * 통계 데이터 계산
   * 
   * - totalStrategies: 전체 전략 수
   * - totalCreators: 고유 작성자 수
   */
  const totalStrategies = strategies.length
  const totalBrands = new Set(factbooks.map((f) => f.brand_name)).size
  const totalStrategyViews = strategies.reduce((sum, s) => sum + (s.views || 0), 0)
  const totalFactbooks = new Set(strategies.map((s) => s.factbook_id)).size

  // 3. 최근 활동에서 전략만 필터링
  const strategyActivities = activities.filter(a => a.entity_type === "strategy")

  // 전략 삭제 처리
  const handleDeleteStrategy = useCallback(async (strategyId: string) => {
    if (!confirm("정말로 전략을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      return
    }
    
    setIsDeleting(strategyId)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/strategies/${strategyId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      // 삭제 성공 시 목록에서 제거
      setStrategies(prev => prev.filter(s => s.id.toString() !== strategyId))
      toast.success("전략이 삭제되었습니다.")
    } catch (error) {
      console.error('Error deleting strategy:', error)
      toast.error("전략 삭제에 실패했습니다.")
    } finally {
      setIsDeleting(null)
    }
  }, [])

  // 전략 복제 처리
  const handleDuplicateStrategy = async (strategyId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/strategies/${strategyId}/duplicate`, {
        method: 'POST',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const duplicatedStrategy = await response.json()
      setStrategies(prev => [...prev, duplicatedStrategy])
      toast.success("전략이 복제되었습니다.")
    } catch (error) {
      console.error('Error duplicating strategy:', error)
      toast.error("전략 복제에 실패했습니다.")
    }
  }

  // 전략 공유 처리
  const handleShareStrategy = useCallback((strategyId: string) => {
    const url = `${window.location.origin}/strategy/${strategyId}`
    navigator.clipboard.writeText(url)
    toast.success("공유 링크가 클립보드에 복사되었습니다.")
  }, [])

  // 카드 클릭 핸들러 useCallback
  const handleStrategyClick = useCallback((strategyId: string) => {
    router.push(`/strategy-result?strategy=${strategyId}`)
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

  return (
    <main className="min-h-screen bg-gray-50">
      <Toaster />
      {/* 헤더 네비게이션 */}
      <header className="bg-purple-50 border-b border-gray-200">
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
                <p className="text-sm text-gray-500">전략 라이브러리</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
            <Link href="/manual" prefetch={true} className="text-gray-400 hover:text-gray-600 transition-colors font-semibold flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                서비스 가이드북
              </Link>
              <Link href="/" prefetch={true} className="text-gray-400 hover:text-gray-600 transition-colors font-semibold">
                팩트북 라이브러리
              </Link>
              <span className="text-gray-600 font-semibold">전략 라이브러리</span>
              
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 통계 개요 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">총 팩트북</p>
                  <p className="text-2xl font-bold text-blue-900">{factbooks.length}</p>
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
                  <p className="text-sm font-medium text-orange-700">전략 조회수</p>
                  <p className="text-2xl font-bold text-orange-900">{totalStrategyViews}</p>
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
            - 전략 그리드
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
                  placeholder="브랜드명으로 검색..."
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
              전략 그리드
              - 반응형 그리드 레이아웃
              - 호버 효과
              - 전략 카드 컴포넌트
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
              ) : filteredStrategies.length > 0 ? (
                pagedStrategies.map((strategy) => (
                  <StrategyCard
                    key={strategy.id}
                    strategy={strategy}
                    onClick={handleStrategyClick}
                    isDeleting={isDeleting}
                    handleClick={handleClick}
                    handleShareStrategy={handleShareStrategy}
                    handleDeleteStrategy={handleDeleteStrategy}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">전략이 없습니다</h3>
                  <p className="text-gray-500 mb-4">새로운 전략을 생성해보세요.</p>
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

            {filteredStrategies.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">전략이 없습니다</h3>
                <p className="text-gray-500 mb-4">새로운 전략을 생성해보세요.</p>
                <Link href="/create-strategy">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />첫 번째 전략 만들기
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
                  인기 전략
                </Button> */}
              </CardContent>
            </Card>

            {/* Recent Strategy Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  최근 활동
                </CardTitle>
                <CardDescription>팀의 최근 전략 활동</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {strategyActivities.length > 0 ? (
                    strategyActivities.map((activity, idx) => {
                      let link = "#";
                      if (activity.entity_type === "strategy") {
                        link = `/strategy-result?strategy=${activity.entity_id}`;
                      }
                      const isHighlighted = newActivityIds.includes(activity.id)
                      let brand = activity.title.split(":")[0].trim()
                      let strategy = activity.title.includes(":") ? activity.title.split(":")[1].trim() : ""
                      let desc = strategy ? `${brand} ${strategy} 생성` : `${brand} 전략 생성`
                      return (
                        <div
                          key={activity.id}
                          ref={el => { activityRefs.current[activity.id] = el }}
                          className={`flex items-start space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors${isHighlighted ? " highlight-fade" : ""}`}
                          onClick={() => router.push(link)}
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{brand}</p>
                            <p className="text-xs text-gray-500 truncate">{desc}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-400">{formatDate(activity.time)}</p>
                              <p className="text-xs text-gray-400">{activity.user}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4">
                      <Target className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">아직 전략 활동이 없습니다</p>
                      <p className="text-xs text-gray-400 mt-1">새로운 전략을 생성해보세요</p>
                    </div>
                  )}
                </div>
                {/* 더보기 버튼 */}
                {activitiesHasMore && (
                  <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => fetchRecentActivities(activitiesOffset)} disabled={activitiesLoading}>
                    {activitiesLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
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
// StrategyCard 컴포넌트 분리 + React.memo
const StrategyCard = React.memo(function StrategyCard({ strategy, onClick, isDeleting, handleClick, handleShareStrategy, handleDeleteStrategy, formatDate }: any) {
  const typeInfo = STRATEGY_TYPE_MAP[strategy.strategy_type] || { icon: '❓', label: strategy.strategy_type }
  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(strategy.id.toString())}
    >
      <CardHeader className="pb-0">
        <div className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">{strategy.brand_name ?? '-'}</CardTitle>
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleClick}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e: MouseEvent) => {
                handleClick(e)
                handleShareStrategy(strategy.id.toString())
              }}>
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteStrategy(strategy.id.toString())
                }}
                className="text-red-600"
                disabled={isDeleting === strategy.id.toString()}
              >
                {isDeleting === strategy.id.toString() ? (
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
          <p className="text-sm text-gray-600 line-clamp-2 items-center justify-between">{strategy.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center my-2">
          <span className="text-3xl">{typeInfo.icon}</span>
          <span className="text-l font-semibold mt-1">{typeInfo.label}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-center my-2 mt-3">
          <div>
            <Eye className="inline w-4 h-4 mr-1 text-gray-400" />
            <span className="font-medium">{strategy.views ?? 0}</span>
            <div className="text-xs text-gray-500">조회수</div>
          </div>
          <div>
            <span className="font-medium">{strategy.creator}</span>
            <div className="text-xs text-gray-500">작성자</div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 border-t border-gray-100 pt-2">
          <span>생성: {formatDate(strategy.created_at)}</span>
          <span>수정: {formatDate(strategy.updated_at)}</span>
        </div>
        <div className="flex gap-2 mt-3">
          <Link href={`/factbook/${strategy.factbook_id}`} prefetch={true} className="w-1/2">
            <Button size="sm" className="w-full" variant="outline">
              <BookOpen className="w-3 h-3 mr-1" />
              팩트북 보기
            </Button>
          </Link>
          <Link href={`/strategy-result?strategy=${strategy.id}`} prefetch={true} className="w-1/2">
            <Button size="sm" className="w-full">
              <Target className="w-3 h-3 mr-1" />
              상세 보기
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
})
