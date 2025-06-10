-- 팩트북 상세 정보 뷰
CREATE VIEW factbook_details AS
SELECT 
    f.*,
    u.name as created_by_name,
    u.email as created_by_email,
    o.name as organization_name,
    COALESCE(s.strategy_count, 0) as actual_strategies_count,
    COALESCE(c.comment_count, 0) as comments_count
FROM factbooks f
LEFT JOIN users u ON f.created_by = u.id
LEFT JOIN organizations o ON f.organization_id = o.id
LEFT JOIN (
    SELECT factbook_id, COUNT(*) as strategy_count 
    FROM strategies 
    GROUP BY factbook_id
) s ON f.id = s.factbook_id
LEFT JOIN (
    SELECT entity_id, COUNT(*) as comment_count 
    FROM comments 
    WHERE entity_type = 'factbook' 
    GROUP BY entity_id
) c ON f.id = c.entity_id;

-- 전략 상세 정보 뷰
CREATE VIEW strategy_details AS
SELECT 
    s.*,
    f.brand_name,
    f.industry,
    u.name as created_by_name,
    u.email as created_by_email,
    a.name as approved_by_name,
    COALESCE(c.comment_count, 0) as comments_count
FROM strategies s
LEFT JOIN factbooks f ON s.factbook_id = f.id
LEFT JOIN users u ON s.created_by = u.id
LEFT JOIN users a ON s.approved_by = a.id
LEFT JOIN (
    SELECT entity_id, COUNT(*) as comment_count 
    FROM comments 
    WHERE entity_type = 'strategy' 
    GROUP BY entity_id
) c ON s.id = c.entity_id;

-- 최근 활동 뷰
CREATE VIEW recent_activities AS
SELECT 
    al.*,
    u.name as user_name,
    CASE 
        WHEN al.entity_type = 'factbook' THEN f.brand_name
        WHEN al.entity_type = 'strategy' THEN s.title
    END as entity_name
FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.id
LEFT JOIN factbooks f ON al.entity_type = 'factbook' AND al.entity_id = f.id
LEFT JOIN strategies s ON al.entity_type = 'strategy' AND al.entity_id = s.id
ORDER BY al.created_at DESC;

-- 조직별 통계 뷰
CREATE VIEW organization_stats AS
SELECT 
    o.id,
    o.name,
    COUNT(DISTINCT u.id) as user_count,
    COUNT(DISTINCT f.id) as factbook_count,
    COUNT(DISTINCT s.id) as strategy_count,
    SUM(f.views_count) as total_views
FROM organizations o
LEFT JOIN users u ON o.id = u.organization_id
LEFT JOIN factbooks f ON o.id = f.organization_id
LEFT JOIN strategies s ON f.id = s.factbook_id
GROUP BY o.id, o.name;

-- 검색 함수
CREATE OR REPLACE FUNCTION search_factbooks(
    search_term TEXT,
    org_id UUID DEFAULT NULL,
    industry_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    brand_name VARCHAR(255),
    industry VARCHAR(100),
    description TEXT,
    created_by_name VARCHAR(255),
    views_count INTEGER,
    strategies_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        fd.id,
        fd.brand_name,
        fd.industry,
        fd.description,
        fd.created_by_name,
        fd.views_count,
        fd.actual_strategies_count,
        fd.created_at,
        ts_rank(
            to_tsvector('korean', fd.brand_name || ' ' || COALESCE(fd.description, '')),
            plainto_tsquery('korean', search_term)
        ) as rank
    FROM factbook_details fd
    WHERE 
        (org_id IS NULL OR fd.organization_id = org_id)
        AND (industry_filter IS NULL OR fd.industry = industry_filter)
        AND (
            search_term IS NULL OR search_term = '' OR
            to_tsvector('korean', fd.brand_name || ' ' || COALESCE(fd.description, '')) 
            @@ plainto_tsquery('korean', search_term)
        )
    ORDER BY 
        CASE WHEN search_term IS NULL OR search_term = '' THEN fd.created_at END DESC,
        CASE WHEN search_term IS NOT NULL AND search_term != '' THEN rank END DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql;
