/**
 * 인기 팩트북 페이지 로딩 컴포넌트
 * 
 * 인기 팩트북 페이지가 로딩되는 동안 표시되는 로딩 상태 컴포넌트입니다.
 * Next.js의 자동 로딩 UI 기능을 활용하여 페이지 전환 시 자연스러운 사용자 경험을 제공합니다.
 * 
 * @returns {JSX.Element} 로딩 상태를 표시하는 컴포넌트
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-8">
          {/* 헤더 스켈레톤 */}
          <div className="h-16 bg-gray-200 rounded-lg" />

          {/* 필터 섹션 스켈레톤 */}
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded-lg" />
            <div className="flex gap-4">
              <div className="h-10 w-[180px] bg-gray-200 rounded-lg" />
              <div className="h-10 w-[180px] bg-gray-200 rounded-lg" />
            </div>
          </div>

          {/* 팩트북 카드 스켈레톤 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-6 bg-gray-200 rounded w-16" />
                    <div className="h-6 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 스켈레톤 */}
          <div className="flex justify-center gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-200 rounded" />
            <div className="h-8 w-8 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  )
} 