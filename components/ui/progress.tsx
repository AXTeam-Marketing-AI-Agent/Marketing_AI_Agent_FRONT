/**
 * 프로그레스 컴포넌트
 * 
 * 이 컴포넌트는 Radix UI의 Progress 컴포넌트를 기반으로 하며,
 * 작업 진행 상태를 시각적으로 표시하는 프로그레스 바를 구현합니다.
 * 클라이언트 사이드 렌더링을 위해 "use client" 지시문을 사용합니다.
 */

"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

/**
 * Progress 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @param {number} [props.value] - 진행률 (0-100 사이의 값)
 * @param {Object} props... - Radix UI Progress 컴포넌트의 속성들
 * 
 * 특징:
 * - 부드러운 애니메이션 전환 효과
 * - 반응형 디자인
 * - 접근성 지원
 * - 커스터마이즈 가능한 스타일링
 * 
 * @returns {JSX.Element} 프로그레스 바 컴포넌트
 */
function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
