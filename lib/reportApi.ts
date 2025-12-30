import API from './axios';

// 검사 결과 타입 정의
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

// 검사 결과 저장
export async function saveReport(data: ReportData) {
  try {
    const response = await API.post('/report', data);
    return response.data;
  } catch (error) {
    console.error('검사 결과 저장 실패:', error);
    throw error;
  }
}

// 검사 결과 목록 조회
export async function getReports(): Promise<ReportResponse[]> {
  try {
    const response = await API.get('/report');
    return response.data.data;
  } catch (error) {
    console.error('검사 결과 목록 조회 실패:', error);
    throw error;
  }
}

// 검사 결과 상세 조회
export async function getReportByDayOfWeek(dayOfWeek: number): Promise<ReportResponse> {
  try {
    const response = await API.get(`/report/${dayOfWeek}`);
    return response.data.data;
  } catch (error) {
    console.error('검사 결과 상세 조회 실패:', error);
    throw error;
  }
}

