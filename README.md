# 마케팅 전략 AI Agent

대홍기획 사내 마케팅 전략 수립을 위한 AI 기반 팩트북 생성 및 전략 도출 시스템

## 📋 프로젝트 개요

이 시스템은 브랜드별 팩트북을 자동 생성하고, 이를 기반으로 다양한 마케팅 전략을 AI가 제안하는 도구입니다.

### 주요 기능
- 🔍 **팩트북 자동 생성**: 브랜드 정보 입력 시 7개 섹션별 데이터 자동 수집
- 🎯 **전략 생성**: TV 광고, 퍼포먼스 마케팅, SNS 콘텐츠 등 5가지 전략 유형 지원
- 💬 **AI 채팅**: 생성된 전략에 대한 상세 질의응답
- 📊 **관리자 대시보드**: LLM 사용량 및 비용 모니터링
- 📚 **서비스 가이드북**: 사용자 매뉴얼 제공

## 🛠 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: FastAPI, Python
- **Database**: PostgreSQL
- **AI/LLM**: OpenAI GPT, Claude, Gemini, Perplexity
- **Deployment**: Vercel

## 🏗 시스템 구조

```
marketing_strategy_ui/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 팩트북 라이브러리 (메인)
│   ├── create-factbook/   # 팩트북 생성
│   ├── factbook/[id]/    # 팩트북 상세
│   ├── strategy-selection/ # 전략 유형 선택
│   ├── strategy-result/   # 전략 결과
│   ├── admin-llm-logs/   # 관리자 대시보드
│   └── manual/           # 서비스 가이드북
├── components/           # 재사용 컴포넌트
└── lib/                 # 유틸리티 함수
```

## 🚀 실행 방법

### 개발 환경
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 프로덕션 빌드
```bash
# 빌드
npm run build

# 프로덕션 실행
npm start
```

## 🔐 보안

- 보안 코드 인증 시스템 (8시간 갱신)
- 사내 전용 시스템으로 설계
- LLM API 사용량 모니터링 및 비용 관리

## 👨‍💻 개발자 정보

**개발자**: 임주혁  
**소속**: 대홍기획 AX Team  
**이메일**: juhyeok1104@gmail.com  

## 📄 라이센스

이 프로젝트는 대홍기획 사내 시스템으로 개발되었습니다.

---

**© 2025 임주혁, 대홍기획. All rights reserved.**
