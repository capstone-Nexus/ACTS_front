import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getReports, saveReport, ReportResponse, ReportData } from '@/lib/reportApi';

interface TestResultState {
  currentResult: ReportResponse | null;
  previousResult: ReportResponse | null;
  allResults: ReportResponse[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TestResultState = {
  currentResult: null,
  previousResult: null,
  allResults: [],
  isLoading: false,
  error: null,
};

export const fetchTestResults = createAsyncThunk(
  'testResult/fetchResults',
  async () => {
    const reports = await getReports();
    const sorted = reports.sort((a, b) => 
      new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
    );
    return sorted;
  }
);

export const saveTestResult = createAsyncThunk(
  'testResult/saveResult',
  async (data: ReportData) => {
    await saveReport(data);
    const reports = await getReports();
    const sorted = reports.sort((a, b) => 
      new Date(b.reported_at).getTime() - new Date(a.reported_at).getTime()
    );
    return sorted;
  }
);

const testResultSlice = createSlice({
  name: 'testResult',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTestResults.fulfilled, (state, action: PayloadAction<ReportResponse[]>) => {
        state.isLoading = false;
        state.allResults = action.payload;
        state.currentResult = action.payload[0] || null;
        state.previousResult = action.payload[1] || null;
      })
      .addCase(fetchTestResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '데이터 조회 실패';
      })
      .addCase(saveTestResult.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(saveTestResult.fulfilled, (state, action: PayloadAction<ReportResponse[]>) => {
        state.isLoading = false;
        state.allResults = action.payload;
        state.currentResult = action.payload[0] || null;
        state.previousResult = action.payload[1] || null;
      })
      .addCase(saveTestResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || '데이터 저장 실패';
      });
  },
});

export const { clearError } = testResultSlice.actions;
export default testResultSlice.reducer;

