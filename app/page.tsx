"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Plus, Search, Target, TrendingUp, Building2, MoreHorizontal, Eye, Edit3 } from "lucide-react"

const factbooks = [
  {
    id: 1,
    brandName: "스타벅스 코리아",
    industry: "식품/음료",
    createdDate: "2024-01-15",
    lastUpdated: "2024-01-15",
    createdBy: "김마케터",
    strategiesGenerated: 3,
    views: 24,
    description: "프리미엄 커피 브랜드의 한국 시장 진출 전략을 위한 종합 팩트북",
  },
  {
    id: 2,
    brandName: "나이키 러닝",
    industry: "패션/뷰티",
    createdDate: "2024-01-10",
    lastUpdated: "2024-01-14",
    createdBy: "이전략가",
    strategiesGenerated: 2,
    views: 18,
    description: "러닝 전문 브랜드로서의 포지셔닝과 MZ세대 타겟팅 전략",
  },
  {
    id: 3,
    brandName: "삼성 갤럭시",
    industry: "기술/IT",
    createdDate: "2024-01-08",
    lastUpdated: "2024-01-10",
    createdBy: "박애널리스트",
    strategiesGenerated: 5,
    views: 42,
    description: "글로벌 스마트폰 시장에서의 프리미엄 포지셔닝 전략",
  },
  {
    id: 4,
    brandName: "현대자동차",
    industry: "자동차",
    createdDate: "2024-01-05",
    lastUpdated: "2024-01-08",
    createdBy: "최기획자",
    strategiesGenerated: 1,
    views: 15,
    description: "친환경 자동차 시장 진출을 위한 브랜드 전환 전략",
  },
  {
    id: 5,
    brandName: "카카오뱅크",
    industry: "금융",
    createdDate: "2024-01-03",
    lastUpdated: "2024-01-12",
    createdBy: "정디지털",
    strategiesGenerated: 2,
    views: 31,
    description: "디지털 네이티브를 위한 혁신적 금융 서비스 브랜딩",
  },
  {
    id: 6,
    brandName: "올리브영",
    industry: "패션/뷰티",
    createdDate: "2023-12-28",
    lastUpdated: "2024-01-13",
    createdBy: "한뷰티",
    strategiesGenerated: 4,
    views: 28,
    description: "K-뷰티 트렌드를 선도하는 원스톱 뷰티 플랫폼",
  },
]

const recentActivities = [
  { id: 1, factbook: "스타벅스 코리아", action: "팩트북 업데이트", time: "2시간 전", type: "update", user: "김마케터" },
  { id: 2, factbook: "올리브영", action: "SNS 콘텐츠 전략 생성", time: "4시간 전", type: "strategy", user: "한뷰티" },
  { id: 3, factbook: "카카오뱅크", action: "팩트북 조회", time: "6시간 전", type: "view", user: "정디지털" },
  {
    id: 4,
    factbook: "나이키 러닝",
    action: "퍼포먼스 마케팅 전략 생성",
    time: "1일 전",
    type: "strategy",
    user: "이전략가",
  },
  { id: 5, factbook: "삼성 갤럭시", action: "팩트북 공유", time: "2일 전", type: "share", user: "박애널리스트" },
]

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const filteredFactbooks = factbooks
    .filter((factbook) => {
      const matchesSearch =
        factbook.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        factbook.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        factbook.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesIndustry = industryFilter === "all" || factbook.industry === industryFilter

      return matchesSearch && matchesIndustry
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case "popular":
          return b.views - a.views
        case "strategies":
          return b.strategiesGenerated - a.strategiesGenerated
        case "alphabetical":
          return a.brandName.localeCompare(b.brandName)
        default:
          return 0
      }
    })

  const totalFactbooks = factbooks.length
  const totalBrands = new Set(factbooks.map((f) => f.brandName)).size
  const totalStrategies = factbooks.reduce((sum, f) => sum + f.strategiesGenerated, 0)
  const totalViews = factbooks.reduce((sum, f) => sum + f.views, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">마케팅 전략 AI 서비스</h1>
                <p className="text-sm text-gray-500">팩트북 라이브러리</p>
              </div>
            </div>
            <Link href="/create-factbook">
              <Button>
                <Plus className="w-4 h-4 mr-2" />새 팩트북 생성
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 팩트북</p>
                  <p className="text-2xl font-bold text-gray-900">{totalFactbooks}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">브랜드 수</p>
                  <p className="text-2xl font-bold text-green-600">{totalBrands}</p>
                </div>
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">생성된 전략</p>
                  <p className="text-2xl font-bold text-purple-600">{totalStrategies}</p>
                </div>
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">총 조회수</p>
                  <p className="text-2xl font-bold text-orange-600">{totalViews}</p>
                </div>
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="팩트북 검색 (브랜드명, 업종, 설명)..."
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

            {/* Factbooks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredFactbooks.map((factbook) => (
                <Card key={factbook.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{factbook.brandName}</CardTitle>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
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
                        <p className="text-sm font-medium">{factbook.strategiesGenerated}개</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">조회수</p>
                        <p className="text-sm font-medium">{factbook.views}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">작성자</p>
                        <p className="text-sm font-medium">{factbook.createdBy}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>생성: {factbook.createdDate}</span>
                        <span>수정: {factbook.lastUpdated}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/strategy-selection?factbook=${factbook.id}`} className="flex-1">
                        <Button size="sm" className="w-full">
                          <Target className="w-3 h-3 mr-1" />
                          전략 생성
                        </Button>
                      </Link>
                      <Link href={`/factbook?id=${factbook.id}`}>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          보기
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

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

          {/* Sidebar */}
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
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  인기 팩트북
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">최근 활동</CardTitle>
                <CardDescription>팀의 최근 팩트북 활동</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{activity.factbook}</p>
                        <p className="text-xs text-gray-500 truncate">{activity.action}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-400">{activity.time}</p>
                          <p className="text-xs text-gray-400">{activity.user}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  모든 활동 보기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
