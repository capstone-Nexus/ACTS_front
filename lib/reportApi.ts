import API from './axios';

export interface CatScores {
  simple: number;
  sustained: number;
  interference: number;
  divided: number;
  working_memory: number;
}

export interface ReportData {
  day_of_week: number;
  p_final: number;
  label_final: number;
  cat_scores_100: CatScores;
}

export interface ReportResponse {
  idx: number;
  day_of_week: number;
  p_final: number;
  label_final: number;
  cat_score: CatScores & { idx: number };
  reported_at: string;
  score?: number;
}

export async function saveReport(data: ReportData) {
  try {
    console.log('📤 백엔드로 저장 요청:', data);
    const response = await API.post('/report', data);
    console.log('✅ 백엔드 저장 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('검사 결과 저장 실패:', error);
    throw error;
  }
}

export async function getReports(): Promise<ReportResponse[]> {
  try {
    const response = await API.get('/report');
    console.log('📥 백엔드 조회 응답:', response.data);
    console.log('📊 전체 결과 개수:', response.data.data?.length || 0);
    return response.data.data;
  } catch (error) {
    console.error('검사 결과 목록 조회 실패:', error);
    throw error;
  }
}

export async function getReportByDayOfWeek(dayOfWeek: number): Promise<ReportResponse> {
  try {
    const response = await API.get(`/report/${dayOfWeek}`);
    return response.data.data;
  } catch (error) {
    console.error('검사 결과 상세 조회 실패:', error);
    throw error;
  }
}

