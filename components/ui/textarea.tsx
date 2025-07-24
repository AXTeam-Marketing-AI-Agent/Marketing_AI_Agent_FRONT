/**
 * 텍스트영역 컴포넌트
 * 
 * 이 컴포넌트는 기본 HTML textarea 요소를 확장하여
 * 스타일링과 접근성을 개선한 버전입니다.
 * 다크 모드와 포커스 상태에 대한 스타일링이 포함되어 있습니다.
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Textarea 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @param {Object} props... - 기타 HTML textarea 속성들
 * 
 * 특징:
 * - 반응형 디자인 (모바일/데스크톱)
 * - 최소 높이 설정
 * - 포커스/호버 상태 스타일링
 * - 다크 모드 지원
 * - 접근성 고려 (aria-invalid 등)
 * - 비활성화 상태 스타일링
 * 
 * @returns {JSX.Element} 스타일이 적용된 텍스트영역
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
