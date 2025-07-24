/**
 * 팩트북 상세 페이지
 * 
 * 이 페이지는 생성된 마케팅 전략 팩트북의 상세 내용을 보여주는 페이지입니다.
 * 회사 정보, 시장 분석, 경쟁사 분석, 소비자 반응 등 다양한 섹션으로 구성되어 있으며,
 * 각 섹션은 계층적 구조로 구성되어 있어 사용자가 쉽게 탐색할 수 있습니다.
 * 
 * 페이지 구성:
 * 1. 목차 네비게이션
 *    - 회사 및 브랜드 소개
 *    - 주요이슈
 *    - 소비자반응
 *    - 시장분석
 *    - 경쟁사분석
 *    - 자사/경쟁사 커뮤니케이션
 * 
 * 2. 컨텐츠 영역
 *    - 각 섹션별 상세 정보
 *    - 데이터 시각화
 *    - 인사이트 및 분석
 * 
 * 3. 전략 관리
 *    - 생성된 마케팅 전략 목록
 *    - 전략 생성 및 관리 기능
 * 
 * 주요 기능:
 * - 계층적 목차 탐색
 * - 섹션별 상세 정보 표시
 * - 데이터 시각화
 * - 전략 관리
 * - 공유 및 다운로드
 */

"use client"

import React, { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
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
  Trash2,
  Plus,
  MoreVertical,
  ArrowUpDown,
  Maximize2,
  X,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import ReactDOMServer from "react-dom/server"

/**
 * 팩트북 섹션 구조 정의
 * 
 * 각 섹션은 고유 ID, 제목, 아이콘, 하위 섹션을 포함합니다.
 * 하위 섹션은 각각 고유 ID와 제목을 가집니다.
 * 
 * 섹션 구성:
 * 1. 회사 및 브랜드 소개
 *    - 개요, 연혁, 실적, 서비스/특장점, 주요 인물
 * 2. 주요이슈
 *    - 사업 동향, 주요 인물 인터뷰, 부정 이슈
 * 3. 소비자반응
 *    - 소셜 분석
 * 4. 시장분석
 *    - 시장 현황, 시장 트렌드
 * 5. 경쟁사분석
 *    - 회사 소개, 브랜드/제품 특징, 소비자 반응, 주요 이슈
 * 6. 자사/경쟁사 커뮤니케이션
 *    - 커뮤니케이션 채널, 광고물
 */
const sectionList = [
  { key: "company_intro", title: "회사 및 브랜드 소개", icon: Building2 },
  { key: "major_issues", title: "주요이슈", icon: TrendingUp },
  { key: "consumer_reactions", title: "소비자반응", icon: Users },
  { key: "market_analysis", title: "시장분석", icon: BarChart3 },
  { key: "competitor_analysis", title: "경쟁사분석", icon: Target },
  { key: "company_communication", title: "자사커뮤니케이션", icon: MessageSquare },
  { key: "competitor_communication", title: "경쟁사커뮤니케이션", icon: Lightbulb },
];

/**
 * 생성된 전략 데이터
 * 
 * 각 전략은 다음 정보를 포함합니다:
 * - ID: 전략 고유 식별자
 * - type: 전략 유형 (TV 광고, SNS 콘텐츠 등)
 * - createdDate: 생성일
 * - createdBy: 생성자
 * - status: 진행 상태
 * - description: 전략 설명
 */
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

// 섹션별 아이콘 색상 매핑 추가
const iconColors: Record<string, string> = {
  company_intro: "text-blue-500",
  major_issues: "text-green-500",
  consumer_reactions: "text-purple-500",
  market_analysis: "text-orange-500",
  competitor_analysis: "text-red-500",
  company_communication: "text-indigo-500",
  competitor_communication: "text-pink-500",
};

// 전략 타입 매핑 (전략 라이브러리와 동일)
const STRATEGY_TYPE_MAP: Record<string, { icon: string; label: string }> = {
  'tv-advertising': { icon: '📺', label: 'TV 광고 전략' },
  'performance-marketing': { icon: '📊', label: '퍼포먼스 마케팅 전략' },
  'sns-content': { icon: '📱', label: 'SNS 콘텐츠 전략' },
  'influencer-marketing': { icon: '👥', label: '인플루언서 마케팅 전략' },
  'brand-positioning': { icon: '🎨', label: '브랜드 포지셔닝 전략' },
};

// 표 전체화면 모달 컴포넌트 (애니메이션, 더 큰 크기, ESC/오버레이 닫기)
function TableFullscreenModal({ html, onClose }: { html: string, onClose: () => void }) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    setShow(true);
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
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-2 bg-white/80 border border-gray-200 shadow hover:bg-blue-100 hover:text-blue-600 opacity-80 group-hover:opacity-100"
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

// 마크다운 전처리 함수: **'텍스트'** 또는 **"텍스트"** → **텍스트**
function preprocessMarkdown(md: string) {
  return md.replace(/\*\*['"]([^'"]+)['"]\*\*/g, '**$1**');
}

/**
 * FactbookPage 컴포넌트
 * 
 * 팩트북 상세 페이지의 전체 기능을 구현합니다.
 * 
 * 상태 관리:
 * - activeSection: 현재 활성화된 섹션
 * - activeSubsection: 현재 활성화된 하위 섹션
 * - expandedSections: 펼쳐진 섹션 목록
 * 
 * 주요 기능:
 * 1. 섹션 탐색 및 전환
 * 2. 하위 섹션 렌더링
 * 3. 데이터 시각화
 * 4. 전략 관리
 * 
 * @returns {JSX.Element} 팩트북 상세 페이지 컴포넌트
 */
export default function FactbookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const factbookId = id
  const searchParams = useSearchParams()
  const brandName = searchParams.get("brand")
  const [factbook, setFactbook] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentSection, setCurrentSection] = useState("company_intro")
  const [showStrategies, setShowStrategies] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    brand_name: '',
    industry: '',
    description: '',
    sections: {} as Record<string, { title: string, content: string, citations?: any }>,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [showStrategyOverlay, setShowStrategyOverlay] = useState(false)
  const [strategies, setStrategies] = useState<any[]>([])
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest' | 'name' | 'type'>('latest')
  const overlayRef = useRef<HTMLDivElement>(null)
  const [fullscreenTableHtml, setFullscreenTableHtml] = useState<string | null>(null);
  const renderTableToHtml = (props: any) => {
    return ReactDOMServer.renderToStaticMarkup(
      <table {...props}>{props.children}</table>
    );
  };

  useEffect(() => {
    if (!factbookId) return
    
    console.log('Fetching factbook with ID:', factbookId)
    
    fetch(`http://localhost:8000/factbooks/${factbookId}`)
      .then(res => {
        console.log('API Response status:', res.status)
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log('Received factbook data:', data)
        setFactbook(data as any)
      })
      .catch(error => {
        console.error('Error fetching factbook:', error)
        setError('팩트북 데이터를 불러오는데 실패했습니다.')
        toast.error('팩트북 데이터를 불러오는데 실패했습니다.')
      })
      .finally(() => setLoading(false))
  }, [factbookId])

  useEffect(() => {
    const updateActiveSection = () => {
      const scrollY = window.scrollY + 200; // 헤더 오프셋 고려
      
      for (let i = sectionList.length - 1; i >= 0; i--) {
        const section = sectionList[i];
        const element = document.getElementById(section.key);
        if (element && element.offsetTop <= scrollY) {
          setCurrentSection(section.key);
          break;
        }
      }
    };

    updateActiveSection(); // 초기 실행
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    
    return () => window.removeEventListener('scroll', updateActiveSection);
  }, [factbook])

  useEffect(() => {
    if (factbook) {
      const sections: Record<string, { title: string, content: string, citations?: any }> = {};
      sectionList.forEach(section => {
        const data = factbook[section.key] || { title: section.title, content: '' };
        sections[section.key] = {
          title: data.title || section.title,
          content: Array.isArray(data.content) ? data.content.join('\n') : (data.content || ''),
          citations: data.citations || [],
        };
      });
      setEditForm({
        brand_name: factbook.brand_name || '',
        industry: factbook.industry || '',
        description: factbook.description || '',
        sections,
      })
    }
  }, [factbook])

  /**
   * 섹션 클릭 처리 함수
   * 
   * @param {string} sectionId - 클릭된 섹션의 ID
   * @param {string} subsectionId - 클릭된 하위 섹션의 ID
   */
  const handleSectionClick = (sectionId: string, subsectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  /**
   * 전략 정렬 함수
   * 
   * @param {any[]} strategies - 정렬할 전략 배열
   * @param {'latest' | 'oldest' | 'name' | 'type'} order - 정렬 순서
   * @returns {any[]} 정렬된 전략 배열
   */
  const sortStrategies = (strategies: any[], order: 'latest' | 'oldest' | 'name' | 'type') => {
    const sorted = [...strategies]
    
    switch (order) {
      case 'latest':
        return sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
      case 'name':
        return sorted.sort((a, b) => (a.brand_name || a.type || '').localeCompare(b.brand_name || b.type || ''))
      case 'type':
        return sorted.sort((a, b) => (a.strategy_type || '').localeCompare(b.strategy_type || ''))
      default:
        return sorted
    }
  }

  /**
   * 하위 섹션 아이콘 반환 함수
   * 
   * @param {string} subsectionId - 하위 섹션 ID
   * @returns {JSX.Element} 해당 하위 섹션의 아이콘 컴포넌트
   */
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

  /**
   * 전체 컨텐츠 렌더링 함수
   * 
   * 현재 활성화된 섹션과 하위 섹션에 따라
   * 해당하는 컨텐츠를 렌더링합니다.
   * 
   * @returns {JSX.Element} 현재 활성화된 섹션의 컨텐츠
   */
  const renderAllContent = () => {
    if (!factbook) {
      console.log('No factbook data available')
      return <div className="text-gray-400">팩트북 데이터가 없습니다.</div>
    }
    
    console.log('Rendering factbook content:', factbook)
    
    return (
      <div className="space-y-8">
        {sectionList.map((section) => {
          const sectionData = factbook[section.key];
          console.log(`Section ${section.key} data:`, sectionData)
          
          if (!sectionData) {
            return (
              <Card key={section.key} id={section.key} className="bg-white shadow rounded-lg">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <section.icon className={`w-5 h-5 ${iconColors[section.key]}`} />
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-400">내용 없음</div>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={section.key} className="bg-white shadow rounded-lg">
              <div id={section.key} className="scroll-mt-24">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <section.icon className={`w-5 h-5 ${iconColors[section.key]}`} />
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {sectionData.title || section.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({node, ...props}) => (
                        <h1 {...props} className={`section-h1-${section.key} prose-h1`} />
                      ),
                      h2: ({node, ...props}) => (
                        <h2 {...props} className={`section-h2-${section.key} prose-h2`} />
                      ),
                      h3: ({node, ...props}) => (
                        <h3 {...props} className={`section-h3-${section.key} prose-h3`} />
                      ),
                      ul: ({node, ...props}) => (
                        <ul
                          {...props}
                          className={`section-ul section-ul-${section.key} prose-ul`}
                        />
                      ),
                      a: (props) => (
                        <a {...props} target="_blank" rel="noopener noreferrer">
                          {props.children}
                        </a>
                      ),
                      table: ({node, ...props}) => {
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
                          {React.Children.map(children, child => {
                            if (typeof child === "string") {
                              // <br> 태그를 줄바꿈으로 변환
                              return child.split(/<br\s*\/?>/i).map((line, idx, arr) =>
                                idx < arr.length - 1 ? [line, <br key={idx} />] : line
                              );
                            }
                            return child;
                          })}
                        </td>
                      ),
                      th: ({node, children, ...props}) => (
                        <th {...props}>
                          {React.Children.map(children, child => {
                            if (typeof child === "string") {
                              return child.split(/<br\s*\/?>/i).map((line, idx, arr) =>
                                idx < arr.length - 1 ? [line, <br key={idx} />] : line
                              );
                            }
                            return child;
                          })}
                        </th>
                      ),
                    }}
                  >
                    {preprocessMarkdown(Array.isArray(sectionData.content)
                      ? sectionData.content.join('\n\n')
                      : sectionData.content || "")}
                  </ReactMarkdown>
                  {fullscreenTableHtml && (
                    <TableFullscreenModal
                      html={fullscreenTableHtml}
                      onClose={() => setFullscreenTableHtml(null)}
                    />
                  )}
                  {/* AI 인사이트 요약이 있으면 별도 표시 */}
                  {sectionData.ai_insight_view && (
                    <div className="mt-8">
                      <div className="flex items-center mb-2">
                        <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
                        <span className="font-bold text-2xl text-yellow-700">핵심 AI 인사이트</span>
                      </div>
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: (props) => (
                              <a {...props} target="_blank" rel="noopener noreferrer">
                                {props.children}
                              </a>
                            ),
                          }}
                        >
                          {sectionData.ai_insight_view}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  /**
   * 팩트북 삭제 처리
   */
  const handleDeleteFactbook = async () => {
    if (!confirm("정말로 이 팩트북을 삭제하시겠습니까?\n연관된 모든 전략도 함께 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.")) {
      return
    }
    
    setIsDeleting(true)
    try {
      const response = await fetch(`http://localhost:8000/factbooks/${factbookId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      toast.success("팩트북이 삭제되었습니다.")
      // 메인 페이지로 이동
      window.location.href = '/'
    } catch (error) {
      console.error('Error deleting factbook:', error)
      toast.error("팩트북 삭제에 실패했습니다.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSave = async () => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      formData.append('brand_name', editForm.brand_name)
      formData.append('industry', editForm.industry)
      formData.append('description', editForm.description)
      sectionList.forEach(section => {
        // content만 수정 가능, title/citations은 그대로 둠
        const sectionObj = {
          ...editForm.sections[section.key],
          content: editForm.sections[section.key].content,
        }
        formData.append(section.key, JSON.stringify(sectionObj))
      })
      const res = await fetch(`http://localhost:8000/factbooks/${factbookId}`, {
        method: 'PATCH',
        body: formData,
      })
      if (!res.ok) throw new Error('수정 실패')
      toast.success('팩트북 정보가 수정되었습니다.')
      setEditOpen(false)
      // 수정 후 데이터 새로고침
      const updated = await fetch(`http://localhost:8000/factbooks/${factbookId}`).then(r => r.json())
      setFactbook(updated)
    } catch (e) {
      toast.error('수정에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  // 전략 데이터 fetch
  useEffect(() => {
    if (!showStrategyOverlay || !factbookId) return;
    // URL을 백엔드 스펙에 맞게 수정
    fetch(`http://localhost:8000/factbooks/${factbookId}/strategies`)
      .then(res => res.json())
      .then(data => setStrategies(Array.isArray(data) ? data : []))
      .catch(() => setStrategies([]))
  }, [showStrategyOverlay, factbookId])
  // ESC 닫기
  useEffect(() => {
    if (!showStrategyOverlay) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowStrategyOverlay(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [showStrategyOverlay])

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">팩트북을 불러오는 중...</p>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          다시 시도
        </Button>
      </div>
    </div>
  )
  
  if (!factbook) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">팩트북을 찾을 수 없습니다.</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 
        헤더 섹션
        - 뒤로가기 버튼
        - 페이지 제목
        - 공유 및 다운로드 버튼
      */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" prefetch={true}>
                <Button variant="ghost" className="mr-4">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  돌아가기
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-extrabold text-gray-900">
                    {brandName || factbook.brand_name || '팩트북'} 상세 내용
                  </h1>
                  <p className="text-sm text-gray-500">
                    {factbook.created_at ? 
                      new Date(factbook.created_at).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : '생성일 없음'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const url = window.location.href;
                  navigator.clipboard.writeText(url);
                  toast.success('링크가 클립보드에 복사되었습니다.');
                }}
              >
                <Share2 className="w-4 h-4 mr-2" />
                공유
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  const factbookText = `
${factbook.brand_name || '-'} 팩트북

${factbook.description || ''}

${sectionList.map(section => {
  const sectionData = factbook[section.key];
  if (!sectionData) return '';
  return `
${sectionData.title || section.title}
${sectionData.content || ''}
`;
}).join('\n')}

생성일: ${factbook.created_at ? 
  new Date(factbook.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '생성일 없음'}
                  `.trim();
                  
                  navigator.clipboard.writeText(factbookText);
                  toast.success('팩트북 내용이 클립보드에 복사되었습니다.');
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                복사
              </Button>
              {/* <Button
                variant="outline" 
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                편집
              </Button> */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDeleteFactbook}
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
        <div className="grid grid-cols-12 gap-8">
          {/* 
            목차 네비게이션
            - 섹션 목록
            - 하위 섹션 목록
            - 현재 활성화된 섹션 하이라이트
          */}
          <div className="col-span-3">
            <div className="sticky top-8">
              <Card className="gap-0 space-y-0 backdrop-blur-sm bg-white/90 shadow-lg border border-gray-200">
                <CardHeader className="pb-0 mb-0">
                  <CardTitle className="text-lg mb-0 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-600" />
                    목차
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {sectionList.map((section) => {
                      const Icon = section.icon
                      const sectionData = factbook?.[section.key];
                      return (
                        <div key={section.key} className="rounded-md mb-1">
                          <button
                            onClick={() => handleSectionClick(section.key, section.key)}
                            className={`w-full flex items-center px-4 py-3 text-left transition-all duration-200 cursor-pointer hover:bg-gray-100
                              ${currentSection === section.key 
                                ? "bg-blue-50 shadow-sm transform scale-[1.02]" 
                                : ""}`}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className={`ml-2 w-4 h-4 ${currentSection === section.key ? "text-blue-600" : iconColors[section.key]}`} />
                              <span className={`text-sm font-medium ${currentSection === section.key ? "text-blue-700" : "text-gray-700"}`}>
                                {sectionData?.title || section.title}
                              </span>
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>

              <Card className="gap-1 space-y-0 mt-6">
                <CardHeader className="pb-0 mb-0">
                  <CardTitle className="text-lg">다음 단계</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2 mt-0">
                  <Link href={`/strategy-selection?factbook=${factbookId}`}>
                    <Button
                      className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white cursor-pointer"
                      size="lg"
                    >
                      <Target className="w-5 h-5 text-white" />
                      전략 생성하기
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* 생성된 전략 목록 */}
              <Card className="mt-6 gap-0 space-y-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">생성된 전략</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-2">
                  <Button
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 cursor-pointer"
                    variant="secondary"
                    size="lg"
                    onClick={() => setShowStrategyOverlay(true)}
                    style={{ boxShadow: '0 2px 8px 0 rgba(36,37,38,0.06)' }}
                  >
                    <Eye className="w-5 h-5 text-gray-600" />
                    전략 확인하기
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* 
            메인 컨텐츠 영역
            - 현재 선택된 섹션의 상세 정보
            - 데이터 시각화
            - 전략 관리
          */}
          <div className="col-span-9">
            <Card className="gap-0 space-y-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <h2 className="text-3xl font-extrabold text-gray-900">
                        {brandName || factbook.brand_name || '-'} 팩트북
                      </h2>
                      <p className="text-m text-gray-500 mt-1">
                        {factbook.description || '마케팅 전략을 위한 팩트북 상세 내용'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>{renderAllContent()}</CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 커스텀 편집 모달 */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">팩트북 정보 편집</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">브랜드명</label>
                <Input
                  value={editForm.brand_name}
                  onChange={e => setEditForm(f => ({ ...f, brand_name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">업종</label>
                <Input
                  value={editForm.industry}
                  onChange={e => setEditForm(f => ({ ...f, industry: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">설명</label>
                <Textarea
                  value={editForm.description}
                  onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="border-t pt-4 mt-4">
                <h3 className="text-base font-semibold mb-2">섹션별 본문 내용</h3>
                <div className="space-y-4">
                  {sectionList.map(section => (
                    <div key={section.key}>
                      <label className="block text-sm font-medium mb-1">{editForm.sections[section.key]?.title || section.title}</label>
                      <Textarea
                        value={editForm.sections[section.key]?.content || ''}
                        onChange={e => setEditForm(f => ({
                          ...f,
                          sections: {
                            ...f.sections,
                            [section.key]: {
                              ...f.sections[section.key],
                              content: e.target.value,
                            }
                          }
                        }))}
                        rows={5}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditOpen(false)} disabled={isSaving}>취소</Button>
              <Button onClick={handleEditSave} disabled={isSaving}>
                {isSaving ? '저장 중...' : '저장'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 전략 브레인스토밍 오버레이 */}
      {showStrategyOverlay && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center"
          onClick={() => setShowStrategyOverlay(false)}
        >
          <div
            className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-2xl border-2 border-gray-200 overflow-y-auto max-h-[80vh]"
            onClick={e => e.stopPropagation()}
          >
            <section className="strategy-list-section p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-gray-600" /> 생성된 전략 리스트
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">정렬:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        {sortOrder === 'latest' && '최근 생성일 순'}
                        {sortOrder === 'oldest' && '오래된 순'}
                        {sortOrder === 'type' && '유형 순'}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortOrder('latest')}>
                        최근 생성일 순
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                        오래된 순
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortOrder('type')}>
                        유형 순
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {strategies.length === 0 ? (
                <div className="text-center text-gray-400 py-12">생성된 전략이 없습니다.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortStrategies(strategies, sortOrder).map((strategy) => {
                    const typeInfo = STRATEGY_TYPE_MAP[strategy.strategy_type] || { icon: '❓', label: strategy.strategy_type }
                    return (
                      <Card
                        key={strategy.id}
                        className="hover:shadow-lg transition-shadow cursor-pointer bg-gray-50 border-gray-200 hover:bg-gray-100"
                        onClick={() => window.location.href = `/strategy-result?strategy=${strategy.id}`}
                      >
                        <CardHeader className="pb-0">
                          <div className="flex flex-row items-center justify-between">
                            <CardTitle className="text-xl font-bold">{strategy.brand_name ?? strategy.type ?? '-'}</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">열기</span>
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  const url = `${window.location.origin}/strategy-result?strategy=${strategy.id}`;
                                  navigator.clipboard.writeText(url);
                                  toast.success('링크가 클립보드에 복사되었습니다.');
                                }}>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  링크 공유
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => {
                                  e.stopPropagation();
                                  const strategyText = `
${strategy.brand_name || strategy.type || '-'} 전략

${strategy.description || ''}

생성일: ${strategy.created_at ? 
  new Date(strategy.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '생성일 없음'}
                                  `.trim();
                                  
                                  navigator.clipboard.writeText(strategyText);
                                  toast.success('전략 내용이 클립보드에 복사되었습니다.');
                                }}>
                                  <FileText className="mr-2 h-4 w-4" />
                                  내용 복사
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={async (e) => {
                                  e.stopPropagation();
                                  if (confirm("정말로 이 전략을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
                                    setIsDeleting(true);
                                    try {
                                      const response = await fetch(`http://localhost:8000/strategies/${strategy.id}`, {
                                        method: 'DELETE',
                                      });
                                      if (!response.ok) {
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                      }
                                      toast.success("전략이 삭제되었습니다.");
                                      // 전략 리스트 새로고침
                                      const updatedStrategies = await fetch(`http://localhost:8000/factbooks/${factbookId}/strategies`).then(r => r.json());
                                      setStrategies(Array.isArray(updatedStrategies) ? updatedStrategies : []);
                                    } catch (error) {
                                      console.error('Error deleting strategy:', error);
                                      toast.error("전략 삭제에 실패했습니다.");
                                    } finally {
                                      setIsDeleting(false);
                                    }
                                  }
                                }}>
                                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                                  삭제
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
                              <span className="font-medium">{strategy.creator || strategy.createdBy}</span>
                              <div className="text-xs text-gray-500">작성자</div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-2 border-t border-gray-100 pt-2">
                            <span>생성: {strategy.created_at ? new Date(strategy.created_at).toLocaleDateString('ko-KR') : ''}</span>
                            <span>수정: {strategy.updated_at ? new Date(strategy.updated_at).toLocaleDateString('ko-KR') : ''}</span>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button 
                              size="sm" 
                              className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/strategy-result?strategy=${strategy.id}`;
                              }}
                            >
                              <Target className="w-3 h-3 mr-1" />
                              상세 보기
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
