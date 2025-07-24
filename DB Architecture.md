#1. 핵심 엔터티(테이블) 설계

## 1) Factbook (팩트북)
id (PK)
brand_name (브랜드명)
industry (업종)
creator_name (작성자)
description (브랜드 설명)
vision (비전)
history (JSON or 별도 테이블)
performance (JSON or 별도 테이블)
services (JSON or 별도 테이블)
key_people (JSON or 별도 테이블)
issues (JSON or 별도 테이블)
consumer_reactions (JSON or 별도 테이블)
market_analysis (JSON or 별도 테이블)
competitor_analysis (JSON or 별도 테이블)
communication (JSON or 별도 테이블)
created_at
updated_at
rfp_file_url (첨부파일 경로, 선택)

## 2) Strategy (전략)
id (PK)
factbook_id (FK, Factbook)
type (전략 카테고리)
objective (전략 목표)
creator_name (작성자)
content (전략 상세 내용, JSON or TEXT)
reference_file_url (첨부파일 경로, 선택)
created_at
updated_at

3) Activity (활동 기록)
id (PK)
user_name (사용자명)
type (ex: factbook_created, strategy_created, factbook_edited 등)
factbook_id (FK, Factbook, 선택)
strategy_id (FK, Strategy, 선택)
description (활동 설명)
created_at
