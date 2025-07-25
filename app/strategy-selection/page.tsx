"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { type File, FileText, Upload, Loader2, CheckCircle, Search, Sparkles, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createStrategy } from "@/utils/api"; // 상단에 추가

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

export default function StrategySelectionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawFactbookId = searchParams.get("factbook")
  const factbookId = rawFactbookId // 쿼리스트링 값 그대로 사용
  const [selectedFactbook, setSelectedFactbook] = useState<any>(null)
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [creator, setCreator] = useState("")
  const [description, setDescription] = useState("")

  // 실제 팩트북 상세 fetch
  useEffect(() => {
    if (!factbookId) return;
            fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/factbooks/${factbookId}`)
      .then(res => {
        if (!res.ok) throw new Error("팩트북 정보를 불러오지 못했습니다.")
        return res.json()
      })
      .then(data => setSelectedFactbook(data))
      .catch(e => setError(e.message))
  }, [factbookId])

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

  const handleGenerateStrategy = async () => {
    if (!selectedStrategy) return;
    setIsGenerating(true);
    setError(null);

    try {
      const data = await createStrategy({
        factbook_id: factbookId || "",
        strategy_type: selectedStrategy,
        objective: additionalInfo,
        creator,
        description,
        files: uploadedFiles,
      });
      router.push(`/strategy-result?strategy=${data.id}`);
    } catch (e: any) {
      setError(e.message || "전략 생성에 실패했습니다.");
      setIsGenerating(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    if (extension === 'pdf') {
      return <FileText className="w-4 h-4 text-red-500" />
    } else if (["doc", "docx"].includes(extension || '')) {
      return <FileText className="w-4 h-4 text-blue-500" />
    } else if (["ppt", "pptx"].includes(extension || '')) {
      return <FileText className="w-4 h-4 text-orange-500" />
    } else {
      return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  // 단계별 진행 텍스트 및 아이콘 (애니메이션 없이)
  const steps = [
    {
      label: "AI 인사이트 도출 중...",
      icon: <Search className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "AI 전략 수립 중...",
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
    },
    {
      label: "DB에 저장 중...",
      icon: <Database className="w-5 h-5 text-green-500" />,
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {isGenerating ? (
        <div className="flex flex-col items-center py-12">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h3 className="text-lg font-semibold mb-2">전략 생성 중...</h3>
          <p className="text-gray-600 mb-4">AI가 브랜드 데이터를 분석하여 전략을 생성하고 있습니다.</p>
          <div className="w-full max-w-xs mx-auto mb-4">
            <div className="space-y-3">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  {step.icon}
                  <span className="text-gray-700">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-sm text-gray-500 mb-2">잠시만 기다려주세요.</div>
          <div className="text-xs text-gray-400">완료되면 자동으로 결과 페이지로 이동합니다.</div>
        </div>
      ) : (
        <>
          {/* 헤더 섹션 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">전략 생성</h1>
              <Button variant="outline" onClick={() => router.back()}>
                뒤로가기
              </Button>
            </div>
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{selectedFactbook?.brand_name || "-"}</h2>
                  <p className="text-gray-600">{selectedFactbook?.description || ""}</p>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">{selectedFactbook?.industry}</span>
                  <span>{selectedFactbook?.creator_name}</span>
                </div>
              </div>
            </div>
          </div>
          {/* 전략 유형 선택 섹션 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">전략 유형을 선택해주세요</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategyTypes.map((strategy) => (
                <button
                  key={strategy.id}
                  onClick={() => handleStrategySelect(strategy.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedStrategy === strategy.id
                      ? "border-blue-500 bg-blue-50 scale-[1.02]"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-3xl">{strategy.icon}</span>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-lg mb-2">{strategy.title}</h3>
                      <p className="text-gray-600 mb-3">{strategy.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {strategy.bestFor.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white rounded-full text-xs text-gray-600 border"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* 추가 정보 입력 섹션 */}
          {selectedStrategy && (
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">추가 정보</h2>
              <div className="space-y-6">
                {/* 작성자 입력 */}
                <div>
                  <label htmlFor="creator" className="block text-sm font-medium mb-2">
                    작성자
                  </label>
                  <input
                    id="creator"
                    type="text"
                    value={creator}
                    onChange={e => setCreator(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                {/* 설명 입력 */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    전략 설명
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="전략에 대한 설명을 입력하세요"
                    rows={3}
                  />
                </div>
                {/* 파일 업로드 */}
                <div>
                  <label className="block text-sm font-medium mb-2">RFP 또는 참고 자료</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-12"
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      파일 선택하기
                    </Button>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center space-x-3">
                            {getFileIcon(file.name)}
                            <span className="text-sm font-medium">{file.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            삭제
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                      AI가 해당 파일을 참고하여 맞춤형 전략을 생성합니다. PDF, Word, txt 문서 형식의 파일을 업로드할 수 있습니다.
                  </p>
                </div>
                {/* 추가 정보 입력 */}
                <div>
                  <label htmlFor="additionalInfo" className="block text-sm font-medium mb-2">
                    전략 목표 및 참고사항
                  </label>
                  <textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    placeholder="전략의 목표나 참고할 사항을 자유롭게 입력해주세요."
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
                </div>
                {/* 생성 버튼 */}
                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleGenerateStrategy}
                    className="px-8 h-12 text-base"
                    disabled={!selectedStrategy || isGenerating}
                  >
                    전략 생성하기
                  </Button>
                </div>
                {error && <div className="text-red-500 mt-2">{error}</div>}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
