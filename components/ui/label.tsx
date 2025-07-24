/**
 * 라벨 컴포넌트
 * 
 * 이 컴포넌트는 Radix UI의 Label 컴포넌트를 기반으로 하며,
 * 폼 요소들과의 연동을 위한 접근성 기능을 제공합니다.
 * 클라이언트 사이드 렌더링을 위해 "use client" 지시문을 사용합니다.
 */

"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

/**
 * Label 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @param {Object} props... - Radix UI Label 컴포넌트의 속성들
 * 
 * 특징:
 * - 폼 요소와의 연동을 위한 접근성 지원
 * - 비활성화 상태 스타일링
 * - 그룹 데이터 속성을 통한 상태 관리
 * - 선택 불가능한 텍스트
 * 
 * @returns {JSX.Element} 스타일이 적용된 라벨 컴포넌트
 */
function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
