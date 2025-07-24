/**
 * 셀렉트 컴포넌트 시스템
 * 
 * 이 모듈은 Radix UI의 Select 컴포넌트를 기반으로 한
 * 완전한 기능을 갖춘 드롭다운 선택 컴포넌트를 제공합니다.
 * 클라이언트 사이드 렌더링을 위해 "use client" 지시문을 사용합니다.
 */

"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * 기본 Select 컴포넌트
 * 
 * @param {Object} props - Radix UI Select 컴포넌트의 속성들
 * @returns {JSX.Element} 셀렉트 루트 컴포넌트
 */
function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

/**
 * SelectGroup 컴포넌트
 * 
 * @param {Object} props - Radix UI Select Group 컴포넌트의 속성들
 * @returns {JSX.Element} 셀렉트 옵션들을 그룹화하는 컴포넌트
 */
function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

/**
 * SelectValue 컴포넌트
 * 
 * @param {Object} props - Radix UI Select Value 컴포넌트의 속성들
 * @returns {JSX.Element} 선택된 값을 표시하는 컴포넌트
 */
function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

/**
 * SelectTrigger 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @param {"sm" | "default"} [props.size="default"] - 트리거 버튼의 크기
 * @param {React.ReactNode} props.children - 트리거 버튼의 내용
 * 
 * 특징:
 * - 반응형 디자인
 * - 다크 모드 지원
 * - 접근성 지원
 * - 커스터마이즈 가능한 스타일링
 * 
 * @returns {JSX.Element} 셀렉트 트리거 버튼
 */
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default"
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="size-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

/**
 * SelectContent 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @param {React.ReactNode} props.children - 컨텐츠 영역의 내용
 * @param {"popper" | "item-aligned"} [props.position="popper"] - 드롭다운 위치 전략
 * 
 * 특징:
 * - 애니메이션 효과
 * - 스크롤 가능한 컨텐츠
 * - 포지셔닝 전략 지원
 * - 접근성 지원
 * 
 * @returns {JSX.Element} 셀렉트 드롭다운 컨텐츠
 */
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

/**
 * SelectLabel 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @returns {JSX.Element} 셀렉트 그룹의 레이블
 */
function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  )
}

/**
 * SelectItem 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @param {React.ReactNode} props.children - 아이템의 내용
 * 
 * 특징:
 * - 선택 상태 표시
 * - 호버/포커스 상태
 * - 비활성화 상태 지원
 * 
 * @returns {JSX.Element} 셀렉트 옵션 아이템
 */
function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

/**
 * SelectSeparator 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @returns {JSX.Element} 셀렉트 아이템 구분선
 */
function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  )
}

/**
 * SelectScrollUpButton 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @returns {JSX.Element} 셀렉트 컨텐츠 스크롤 업 버튼
 */
function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

/**
 * SelectScrollDownButton 컴포넌트
 * 
 * @param {Object} props - 컴포넌트 속성
 * @param {string} [props.className] - 추가적인 CSS 클래스
 * @returns {JSX.Element} 셀렉트 컨텐츠 스크롤 다운 버튼
 */
function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
