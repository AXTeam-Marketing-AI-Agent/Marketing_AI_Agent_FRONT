-- 사용자 및 조직 관리
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member', -- admin, manager, member
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 팩트북 관리
CREATE TABLE factbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL,
    description TEXT,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
    
    -- 브랜드 기본 정보
    brand_data JSONB DEFAULT '{}',
    
    -- 팩트북 섹션별 데이터
    company_data JSONB DEFAULT '{}',
    issues_data JSONB DEFAULT '{}',
    consumer_data JSONB DEFAULT '{}',
    market_data JSONB DEFAULT '{}',
    competitors_data JSONB DEFAULT '{}',
    communication_data JSONB DEFAULT '{}',
    competitor_communication_data JSONB DEFAULT '{}',
    
    -- 메타데이터
    views_count INTEGER DEFAULT 0,
    strategies_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 전략 관리
CREATE TABLE strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factbook_id UUID REFERENCES factbooks(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL, -- tv-advertising, performance-marketing, etc.
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- 전략 데이터
    strategy_data JSONB DEFAULT '{}',
    
    -- 메타데이터
    status VARCHAR(50) DEFAULT 'draft', -- draft, completed, approved, rejected
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 파일 관리
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_path TEXT NOT NULL,
    
    -- 연관 관계 (polymorphic)
    entity_type VARCHAR(50) NOT NULL, -- factbook, strategy
    entity_id UUID NOT NULL,
    
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 댓글 및 피드백
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    
    -- 연관 관계 (polymorphic)
    entity_type VARCHAR(50) NOT NULL, -- factbook, strategy
    entity_id UUID NOT NULL,
    
    -- 대댓글 지원
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 활동 로그
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL, -- created, updated, viewed, shared, etc.
    
    -- 연관 관계 (polymorphic)
    entity_type VARCHAR(50) NOT NULL, -- factbook, strategy
    entity_id UUID NOT NULL,
    
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 즐겨찾기
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- 연관 관계 (polymorphic)
    entity_type VARCHAR(50) NOT NULL, -- factbook, strategy
    entity_id UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, entity_type, entity_id)
);

-- 태그 시스템
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) DEFAULT '#6B7280', -- hex color
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(name, organization_id)
);

CREATE TABLE entity_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    
    -- 연관 관계 (polymorphic)
    entity_type VARCHAR(50) NOT NULL, -- factbook, strategy
    entity_id UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(tag_id, entity_type, entity_id)
);

-- 인덱스 생성
CREATE INDEX idx_factbooks_organization_id ON factbooks(organization_id);
CREATE INDEX idx_factbooks_created_by ON factbooks(created_by);
CREATE INDEX idx_factbooks_status ON factbooks(status);
CREATE INDEX idx_factbooks_industry ON factbooks(industry);
CREATE INDEX idx_factbooks_created_at ON factbooks(created_at DESC);

CREATE INDEX idx_strategies_factbook_id ON strategies(factbook_id);
CREATE INDEX idx_strategies_type ON strategies(type);
CREATE INDEX idx_strategies_status ON strategies(status);
CREATE INDEX idx_strategies_created_by ON strategies(created_by);
CREATE INDEX idx_strategies_created_at ON strategies(created_at DESC);

CREATE INDEX idx_files_entity ON files(entity_type, entity_id);
CREATE INDEX idx_comments_entity ON comments(entity_type, entity_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- 전문 검색을 위한 인덱스 (PostgreSQL)
CREATE INDEX idx_factbooks_search ON factbooks USING gin(
    to_tsvector('korean', brand_name || ' ' || COALESCE(description, ''))
);

CREATE INDEX idx_strategies_search ON strategies USING gin(
    to_tsvector('korean', title || ' ' || COALESCE(description, ''))
);
