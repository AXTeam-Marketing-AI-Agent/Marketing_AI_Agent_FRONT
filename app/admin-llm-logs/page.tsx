"use client";
import React, { useEffect, useState, useMemo } from "react";

interface LLMLog {
  id: number;
  created_at: string;
  user_id: string | null;
  strategy_id: number | null;
  factbook_id: number | null;
  llm_type: string;
  prompt_type: string;
  prompt_length: number | null;
  completion_length: number | null;
  total_tokens: number | null;
  elapsed_time: number | null;
  status: string;
  error_message: string | null;
}

// LLM 모델별 토큰 가격 정보 (USD per 1K tokens)
const TOKEN_PRICES: Record<string, { input: number; output: number }> = {
  // OpenAI GPT models
  "gpt-4": { input: 0.03, output: 0.06 },
  "gpt-4-turbo": { input: 0.01, output: 0.03 },
  "gpt-3.5-turbo": { input: 0.0005, output: 0.0015 },
  
  // Claude models
  "claude-3-opus": { input: 0.015, output: 0.075 },
  "claude-3-sonnet": { input: 0.003, output: 0.015 },
  "claude-3-haiku": { input: 0.00025, output: 0.00125 },
  
  // Perplexity Sonar
  "sonar": { input: 0.001, output: 0.001 },
  "perplexity-sonar": { input: 0.001, output: 0.001 },
  
  // Google Gemini models
  "gemini-2.5-flash": { input: 0.0003, output: 0.001 }, // 텍스트/이미지/동영상: $0.30/$1.00 per 1M tokens
  "gemini-2.5-pro": { input: 0.00125, output: 0.0025 }, // <=200K tokens: $1.25/$2.50, >200K: $2.50/$10.00
  "gemini-pro": { input: 0.00035, output: 0.00105 },
  "gemini-1.5-pro": { input: 0.00125, output: 0.0025 },
  "gemini-flash": { input: 0.0003, output: 0.001 },
};

// 기본 가격 (알 수 없는 모델용)
const DEFAULT_PRICE = { input: 0.001, output: 0.003 };

export default function AdminLLMLogsPage() {
  const [logs, setLogs] = useState<LLMLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [llmTypeFilter, setLlmTypeFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<LLMLog | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:8000/llm-logs?limit=200")
      .then((res) => {
        if (!res.ok) throw new Error("로그 데이터를 불러오지 못했습니다.");
        return res.json();
      })
      .then((data) => setLogs(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // 토큰 비용 계산 함수
  const calculateTokenCost = (log: LLMLog) => {
    const modelName = log.llm_type.toLowerCase();
    const prices = TOKEN_PRICES[modelName] || DEFAULT_PRICE;
    
    const inputTokens = log.prompt_length || 0;
    const outputTokens = log.completion_length || 0;
    
    const inputCost = (inputTokens / 1000) * prices.input;
    const outputCost = (outputTokens / 1000) * prices.output;
    const totalCost = inputCost + outputCost;
    
    return { inputCost, outputCost, totalCost, inputTokens, outputTokens };
  };

  // 필터링된 로그
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = 
        searchTerm === "" ||
        log.prompt_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user_id && log.user_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (log.error_message && log.error_message.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" || log.status === statusFilter;
      const matchesLlmType = llmTypeFilter === "all" || log.llm_type === llmTypeFilter;
      
      return matchesSearch && matchesStatus && matchesLlmType;
    });
  }, [logs, searchTerm, statusFilter, llmTypeFilter]);

  // 통계 계산
  const stats = useMemo(() => {
    const total = filteredLogs.length;
    const success = filteredLogs.filter(log => log.status === "success").length;
    const failed = filteredLogs.filter(log => log.status === "error").length;
    
    // 토큰 통계
    const totalInputTokens = filteredLogs.reduce((sum, log) => sum + (log.prompt_length || 0), 0);
    const totalOutputTokens = filteredLogs.reduce((sum, log) => sum + (log.completion_length || 0), 0);
    const totalTokens = filteredLogs.reduce((sum, log) => sum + (log.total_tokens || 0), 0);
    
    const avgInputTokens = total > 0 ? Math.round(totalInputTokens / total) : 0;
    const avgOutputTokens = total > 0 ? Math.round(totalOutputTokens / total) : 0;
    const avgTokens = total > 0 ? Math.round(totalTokens / total) : 0;
    
    // 비용 통계
    const totalCost = filteredLogs.reduce((sum, log) => {
      const { totalCost } = calculateTokenCost(log);
      return sum + totalCost;
    }, 0);
    
    const avgTime = total > 0 ? Math.round(
      filteredLogs.reduce((sum, log) => sum + (log.elapsed_time || 0), 0) / total
    ) : 0;
    
    return { 
      total, 
      success, 
      failed, 
      avgInputTokens,
      avgOutputTokens, 
      avgTokens, 
      totalInputTokens,
      totalOutputTokens,
      totalTokens,
      totalCost,
      avgTime 
    };
  }, [filteredLogs]);

  // 고유 값들 추출
  const uniqueStatuses = [...new Set(logs.map(log => log.status))];
  const uniqueLlmTypes = [...new Set(logs.map(log => log.llm_type))];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "success":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "error":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Log Dashboard</h1>
          <p className="text-gray-600">사용자 로그 및 성능 모니터링</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 기본 통계 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">총 요청</div>
            <div className="mt-2 flex space-x-4 text-xs">
              <span className="text-green-600">성공: {stats.success}</span>
              <span className="text-red-600">실패: {stats.failed}</span>
            </div>
          </div>
          
          {/* 토큰 통계 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">{stats.totalTokens.toLocaleString()}</div>
            <div className="text-sm text-gray-600">총 토큰</div>
            <div className="mt-2 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-600">입력:</span>
                <span>{stats.totalInputTokens.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">출력:</span>
                <span>{stats.totalOutputTokens.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* 평균 토큰 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-indigo-600">{stats.avgTokens}</div>
            <div className="text-sm text-gray-600">평균 토큰/요청</div>
            <div className="mt-2 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-blue-600">입력:</span>
                <span>{stats.avgInputTokens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">출력:</span>
                <span>{stats.avgOutputTokens}</span>
              </div>
            </div>
          </div>
          
          {/* 비용 통계 */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">{formatCurrency(stats.totalCost)}</div>
            <div className="text-sm text-gray-600">총 비용 (USD)</div>
            <div className="mt-2 text-xs text-gray-500">
              평균: {formatCurrency(stats.totalCost / (stats.total || 1))}/요청
            </div>
          </div>
        </div>

        {/* 추가 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-orange-600">{stats.avgTime}ms</div>
            <div className="text-sm text-gray-600">평균 응답시간</div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-teal-600">
              {stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600">성공률</div>
          </div>
          
                      <div className="bg-white rounded-lg shadow p-6">
              <div className="text-2xl font-bold text-pink-600">
                ₩{Math.round(stats.totalCost * 1366).toLocaleString()}원
              </div>
              <div className="text-sm text-gray-600">총 비용 (₩)</div>
            </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">검색</label>
              <input
                type="text"
                placeholder="프롬프트 타입, 사용자 ID, 에러 메시지..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">상태</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">전체</option>
                {uniqueStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LLM 타입</label>
              <select
                value={llmTypeFilter}
                onChange={(e) => setLlmTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">전체</option>
                {uniqueLlmTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setLlmTypeFilter("all");
                }}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                필터 초기화
              </button>
            </div>
          </div>
        </div>

        {/* 로그 테이블 */}
        <div className="bg-white rounded-lg shadow">
      {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-gray-500">로딩 중...</div>
            </div>
      ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-2">⚠️ 오류 발생</div>
              <div className="text-gray-600">{error}</div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {logs.length === 0 ? "로그가 없습니다." : "검색 조건에 맞는 로그가 없습니다."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">사용자</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">프롬프트 타입</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LLM</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">입력 토큰</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">출력 토큰</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">비용 (USD)</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">시간(ms)</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLogs.map((log) => {
                    const costInfo = calculateTokenCost(log);
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(log.created_at)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                          {log.user_id || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <div className="max-w-xs truncate" title={log.prompt_type}>
                            {log.prompt_type}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {log.llm_type}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          <div className="text-blue-600 font-medium">
                            {costInfo.inputTokens.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          <div className="text-green-600 font-medium">
                            {costInfo.outputTokens.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          <div className="text-red-600 font-medium">
                            {formatCurrency(costInfo.totalCost)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatCurrency(costInfo.inputCost)} + {formatCurrency(costInfo.outputCost)}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                          {log.elapsed_time?.toLocaleString() || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={getStatusBadge(log.status)}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            상세보기
                          </button>
                  </td>
                </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      )}
        </div>

        {/* 페이지네이션 정보 */}
        {filteredLogs.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            총 {filteredLogs.length}개의 로그가 표시되고 있습니다.
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {selectedLog && (() => {
        const costInfo = calculateTokenCost(selectedLog);
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">로그 상세 정보</h3>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>
                
                {/* 비용 계산 요약 */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-3">💰 토큰 비용 분석</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-blue-600 font-medium">입력 토큰</div>
                      <div className="text-lg font-bold">{costInfo.inputTokens.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">{formatCurrency(costInfo.inputCost)}</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-medium">출력 토큰</div>
                      <div className="text-lg font-bold">{costInfo.outputTokens.toLocaleString()}</div>
                      <div className="text-xs text-gray-600">{formatCurrency(costInfo.outputCost)}</div>
                    </div>
                    <div>
                      <div className="text-purple-600 font-medium">총 토큰</div>
                      <div className="text-lg font-bold">{(costInfo.inputTokens + costInfo.outputTokens).toLocaleString()}</div>
                      <div className="text-xs text-gray-600">-</div>
                    </div>
                    <div>
                      <div className="text-red-600 font-medium">총 비용</div>
                      <div className="text-lg font-bold">{formatCurrency(costInfo.totalCost)}</div>
                                             <div className="text-xs text-gray-600">≈ ₩{Math.round(costInfo.totalCost * 1366).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID</label>
                      <div className="text-sm text-gray-900">{selectedLog.id}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">생성 시간</label>
                      <div className="text-sm text-gray-900">{formatDate(selectedLog.created_at)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">사용자 ID</label>
                      <div className="text-sm text-gray-900">{selectedLog.user_id || "-"}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">전략 ID</label>
                      <div className="text-sm text-gray-900">{selectedLog.strategy_id || "-"}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">팩트북 ID</label>
                      <div className="text-sm text-gray-900">{selectedLog.factbook_id || "-"}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">LLM 타입</label>
                      <div className="text-sm text-gray-900">{selectedLog.llm_type}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">소요 시간 (ms)</label>
                      <div className="text-sm text-gray-900">{selectedLog.elapsed_time?.toLocaleString() || "-"}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">총 토큰</label>
                      <div className="text-sm text-gray-900">{selectedLog.total_tokens?.toLocaleString() || "-"}</div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">프롬프트 타입</label>
                    <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{selectedLog.prompt_type}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">상태</label>
                    <span className={getStatusBadge(selectedLog.status)}>
                      {selectedLog.status}
                    </span>
                  </div>
                  
                  {selectedLog.error_message && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">에러 메시지</label>
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                        {selectedLog.error_message}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
} 