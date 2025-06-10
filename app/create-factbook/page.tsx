"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Building2, Users, Target, DollarSign, Lightbulb, CheckCircle } from "lucide-react"

const industries = ["식품/음료", "패션/뷰티", "기술/IT", "자동차", "금융", "교육", "헬스케어", "엔터테인먼트", "기타"]

const targetAges = ["10대", "20대", "30대", "40대", "50대", "60대 이상"]

const channels = [
  { id: "tv", label: "TV" },
  { id: "digital", label: "디지털" },
  { id: "print", label: "인쇄매체" },
  { id: "outdoor", label: "옥외광고" },
  { id: "radio", label: "라디오" },
  { id: "social", label: "소셜미디어" },
]

const steps = [
  { id: 1, title: "기본 정보", icon: Building2 },
  { id: 2, title: "타겟 분석", icon: Users },
  { id: 3, title: "마케팅 목표", icon: Target },
  { id: 4, title: "예산 및 채널", icon: DollarSign },
]

export default function CreateFactbookPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    brandName: "",
    industry: "",
    description: "",
    targetAge: [],
    targetGender: "",
    targetIncome: "",
    targetLifestyle: "",
    goals: "",
    competitors: "",
    budget: "",
    timeline: "",
    channels: [],
    uniqueValue: "",
    brandPersonality: "",
  })

  const [isGenerating, setIsGenerating] = useState(false)

  const handleChannelChange = (channelId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      channels: checked ? [...prev.channels, channelId] : prev.channels.filter((id) => id !== channelId),
    }))
  }

  const handleTargetAgeChange = (age: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      targetAge: checked ? [...prev.targetAge, age] : prev.targetAge.filter((a) => a !== age),
    }))
  }

  const getStepProgress = () => {
    let completedFields = 0
    let totalFields = 0

    switch (currentStep) {
      case 1:
        totalFields = 3
        if (formData.brandName) completedFields++
        if (formData.industry) completedFields++
        if (formData.description) completedFields++
        break
      case 2:
        totalFields = 4
        if (formData.targetAge.length > 0) completedFields++
        if (formData.targetGender) completedFields++
        if (formData.targetIncome) completedFields++
        if (formData.targetLifestyle) completedFields++
        break
      case 3:
        totalFields = 3
        if (formData.goals) completedFields++
        if (formData.competitors) completedFields++
        if (formData.uniqueValue) completedFields++
        break
      case 4:
        totalFields = 3
        if (formData.budget) completedFields++
        if (formData.timeline) completedFields++
        if (formData.channels.length > 0) completedFields++
        break
    }

    return (completedFields / totalFields) * 100
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.brandName && formData.industry && formData.description
      case 2:
        return formData.targetAge.length > 0 && formData.targetGender
      case 3:
        return formData.goals && formData.uniqueValue
      case 4:
        return formData.budget && formData.timeline && formData.channels.length > 0
      default:
        return false
    }
  }

  const handleGenerateFactbook = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)
    // Navigate to factbook result
    router.push(`/factbook?id=new&brand=${encodeURIComponent(formData.brandName)}`)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="brandName">브랜드명 *</Label>
              <Input
                id="brandName"
                value={formData.brandName}
                onChange={(e) => setFormData((prev) => ({ ...prev, brandName: e.target.value }))}
                placeholder="예: 스타벅스 코리아"
              />
            </div>

            <div>
              <Label htmlFor="industry">업종 *</Label>
              <Select
                value={formData.industry}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, industry: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="업종을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">브랜드 설명 *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="브랜드의 핵심 가치, 제품/서비스 특징, 브랜드 포지셔닝 등을 상세히 설명해주세요"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="brandPersonality">브랜드 개성</Label>
              <Input
                id="brandPersonality"
                value={formData.brandPersonality}
                onChange={(e) => setFormData((prev) => ({ ...prev, brandPersonality: e.target.value }))}
                placeholder="예: 친근한, 혁신적인, 신뢰할 수 있는, 프리미엄한"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium mb-3 block">주요 타겟 연령대 * (복수 선택 가능)</Label>
              <div className="grid grid-cols-3 gap-3">
                {targetAges.map((age) => (
                  <div key={age} className="flex items-center space-x-2">
                    <Checkbox
                      id={age}
                      checked={formData.targetAge.includes(age)}
                      onCheckedChange={(checked) => handleTargetAgeChange(age, checked as boolean)}
                    />
                    <Label htmlFor={age} className="text-sm">
                      {age}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="targetGender">주요 타겟 성별 *</Label>
              <Select
                value={formData.targetGender}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, targetGender: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="타겟 성별을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="male">남성 중심</SelectItem>
                  <SelectItem value="female">여성 중심</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetIncome">소득 수준</Label>
              <Select
                value={formData.targetIncome}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, targetIncome: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="주요 타겟의 소득 수준" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">저소득층</SelectItem>
                  <SelectItem value="middle-low">중하위층</SelectItem>
                  <SelectItem value="middle">중간층</SelectItem>
                  <SelectItem value="middle-high">중상위층</SelectItem>
                  <SelectItem value="high">고소득층</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetLifestyle">라이프스타일 특성</Label>
              <Textarea
                id="targetLifestyle"
                value={formData.targetLifestyle}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetLifestyle: e.target.value }))}
                placeholder="타겟 고객의 라이프스타일, 관심사, 행동 패턴 등을 설명해주세요"
                rows={3}
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="goals">주요 마케팅 목표 *</Label>
              <Textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => setFormData((prev) => ({ ...prev, goals: e.target.value }))}
                placeholder="예: 브랜드 인지도 20% 향상, 신제품 런칭, 매출 30% 증대, 신규 고객 1만명 확보 등"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="uniqueValue">핵심 차별화 요소 *</Label>
              <Textarea
                id="uniqueValue"
                value={formData.uniqueValue}
                onChange={(e) => setFormData((prev) => ({ ...prev, uniqueValue: e.target.value }))}
                placeholder="경쟁사 대비 우리 브랜드만의 독특한 가치나 강점을 설명해주세요"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="competitors">주요 경쟁사</Label>
              <Input
                id="competitors"
                value={formData.competitors}
                onChange={(e) => setFormData((prev) => ({ ...prev, competitors: e.target.value }))}
                placeholder="예: 투썸플레이스, 이디야커피, 커피빈"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="budget">예산 규모 *</Label>
              <Select
                value={formData.budget}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="마케팅 예산 규모를 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">1억 미만</SelectItem>
                  <SelectItem value="medium">1억 - 10억</SelectItem>
                  <SelectItem value="large">10억 - 100억</SelectItem>
                  <SelectItem value="enterprise">100억 이상</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeline">마케팅 기간 *</Label>
              <Select
                value={formData.timeline}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, timeline: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="마케팅 캠페인 기간을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">1-3개월</SelectItem>
                  <SelectItem value="medium">3-6개월</SelectItem>
                  <SelectItem value="long">6개월 이상</SelectItem>
                  <SelectItem value="ongoing">지속적</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-medium mb-3 block">선호 마케팅 채널 * (복수 선택 가능)</Label>
              <div className="grid grid-cols-2 gap-3">
                {channels.map((channel) => (
                  <div key={channel.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={channel.id}
                      checked={formData.channels.includes(channel.id)}
                      onCheckedChange={(checked) => handleChannelChange(channel.id, checked as boolean)}
                    />
                    <Label htmlFor={channel.id} className="text-sm">
                      {channel.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                팩트북 라이브러리로
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <Lightbulb className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">새 팩트북 생성</h1>
                <p className="text-sm text-gray-500">AI가 브랜드 정보를 분석하여 팩트북을 생성합니다</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">진행 상황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {steps.map((step) => {
                      const Icon = step.icon
                      const isCompleted = currentStep > step.id
                      const isCurrent = currentStep === step.id

                      return (
                        <div
                          key={step.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            isCurrent ? "bg-blue-50 border border-blue-200" : isCompleted ? "bg-green-50" : "bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              isCompleted ? "bg-green-100" : isCurrent ? "bg-blue-100" : "bg-gray-100"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Icon className={`w-4 h-4 ${isCurrent ? "text-blue-600" : "text-gray-400"}`} />
                            )}
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isCurrent ? "text-blue-900" : "text-gray-700"}`}>
                              {step.title}
                            </p>
                            {isCurrent && (
                              <div className="mt-1">
                                <Progress value={getStepProgress()} className="h-1" />
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">💡 입력 팁</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  {currentStep === 1 && (
                    <>
                      <p>• 브랜드 설명은 구체적으로 작성할수록 정확한 팩트북이 생성됩니다</p>
                      <p>• 브랜드의 핵심 가치와 차별점을 명확히 기술하세요</p>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <p>• 주요 고객층을 중심으로 선택하세요</p>
                      <p>• 라이프스타일 정보는 마케팅 전략 수립에 중요합니다</p>
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <p>• 목표는 측정 가능한 지표로 설정하는 것이 좋습니다</p>
                      <p>• 차별화 요소는 전략 수립의 핵심입니다</p>
                    </>
                  )}
                  {currentStep === 4 && (
                    <>
                      <p>• 예산과 기간에 맞는 현실적인 채널을 선택하세요</p>
                      <p>• 타겟 고객이 주로 이용하는 채널을 우선 고려하세요</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    {(() => {
                      const currentStepData = steps.find((s) => s.id === currentStep)
                      const Icon = currentStepData?.icon || Building2
                      return <Icon className="w-5 h-5 text-blue-600" />
                    })()}
                    <span>{steps.find((s) => s.id === currentStep)?.title}</span>
                  </CardTitle>
                  <Badge variant="secondary">
                    {currentStep} / {steps.length}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                {renderStepContent()}

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    이전
                  </Button>

                  {currentStep < steps.length ? (
                    <Button onClick={() => setCurrentStep(currentStep + 1)} disabled={!canProceedToNext()}>
                      다음
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleGenerateFactbook}
                      disabled={!canProceedToNext() || isGenerating}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          팩트북 생성 중...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="w-4 h-4 mr-2" />
                          팩트북 생성하기
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            {formData.brandName && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">입력 정보 미리보기</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">브랜드명:</span>
                      <span className="ml-2">{formData.brandName || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">업종:</span>
                      <span className="ml-2">{formData.industry || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">타겟 연령:</span>
                      <span className="ml-2">{formData.targetAge.join(", ") || "-"}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">예산 규모:</span>
                      <span className="ml-2">{formData.budget || "-"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
