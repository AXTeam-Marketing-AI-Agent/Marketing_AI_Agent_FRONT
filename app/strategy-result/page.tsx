"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  AlertTriangle,
  Trash2,
  Maximize2,
  X,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import { toast } from "sonner"
import remarkGfm from "remark-gfm"
import ReactDOMServer from "react-dom/server"
import React from "react"
import { ChatPanel } from '../../components/ui/chatPanel'

// 전략 섹션 한글명/아이콘 매핑 (navTitle 추가)
const strategySectionList = [
  { key: "problem", title: "문제 정의 및 원인 분석", navTitle: "문제 정의", icon: MessageSquare, color: "text-red-500" },
  { key: "insight", title: "인사이트 도출 및 기회 포착", navTitle: "인사이트 도출", icon: Lightbulb, color: "text-yellow-500" },
  { key: "goal_target", title: "목표 및 타겟 정의", navTitle: "목표/타겟", icon: Target, color: "text-green-600" },
  { key: "direction", title: "전략 방향성 (Big Idea)", navTitle: "전략 방향성", icon: ArrowLeft, color: "text-blue-500 rotate-180" },
  { key: "execution", title: "실행 전략", navTitle: "실행 전략", icon: Calendar, color: "text-blue-600" },
]

// 전략 유형 한글명 매핑
const strategyTypeMapping: Record<string, string> = {
  "tv-advertising": "TV 광고 전략",
  "digital-advertising": "디지털 광고 전략",
  "sns-content": "SNS 마케팅 전략",
  "content-marketing": "콘텐츠 마케팅 전략",
  "influencer-marketing": "인플루언서 마케팅 전략",
  "performance-marketing": "퍼포먼스 마케팅 전략",
  "brand-positioning": "브랜드 포지셔닝 전략",
  "pr-campaign": "PR 캠페인 전략",
  "event-marketing": "이벤트 마케팅 전략",
  "email-marketing": "이메일 마케팅 전략",
  "search-marketing": "검색 마케팅 전략",
  "mobile-marketing": "모바일 마케팅 전략",
  "video-marketing": "비디오 마케팅 전략",
  "affiliate-marketing": "제휴 마케팅 전략",
  "guerilla-marketing": "게릴라 마케팅 전략",
}

// 전략 유형을 한글로 변환하는 함수
const getStrategyTypeKorean = (strategyType: string): string => {
  return strategyTypeMapping[strategyType] || strategyType
}

// 섹션별 색상 매핑 (팩트북 스타일 참고)
const strategySectionColors: Record<string, string> = {
  problem: "text-red-500",
  insight: "text-yellow-500",
  goal_target: "text-green-600",
  direction: "text-blue-500",
  execution: "text-blue-600",
};

// 표 전체화면 모달 컴포넌트 (애니메이션, 더 큰 크기)
function TableFullscreenModal({ html, onClose }: { html: string, onClose: () => void }) {
  // 애니메이션 상태
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setShow(true);
    // ESC 키로 닫기
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      setShow(false);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // 바깥 클릭 시 닫기
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 bg-black/70 flex items-center justify-center transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      onClick={handleOverlayClick}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-7xl w-full h-[98vh] max-h-[98vh] overflow-auto p-10 relative border border-gray-200
        transform transition-transform duration-300 ${show ? 'scale-100' : 'scale-95'}`}
        style={{ transitionProperty: 'opacity, transform' }}
      >
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-2 bg-white/80 shadow"
          onClick={onClose}
          aria-label="전체화면 닫기"
        >
          <X className="w-6 h-6" />
        </button>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

// 마크다운 전처리 함수: 굵게 처리 문제 해결
function preprocessMarkdown(md: string) {
  // 1. 따옴표 제거: **'텍스트'** 또는 **"텍스트"** → **텍스트**
  let processed = md.replace(/\*\*['"]([^'"]+)['"]\*\*/g, '**$1**');
  
  // 2. 괄호로 끝나는 굵게 텍스트 문제 해결: **텍스트)** → **텍스트**) 
  // 마크다운 파서가 인식하지 못하는 경우를 위해 공백 추가
  processed = processed.replace(/\*\*([^*]+\))\*\*/g, '**$1** ').replace(/\*\*  /g, '** ');
  
  // 3. 또는 HTML 태그로 직접 변환 (강력한 방법)
  // processed = processed.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  return processed;
}

export default function StrategyResultPage() {
  const searchParams = useSearchParams()
  const strategyId = searchParams.get("strategy")

  // 모든 Hook은 최상단에서 선언
  const [strategy, setStrategy] = useState<any>(null)
  const [factbook, setFactbook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeSection, setActiveSection] = useState<string>(strategySectionList[0].key)
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [fullscreenTableHtml, setFullscreenTableHtml] = useState<string | null>(null);

  // table을 html string으로 변환하는 함수
  const renderTableToHtml = (props: any) => {
    // ReactNode를 html string으로 변환
    return ReactDOMServer.renderToStaticMarkup(
      <table {...props}>{props.children}</table>
    );
  };

  useEffect(() => {
    if (!strategyId) return
    setLoading(true)
    
    // 전략 데이터와 팩트북 데이터를 함께 조회
    Promise.all([
      fetch(`http://localhost:8000/strategies/${strategyId}`),
      fetch(`http://localhost:8000/strategies/${strategyId}`).then(res => res.json()).then(strategyData => 
        fetch(`http://localhost:8000/factbooks/${strategyData.factbook_id}`)
      )
    ])
      .then(([strategyRes, factbookRes]) => {
        if (!strategyRes.ok) throw new Error("전략 데이터를 불러오지 못했습니다.")
        if (!factbookRes.ok) throw new Error("팩트북 데이터를 불러오지 못했습니다.")
        return Promise.all([strategyRes.json(), factbookRes.json()])
      })
      .then(([strategyData, factbookData]) => {
        setStrategy(strategyData)
        setFactbook(factbookData)
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [strategyId])

  // 목차 클릭 시 해당 섹션으로 스크롤
  const handleSectionClick = (sectionKey: string) => {
    const el = sectionRefs.current[sectionKey]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // IntersectionObserver로 현재 보고 있는 섹션 추적
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      (entries) => {
        // 현재 화면에 보이는 섹션들 중 가장 위에 있는 섹션을 활성화
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          // 여러 섹션이 보일 때는 가장 위에 있는 섹션을 선택
          const topEntry = visibleEntries.reduce((prev, curr) => {
            const prevBounding = (prev.target as HTMLElement).getBoundingClientRect();
            const currBounding = (curr.target as HTMLElement).getBoundingClientRect();
            return prevBounding.top > currBounding.top ? curr : prev;
          });
          setActiveSection(topEntry.target.id);
        }
      },
      {
        rootMargin: "-10% 0px -80% 0px", // 상단 여백을 좀 더 좁게 조정
        threshold: [0, 0.1, 0.2, 0.3], // 더 세밀한 관찰
      }
    )
    strategySectionList.forEach((section) => {
      const el = sectionRefs.current[section.key]
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [strategy])

  const handleDeleteStrategy = async () => {
    if (!window.confirm("정말로 이 전략을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return
    setIsDeleting(true)
    try {
      const res = await fetch(`http://localhost:8000/strategies/${strategy.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("삭제 실패")
      toast.success("전략이 삭제되었습니다.")
      window.location.href = "/" // 또는 팩트북 상세로 이동
    } catch (e) {
      toast.error("전략 삭제에 실패했습니다.")
    } finally {
      setIsDeleting(false)
    }
  }

  // 복사 기능 구현
  const handleCopyStrategy = () => {
    if (!strategy) return;
    let text = '';
    text += `전략명: ${factbook?.brand_name ? `${factbook.brand_name}: ${getStrategyTypeKorean(strategy.strategy_type)}` : getStrategyTypeKorean(strategy.strategy_type)}\n`;
    text += `생성일: ${strategy.created_at ? new Date(strategy.created_at).toLocaleString() : "방금 생성됨"}\n`;
    text += `목표/설명: ${strategy.objective || strategy.description || ''}\n\n`;

    strategySectionList.forEach(section => {
      const sectionData = strategy[section.key];
      if (sectionData && sectionData.content) {
        text += `# ${section.title}\n${Array.isArray(sectionData.content) ? sectionData.content.join('\n\n') : sectionData.content}\n\n`;
      }
    });

    navigator.clipboard.writeText(text);
    toast.success("전략 전체가 복사되었습니다.");
  };

  // 전략 데이터가 이미 있으면 바로 보여주고, 없을 때만 로딩 (팩트북 상세와 동일)
  if (loading && !strategy) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold mb-2">전략을 불러오는 중...</h3>
        <p className="text-gray-600 mb-4">전략 데이터를 불러오고 있습니다. 잠시만 기다려주세요.</p>
      </div>
    </div>
  );

  if (error) return <div>에러: {error}</div>
  if (!strategy) return <div>전략 데이터 없음</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 플로팅 목차 (오버랩) */}
      <div className="hidden lg:block">
        <div
          className="fixed top-28 left-6 z-30 w-36 bg-white/90 shadow-lg rounded-xl border border-gray-200 p-1 backdrop-blur-sm"
          style={{ minWidth: 120, transition: 'all 0.3s ease' }}
        >
          <div className="px-2 py-1 text-xs font-bold text-gray-700">목차</div>
          <nav className="space-y-1">
            {strategySectionList.map((section) => {
              const SectionIcon = section.icon
              return (
                <button
                  key={section.key}
                  onClick={() => handleSectionClick(section.key)}
                  className={`w-full flex items-center px-2 py-1.5 text-left text-[11px] rounded-lg transition-all duration-200 cursor-pointer hover:bg-blue-50 
                    ${activeSection === section.key 
                      ? "bg-blue-100 shadow-sm transform scale-[1.02] font-bold" 
                      : "bg-transparent"}`}
                >
                  <SectionIcon className={`w-3 h-3 mr-1 ${section.color}`} />
                  <span className={`text-[11px] transition-all duration-200 ${activeSection === section.key ? 'text-blue-700 font-bold' : 'text-gray-600'}`}>
                    {section.navTitle}
                  </span>
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" prefetch={true}>
                <Button variant="ghost" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  라이브러리로
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {factbook?.brand_name ? `${factbook.brand_name}: ${getStrategyTypeKorean(strategy.strategy_type)}` : getStrategyTypeKorean(strategy.strategy_type)}
                  </h1>
                  <p className="text-sm text-gray-500">{strategy.created_at ? new Date(strategy.created_at).toLocaleString() : "방금 생성됨"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={handleCopyStrategy}>
                <Copy className="w-4 h-4 mr-2" />
                복사
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('링크가 클립보드에 복사되었습니다.');
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Link href={`/factbook/${strategy.factbook_id}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="ml-2">
                  <Eye className="w-4 h-4 mr-2" />
                  팩트북 보기
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDeleteStrategy}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {isDeleting ? (
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
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5 text-green-600" />
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">
                      {factbook?.brand_name ? `${factbook.brand_name}: ${getStrategyTypeKorean(strategy.strategy_type)}` : getStrategyTypeKorean(strategy.strategy_type)}
                    </h2>
                    <p className="text-m text-gray-500 mt-1">
                      {strategy.objective || strategy.description || '전략 설명이 없습니다.'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8 pb-20 lg:pb-0">
                  {/* 전략 상세 섹션들만 렌더링 */}
                  {strategySectionList.map(section => {
                    const SectionIcon = section.icon
                    const sectionData = strategy[section.key]
                    return (
                      <Card key={section.key} className="bg-white shadow rounded-lg" id={section.key} ref={el => { sectionRefs.current[section.key] = el }}>
                        <CardHeader>
                                  <div className="flex items-center space-x-2">
                            <SectionIcon className={`w-5 h-5 ${section.color}`} />
                            <CardTitle className="text-2xl font-bold text-gray-900">
                              {section.title}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="prose leading-relaxed">
                            {sectionData && sectionData.content ? (
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  h1: ({node, ...props}) => (
                                    <h1 {...props} className={`section-h1-${section.key} prose-h1 ${strategySectionColors[section.key]}`} />
                                  ),
                                  h2: ({node, ...props}) => (
                                    <h2 {...props} className={`section-h2-${section.key} prose-h2 ${strategySectionColors[section.key]}`} />
                                  ),
                                  h3: ({node, ...props}) => (
                                    <h3 {...props} className={`section-h3-${section.key} prose-h3 ${strategySectionColors[section.key]}`} />
                                  ),
                                  ul: ({node, ...props}) => (
                                    <ul {...props} className={`section-ul section-ul-${section.key} prose-ul`} />
                                  ),
                                  a: (props) => (
                                    <a {...props} target="_blank" rel="noopener noreferrer">
                                      {props.children}
                                    </a>
                                  ),
                                  table: ({node, ...props}) => {
                                    // table을 html string으로 변환
                                    const tableHtml = renderTableToHtml(props);
                                    return (
                                      <div className="relative overflow-x-auto my-4 group">
                                        <button
                                          className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/90 border border-gray-200 shadow hover:bg-blue-100 hover:text-blue-600 transition-colors opacity-80 group-hover:opacity-100"
                                          onClick={() => setFullscreenTableHtml(tableHtml)}
                                          aria-label="표 전체화면 보기"
                                          title="표 전체화면 보기"
                                        >
                                          <Maximize2 className="w-4 h-4" />
                                        </button>
                                        <table {...props} className="w-full border">{props.children}</table>
                                      </div>
                                    );
                                  },
                                  td: ({node, children, ...props}) => (
                                    <td {...props}>
                                      {React.Children.map(children, (child, idx) => {
                                        if (typeof child === "string") {
                                          // <br> 태그를 줄바꿈으로 변환
                                          return child.split(/<br\s*\/?>/i).map((line, i, arr) =>
                                            i < arr.length - 1 ? [line, <br key={i} />] : line
                                          );
                                        }
                                        return child;
                                      })}
                                    </td>
                                  ),
                                  th: ({node, children, ...props}) => (
                                    <th {...props}>
                                      {React.Children.map(children, (child, idx) => {
                                        if (typeof child === "string") {
                                          return child.split(/<br\s*\/?>/i).map((line, i, arr) =>
                                            i < arr.length - 1 ? [line, <br key={i} />] : line
                                          );
                                        }
                                        return child;
                                      })}
                                    </th>
                                  ),
                                }}
                              >
                                {preprocessMarkdown(Array.isArray(sectionData.content) ? sectionData.content.join("\n\n") : sectionData.content)}
                              </ReactMarkdown>
                            ) : (
                              <div className="text-gray-400">내용 없음</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                    </div>
              </CardContent>
            </Card>
          </div>

          {/* 우측 채팅창 */}
          <div className="hidden lg:flex">
            <ChatPanel strategy={strategy} factbook={factbook} />
          </div>

          {/* 모바일/태블릿용 채팅창 (하단 고정) */}
          {/* <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 p-4">
            <div className="flex items-center gap-2">
              <Input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !isStreaming) handleSendMessage() }}
                placeholder="전략에 대해 궁금한 점을 입력하세요"
                className="flex-1"
                disabled={isStreaming}
              />
              <Button onClick={handleSendMessage} disabled={!chatInput.trim() || isStreaming}>
                <Send className="w-4 h-4" />
                  </Button>
                </div>
          </div> */}
        </div>
      </div>
      {fullscreenTableHtml && (
        <TableFullscreenModal
          html={fullscreenTableHtml}
          onClose={() => setFullscreenTableHtml(null)}
        />
      )}
    </div>
  )
}
