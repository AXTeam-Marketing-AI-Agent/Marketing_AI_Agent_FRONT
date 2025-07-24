"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Building2, Users, Target, DollarSign } from "lucide-react"

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

export default function BrandInputPage() {
  const [formData, setFormData] = useState({
    brandName: "",
    industry: "",
    description: "",
    targetAge: [] as string[],
    targetGender: "",
    budget: "",
    goals: "",
    competitors: "",
    channels: [] as string[],
    timeline: "",
  })

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-600 to-cyan-600 border-b border-teal-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" className="mr-4 text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              돌아가기
            </Button>
            <h1 className="text-xl font-bold text-white">브랜드 정보 입력</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">브랜드 기본 정보</h2>
          <p className="text-gray-600">정확한 팩트북 생성을 위해 브랜드의 상세 정보를 입력해주세요.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5" />
                  <span>기본 정보</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                    placeholder="브랜드의 핵심 가치, 제품/서비스 특징, 브랜드 포지셔닝 등을 설명해주세요"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>타겟 고객</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-3 block">연령대 (복수 선택 가능)</Label>
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
                  <Label htmlFor="targetGender">성별</Label>
                  <Select
                    value={formData.targetGender}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, targetGender: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="타겟 성별을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="male">남성</SelectItem>
                      <SelectItem value="female">여성</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Marketing Goals */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>마케팅 목표</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="goals">주요 목표 *</Label>
                  <Textarea
                    id="goals"
                    value={formData.goals}
                    onChange={(e) => setFormData((prev) => ({ ...prev, goals: e.target.value }))}
                    placeholder="예: 브랜드 인지도 향상, 신제품 런칭, 매출 증대, 고객 확보 등"
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
              </CardContent>
            </Card>

            {/* Budget & Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>예산 및 일정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="budget">예산 규모</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="예산 규모를 선택하세요" />
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
                  <Label htmlFor="timeline">캠페인 기간</Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, timeline: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="캠페인 기간을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">1-3개월</SelectItem>
                      <SelectItem value="medium">3-6개월</SelectItem>
                      <SelectItem value="long">6개월 이상</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium mb-3 block">선호 채널 (복수 선택 가능)</Label>
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
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
              <Button variant="outline">임시저장</Button>
              <Button>
                팩트북 생성하기
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">입력 진행률</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">기본 정보</span>
                    <Badge variant={formData.brandName && formData.industry ? "default" : "secondary"}>
                      {formData.brandName && formData.industry ? "완료" : "미완료"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">타겟 고객</span>
                    <Badge variant={formData.targetAge.length > 0 ? "default" : "secondary"}>
                      {formData.targetAge.length > 0 ? "완료" : "미완료"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">마케팅 목표</span>
                    <Badge variant={formData.goals ? "default" : "secondary"}>
                      {formData.goals ? "완료" : "미완료"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">예산 및 일정</span>
                    <Badge variant={formData.budget ? "default" : "secondary"}>
                      {formData.budget ? "완료" : "미완료"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 입력 팁</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>• 브랜드 설명은 구체적으로 작성할수록 정확한 팩트북이 생성됩니다</p>
                  <p>• 타겟 고객은 주요 고객층을 중심으로 선택하세요</p>
                  <p>• 마케팅 목표는 측정 가능한 지표로 설정하는 것이 좋습니다</p>
                  <p>• 경쟁사 정보는 전략 수립에 중요한 참고자료가 됩니다</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
