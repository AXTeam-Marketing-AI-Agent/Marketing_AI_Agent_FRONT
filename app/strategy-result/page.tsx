"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Send,
  Download,
  Share2,
  Target,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  CheckCircle,
  Eye,
  ThumbsUp,
  Copy,
} from "lucide-react"

// Strategy templates for different types
const strategyTemplates = {
  "tv-advertising": {
    title: "TV 광고 전략",
    objective: "브랜드 인지도 향상 및 감성적 연결 강화",
    timeline: "3개월 (2024년 2월 - 4월)",
    budget: "50억원",
    creative: {
      concept: "일상 속 특별한 순간을 만드는 브랜드",
      message: "매일의 소중한 순간, 함께하는 가치",
      tone: "따뜻하고 친근하며 감성적인",
      visuals: [
        "다양한 연령대의 고객들이 브랜드와 함께하는 일상",
        "계절감 있는 따뜻한 색감과 자연스러운 조명",
        "제품보다는 경험과 감정에 초점",
      ],
    },
    media: {
      channels: [
        { name: "TV", allocation: "60%", budget: "30억원", description: "프라임타임 및 주말 집중 편성" },
        { name: "디지털", allocation: "25%", budget: "12.5억원", description: "YouTube, 네이버TV 등" },
        { name: "옥외광고", allocation: "15%", budget: "7.5억원", description: "지하철, 버스정류장 중심" },
      ],
    },
    kpis: [
      { metric: "브랜드 인지도", target: "현재 대비 15% 증가", measurement: "브랜드 트래킹 조사" },
      { metric: "광고 회상률", target: "35% 이상", measurement: "광고 효과 조사" },
      { metric: "매장 방문 증가율", target: "10% 증가", measurement: "매장 데이터 분석" },
    ],
  },
  "performance-marketing": {
    title: "퍼포먼스 마케팅 전략",
    objective: "전환율 최적화 및 ROI 극대화",
    timeline: "6개월 지속 운영",
    budget: "30억원",
    channels: {
      search: { budget: "40%", description: "구글 애즈, 네이버 SA" },
      social: { budget: "35%", description: "페이스북, 인스타그램, 카카오" },
      display: { budget: "25%", description: "GDN, 크리테오, 리타겟팅" },
    },
    targeting: {
      demographics: "25-45세, 중상위 소득층",
      interests: "브랜드 관련 키워드 검색자, 경쟁사 관심고객",
      behavior: "온라인 구매 경험자, 모바일 활성 사용자",
    },
    kpis: [
      { metric: "ROAS", target: "400% 이상", measurement: "광고 플랫폼 데이터" },
      { metric: "전환율", target: "3.5% 이상", measurement: "GA4 분석" },
      { metric: "CPA", target: "50,000원 이하", measurement: "캠페인 성과 데이터" },
    ],
  },
  "sns-content": {
    title: "SNS 콘텐츠 전략",
    objective: "소셜 참여도 증대 및 브랜드 커뮤니티 구축",
    timeline: "3개월 집중 운영",
    budget: "15억원",
    platforms: {
      instagram: { focus: "비주얼 스토리텔링", content: "제품 사진, 라이프스타일, 스토리" },
      tiktok: { focus: "트렌드 콘텐츠", content: "챌린지, 숏폼 영상, 인플루언서 협업" },
      youtube: { focus: "브랜드 스토리", content: "브랜드 다큐, 제품 리뷰, 튜토리얼" },
    },
    contentPlan: [
      { type: "브랜드 스토리", frequency: "주 2회", description: "브랜드 가치와 철학 전달" },
      { type: "제품 소개", frequency: "주 3회", description: "신제품 및 인기 제품 소개" },
      { type: "고객 참여", frequency: "주 2회", description: "이벤트, 챌린지, UGC" },
    ],
    kpis: [
      { metric: "팔로워 증가율", target: "월 20% 증가", measurement: "소셜 미디어 분석" },
      { metric: "참여율", target: "5% 이상", measurement: "좋아요, 댓글, 공유 수" },
      { metric: "브랜드 멘션", target: "50% 증가", measurement: "소셜 리스닝" },
    ],
  },
}

const chatMessages = [
  {
    id: 1,
    type: "assistant",
    content: "전략이 생성되었습니다! 어떤 부분에 대해 더 자세히 알고 싶으시거나 수정하고 싶은 부분이 있나요?",
  },
]

export default function StrategyResultPage() {
  const searchParams = useSearchParams()
  const factbookId = searchParams.get("factbook")
  const strategyType = searchParams.get("strategy") || "tv-advertising"

  const [messages, setMessages] = useState(chatMessages)
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [isGenerating, setIsGenerating] = useState(true)

  const strategy =
    strategyTemplates[strategyType as keyof typeof strategyTemplates] || strategyTemplates["tv-advertising"]

  const factbook = {
    id: factbookId,
    brandName: "스타벅스 코리아",
    industry: "식품/음료",
  }

  useEffect(() => {
    // Simulate strategy generation
    const timer = setTimeout(() => {
      setIsGenerating(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const newMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: input,
    }

    setMessages([...messages, newMessage])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: "assistant" as const,
        content: "네, 좋은 질문입니다. 해당 부분에 대해 더 구체적으로 설명드리겠습니다...",
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleCopyStrategy = () => {
    // Copy strategy to clipboard
    navigator.clipboard.writeText("전략 내용이 클립보드에 복사되었습니다.")
  }

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">전략 생성 중...</h3>
            <p className="text-gray-600 mb-4">AI가 팩트북을 분석하여 맞춤형 {strategy.title}을 생성하고 있습니다.</p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>✓ 팩트북 데이터 분석 완료</p>
              <p>✓ 타겟 고객 분석 완료</p>
              <p className="text-blue-600">⏳ 전략 최적화 중...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  라이브러리로
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{strategy.title}</h1>
                  <p className="text-sm text-gray-500">{factbook.brandName} • 방금 생성됨</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleCopyStrategy}>
                <Copy className="w-4 h-4 mr-2" />
                복사
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                다운로드
              </Button>
              <Button size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                승인
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Success Banner */}
            <Card className="mb-6 bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">전략 생성 완료!</h3>
                    <p className="text-sm text-green-700">
                      {factbook.brandName}의 팩트북을 기반으로 {strategy.title}이 성공적으로 생성되었습니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Strategy Overview */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>전략 개요</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-blue-900">목표</span>
                    </div>
                    <p className="text-blue-700 text-sm">{strategy.objective}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900">기간</span>
                    </div>
                    <p className="text-green-700 text-sm">{strategy.timeline}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-900">예산</span>
                    </div>
                    <p className="text-purple-700 text-sm">{strategy.budget}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span className="font-medium text-orange-900">브랜드</span>
                    </div>
                    <p className="text-orange-700 text-sm">{factbook.brandName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Strategy */}
            <Card>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">핵심 전략</TabsTrigger>
                    <TabsTrigger value="execution">실행 계획</TabsTrigger>
                    <TabsTrigger value="kpis">성과 지표</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6">
                    {strategyType === "tv-advertising" && strategy.creative && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-3">크리에이티브 컨셉</h3>
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <h4 className="font-medium text-yellow-900 mb-2">{strategy.creative.concept}</h4>
                            <p className="text-yellow-700 text-sm mb-3">핵심 메시지: {strategy.creative.message}</p>
                            <p className="text-yellow-700 text-sm">톤앤매너: {strategy.creative.tone}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">비주얼 방향성</h3>
                          <div className="space-y-2">
                            {strategy.creative.visuals.map((visual, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                                <span className="text-gray-700 text-sm">{visual}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {strategyType === "performance-marketing" && "channels" in strategy && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-3">채널별 예산 배분</h3>
                          <div className="space-y-3">
                            {Object.entries(strategy.channels).map(([channel, data]) => (
                              <div key={channel} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium capitalize">{channel}</span>
                                  <Badge variant="secondary">{data.budget}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">{data.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">타겟팅 전략</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(strategy.targeting).map(([key, value]) => (
                              <div key={key} className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-medium text-blue-900 mb-2 capitalize">{key}</h4>
                                <p className="text-blue-700 text-sm">{value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {strategyType === "sns-content" && "platforms" in strategy && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="font-semibold mb-3">플랫폼별 전략</h3>
                          <div className="space-y-3">
                            {Object.entries(strategy.platforms).map(([platform, data]) => (
                              <div key={platform} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium capitalize">{platform}</span>
                                  <Badge variant="outline">{data.focus}</Badge>
                                </div>
                                <p className="text-sm text-gray-600">{data.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold mb-3">콘텐츠 계획</h3>
                          <div className="space-y-3">
                            {strategy.contentPlan.map((plan, index) => (
                              <div key={index} className="p-3 bg-purple-50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-purple-900">{plan.type}</span>
                                  <Badge variant="secondary">{plan.frequency}</Badge>
                                </div>
                                <p className="text-sm text-purple-700">{plan.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="execution" className="p-6">
                    <div className="space-y-6">
                      {strategyType === "tv-advertising" && strategy.media && (
                        <div>
                          <h3 className="font-semibold mb-3">미디어 믹스</h3>
                          <div className="space-y-3">
                            {strategy.media.channels.map((channel, index) => (
                              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium">{channel.name}</span>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="secondary">{channel.allocation}</Badge>
                                    <Badge variant="outline">{channel.budget}</Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600">{channel.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h3 className="font-semibold mb-3">실행 일정</h3>
                        <div className="space-y-3">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">1주차</span>
                              <Badge variant="outline" className="text-xs">
                                준비
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">전략 세부 계획 수립 및 크리에이티브 제작 시작</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">2-4주차</span>
                              <Badge variant="outline" className="text-xs">
                                런칭
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">캠페인 런칭 및 초기 성과 모니터링</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm">5-8주차</span>
                              <Badge variant="outline" className="text-xs">
                                최적화
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">성과 데이터 기반 캠페인 최적화</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="kpis" className="p-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-3">핵심 성과 지표 (KPI)</h3>
                      {strategy.kpis.map((kpi, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{kpi.metric}</h4>
                            <Badge variant="default">{kpi.target}</Badge>
                          </div>
                          <p className="text-sm text-gray-600">측정 방법: {kpi.measurement}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>전략 Q&A</span>
                </CardTitle>
                <CardDescription>전략에 대해 질문하거나 수정 요청을 해보세요</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col">
                {/* Messages */}
                <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.type === "assistant" && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="w-4 h-4" />
                            <span className="font-medium">AI 어시스턴트</span>
                          </div>
                        )}
                        <p>{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="질문을 입력하세요..."
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button size="sm" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">빠른 실행</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href={`/strategy-selection?factbook=${factbookId}`}>
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <Target className="w-4 h-4 mr-2" />
                      다른 전략 생성
                    </Button>
                  </Link>
                  <Link href={`/factbook?id=${factbookId}`}>
                    <Button variant="outline" className="w-full justify-start text-sm">
                      <Eye className="w-4 h-4 mr-2" />
                      팩트북 보기
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    전략 평가
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    성과 예측
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Strategy Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">전략 정보</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">생성 시간</span>
                    <span className="font-medium">방금 전</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">기반 팩트북</span>
                    <span className="font-medium">{factbook.brandName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">전략 유형</span>
                    <Badge variant="secondary">{strategy.title}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">상태</span>
                    <Badge className="bg-green-100 text-green-800">생성 완료</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
