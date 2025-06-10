"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Edit3,
  Save,
  Share2,
  Download,
  Building2,
  Users,
  Target,
  TrendingUp,
  Lightbulb,
  BarChart3,
  MessageSquare,
  Eye,
  ChevronRight,
  ChevronDown,
  Calendar,
  FileText,
  History,
  BarChart2,
  Award,
  User,
  AlertTriangle,
  PieChart,
  TrendingDown,
  Briefcase,
} from "lucide-react"

// 계층적 목차 구조 정의
const factbookSections = [
  {
    id: "company",
    title: "회사 및 브랜드 소개",
    icon: Building2,
    subsections: [
      { id: "company-overview", title: "개요" },
      { id: "company-history", title: "연혁" },
      { id: "company-performance", title: "실적" },
      { id: "company-services", title: "서비스/특장점" },
      { id: "company-people", title: "주요 인물" },
    ],
  },
  {
    id: "issues",
    title: "주요이슈",
    icon: TrendingUp,
    subsections: [
      { id: "issues-trends", title: "사업 동향" },
      { id: "issues-interviews", title: "주요 인물 인터뷰" },
      { id: "issues-negative", title: "부정 이슈" },
    ],
  },
  {
    id: "consumer",
    title: "소비자반응",
    icon: Users,
    subsections: [{ id: "consumer-social", title: "소셜 분석" }],
  },
  {
    id: "market",
    title: "시장분석",
    icon: BarChart3,
    subsections: [
      { id: "market-current", title: "시장 현황" },
      { id: "market-trends", title: "시장 트렌드" },
    ],
  },
  {
    id: "competitors",
    title: "경쟁사분석",
    icon: Target,
    subsections: [
      { id: "competitors-overview", title: "회사 소개" },
      { id: "competitors-products", title: "브랜드/제품 특징" },
      { id: "competitors-consumer", title: "소비자 반응" },
      { id: "competitors-issues", title: "주요 이슈" },
    ],
  },
  {
    id: "communication",
    title: "자사커뮤니케이션",
    icon: MessageSquare,
    subsections: [
      { id: "communication-channels", title: "커뮤니케이션 채널" },
      { id: "communication-ads", title: "광고물" },
    ],
  },
  {
    id: "competitor-communication",
    title: "경쟁사커뮤니케이션",
    icon: Lightbulb,
    subsections: [
      { id: "competitor-communication-channels", title: "커뮤니케이션 채널" },
      { id: "competitor-communication-ads", title: "광고물" },
    ],
  },
]

// 생성된 전략 데이터
const generatedStrategies = [
  {
    id: 1,
    type: "TV 광고 전략",
    createdDate: "2024-01-15",
    createdBy: "김마케터",
    status: "완료",
    description: "브랜드 인지도 향상을 위한 TV 광고 캠페인 전략",
  },
  {
    id: 2,
    type: "SNS 콘텐츠 전략",
    createdDate: "2024-01-12",
    createdBy: "김마케터",
    status: "완료",
    description: "MZ세대 타겟 소셜미디어 마케팅 전략",
  },
  {
    id: 3,
    type: "퍼포먼스 마케팅",
    createdDate: "2024-01-10",
    createdBy: "김마케터",
    status: "완료",
    description: "ROI 최적화 중심의 디지털 마케팅 전략",
  },
]

const factbookData = {
  company: {
    overview: {
      name: "스타벅스 코리아",
      industry: "식품/음료",
      founded: "1999년",
      description:
        "전 세계적으로 사랑받는 프리미엄 커피 브랜드로, 한국에서는 1999년 첫 매장을 오픈한 이후 지속적인 성장을 이어가고 있습니다.",
      vision: "사람과 사람을 연결하고, 커뮤니티를 만들어가는 제3의 공간을 제공",
    },
    history: [
      { year: "1999", event: "한국 1호점 이대앞점 오픈" },
      { year: "2003", event: "100호점 돌파" },
      { year: "2010", event: "500호점 돌파, 리저브 매장 도입" },
      { year: "2018", event: "1,000호점 돌파" },
      { year: "2023", event: "1,700호점 달성, 국내 최대 커피 체인" },
    ],
    performance: {
      revenue: "약 2조원 (2023년)",
      stores: "1,700개 매장",
      marketShare: "국내 커피전문점 시장 1위 (약 30%)",
      employees: "약 20,000명",
    },
    services: [
      "프리미엄 커피 및 음료",
      "디저트 및 푸드",
      "원두 및 커피용품 판매",
      "사이렌 오더 (모바일 주문)",
      "스타벅스 리워드 프로그램",
      "기업 케이터링 서비스",
    ],
    keyPeople: [
      { name: "송호섭", position: "대표이사", background: "전 맥도날드 코리아 대표" },
      { name: "이승환", position: "마케팅 총괄", background: "브랜드 전략 및 디지털 마케팅 전문" },
    ],
  },
  issues: {
    businessTrends: [
      "ESG 경영 강화 - 친환경 매장 확대 및 일회용품 사용 줄이기",
      "디지털 전환 가속화 - 사이렌 오더 이용률 70% 돌파",
      "프리미엄 시장 확대 - 리저브 매장 및 고급 원두 라인 강화",
      "지역 특화 메뉴 개발 - 한국 고객 취향에 맞춘 음료 출시",
    ],
    interviews: [
      {
        person: "송호섭 대표",
        content: "한국 시장의 특수성을 이해하고 현지화된 서비스를 제공하는 것이 성공의 핵심",
        date: "2024-01-10",
      },
      {
        person: "이승환 마케팅 총괄",
        content: "MZ세대 고객과의 소통을 위해 디지털 플랫폼 중심의 마케팅 전략을 강화하고 있음",
        date: "2024-01-05",
      },
    ],
    negativeIssues: [
      {
        issue: "일회용품 사용 논란",
        description: "환경단체의 일회용 컵 사용 지적",
        response: "2025년까지 일회용 컵 사용량 50% 감축 목표 발표",
        impact: "중간",
      },
      {
        issue: "가격 인상 논란",
        description: "원자재 가격 상승으로 인한 메뉴 가격 인상",
        response: "고품질 원두 사용과 서비스 향상으로 가치 제공 강조",
        impact: "낮음",
      },
    ],
  },
  consumer: {
    socialAnalysis: {
      sentiment: "긍정 75%, 중립 20%, 부정 5%",
      platforms: {
        instagram: { mentions: "월 15,000건", sentiment: "긍정 80%" },
        twitter: { mentions: "월 8,000건", sentiment: "긍정 70%" },
        youtube: { mentions: "월 3,000건", sentiment: "긍정 85%" },
      },
      insights: [
        "신메뉴 출시 시 SNS 화제성 높음",
        "매장 인테리어와 분위기에 대한 긍정적 반응",
        "가격 대비 품질에 대한 만족도 높음",
        "친환경 활동에 대한 관심과 지지 증가",
      ],
    },
  },
  market: {
    current: {
      size: "약 7조원 (2023년 기준)",
      growth: "연평균 5.2% 성장",
      segments: [
        { name: "커피전문점", share: "45%", growth: "6%" },
        { name: "편의점 커피", share: "30%", growth: "8%" },
        { name: "카페", share: "25%", growth: "3%" },
      ],
    },
    trends: [
      "프리미엄 커피 시장 확대 - 고급 원두와 특별한 경험 추구",
      "홈카페 문화 확산 - 집에서 즐기는 커피 문화 성장",
      "친환경 제품 선호도 증가 - 지속가능한 제품에 대한 관심",
      "디지털 주문 서비스 확산 - 비대면 주문 및 픽업 서비스",
      "개인화 서비스 확대 - 고객 취향에 맞춘 맞춤형 서비스",
    ],
  },
  competitors: [
    {
      name: "투썸플레이스",
      overview: "CJ그룹 계열의 프리미엄 카페 브랜드",
      marketShare: "15%",
      strengths: ["디저트 특화", "프리미엄 인테리어", "케이크 전문성"],
      products: ["핸드드립 커피", "시그니처 케이크", "브런치 메뉴"],
      consumerReaction: "디저트 품질에 대한 높은 평가, 가격 부담 지적",
      issues: ["매장 수 확장 속도", "브랜드 차별화 필요성"],
    },
    {
      name: "이디야커피",
      overview: "합리적 가격의 대중적 커피 브랜드",
      marketShare: "12%",
      strengths: ["가격 경쟁력", "접근성", "빠른 확장"],
      products: ["아메리카노", "라떼", "간단한 디저트"],
      consumerReaction: "가성비에 대한 만족, 매장 분위기 아쉬움",
      issues: ["프리미엄 이미지 부족", "매장 표준화 필요"],
    },
    {
      name: "커피빈",
      overview: "미국 발 프리미엄 커피 브랜드",
      marketShare: "8%",
      strengths: ["프리미엄 포지셔닝", "아이스블렌디드", "브랜드 헤리티지"],
      products: ["아이스블렌디드", "프리미엄 원두", "시즌 메뉴"],
      consumerReaction: "음료 품질 인정, 매장 수 부족 아쉬움",
      issues: ["시장 점유율 하락", "매장 확장 전략"],
    },
  ],
  communication: {
    channels: [
      {
        type: "디지털",
        platforms: ["공식 웹사이트", "모바일 앱", "인스타그램", "유튜브", "페이스북"],
        strategy: "MZ세대 중심의 소셜미디어 마케팅",
      },
      {
        type: "오프라인",
        platforms: ["매장 내 디스플레이", "옥외광고", "지하철 광고"],
        strategy: "프리미엄 브랜드 이미지 강화",
      },
      {
        type: "이벤트",
        platforms: ["시즌 프로모션", "신메뉴 런칭", "콜라보레이션"],
        strategy: "고객 참여형 마케팅",
      },
    ],
    ads: [
      {
        name: "2024 스프링 시즌 광고",
        type: "TV 광고",
        concept: "봄의 시작, 새로운 만남",
        url: "https://example.com/ad1",
      },
      {
        name: "사이렌 오더 프로모션",
        type: "디지털 광고",
        concept: "편리함의 새로운 기준",
        url: "https://example.com/ad2",
      },
    ],
  },
  competitorCommunication: {
    channels: {
      twosome: {
        channels: ["TV 광고", "인스타그램", "매장 프로모션"],
        strategy: "디저트 전문성과 프리미엄 경험 강조",
      },
      ediya: {
        channels: ["라디오", "지하철 광고", "배달앱 프로모션"],
        strategy: "합리적 가격과 접근성 강조",
      },
      coffeebean: {
        channels: ["매거진 광고", "인플루언서 마케팅"],
        strategy: "프리미엄 원두와 브랜드 헤리티지 강조",
      },
    },
    ads: {
      twosome: [
        { name: "케이크 장인 스토리", type: "브랜드 영상", url: "https://example.com/twosome1" },
        { name: "프리미엄 디저트 라인", type: "제품 광고", url: "https://example.com/twosome2" },
      ],
      ediya: [
        { name: "가성비 아메리카노", type: "라디오 광고", url: "https://example.com/ediya1" },
        { name: "동네 카페 컨셉", type: "지하철 광고", url: "https://example.com/ediya2" },
      ],
      coffeebean: [
        { name: "아이스블렌디드 시그니처", type: "매거진 광고", url: "https://example.com/coffeebean1" },
        { name: "원두 스토리텔링", type: "인플루언서 콘텐츠", url: "https://example.com/coffeebean2" },
      ],
    },
  },
}

export default function FactbookPage() {
  const searchParams = useSearchParams()
  const factbookId = searchParams.get("id")
  const brandName = searchParams.get("brand")

  const [currentSection, setCurrentSection] = useState("company-overview")
  const [expandedSections, setExpandedSections] = useState<string[]>(["company"])
  const [isEditing, setIsEditing] = useState(false)
  const [showStrategies, setShowStrategies] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0.1,
      },
    )

    // 모든 섹션 요소를 관찰
    factbookSections.forEach((section) => {
      section.subsections.forEach((subsection) => {
        const element = document.getElementById(subsection.id)
        if (element) {
          observer.observe(element)
        }
      })
    })

    return () => observer.disconnect()
  }, [])

  const toggleSection = (sectionId: string) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter((id) => id !== sectionId))
    } else {
      setExpandedSections([...expandedSections, sectionId])
    }
  }

  const handleSectionClick = (sectionId: string, subsectionId: string) => {
    const element = document.getElementById(subsectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }

    if (!expandedSections.includes(sectionId)) {
      setExpandedSections([...expandedSections, sectionId])
    }
  }

  const getSubsectionIcon = (subsectionId: string) => {
    const iconMap: Record<string, any> = {
      "company-overview": Building2,
      "company-history": History,
      "company-performance": BarChart2,
      "company-services": Award,
      "company-people": User,
      "issues-trends": TrendingUp,
      "issues-interviews": MessageSquare,
      "issues-negative": AlertTriangle,
      "consumer-social": Users,
      "market-current": PieChart,
      "market-trends": TrendingDown,
      "competitors-overview": Briefcase,
      "competitors-products": Award,
      "competitors-consumer": Users,
      "competitors-issues": AlertTriangle,
      "communication-channels": MessageSquare,
      "communication-ads": FileText,
      "competitor-communication-channels": MessageSquare,
      "competitor-communication-ads": FileText,
    }

    return iconMap[subsectionId] || BookOpen
  }

  const renderAllContent = () => {
    return (
      <div className="space-y-12">
        {/* 회사 및 브랜드 소개 */}
        <section id="company-overview" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">개요</h2>
          </div>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">기본 정보</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">브랜드명:</span> {factbookData.company.overview.name}
                </div>
                <div>
                  <span className="font-medium">업종:</span> {factbookData.company.overview.industry}
                </div>
                <div>
                  <span className="font-medium">설립:</span> {factbookData.company.overview.founded}
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">브랜드 설명</h4>
              <p className="text-gray-700">{factbookData.company.overview.description}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">비전</h4>
              <p className="text-gray-700">{factbookData.company.overview.vision}</p>
            </div>
          </div>
        </section>

        {/* 회사 및 브랜드 소개 - 연혁 */}
        <section id="company-history" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <History className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">연혁</h2>
          </div>
          <div className="space-y-3">
            {factbookData.company.history.map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <Badge variant="outline">{item.year}</Badge>
                <span className="text-gray-700 text-sm">{item.event}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 회사 및 브랜드 소개 - 실적 */}
        <section id="company-performance" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <BarChart2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">실적</h2>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">2023년 실적</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">매출:</span> {factbookData.company.performance.revenue}
              </div>
              <div>
                <span className="font-medium">매장 수:</span> {factbookData.company.performance.stores}
              </div>
              <div>
                <span className="font-medium">시장점유율:</span> {factbookData.company.performance.marketShare}
              </div>
              <div>
                <span className="font-medium">직원 수:</span> {factbookData.company.performance.employees}
              </div>
            </div>
          </div>
        </section>

        {/* 회사 및 브랜드 소개 - 서비스/특장점 */}
        <section id="company-services" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">서비스/특장점</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {factbookData.company.services.map((service, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700 text-sm">{service}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 회사 및 브랜드 소개 - 주요 인물 */}
        <section id="company-people" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <User className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">주요 인물</h2>
          </div>
          <div className="space-y-3">
            {factbookData.company.keyPeople.map((person, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{person.name}</span>
                  <Badge variant="secondary">{person.position}</Badge>
                </div>
                <p className="text-sm text-gray-600">{person.background}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 주요이슈 - 사업 동향 */}
        <section id="issues-trends" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">사업 동향</h2>
          </div>
          <div className="space-y-2">
            {factbookData.issues.businessTrends.map((trend, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <span className="text-gray-700 text-sm">{trend}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 주요이슈 - 주요 인물 인터뷰 */}
        <section id="issues-interviews" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquare className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">주요 인물 인터뷰</h2>
          </div>
          <div className="space-y-4">
            {factbookData.issues.interviews.map((interview, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-blue-900">{interview.person}</span>
                  <span className="text-xs text-blue-600">{interview.date}</span>
                </div>
                <p className="text-blue-700 text-sm">"{interview.content}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* 주요이슈 - 부정 이슈 */}
        <section id="issues-negative" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">부정 이슈</h2>
          </div>
          <div className="space-y-4">
            {factbookData.issues.negativeIssues.map((issue, index) => (
              <div key={index} className="p-4 border border-red-200 bg-red-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-red-900">{issue.issue}</h4>
                  <Badge
                    variant={
                      issue.impact === "높음" ? "destructive" : issue.impact === "중간" ? "default" : "secondary"
                    }
                  >
                    {issue.impact}
                  </Badge>
                </div>
                <p className="text-red-700 text-sm mb-2">{issue.description}</p>
                <p className="text-red-600 text-sm">
                  <span className="font-medium">대응:</span> {issue.response}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 소비자반응 - 소셜 분석 */}
        <section id="consumer-social" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">소셜 분석</h2>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">전체 감성 분석</h4>
                <p className="text-green-700 text-sm">{factbookData.consumer.socialAnalysis.sentiment}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">플랫폼별 분석</h4>
              {Object.entries(factbookData.consumer.socialAnalysis.platforms).map(([platform, data]) => (
                <div key={platform} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium capitalize">{platform}</span>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {data.mentions}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {data.sentiment}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">주요 인사이트</h4>
              <div className="space-y-2">
                {factbookData.consumer.socialAnalysis.insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <span className="text-gray-700 text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 시장분석 - 시장 현황 */}
        <section id="market-current" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <PieChart className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">시장 현황</h2>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">시장 규모</h4>
                <p className="text-2xl font-bold text-blue-700">{factbookData.market.current.size}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">성장률</h4>
                <p className="text-2xl font-bold text-green-700">{factbookData.market.current.growth}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">시장 세분화</h4>
              <div className="space-y-3">
                {factbookData.market.current.segments.map((segment, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{segment.name}</span>
                      <div className="flex space-x-2">
                        <Badge variant="secondary">점유율 {segment.share}</Badge>
                        <Badge variant="outline">성장률 {segment.growth}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 시장분석 - 시장 트렌드 */}
        <section id="market-trends" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <TrendingDown className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-bold text-gray-900">시장 트렌드</h2>
          </div>
          <div className="space-y-2">
            {factbookData.market.trends.map((trend, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span className="text-gray-700 text-sm">{trend}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 경쟁사분석 섹션들 */}
        <section id="competitors-overview" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <Briefcase className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">회사 소개</h2>
          </div>
          {factbookData.competitors.map((competitor, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{competitor.name}</h3>
                <Badge variant="secondary">시장점유율 {competitor.marketShare}</Badge>
              </div>
              <p className="text-gray-700 text-sm">{competitor.overview}</p>
            </div>
          ))}
        </section>

        <section id="competitors-products" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <Award className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">브랜드/제품 특징</h2>
          </div>
          {factbookData.competitors.map((competitor, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{competitor.name}</h3>
              </div>
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">강점</h4>
                <div className="flex flex-wrap gap-1">
                  {competitor.strengths.map((strength, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">주요 제품/서비스</h4>
                <div className="space-y-1">
                  {competitor.products.map((product, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-600 text-sm">{product}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section id="competitors-consumer" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <Users className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">소비자 반응</h2>
          </div>
          {factbookData.competitors.map((competitor, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{competitor.name}</h3>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">소비자 반응</h4>
                <p className="text-gray-700 text-sm">{competitor.consumerReaction}</p>
              </div>
            </div>
          ))}
        </section>

        <section id="competitors-issues" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <h2 className="text-2xl font-bold text-gray-900">주요 이슈</h2>
          </div>
          {factbookData.competitors.map((competitor, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{competitor.name}</h3>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">주요 이슈</h4>
                <div className="flex flex-wrap gap-1">
                  {competitor.issues.map((issue, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs bg-yellow-50">
                      {issue}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* 자사커뮤니케이션 섹션들 */}
        <section id="communication-channels" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquare className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">커뮤니케이션 채널</h2>
          </div>
          <div className="space-y-4">
            {factbookData.communication.channels.map((channel, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{channel.type}</h4>
                <div className="mb-2">
                  <div className="flex flex-wrap gap-1">
                    {channel.platforms.map((platform, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{channel.strategy}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="communication-ads" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">광고물</h2>
          </div>
          <div className="space-y-4">
            {factbookData.communication.ads.map((ad, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-blue-900">{ad.name}</h4>
                  <Badge variant="outline">{ad.type}</Badge>
                </div>
                <p className="text-blue-700 text-sm mb-2">컨셉: {ad.concept}</p>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    광고 보기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 경쟁사커뮤니케이션 섹션들 */}
        <section id="competitor-communication-channels" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquare className="w-6 h-6 text-pink-600" />
            <h2 className="text-2xl font-bold text-gray-900">경쟁사 커뮤니케이션 채널</h2>
          </div>
          {Object.entries(factbookData.competitorCommunication.channels).map(([competitor, data]) => (
            <div key={competitor} className="p-4 border border-gray-200 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-3 capitalize">
                {competitor === "twosome" ? "투썸플레이스" : competitor === "ediya" ? "이디야커피" : "커피빈"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">주요 채널</h4>
                  <div className="flex flex-wrap gap-1">
                    {data.channels.map((channel, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">전략</h4>
                  <p className="text-gray-700 text-sm">{data.strategy}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section id="competitor-communication-ads" className="scroll-mt-8">
          <div className="flex items-center space-x-3 mb-6">
            <FileText className="w-6 h-6 text-pink-600" />
            <h2 className="text-2xl font-bold text-gray-900">경쟁사 광고물</h2>
          </div>
          {Object.entries(factbookData.competitorCommunication.ads).map(([competitor, ads]) => (
            <div key={competitor} className="p-4 border border-gray-200 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-3 capitalize">
                {competitor === "twosome" ? "투썸플레이스" : competitor === "ediya" ? "이디야커피" : "커피빈"}
              </h3>
              <div className="space-y-3">
                {ads.map((ad, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{ad.name}</span>
                      <Badge variant="outline">{ad.type}</Badge>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="w-3 h-3 mr-1" />
                        광고 보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
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
                  돌아가기
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {brandName || factbookData.company.overview.name} 팩트북
                  </h1>
                  <p className="text-sm text-gray-500">2024-01-15 생성</p>
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
              <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? "완료" : "편집"}
              </Button>
              <Button size="sm">
                <Save className="w-4 h-4 mr-2" />
                저장
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">목차</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {factbookSections.map((section) => {
                      const Icon = section.icon
                      const isExpanded = expandedSections.includes(section.id)

                      return (
                        <div key={section.id}>
                          <button
                            onClick={() => toggleSection(section.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                              section.id === "company" ? "text-gray-700" : "text-gray-700"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{section.title}</span>
                            </div>
                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          </button>

                          {isExpanded && (
                            <div className="pl-4 pr-2 pb-1">
                              {section.subsections.map((subsection) => {
                                const SubIcon = getSubsectionIcon(subsection.id)
                                return (
                                  <button
                                    key={subsection.id}
                                    onClick={() => handleSectionClick(section.id, subsection.id)}
                                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors rounded-md ${
                                      currentSection === subsection.id
                                        ? "bg-blue-50 text-blue-700 font-medium"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    <SubIcon className="w-3 h-3" />
                                    <span>{subsection.title}</span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">다음 단계</CardTitle>
                </CardHeader>
                <CardContent>
                  <Link href={`/strategy-selection?factbook=${factbookId}`}>
                    <Button className="w-full">
                      전략 생성하기
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* 생성된 전략 목록 */}
              <Card className="mt-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">생성된 전략</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowStrategies(!showStrategies)}
                      className="p-1"
                    >
                      {showStrategies ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                  </div>
                </CardHeader>
                {showStrategies && (
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {generatedStrategies.map((strategy) => (
                        <div
                          key={strategy.id}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-gray-900">{strategy.type}</h4>
                              <p className="text-xs text-gray-600 mt-1">{strategy.description}</p>
                            </div>
                            <Badge variant="secondary" className="text-xs ml-2">
                              {strategy.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{strategy.createdDate}</span>
                            </div>
                            <span>{strategy.createdBy}</span>
                          </div>
                          <div className="mt-2 flex space-x-2">
                            <Link
                              href={`/strategy-result?factbook=${factbookId}&strategy=${strategy.type.toLowerCase().replace(/\s+/g, "-")}`}
                            >
                              <Button size="sm" variant="outline" className="text-xs h-7">
                                <Eye className="w-3 h-3 mr-1" />
                                보기
                              </Button>
                            </Link>
                            <Button size="sm" variant="outline" className="text-xs h-7">
                              <FileText className="w-3 h-3 mr-1" />
                              복사
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {(() => {
                      const SubIcon = getSubsectionIcon(currentSection)
                      return <SubIcon className="w-5 h-5 text-blue-600" />
                    })()}
                    <div>
                      <CardTitle>
                        {
                          factbookSections.find((s) =>
                            s.subsections.find((sub) => sub.id === currentSection) ? s.id === s.id : null,
                          )?.title
                        }{" "}
                        -
                        {
                          factbookSections
                            .find((s) =>
                              s.subsections.find((sub) => sub.id === currentSection) ? s.id === s.id : null,
                            )
                            ?.subsections.find((sub) => sub.id === currentSection)?.title
                        }
                      </CardTitle>
                    </div>
                  </div>
                  {isEditing && <Badge variant="secondary">편집 모드</Badge>}
                </div>
              </CardHeader>
              <CardContent>{renderAllContent()}</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
