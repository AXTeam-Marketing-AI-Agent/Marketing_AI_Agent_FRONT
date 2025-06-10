"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { type File, FileText } from "lucide-react"

const factbooks = {
  1: {
    id: 1,
    brandName: "스타벅스 코리아",
    industry: "식품/음료",
    createdDate: "2024-01-15",
    createdBy: "김마케터",
    description: "프리미엄 커피 브랜드의 한국 시장 진출 전략을 위한 종합 팩트북",
  },
  2: {
    id: 2,
    brandName: "나이키 러닝",
    industry: "패션/뷰티",
    createdDate: "2024-01-10",
    createdBy: "이전략가",
    description: "러닝 전문 브랜드로서의 포지셔닝과 MZ세대 타겟팅 전략",
  },
}

const strategyTypes = [
  {
    id: "tv-advertising",
    title: "TV 광고 전략",
    description: "브랜드 인지도 향상을 위한 TV 광고 캠페인 전략",
    icon: "📺",
    estimatedTime: "15-20분",
    complexity: "중급",
    bestFor: ["브랜드 인지도", "대중 노출", "감성 마케팅"],
    color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  },
  {
    id: "performance-marketing",
    title: "퍼포먼스 마케팅",
    description: "전환율 최적화 중심의 디지털 마케팅 전략",
    icon: "📊",
    estimatedTime: "10-15분",
    complexity: "고급",
    bestFor: ["전환율 향상", "ROI 최적화", "데이터 기반"],
    color: "bg-green-50 border-green-200 hover:bg-green-100",
  },
  {
    id: "sns-content",
    title: "SNS 콘텐츠 전략",
    description: "소셜미디어 플랫폼별 맞춤 콘텐츠 전략",
    icon: "📱",
    estimatedTime: "12-18분",
    complexity: "초급",
    bestFor: ["소셜 참여", "바이럴 마케팅", "커뮤니티"],
    color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
  },
  {
    id: "media-mix",
    title: "디지털 미디어믹스",
    description: "통합적인 디지털 미디어 전략 및 예산 배분",
    icon: "🎯",
    estimatedTime: "20-25분",
    complexity: "고급",
    bestFor: ["통합 마케팅", "예산 최적화", "채널 믹스"],
    color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  },
  {
    id: "influencer-marketing",
    title: "인플루언서 마케팅",
    description: "인플루언서 협업을 통한 브랜드 마케팅 전략",
    icon: "👥",
    estimatedTime: "10-15분",
    complexity: "중급",
    bestFor: ["신뢰도 구축", "타겟 도달", "콘텐츠 확산"],
    color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
  },
  {
    id: "brand-positioning",
    title: "브랜드 포지셔닝",
    description: "시장 내 브랜드 위치 설정 및 차별화 전략",
    icon: "🎨",
    estimatedTime: "15-20분",
    complexity: "중급",
    bestFor: ["브랜드 차별화", "시장 포지션", "경쟁 우위"],
    color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
  },
]

const recentStrategies = [
  { brand: "삼성 갤럭시", strategy: "퍼포먼스 마케팅", createdBy: "박애널리스트", date: "2024-01-10" },
  { brand: "나이키 러닝", strategy: "SNS 콘텐츠 전략", createdBy: "이전략가", date: "2024-01-08" },
  { brand: "올리브영", strategy: "인플루언서 마케팅", createdBy: "한뷰티", date: "2024-01-05" },
]

export default function StrategySelectionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const factbookId = searchParams.get("factbook")
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [additionalInfo, setAdditionalInfo] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedFactbook = factbooks[factbookId as keyof typeof factbooks] || factbooks[1]

  const handleStrategySelect = (strategyId: string) => {
    setSelectedStrategy(strategyId)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setUploadedFiles([...uploadedFiles, ...newFiles])
    }
  }

  const handleRemoveFile = (index: number) => {
    const newFiles = [...uploadedFiles]
    newFiles.splice(index, 1)
    setUploadedFiles(newFiles)
  }

  const handleGenerateStrategy = () => {
    if (selectedStrategy) {
      router.push(`/strategy-result?factbook=${factbookId}&strategy=${selectedStrategy}`)
    }
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (extension === 'pdf') {
      return <FileText className="w-4 h-4 text-red-500" />
    } else if (['doc', 'docx'].includes(extension || '')) {
      return <FileText className="w-4 h-4 text-blue-500" />
