/**
 * 입력 컴포넌트
 * 
 * 이 컴포넌트는 기본 HTML input 요소를 확장하여 스타일링과 접근성을 개선한 버전입니다.
 * 파일 업로드, 텍스트 입력 등 다양한 입력 타입을 지원하며,
 * 다크 모드와 포커스 상태에 대한 스타일링이 포함되어 있습니다.
 */

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Input 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @param {string} [props.type] - 입력 필드의 타입 (text, file, password 등)
 * @param {Object} props... - 기타 HTML input 속성들
 * 
 * 스타일 특징:
 * - 반응형 디자인 (모바일/데스크톱)
 * - 파일 업로드 스타일링
 * - 포커스/호버 상태 스타일링
 * - 다크 모드 지원
 * - 접근성 고려 (aria-invalid 등)
 * 
 * @returns {JSX.Element} 스타일이 적용된 입력 필드
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
