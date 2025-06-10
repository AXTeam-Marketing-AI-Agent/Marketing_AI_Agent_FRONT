-- 샘플 조직 생성
INSERT INTO organizations (id, name, slug) VALUES 
('550e8400-e29b-41d4-a716-446655440000', '마케팅 에이전시', 'marketing-agency'),
('550e8400-e29b-41d4-a716-446655440001', '스타트업 컴퍼니', 'startup-company');

-- 샘플 사용자 생성
INSERT INTO users (id, email, name, organization_id, role) VALUES 
('660e8400-e29b-41d4-a716-446655440000', 'kim.marketer@example.com', '김마케터', '550e8400-e29b-41d4-a716-446655440000', 'manager'),
('660e8400-e29b-41d4-a716-446655440001', 'lee.strategist@example.com', '이전략가', '550e8400-e29b-41d4-a716-446655440000', 'member'),
('660e8400-e29b-41d4-a716-446655440002', 'park.analyst@example.com', '박애널리스트', '550e8400-e29b-41d4-a716-446655440000', 'member');

-- 샘플 팩트북 생성
INSERT INTO factbooks (
    id, 
    brand_name, 
    industry, 
    description, 
    organization_id, 
    created_by,
    status,
    brand_data,
    company_data,
    views_count
) VALUES 
(
    '770e8400-e29b-41d4-a716-446655440000',
    '스타벅스 코리아',
    '식품/음료',
    '프리미엄 커피 브랜드의 한국 시장 진출 전략을 위한 종합 팩트북',
    '550e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    'published',
    '{"targetAge": ["20대", "30대", "40대"], "targetGender": "all", "budget": "large"}',
    '{"overview": {"name": "스타벅스 코리아", "industry": "식품/음료", "founded": "1999년"}}',
    24
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    '나이키 러닝',
    '패션/뷰티',
    '러닝 전문 브랜드로서의 포지셔닝과 MZ세대 타겟팅 전략',
    '550e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440001',
    'published',
    '{"targetAge": ["20대", "30대"], "targetGender": "all", "budget": "enterprise"}',
    '{"overview": {"name": "나이키 러닝", "industry": "패션/뷰티", "founded": "1971년"}}',
    18
);

-- 샘플 전략 생성
INSERT INTO strategies (
    id,
    factbook_id,
    type,
    title,
    description,
    status,
    created_by,
    strategy_data
) VALUES 
(
    '880e8400-e29b-41d4-a716-446655440000',
    '770e8400-e29b-41d4-a716-446655440000',
    'tv-advertising',
    'TV 광고 전략',
    '브랜드 인지도 향상을 위한 TV 광고 캠페인 전략',
    'completed',
    '660e8400-e29b-41d4-a716-446655440000',
    '{"objective": "브랜드 인지도 향상", "budget": "50억원", "timeline": "3개월"}'
),
(
    '880e8400-e29b-41d4-a716-446655440001',
    '770e8400-e29b-41d4-a716-446655440000',
    'sns-content',
    'SNS 콘텐츠 전략',
    'MZ세대 타겟 소셜미디어 마케팅 전략',
    'completed',
    '660e8400-e29b-41d4-a716-446655440000',
    '{"platforms": ["instagram", "tiktok", "youtube"], "budget": "15억원"}'
);

-- 샘플 태그 생성
INSERT INTO tags (id, name, color, organization_id) VALUES 
('990e8400-e29b-41d4-a716-446655440000', '프리미엄', '#3B82F6', '550e8400-e29b-41d4-a716-446655440000'),
('990e8400-e29b-41d4-a716-446655440001', 'MZ세대', '#10B981', '550e8400-e29b-41d4-a716-446655440000'),
('990e8400-e29b-41d4-a716-446655440002', '디지털마케팅', '#8B5CF6', '550e8400-e29b-41d4-a716-446655440000');

-- 샘플 태그 연결
INSERT INTO entity_tags (tag_id, entity_type, entity_id) VALUES 
('990e8400-e29b-41d4-a716-446655440000', 'factbook', '770e8400-e29b-41d4-a716-446655440000'),
('990e8400-e29b-41d4-a716-446655440001', 'factbook', '770e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440002', 'strategy', '880e8400-e29b-41d4-a716-446655440001');
