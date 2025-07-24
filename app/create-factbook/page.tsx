/**
 * 팩트북 생성 페이지
 * 
 * 이 페이지는 마케팅 전략 팩트북을 생성하기 위한 페이지입니다.
 * 사용자가 최소한의 정보만 입력하여 빠르게 팩트북을 생성할 수 있도록 합니다.
 * 
 * 필수 입력 항목:
 * 1. 작성자 이름
 * 2. 브랜드명
 * 
 * 선택 입력 항목:
 * - RFP 파일 업로드
 * 
 * 주요 기능:
 * - 간단한 정보 입력
 * - RFP 파일 업로드
 * - 팩트북 생성 및 결과 페이지로 이동
 */

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight, Upload, FileText, CheckCircle, Loader2, Search, Sparkles, Database } from "lucide-react"
import { createFactbook } from "@/utils/api" // 경로는 실제 위치에 맞게

export default function CreateFactbookPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    creatorName: "",
    brandName: "",
    rfpFile: null as File | null,
    industry: "",
    description: "", // 추가
  })
  const [progressStep, setProgressStep] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // 진행 단계 텍스트 및 아이콘
  const steps = [
    {
      label: "AI 정보 수집 중...",
      icon: <Search className="w-5 h-5 text-blue-500 animate-pulse" />,
    },
    {
      label: "정보 요약 및 인사이트 도출 중...",
      icon: <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />,
    },
    {
      label: "DB에 저장 중...",
      icon: <Database className="w-5 h-5 text-green-500 animate-pulse" />,
    },
  ]

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
   * 폼 제출 처리
   */

const handleSubmit = async () => {
  if (!formData.creatorName || !formData.brandName || !formData.industry) return

    setIsGenerating(true)
  setProgressStep(0)

  try {
    // 실제 API 호출
    const created = await createFactbook({
      creator_name: formData.creatorName,
      brand_name: formData.brandName,
      industry: formData.industry,
      rfpFile: formData.rfpFile,
      description: formData.description,
    })
    // 생성된 id로 이동
    router.push(`/factbook/${created.factbook_id}`)
  } catch (e) {
    alert("팩트북 생성에 실패했습니다.")
  } finally {
    setIsGenerating(false)
    setProgressStep(0)
  }
}

  /**
   * 필수 입력 항목 검증
   */
  const canSubmit = formData.creatorName && formData.brandName && formData.industry

        return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>새 팩트북 생성</CardTitle>
              <CardDescription>
                마케팅 전략 팩트북 생성을 위한 기본 정보를 입력해주세요.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <h3 className="text-lg font-semibold mb-2">팩트북 생성 중...</h3>
              <p className="text-gray-600 mb-4">AI가 브랜드 데이터를 분석하여 팩트북을 생성하고 있습니다.</p>
              <div className="w-full max-w-xs mx-auto mb-4">
                <div className="space-y-3">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      {progressStep > idx ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : progressStep === idx ? (
                        step.icon
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-gray-300" />
                      )}
                      <span className={progressStep === idx ? "font-semibold text-blue-700" : progressStep > idx ? "text-green-700" : "text-gray-500"}>
                        {step.label}
                      </span>
                  </div>
                ))}
              </div>
            </div>
              <div className="text-sm text-gray-500 mb-2">예상 소요 시간: 약 3~4분</div>
              <div className="text-xs text-gray-400">완료되면 자동으로 상세 페이지로 이동합니다.</div>
            </div>
          ) : (
          <div className="space-y-6">
              {/* 작성자 이름 입력 */}
              <div className="space-y-2">
                <Label htmlFor="creatorName">작성자 이름 *</Label>
                <Input
                  id="creatorName"
                  placeholder="이름을 입력해주세요"
                  value={formData.creatorName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, creatorName: e.target.value }))}
              />
            </div>

              {/* 브랜드명 입력 */}
              <div className="space-y-2">
                <Label htmlFor="brandName">브랜드명 *</Label>
                <Input
                  id="brandName"
                  placeholder="브랜드명을 입력해주세요"
                  value={formData.brandName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, brandName: e.target.value }))}
              />
            </div>

              {/* 업종 선택 */}
              <div className="space-y-2">
                <Label htmlFor="industry">업종 *</Label>
              <Select
                  value={formData.industry}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
              >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="업종을 선택해주세요" />
                </SelectTrigger>
                <SelectContent>
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
            </div>

              {/* RFP 파일 업로드
              <div className="space-y-2">
                <Label htmlFor="rfpFile">관련 파일 (선택)</Label>
                <div className="flex items-center space-x-4">
              <Input
                    id="rfpFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("rfpFile")?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.rfpFile ? "파일 변경하기" : "파일 선택하기"}
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
                  PDF, Word, txt 문서 형식의 파일을 업로드할 수 있습니다. (RFP, 브리프와 같은 파일을 업로드해주세요)
                </p>
              </div> */}

              {/* 설명 입력 */}
              <div className="space-y-2">
                <Label htmlFor="description">설명 (선택)</Label>
                <textarea
                  id="description"
                  name="description"
                  className="w-full border rounded px-3 py-2 mb-4 text-sm"
                  placeholder="팩트북에 대한 간단한 설명을 입력하세요."
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* 생성 버튼 */}
                    <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={!canSubmit || isGenerating}
                    >
                      {isGenerating ? (
                        <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          팩트북 생성 중...
                        </>
                      ) : (
                        <>
                    <ArrowRight className="mr-2 h-4 w-4" />
                          팩트북 생성하기
                        </>
                      )}
                    </Button>
            </div>
          )}
                </CardContent>
              </Card>
    </div>
  )
}
