/**
 * 배지 컴포넌트
 * 
 * 이 컴포넌트는 Radix UI의 Slot 컴포넌트와 class-variance-authority를 사용하여
 * 다양한 스타일의 배지를 구현합니다.
 * 상태 표시, 카운터, 태그 등에 사용할 수 있습니다.
 */

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * 배지의 스타일 변형을 정의하는 cva 설정
 * 
 * 기본 스타일:
 * - 인라인 플렉스 레이아웃
 * - 중앙 정렬
 * - 둥근 모서리
 * - 테두리
 * - 작은 텍스트 크기
 * - 아이콘 지원
 * 
 * variants:
 * - variant: 배지의 시각적 스타일
 *   - default: 기본 스타일 (primary 색상)
 *   - secondary: 보조 스타일
 *   - destructive: 경고/에러 스타일
 *   - outline: 테두리만 있는 스타일
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Badge 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @param {string} [props.variant] - 배지 스타일 변형
 * @param {boolean} [props.asChild=false] - Slot 컴포넌트로 렌더링할지 여부
 * @param {Object} props... - 기타 HTML span 속성들
 * 
 * 특징:
 * - 다양한 스타일 변형
 * - 링크로 사용 가능 (a 태그로 렌더링)
 * - 아이콘 지원
 * - 접근성 고려
 * - 다크 모드 지원
 * 
 * @returns {JSX.Element} 스타일이 적용된 배지 컴포넌트
 */
function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
