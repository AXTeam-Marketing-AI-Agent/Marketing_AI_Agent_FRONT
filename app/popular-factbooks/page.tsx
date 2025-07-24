/**
 * 인기 팩트북 페이지
 * 
 * 이 페이지는 사용자들이 가장 많이 조회하고 활용한 팩트북들을 보여주는 페이지입니다.
 * 인기 팩트북은 조회수, 다운로드 수, 공유 수 등의 지표를 기반으로 선정됩니다.
 * 
 * 페이지 구성:
 * 1. 필터 및 정렬
 *    - 업종별 필터
 *    - 정렬 옵션 (조회수, 다운로드, 공유)
 *    - 검색 기능
 * 
 * 2. 인기 팩트북 목록
 *    - 팩트북 카드 (썸네일, 제목, 업종, 통계)
 *    - 인기 지표 (조회수, 다운로드, 공유)
 *    - 태그 및 배지
 * 
 * 3. 페이지네이션
 *    - 페이지 이동
 *    - 페이지당 표시 개수 조절
 */

"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Search,
  Eye,
  Download,
  Share2,
  TrendingUp,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// 업종 목록
const industries = ["전체", "식품/음료", "패션/뷰티", "기술/IT", "자동차", "금융", "교육", "헬스케어", "엔터테인먼트"]

// 정렬 옵션
const sortOptions = [
  { value: "views", label: "조회수 순" },
  { value: "downloads", label: "다운로드 순" },
  { value: "shares", label: "공유 순" },
  { value: "recent", label: "최신 순" },
]

// 인기 팩트북 데이터
const popularFactbooks = [
  {
    id: 1,
    title: "스타벅스 코리아 마케팅 전략 팩트북",
    industry: "식품/음료",
    thumbnail: "/images/factbooks/starbucks.jpg",
    views: 12500,
    downloads: 3200,
    shares: 850,
    tags: ["카페", "프리미엄", "MZ세대"],
    createdAt: "2024-01-15",
    updatedAt: "2024-02-01",
  },
  {
    id: 2,
    title: "현대자동차 전기차 시장 진출 전략",
    industry: "자동차",
    thumbnail: "/images/factbooks/hyundai.jpg",
    views: 9800,
    downloads: 2500,
    shares: 620,
    tags: ["전기차", "친환경", "기술혁신"],
    createdAt: "2024-01-20",
    updatedAt: "2024-02-05",
  },
  {
    id: 3,
    title: "쿠팡 이커머스 시장 점유율 분석",
    industry: "기술/IT",
    thumbnail: "/images/factbooks/coupang.jpg",
    views: 8700,
    downloads: 2100,
    shares: 580,
    tags: ["이커머스", "배송", "프라임"],
    createdAt: "2024-01-25",
    updatedAt: "2024-02-10",
  },
  {
    id: 4,
    title: "올리브영 뷰티 시장 리더십 전략",
    industry: "패션/뷰티",
    thumbnail: "/images/factbooks/oliveyoung.jpg",
    views: 7600,
    downloads: 1800,
    shares: 450,
    tags: ["뷰티", "헬스케어", "MZ세대"],
    createdAt: "2024-01-30",
    updatedAt: "2024-02-15",
  },
  {
    id: 5,
    title: "카카오뱅크 디지털 금융 혁신 전략",
    industry: "금융",
    thumbnail: "/images/factbooks/kakaobank.jpg",
    views: 6900,
    downloads: 1600,
    shares: 420,
    tags: ["디지털뱅킹", "핀테크", "MZ세대"],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-20",
  },
]

/**
 * PopularFactbooksPage 컴포넌트
 * 
 * 인기 팩트북 페이지의 전체 기능을 구현합니다.
 * 
 * 상태 관리:
 * - selectedIndustry: 선택된 업종
 * - sortBy: 정렬 기준
 * - searchQuery: 검색어
 * - currentPage: 현재 페이지
 * 
 * 주요 기능:
 * 1. 팩트북 필터링 및 정렬
 * 2. 검색
 * 3. 페이지네이션
 * 
 * @returns {JSX.Element} 인기 팩트북 페이지 컴포넌트
 */
export default function PopularFactbooksPage() {
  const [selectedIndustry, setSelectedIndustry] = useState("전체")
  const [sortBy, setSortBy] = useState("views")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // 필터링 및 정렬된 팩트북 목록
  const filteredFactbooks = popularFactbooks
    .filter((factbook) => {
      const matchesIndustry = selectedIndustry === "전체" || factbook.industry === selectedIndustry
      const matchesSearch = factbook.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesIndustry && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "views":
          return b.views - a.views
        case "downloads":
          return b.downloads - a.downloads
        case "shares":
          return b.shares - a.shares
        case "recent":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        default:
          return 0
      }
    })

  // 현재 페이지의 팩트북 목록
  const currentFactbooks = filteredFactbooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 총 페이지 수
  const totalPages = Math.ceil(filteredFactbooks.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 
        헤더 섹션
        - 뒤로가기 버튼
        - 페이지 제목
      */}
      <header className="bg-gradient-to-r from-orange-600 to-red-600 border-b border-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" className="mr-4 text-white hover:bg-white/20">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  돌아가기
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-6 h-6 text-white" />
                <h1 className="text-xl font-bold text-white">인기 팩트북</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 
          필터 및 검색 섹션
          - 업종 필터
          - 정렬 옵션
          - 검색창
        */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="팩트북 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-4">
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="업종 선택" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="정렬 기준" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 
          팩트북 목록
          - 팩트북 카드
          - 통계 정보
          - 태그
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentFactbooks.map((factbook) => (
            <Link href={`/factbook/${factbook.id}`} key={factbook.id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                <div className="aspect-video relative bg-gray-100 rounded-t-lg overflow-hidden">
                  <img
                    src={factbook.thumbnail}
                    alt={factbook.title}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2">{factbook.industry}</Badge>
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-2 text-lg">{factbook.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {factbook.views.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {factbook.downloads.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <Share2 className="w-4 h-4 mr-1" />
                        {factbook.shares.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-xs">
                      {new Date(factbook.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {factbook.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* 
          페이지네이션
          - 이전/다음 페이지 버튼
          - 페이지 번호
        */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              다음
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
} 