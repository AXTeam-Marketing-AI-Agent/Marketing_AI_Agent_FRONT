-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_organizations_updated_at 
    BEFORE UPDATE ON organizations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_factbooks_updated_at 
    BEFORE UPDATE ON factbooks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategies_updated_at 
    BEFORE UPDATE ON strategies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at 
    BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 팩트북 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_factbook_views(factbook_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE factbooks 
    SET views_count = views_count + 1 
    WHERE id = factbook_uuid;
END;
$$ LANGUAGE plpgsql;

-- 팩트북의 전략 수 업데이트 함수
CREATE OR REPLACE FUNCTION update_factbook_strategies_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE factbooks 
        SET strategies_count = strategies_count + 1 
        WHERE id = NEW.factbook_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE factbooks 
        SET strategies_count = strategies_count - 1 
        WHERE id = OLD.factbook_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_strategies_count_trigger
    AFTER INSERT OR DELETE ON strategies
    FOR EACH ROW EXECUTE FUNCTION update_factbook_strategies_count();

-- 활동 로그 자동 생성 함수
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
    action_name VARCHAR(100);
    entity_type_name VARCHAR(50);
BEGIN
    -- 테이블명에서 entity_type 추출
    entity_type_name := CASE TG_TABLE_NAME
        WHEN 'factbooks' THEN 'factbook'
        WHEN 'strategies' THEN 'strategy'
        ELSE TG_TABLE_NAME
    END;
    
    -- 작업 유형 결정
    action_name := CASE TG_OP
        WHEN 'INSERT' THEN 'created'
        WHEN 'UPDATE' THEN 'updated'
        WHEN 'DELETE' THEN 'deleted'
    END;
    
    -- 활동 로그 삽입
    IF TG_OP = 'DELETE' THEN
        INSERT INTO activity_logs (action, entity_type, entity_id, user_id)
        VALUES (action_name, entity_type_name, OLD.id, OLD.created_by);
        RETURN OLD;
    ELSE
        INSERT INTO activity_logs (action, entity_type, entity_id, user_id)
        VALUES (action_name, entity_type_name, NEW.id, NEW.created_by);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 활동 로그 트리거
CREATE TRIGGER factbooks_activity_log
    AFTER INSERT OR UPDATE OR DELETE ON factbooks
    FOR EACH ROW EXECUTE FUNCTION log_activity();

CREATE TRIGGER strategies_activity_log
    AFTER INSERT OR UPDATE OR DELETE ON strategies
    FOR EACH ROW EXECUTE FUNCTION log_activity();
