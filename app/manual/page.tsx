"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Target, FileText, Lightbulb, ChevronRight, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

// 매뉴얼 섹션 정의
const MANUAL_SECTIONS = {
  factbook: {
    title: "팩트북 생성",
    icon: FileText,
    subsections: [
      { id: "create", title: "새 팩트북 생성" },
      { id: "basic-info", title: "기본 정보 입력" },
      { id: "sections", title: "팩트북 데이터 확인" },
      { id: "citations", title: "출처 정보 확인" },
      { id: "insights", title: "AI 인사이트 활용" },
      { id: "related-strategies", title: "생성된 전략 확인" },
    ]
  },
  strategy: {
    title: "전략 생성",
    icon: Target,
    subsections: [
      { id: "select-type", title: "전략 유형 선택" },
      { id: "generation", title: "전략 생성 과정" },
      { id: "result", title: "결과 확인" },
      { id: "chat", title: "전략 채팅 활용" },
    ]
  },
  features: {
    title: "주요 기능",
    icon: Lightbulb,
    subsections: [
      { id: "search", title: "검색 및 필터" },
      { id: "activities", title: "최근 활동" },
    ]
  },
  security: {
    title: "보안 인증",
    icon: AlertCircle,
    subsections: [
      { id: "access", title: "보안 코드 입력" },
    ]
  }
}

// 스크린샷 컴포넌트
function Screenshot({ description, imagePath }: { description: string; imagePath?: string }) {
  if (imagePath) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-[16/9] bg-white relative">
          <Image
            src={imagePath}
            alt={description}
            fill
            quality={100}
            priority
            className="object-contain"
            // sizes="(min-width: 1280px) 32rem, (min-width: 1024px) 28rem, (min-width: 768px) 24rem, 20rem"
          />
        </div>
        {/* <div className="p-2 bg-gray-50 text-xs text-gray-600 text-center border-t border-gray-100">
          {description}
        </div> */}
      </div>
    )
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="aspect-[16/9] bg-gray-100 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          📷 {description}
        </div>
      </div>
      <div className="p-2 bg-gray-50 text-xs text-gray-600 text-center border-t border-gray-100">
        스크린샷 준비 중
      </div>
    </div>
  )
}

// 섹션 설명 컴포넌트
function SectionDescription({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-20 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{description}</p>
      </div>
      {children}
    </div>
  )
}

export default function ManualPage() {
  const [activeSection, setActiveSection] = useState("factbook")
  const [activeSubsection, setActiveSubsection] = useState("create")
  const [expandedSections, setExpandedSections] = useState<string[]>(["factbook"])
  const observerRef = useRef<IntersectionObserver | null>(null)

  // 디버깅용 로그
  useEffect(() => {
    console.log('Current active:', activeSection, activeSubsection)
  }, [activeSection, activeSubsection])

  // Intersection Observer 설정
  useEffect(() => {
    const callback = (entries: IntersectionObserverEntry[]) => {
      // 현재 화면에 보이는 섹션들 중에서 가장 많이 보이는 것 찾기
      const visibleEntries = entries.filter(entry => entry.isIntersecting)
      
      if (visibleEntries.length > 0) {
        // 가장 많이 보이는 엔트리 선택
        const mostVisible = visibleEntries.reduce((prev, current) => 
          prev.intersectionRatio > current.intersectionRatio ? prev : current
        )
        
        const targetId = (mostVisible.target as Element).id
        const [section, subsection] = targetId.split("-")
        console.log('Active section changed:', section, subsection) // 디버깅용
        setActiveSection(section)
        setActiveSubsection(subsection)
      }
    }

    observerRef.current = new IntersectionObserver(callback, {
      threshold: [0.1, 0.3, 0.5, 0.7, 0.9], // 여러 임계값 설정
      rootMargin: "-100px 0px -50% 0px" // 상단 100px, 하단 50% 여백
    })

    // DOM이 로드된 후 observer 추가
    setTimeout(() => {
      Object.entries(MANUAL_SECTIONS).forEach(([sectionKey, section]) => {
        section.subsections.forEach((subsection) => {
          const element = document.getElementById(`${sectionKey}-${subsection.id}`)
          if (element) {
            observerRef.current?.observe(element)
            console.log('Observing:', `${sectionKey}-${subsection.id}`) // 디버깅용
          }
        })
      })
    }, 100)

    return () => observerRef.current?.disconnect()
  }, [])

  // activeSection이 변경될 때 자동으로 해당 섹션 펼치기
  useEffect(() => {
    if (activeSection && !expandedSections.includes(activeSection)) {
      setExpandedSections(prev => [...prev, activeSection])
    }
  }, [activeSection])

  // 섹션 클릭 시 스크롤
  const scrollToSection = (sectionKey: string, subsectionId: string) => {
    const element = document.getElementById(`${sectionKey}-${subsectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // 섹션 토글 함수
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionKey)
        ? prev.filter(s => s !== sectionKey)
        : [...prev, sectionKey]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더는 동일 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
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
                <p className="text-sm text-gray-500">서비스 가이드북</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-gray-400 hover:text-gray-600 transition-colors font-semibold flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                서비스 가이드북
              </div>
              <Link href="/" prefetch={true} className="text-gray-400 hover:text-gray-600 transition-colors font-semibold">
                팩트북 라이브러리
              </Link>
              <Link href="/strategy-library" prefetch={true} className="text-gray-400 hover:text-gray-600 transition-colors font-semibold">
                전략 라이브러리
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 왼쪽 사이드바 네비게이션 */}
        <div className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
          <nav className="p-4">
            {Object.entries(MANUAL_SECTIONS).map(([key, section]) => {
              const Icon = section.icon
              const isExpanded = expandedSections.includes(key)
              const isActive = activeSection === key

              return (
                <div key={key} className="mb-6">
                  <button
                    onClick={() => toggleSection(key)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg relative",
                      isActive
                        ? "bg-blue-50 text-blue-700 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50",
                      "before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:rounded-r-full",
                      isActive
                        ? "before:bg-blue-500"
                        : "before:bg-transparent"
                    )}
                  >
                    <div className="flex items-center">
                      <Icon className="w-4 h-4 mr-2" />
                      {section.title}
                    </div>
                    <ChevronRight 
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded ? "rotate-90" : ""
                      )} 
                    />
                  </button>
                  <div 
                    className={cn(
                      "mt-2 ml-4 space-y-1 overflow-hidden transition-all duration-200",
                      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    {section.subsections.map((subsection) => (
                      <button
                        key={subsection.id}
                        onClick={() => scrollToSection(key, subsection.id)}
                        className={cn(
                          "w-full text-left px-4 py-2 text-sm rounded-lg relative",
                          isActive && activeSubsection === subsection.id
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50",
                          "hover:bg-gray-50"
                        )}
                      >
                        {subsection.title}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </nav>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* 팩트북 생성 섹션 */}
            <div>
              <h1 className="text-3xl font-bold mb-8">팩트북 생성</h1>
              <div className="space-y-16">
                <SectionDescription
                  id="factbook-create"
                  title="새 팩트북 생성"
                  description="팩트북 라이브러리에서 새로운 팩트북을 생성하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 팩트북 라이브러리 접속</h3>
                      <Screenshot description="스크린샷: 팩트북 라이브러리 메인 화면" imagePath="/guidebook/factbook-library.png" />
                      <p className="text-sm text-gray-600 mt-2">
                        상단 네비게이션에서 "팩트북 라이브러리"를 선택하거나, 메인 화면에서 "새 팩트북 생성" 버튼을 클릭합니다.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">2. 새 팩트북 버튼 클릭</h3>
                      <Screenshot description="스크린샷: 새 팩트북 생성 버튼" imagePath="/guidebook/create-factbook-button.png"/>
                      <p className="text-sm text-gray-600 mt-2">
                        화면 우측의 "빠른 실행" 카드에서 "새 팩트북 생성" 버튼을 클릭합니다.
                      </p>
                    </div>

                    <Card className="p-4 bg-yellow-50 border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">주의사항</h4>
                      <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                        <li>팩트북 생성은 3-5분 정도 소요됩니다</li>
                        <li>브랜드명은 정확하게 입력해주세요</li>
                      </ul>
                    </Card>
                  </div>
                </SectionDescription>

                <SectionDescription
                  id="factbook-basic-info"
                  title="기본 정보 입력"
                  description="팩트북 생성에 필요한 기본 정보를 입력하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 브랜드 정보 입력</h3>
                      <Screenshot description="스크린샷: 브랜드 정보 입력 폼" imagePath="/guidebook/brand-info-form.png" />
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-2 mt-2">
                        <li>브랜드명: 정확한 브랜드명을 입력합니다</li>
                        <li>업종: 드롭다운에서 해당하는 업종을 선택합니다</li>
                        <li>설명: 해당 항목은 AI가 참고하지 않으며, 메모용으로 간단한 설명을 입력할 수 있습니다. (선택사항) 
                        </li>
                      </ul>
                    </div>
                  </div>
                </SectionDescription>

                <SectionDescription
                  id="factbook-sections"
                  title="팩트북 데이터 확인"
                  description="생성된 팩트북의 데이터를 확인하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 목차를 통한 빠른 이동</h3>
                      <Screenshot description="스크린샷: 팩트북 목차 네비게이션" imagePath="/guidebook/section-navigation.png" />
                      <div className="space-y-4 mt-2">
                        <div>
                          <h4 className="font-semibold mb-2">📋 팩트북 구성 (7개 섹션)</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                            <li>회사 및 브랜드 소개</li>
                            <li>주요 이슈</li>
                            <li>소비자 반응</li>
                            <li>시장 분석</li>
                            <li>경쟁사 분석</li>
                            <li>자사 커뮤니케이션</li>
                            <li>경쟁사 커뮤니케이션</li>
                          </ul>
                        </div>
                        <Card className="p-4 bg-blue-50 border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">💡 빠른 이동 팁</h4>
                          <p className="text-sm text-blue-700">
                            왼쪽 목차에서 원하는 섹션을 클릭하면 해당 화면으로 즉시 이동할 수 있습니다.
                          </p>
                        </Card>
                      </div>
                    </div>

                    <SectionDescription
                      id="factbook-citations"
                      title="출처 정보 확인"
                      description="팩트북 내 데이터의 출처를 확인하고 활용하는 방법을 안내합니다."
                    >
                      <div className="space-y-8">
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900">1. 출처 정보 확인하기</h3>
                          <Screenshot description="스크린샷: 출처 링크 클릭 화면" imagePath="/guidebook/section-detail-data.png" />
                          <div className="space-y-4 mt-2">
                            <div>
                              <h4 className="font-semibold mb-2">🔗 출처 링크 활용법</h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                                <li>팩트북 본문에서 <span className="bg-blue-100 text-blue-800 px-1 rounded text-xs font-medium">[2]</span>, <span className="bg-blue-100 text-blue-800 px-1 rounded text-xs font-medium">[3]</span>과 같은 번호를 클릭</li>
                                <li>클릭하면 해당 데이터의 원본 출처로 바로 이동</li>
                                <li>뉴스 기사, 보고서, 공식 발표 등의 신뢰할 수 있는 정보 확인 가능</li>
                              </ul>
                            </div>
                            <Card className="p-4 bg-green-50 border-green-200">
                              <h4 className="font-semibold text-green-800 mb-2">✅ 신뢰성 확보</h4>
                              <p className="text-sm text-green-700">
                                모든 데이터는 출처가 명확하게 표기되어 있어, 정보의 신뢰성을 직접 확인할 수 있습니다.
                              </p>
                            </Card>
                          </div>
                        </div>
                      </div>
                    </SectionDescription>
                  </div>
                </SectionDescription>

                <SectionDescription
                  id="factbook-insights"
                  title="AI 인사이트 활용"
                  description="생성된 팩트북 하단에는 AI 요약 및 인사이트 정보가 있습니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. AI 인사이트 확인</h3>
                      <Screenshot description="스크린샷: AI 인사이트 화면" imagePath="/guidebook/ai-insights.png" />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">2. 인사이트 활용</h3>
                      <Screenshot description="스크린샷: 인사이트 활용 예시" imagePath="/guidebook/insights-utilization.png" />
                      <p className="text-sm text-gray-600 mt-2">
                        인사이트와 시사점, 그리고 전략적 의미를 파악하여 전략 수립에 활용합니다.
                      </p>
                    </div>
                  </div>
                </SectionDescription>

                <SectionDescription
                  id="factbook-related-strategies"
                  title="연관 전략 확인"
                  description="현재 팩트북을 기반으로 생성된 모든 전략을 한눈에 확인할 수 있습니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 생성된 전략 목록</h3>
                      <Screenshot description="스크린샷: 팩트북 연관 전략 목록" imagePath="/guidebook/related-strategies-list.png" />
                      <div className="space-y-4 mt-2">
                        <div>
                          <h4 className="font-semibold mb-2">📊 전략 구조</h4>
                          <ul className="list-disc list-inside text-sm text-gray-600 space-y-2">
                            <li><strong>하나의 팩트북</strong> → <strong>여러 전략 파생</strong></li>
                            <li>같은 데이터를 바탕으로 다양한 전략 유형 생성 가능</li>
                          </ul>
                        </div>
                        
                        <Card className="p-4 bg-green-50 border-green-200">
                          <h4 className="font-semibold text-green-800 mb-2">💡 활용 팁</h4>
                          <div className="text-sm text-green-700 space-y-1">
                            <p>• 팩트북 상세 페이지 하단에서 "생성된 전략" 섹션 확인</p>
                            <p>• 각 전략 카드를 클릭하면 해당 전략 상세 페이지로 이동</p>
                            <p>• 전략 유형별로 분류되어 쉽게 비교 가능</p>
                          </div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </SectionDescription>

                {/* <SectionDescription
                  id="factbook-citations"
                  title="출처 및 인용"
                  description="팩트북에 사용된 데이터의 출처와 인용 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 출처 확인</h3>
                      <Screenshot description="스크린샷: 출처 확인 화면" imagePath="/guidebook/citation-check.png" />
                      <p className="text-sm text-gray-600 mt-2">
                        각 데이터 항목의 출처를 확인하여 신뢰성을 확보합니다.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">2. 인용 방법</h3>
                      <Screenshot description="스크린샷: 인용 방법 화면" imagePath="/guidebook/citation-method.png" />
                      <p className="text-sm text-gray-600 mt-2">
                        데이터를 인용할 때는 출처와 함께 정확하게 표기합니다.
                      </p>
                    </div>
                  </div>
                </SectionDescription> */}
              </div>
            </div>

            {/* 전략 생성 섹션 */}
            <div>
              <h1 className="text-3xl font-bold mb-8">전략 생성</h1>
              <div className="space-y-16">

                <SectionDescription
                  id="strategy-new"
                  title="새 전략 생성"
                  description="팩트북 데이터를 바탕으로 새로운 마케팅 전략을 생성하는 첫 단계입니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 전략 생성 시작하기</h3>
                      <Screenshot description="스크린샷: 전략 생성 첫 화면" imagePath="/guidebook/strategy-new-start.png" />
                      <p className="text-sm text-gray-600 mt-2">
                        '전략 생성하기' 버튼을 클릭하면, 팩트북의 데이터를 기반으로 마케팅 전략을 도출할 수 있습니다.<br />
                        아래 단계에 따라 전략 생성 과정을 진행하세요.
                      </p>
                    </div>
                  </div>
                </SectionDescription>

                <SectionDescription
                  id="strategy-select-type"
                  title="전략 유형 선택"
                  description="팩트북을 기반으로 생성할 전략의 유형을 선택하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 전략 유형</h3>
                      <Screenshot description="스크린샷: 전략 유형 선택 화면" imagePath="/guidebook/strategy-type-selection.png" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">TV 광고 전략</h4>
                          <p className="text-sm text-gray-600">브랜드 인지도 향상을 위한 TV 광고 캠페인 전략</p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">퍼포먼스 마케팅 전략</h4>
                          <p className="text-sm text-gray-600">실질적인 전환과 ROI 향상을 위한 디지털 마케팅 전략</p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">SNS 콘텐츠 전략</h4>
                          <p className="text-sm text-gray-600">소셜 미디어 채널별 콘텐츠 제작 및 운영 전략</p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">인플루언서 마케팅 전략</h4>
                          <p className="text-sm text-gray-600">인플루언서를 활용한 브랜드 홍보 전략</p>
                        </Card>
                        <Card className="p-4">
                          <h4 className="font-semibold mb-2">브랜드 포지셔닝 전략</h4>
                          <p className="text-sm text-gray-600">시장에서의 브랜드 차별화 및 포지셔닝 전략</p>
                        </Card>
                      </div>
                    </div>
                  </div>
                </SectionDescription>
                
                  {/* 전략 유형을 클릭하면, 선택한 전략 유형에 맞는 추가 정보 입력 폼이 하단에 나타납니다.
                      예를 들어, '퍼포먼스 마케팅 전략'을 선택하면 목표, 예산, 주요 KPI 등 세부 정보를 입력할 수 있는 폼이 자동으로 활성화됩니다.
                      사용자는 해당 폼에 필요한 정보를 입력한 후 전략 생성을 진행할 수 있습니다. */}                
                <SectionDescription
                  id="strategy-generation"
                  title="전략 정보 입력"
                  description="전략 유형을 클릭하면, 추가 정보 입력 폼이 하단에 나타납니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 전략 생성 시작</h3>
                      <Screenshot description="스크린샷: 전략 생성 진행 화면" imagePath="/guidebook/strategy-generation-progress.png" />
                    </div>

                    <Card className="p-4 bg-blue-50 border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">💡 전략 팁</h4>
                      <p className="text-sm text-blue-700">
                      <li>제안서와 같은 첨부 파일을 업로드하거나 전략 목표를 구체적으로 입력하면 더 맞춤형 된 전략이 도출 될 수 있습니다.</li>
                      <li>전략 유형에 따라 3-4분 정도 소요됩니다.</li>
                      </p>
                    </Card>
                  </div>
                </SectionDescription>

                <SectionDescription
                  id="strategy-result"
                  title="전략 결과 확인"
                  description="생성된 전략의 상세 내용을 확인하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 전략 내용 확인</h3>
                      <Screenshot description="스크린샷: 전략 결과 메인 화면" imagePath="/guidebook/strategy-result-main.png" />
                      <div className="space-y-2 mt-2">
                        <p className="text-sm text-gray-600">전략 결과는 다음 항목으로 구성됩니다:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>현황 및 문제점 분석</li>
                          <li>핵심 인사이트</li>
                          <li>목표 및 타겟</li>
                          <li>전략 방향성</li>
                          <li>전략 유형별 실행 계획</li>
                        </ul>
                      </div>
                    </div>

                      <Card className="p-4 bg-blue-50 border-blue-200">
                          <h4 className="font-semibold text-blue-800 mb-2">💡 빠른 이동 팁</h4>
                          <p className="text-sm text-blue-700">
                            왼쪽 목차에서 원하는 섹션을 클릭하면 해당 화면으로 즉시 이동할 수 있습니다.
                          </p>
                        </Card>
                  </div>
                </SectionDescription>

                <SectionDescription
                  id="strategy-chat"
                  title="전략 채팅 활용"
                  description="AI와의 대화를 통해 전략 내용을 더 자세히 파악하고 조정하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 채팅 인터페이스</h3>
                      <Screenshot description="스크린샷: 전략 채팅 인터페이스" imagePath="/guidebook/strategy-chat-interface.png" />
                      <div className="space-y-2 mt-2">
                        <p className="text-sm text-gray-600">채팅을 통해 다음과 같은 내용을 문의할 수 있습니다:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>전략의 세부 내용이나 구체적 액션 플랜 문의</li>
                          <li>전략의 효과, 한계, 리스크 등 검증 질문</li>
                          <li>다른 접근법이나 추가 아이디어 요청</li>
                        </ul>
                      </div>
                    </div>

                    <Card className="p-4 bg-purple-50 border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">채팅 활용 팁</h4>
                      <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                        <li>전략을 둘러싸고 있는 정보를 이해하고 있으므로, 자유롭게 활용해보세요.</li>
                        <li>구체적인 질문을 통해 더 정교한 전략을 도출할 수 있습니다</li>
                      </ul>
                    </Card>
                  </div>
                </SectionDescription>
              </div>
            </div>

            {/* 주요 기능 섹션 */}
            <div>
              <h1 className="text-3xl font-bold mb-8">주요 기능</h1>
              <div className="space-y-16">
                <SectionDescription
                  id="features-search"
                  title="검색 및 필터 기능"
                  description="팩트북과 전략을 효율적으로 찾고 관리하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 검색 기능</h3>
                      <Screenshot description="스크린샷: 검색 및 필터 UI" imagePath="/guidebook/search-and-filter.png" />
                      <div className="space-y-2 mt-2">
                        <p className="text-sm text-gray-600">다음과 같은 검색 옵션을 활용할 수 있습니다:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          <li>브랜드명으로 검색</li>
                          <li>업종별 필터링</li>
                          <li>최신순/인기순 정렬</li>
                          <li>전략 유형별 필터링</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SectionDescription>

                {/* <SectionDescription
                  id="features-share"
                  title="공유 기능"
                  description="팩트북과 전략을 팀원들과 공유하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 링크 공유</h3>
                      <Screenshot description="스크린샷: 공유 기능 UI" imagePath="/guidebook/share-function.png" />
                      <div className="space-y-2 mt-2">
                        <p className="text-sm text-gray-600">공유 방법:</p>
                        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                          <li>팩트북/전략 상세 페이지에서 "공유" 버튼 클릭</li>
                          <li>자동으로 클립보드에 링크 복사</li>
                          <li>복사된 링크를 원하는 곳에 공유</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </SectionDescription>

                <SectionDescription
                  id="features-copy"
                  title="복제 기능"
                  description="기존 팩트북이나 전략을 복제하여 재활용하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 팩트북/전략 복제</h3>
                      <Screenshot description="스크린샷: 복제 기능 UI" imagePath="/guidebook/duplicate-function.png" />
                      <div className="space-y-2 mt-2">
                        <p className="text-sm text-gray-600">복제 과정:</p>
                        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                          <li>원하는 팩트북/전략의 메뉴에서 "복제" 선택</li>
                          <li>복제본이 생성되어 목록에 추가</li>
                          <li>필요한 부분만 수정하여 사용</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </SectionDescription> */}

                <SectionDescription
                  id="features-activities"
                  title="최근 활동"
                  description="최근 생성한 팩트북,전략을 빠르게 확인하고 추적하는 방법을 안내합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 활동 내역 확인</h3>
                      <Screenshot description="스크린샷: 최근 활동 UI" imagePath="/guidebook/recent-activities.png" />
                      <div className="space-y-2 mt-2">
                      <p className="text-sm text-gray-600">
                        보고 싶은 팩트북이나 전략을 클릭하면 해당 상세 페이지로 바로 이동할 수 있습니다.
                      </p>
                      </div>
                    </div>
                  </div>
                </SectionDescription>
              </div>
            </div>

            {/* 보안 설정 섹션 */}
            <div>
              <h1 className="text-3xl font-bold mb-8">보안 인증</h1>
              <div className="space-y-16">
                <SectionDescription
                  id="security-access"
                  title="보안 코드 입력"
                  description="서비스 이용을 위해 보안 코드를 입력해야 합니다."
                >
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">1. 보안 코드 입력 화면</h3>
                      <Screenshot description="스크린샷: 보안 코드 입력 화면" imagePath="/guidebook/security-code-input.png" />
                      <div className="space-y-4 mt-2">
                        <Card className="p-4 bg-red-50 border-red-200">
                          <h4 className="font-semibold text-red-800 mb-2">🔒 보안 코드 정보</h4>
                          <div className="text-sm text-red-700 space-y-2">
                            <p><strong>보안 코드:</strong> <code className="bg-red-100 px-2 py-1 rounded font-mono">daehong!@</code></p>
                            <p><strong>갱신 주기:</strong> 8시간마다 자동 초기화</p>
                            <p><strong>입력 방법:</strong> 서비스 접속 시 보안 코드 입력 창에 위 코드를 정확히 입력</p>
                          </div>
                        </Card>
                        
                        <div>
                          <h4 className="font-semibold mb-2">보안 코드 입력 절차</h4>
                          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                            <li>서비스 접속 시 보안 코드 입력 화면이 나타남</li>
                            <li>입력창에 <code className="bg-gray-100 px-1 rounded">daehong!@</code> 입력</li>
                            <li>"확인" 버튼을 클릭하여 서비스 이용 시작</li>
                            <li>8시간 후 자동으로 재입력 요구됨</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    <Card className="p-4 bg-yellow-50 border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">⚠️ 주의사항</h4>
                      <ul className="list-disc list-inside text-sm text-yellow-700 space-y-1">
                        <li>8시간 경과 후에는 다시 보안 코드 입력이 필요합니다</li>
                        <li>❗️ 보안 코드는 외부에 공유하지 마세요 ❗️</li>
                      </ul>
                    </Card>
                  </div>
                </SectionDescription>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 