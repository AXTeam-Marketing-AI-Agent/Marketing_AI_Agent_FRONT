"use client"

import { useState } from "react"
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
} from "lucide-react"

const strategyData = {
  type: "TV 광고 전략",
  objective: "브랜드 인지도 향상 및 신제품 런칭",
  timeline: "3개월 (2024년 2월 - 4월)",
  budget: "50억원",

  creative: {
    concept: "일상 속 특별한 순간을 만드는 스타벅스",
    message: "매일의 소중한 순간, 스타벅스와 함께",
    tone: "따뜻하고 친근하며 감성적인",
    visuals: [
      "다양한 연령대의 고객들이 스타벅스에서 보내는 일상",
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
    schedule: [
      { period: "1주차", activity: "티저 캠페인 시작", channels: ["디지털", "옥외"] },
      { period: "2-4주차", activity: "메인 캠페인 런칭", channels: ["TV", "디지털", "옥외"] },
      { period: "5-8주차", activity: "집중 노출 기간", channels: ["TV", "디지털"] },
      { period: "9-12주차", activity: "마무리 및 효과 측정", channels: ["디지털"] },
    ],
  },

  targeting: {
    primary: "25-40세 여성, 중상위 소득층",
    secondary: "20-25세 대학생 및 사회초년생",
    reach: "타겟 도달률 80% 목표",
    frequency: "평균 노출 빈도 5-7회",
  },

  kpis: [
    { metric: "브랜드 인지도", target: "현재 대비 15% 증가", measurement: "브랜드 트래킹 조사" },
    { metric: "광고 회상률", target: "35% 이상", measurement: "광고 효과 조사" },
    { metric: "매장 방문 증가율", target: "10% 증가", measurement: "매장 데이터 분석" },
    { metric: "SNS 언급량", target: "50% 증가", measurement: "소셜 리스닝" },
  ],

  risks: [
    { risk: "경쟁사 대응 캠페인", mitigation: "차별화된 크리에이티브로 독창성 확보" },
    { risk: "시장 상황 변화", mitigation: "실시간 모니터링 및 유연한 미디어 조정" },
    { risk: "제작 일정 지연", mitigation: "사전 제작 및 백업 플랜 준비" },
  ],
}

const chatMessages = [
  {
    id: 1,
    type: "assistant",
    content:
      "스타벅스 코리아의 TV 광고 전략을 생성했습니다. 어떤 부분에 대해 더 자세히 알고 싶으시거나 수정하고 싶은 부분이 있나요?",
  },
]

export default function StrategyPage() {
  const [messages, setMessages] = useState(chatMessages)
  const [input, setInput] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                돌아가기
              </Button>
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{strategyData.type}</h1>
                  <p className="text-sm text-gray-500">스타벅스 코리아 • 2024-01-15 생성</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
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
                    <p className="text-blue-700 text-sm">{strategyData.objective}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-900">기간</span>
                    </div>
                    <p className="text-green-700 text-sm">{strategyData.timeline}</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span className="font-medium text-purple-900">예산</span>
                    </div>
                    <p className="text-purple-700 text-sm">{strategyData.budget}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span className="font-medium text-orange-900">타겟</span>
                    </div>
                    <p className="text-orange-700 text-sm">{strategyData.targeting.primary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Strategy */}
            <Card>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">크리에이티브</TabsTrigger>
                    <TabsTrigger value="media">미디어 전략</TabsTrigger>
                    <TabsTrigger value="kpis">성과 지표</TabsTrigger>
                    <TabsTrigger value="risks">리스크 관리</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">크리에이티브 컨셉</h3>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-medium text-yellow-900 mb-2">{strategyData.creative.concept}</h4>
                          <p className="text-yellow-700 text-sm mb-3">핵심 메시지: {strategyData.creative.message}</p>
                          <p className="text-yellow-700 text-sm">톤앤매너: {strategyData.creative.tone}</p>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">비주얼 방향성</h3>
                        <div className="space-y-2">
                          {strategyData.creative.visuals.map((visual, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                              <span className="text-gray-700 text-sm">{visual}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-3">미디어 믹스</h3>
                        <div className="space-y-3">
                          {strategyData.media.channels.map((channel, index) => (
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

                      <div>
                        <h3 className="font-semibold mb-3">실행 일정</h3>
                        <div className="space-y-3">
                          {strategyData.media.schedule.map((item, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm">{item.period}</span>
                                <div className="flex space-x-1">
                                  {item.channels.map((channel, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {channel}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600">{item.activity}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-3">타겟팅 전략</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-medium text-purple-900 mb-2">주요 타겟</h4>
                            <p className="text-purple-700 text-sm">{strategyData.targeting.primary}</p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-medium text-purple-900 mb-2">보조 타겟</h4>
                            <p className="text-purple-700 text-sm">{strategyData.targeting.secondary}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">도달률 목표</h4>
                            <p className="text-blue-700 text-sm">{strategyData.targeting.reach}</p>
                          </div>
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900 mb-2">노출 빈도</h4>
                            <p className="text-blue-700 text-sm">{strategyData.targeting.frequency}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="kpis" className="p-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-3">핵심 성과 지표 (KPI)</h3>
                      {strategyData.kpis.map((kpi, index) => (
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

                  <TabsContent value="risks" className="p-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold mb-3">리스크 요인 및 대응 방안</h3>
                      {strategyData.risks.map((risk, index) => (
                        <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                          <h4 className="font-medium text-red-900 mb-2">⚠️ {risk.risk}</h4>
                          <p className="text-red-700 text-sm">
                            <span className="font-medium">대응 방안:</span> {risk.mitigation}
                          </p>
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
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    다른 전략 유형 생성
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Target className="w-4 h-4 mr-2" />
                    타겟 세분화 분석
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    실행 일정 상세화
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <DollarSign className="w-4 h-4 mr-2" />
                    예산 최적화 제안
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
