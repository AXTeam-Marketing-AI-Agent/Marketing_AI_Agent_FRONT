/**
 * 전략 상세 페이지
 * 
 * 이 페이지는 생성된 마케팅 전략의 상세 내용을 보여주는 페이지입니다.
 * 전략의 목표, 기간, 예산, 타겟 등 기본 정보와 함께 크리에이티브, 미디어 전략,
 * 성과 지표, 리스크 관리 등 세부 전략 내용을 제공합니다.
 * 
 * 페이지 구성:
 * 1. 전략 개요
 *    - 목표, 기간, 예산, 타겟 정보
 *    - 공유, 다운로드, 승인 기능
 * 
 * 2. 상세 전략
 *    - 크리에이티브 전략
 *    - 미디어 전략
 *    - 성과 지표
 *    - 리스크 관리
 * 
 * 3. AI 채팅
 *    - 전략 관련 질의응답
 *    - 전략 수정 및 보완
 * 
 * 주요 기능:
 * - 전략 상세 정보 표시
 * - 탭 기반 전략 섹션 탐색
 * - AI 기반 전략 상담
 * - 전략 공유 및 다운로드
 */

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
  ArrowRight,
  Upload,
  FileText,
} from "lucide-react"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

/**
 * 전략 카테고리 옵션
 */
const strategyCategories = [
  { id: "tv", label: "TV 광고 전략", description: "TV 광고를 통한 브랜드 인지도 및 매출 증대" },
  { id: "performance", label: "퍼포먼스 마케팅 전략", description: "CPA/ROAS 기반의 효율적인 광고 집행" },
  { id: "digital", label: "디지털 마케팅 전략", description: "온라인 채널을 활용한 통합 마케팅" },
  { id: "social", label: "SNS 마케팅 전략", description: "소셜 미디어를 활용한 브랜드 커뮤니케이션" },
  { id: "influencer", label: "인플루언서 마케팅 전략", description: "인플루언서를 활용한 브랜드 홍보" },
  { id: "brand", label: "브랜드 캠페인", description: "브랜드 가치 제고를 위한 통합 캠페인" },
  { id: "pr", label: "PR 전략", description: "언론 보도 및 홍보를 통한 브랜드 이미지 구축" },
  { id: "event", label: "이벤트/프로모션", description: "오프라인 이벤트 및 프로모션 전략" },
  { id: "content", label: "콘텐츠 마케팅 전략", description: "브랜드 콘텐츠를 통한 고객 유입 및 전환" },
  { id: "search", label: "검색 마케팅 전략", description: "검색 광고 및 SEO를 통한 트래픽 확보" },
]

/**
 * 전략 생성 페이지
 * 
 * 이 페이지는 마케팅 전략을 생성하기 위한 페이지입니다.
 * 팩트북의 정보를 기반으로 AI가 전략을 생성하며, 사용자는 다음 정보만 입력합니다:
 * 1. 전략 카테고리 선택
 * 2. 전략 목표 입력
 * 3. RFP 파일 업로드 (선택)
 */
export default function StrategyPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    strategyCategory: "",
    objective: "",
    rfpFile: null as File | null,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  /**
   * RFP 파일 업로드 처리
   */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, rfpFile: file }))
      // 파일 업로드 진행률 시뮬레이션
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) clearInterval(interval)
      }, 200)
    }
  }

  /**
   * 전략 생성 처리
   */
  const handleGenerateStrategy = async () => {
    if (!formData.strategyCategory || !formData.objective) return

    setIsGenerating(true)
    // 전략 생성 API 호출 시뮬레이션
    setTimeout(() => {
      setIsGenerating(false)
      router.push("/strategy/1") // 생성된 전략 페이지로 이동
    }, 2000)
  }

  /**
   * 필수 입력 항목 검증
   */
  const canSubmit = formData.strategyCategory && formData.objective

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => router.back()} className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              <ArrowLeft className="h-4 w-4" />
              </Button>
                <div>
              <CardTitle className="text-white">새 전략 생성</CardTitle>
              <CardDescription className="text-purple-100">
                팩트북을 기반으로 마케팅 전략을 생성합니다.
              </CardDescription>
            </div>
          </div>
              </CardHeader>
              <CardContent>
                    <div className="space-y-6">
            {/* 전략 카테고리 선택 */}
                        <div className="space-y-2">
              <Label htmlFor="strategyCategory">전략 카테고리 *</Label>
              <Select
                value={formData.strategyCategory}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, strategyCategory: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="전략 카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {strategyCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex flex-col">
                        <span>{category.label}</span>
                        <span className="text-xs text-gray-500">{category.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 전략 목표 입력 */}
            <div className="space-y-2">
              <Label htmlFor="objective">전략 목표 *</Label>
              <Textarea
                id="objective"
                placeholder="전략의 목표를 자유롭게 입력해주세요. 예: 브랜드 인지도 20% 향상, 신제품 런칭, 매출 30% 증대, 타겟 고객층 확대 등"
                value={formData.objective}
                onChange={(e) => setFormData((prev) => ({ ...prev, objective: e.target.value }))}
                rows={4}
                className="resize-none"
              />
                </div>

            {/* RFP 파일 업로드 (선택) */}
            <div className="space-y-2">
              <Label htmlFor="rfpFile">RFP 파일 업로드</Label>
              <div className="flex items-center space-x-4">
                  <Input
                  id="rfpFile"
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById("rfpFile")?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {formData.rfpFile ? "파일 변경하기" : "RFP 파일 선택하기"}
                  </Button>
              </div>
              {formData.rfpFile && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <FileText className="h-4 w-4" />
                    <span>{formData.rfpFile.name}</span>
                  </div>
                  {uploadProgress < 100 && (
                    <Progress value={uploadProgress} className="mt-2" />
                  )}
                </div>
              )}
              <p className="text-sm text-gray-500">
                PDF, Word, PowerPoint 문서 형식의 RFP 파일을 업로드할 수 있습니다.
              </p>
            </div>

            {/* 생성 버튼 */}
            <Button
              className="w-full"
              onClick={handleGenerateStrategy}
              disabled={!canSubmit || isGenerating}
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  전략 생성 중...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  전략 생성하기
                </>
              )}
                  </Button>
                </div>
              </CardContent>
            </Card>
    </div>
  )
}
