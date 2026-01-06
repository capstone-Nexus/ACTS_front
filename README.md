# ACTS - ADHD Comprehensive Test System

ADHD 자가진단 및 행동 코칭 플랫폼입니다. 과학적 설문조사, 인지능력검사(CAT), AI 기반 분석, 그리고 대화형 AI 챗봇을 통해 사용자가 자신의 ADHD 성향을 이해할 수 있도록 돕습니다.

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| **프레임워크** | Next.js 16.1.1, React 19.2.3 |
| **언어** | TypeScript 5.9.2 |
| **스타일링** | Tailwind CSS 4, PostCSS |
| **상태관리** | Redux Toolkit 2.11.2, React-Redux 9.2.0 |
| **HTTP 클라이언트** | Axios 1.13.1 |
| **아이콘** | Lucide React, FontAwesome 7 |
| **차트** | Chart.js 4.5.0, React-ChartJS-2 |
| **알림** | React Hot Toast, React Toastify |
| **카메라/포즈감지** | React Webcam, MediaPipe Face Mesh |
| **인증** | JWT (Access/Refresh Token), OAuth (Google, Naver, Kakao) |

---

## 환경 설정

### 환경 변수 (.env)

```env
# 백엔드 API 서버
NEXT_PUBLIC_API_URL=https://your-backend-url.com
NEXT_PUBLIC_API_BASE=https://your-backend-url.com

# AI 분석 서버
NEXT_PUBLIC_AI_URL=https://your-ai-server-url.com

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxx

# 프론트엔드 URL
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

### 채팅 SSE 설정 (선택)

```env
NEXT_PUBLIC_CHAT_STREAM_PATH=/chat        # 메시지 스트리밍 경로
NEXT_PUBLIC_CHAT_LIST_PATH=/chat          # 채팅 목록 경로
NEXT_PUBLIC_CHAT_MESSAGES_PATH=/chat/{chatIdx}  # 메시지 조회 경로
```

**SSE 이벤트 형식:**
```
data: {"type":"chatIdx","chatIdx":123}\n\n
data: {"type":"content","content":"안녕"}\n\n
data: {"type":"done"}\n\n
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Turbopack)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 실행
npm start
```

---

## 폴더 구성

```
ACTS_front/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # 랜딩 페이지
│   ├── layout.tsx                # 루트 레이아웃 (Redux Provider)
│   ├── globals.css               # 전역 스타일
│   │
│   ├── signin/                   # 로그인 페이지
│   ├── register/                 # 회원가입 페이지
│   ├── auth/success/             # OAuth 콜백 처리
│   │
│   ├── test/                     # 검사 플로우
│   │   ├── page.tsx              # 검사 소개
│   │   ├── cam/                  # 웹캠 설정 & 포즈 감지
│   │   ├── survey/               # DSM-5 설문조사 (20문항)
│   │   ├── cat/                  # 인지능력검사 (5개 테스트)
│   │   │   ├── before/           # CAT 소개
│   │   │   ├── test1/            # 단순선택주의력
│   │   │   ├── test2/            # 지속억제주의력
│   │   │   ├── test3/            # 간섭선택주의력
│   │   │   ├── test4/            # 분할주의력
│   │   │   └── test5/            # 작업기억력
│   │   └── result/               # AI 분석 결과
│   │
│   ├── consultation/             # AI 상담 챗봇
│   │   ├── page.tsx              # 채팅 인터페이스
│   │   ├── components/           # 메시지 버블 등
│   │   └── lib/                  # 채팅 API 핸들러
│   │
│   ├── mypage/                   # 마이페이지
│   │   ├── page.tsx              # 프로필 & 검사 결과
│   │   └── components/           # 레이더 차트, 모달 등
│   │
│   └── api/                      # Next.js API Routes
│       ├── auth/refresh/         # 토큰 갱신
│       ├── chat/                 # OpenAI 챗봇 폴백
│       └── result/               # 결과 처리
│
├── components/                   # 공통 컴포넌트
│   ├── Header.tsx                # 인증 후 헤더
│   ├── MainHeader.tsx            # 랜딩 페이지 헤더
│   ├── TestHeader.tsx            # 검사 진행 헤더
│   ├── Footer.tsx                # 푸터
│   └── Loading.tsx               # 로딩 스피너
│
├── store/                        # Redux 상태관리
│   ├── index.ts                  # 스토어 설정
│   ├── hooks.ts                  # 커스텀 훅
│   └── slices/
│       ├── userSlice.ts          # 사용자 정보
│       └── testResultSlice.ts    # 검사 결과
│
├── lib/                          # 유틸리티
│   ├── axios.ts                  # Axios 인스턴스 (인터셉터)
│   └── reportApi.ts              # 리포트 API
│
├── public/images/                # 정적 이미지
└── icons/                        # 아이콘 내보내기
```

---

## 화면 구성 및 흐름

### 1. 랜딩 페이지 (`/`)
```
┌─────────────────────────────────────┐
│  MainHeader (스크롤 감지)            │
├─────────────────────────────────────┤
│  Hero Section                       │
│  - ADHD 진단 소개 문구               │
│  - CTA 버튼 (검사 시작, 상담하기)     │
├─────────────────────────────────────┤
│  4단계 프로세스 시각화                │
│  ① 설문조사 → ② 인지검사 →          │
│  ③ AI 분석 → ④ 결과 확인            │
├─────────────────────────────────────┤
│  서비스 미리보기 (목업, AI 챗봇)      │
└─────────────────────────────────────┘
```

### 2. 인증 플로우
```
로그인 (/signin)
├── 이메일/비밀번호 로그인
└── 소셜 로그인 (Google, Naver, Kakao)
    └── OAuth 콜백 (/auth/success)

회원가입 (/register)
├── 이메일 인증
├── 비밀번호 강도 검증
└── 프로필 정보 입력
```

### 3. 검사 플로우 (순차 진행)
```
/test (소개)
    ↓
/test/cam (웹캠 설정)
    │ - MediaPipe 포즈 감지
    │ - 고개 돌림/기울임/이탈 추적
    ↓
/test/survey (DSM-5 설문)
    │ - 20문항 리커트 척도 (1-5점)
    │ - 주의력 & 충동성 평가
    ↓
/test/cat/before (CAT 소개)
    ↓
/test/cat/test1~5 (인지능력검사)
    │ - test1: 단순선택주의력
    │ - test2: 지속억제주의력
    │ - test3: 간섭선택주의력
    │ - test4: 분할주의력
    │ - test5: 작업기억력
    ↓
/test/result (AI 분석 결과)
    - ADHD 확률 점수 (0-100)
    - 영역별 세부 점수
    - 맞춤 조언
```

### 4. AI 상담 (`/consultation`)
```
┌──────────────┬─────────────────────────┐
│   사이드바    │      채팅 영역          │
│              │                         │
│ [+ 새 채팅]   │  ┌─────────────────┐   │
│              │  │ AI 메시지       │   │
│ • 채팅 1     │  └─────────────────┘   │
│ • 채팅 2     │        ┌─────────────┐ │
│ • 채팅 3     │        │ 사용자 메시지│ │
│   (수정/삭제) │        └─────────────┘ │
│              │                         │
│              │  ┌─────────────────────┐│
│              │  │ 메시지 입력창       ││
│              │  └─────────────────────┘│
└──────────────┴─────────────────────────┘
```

### 5. 마이페이지 (`/mypage`)
```
┌─────────────────────────────────────┐
│  사용자 프로필                       │
│  - 이름, 이메일, 성별, 생년월일       │
├─────────────────────────────────────┤
│  최근 검사 결과                      │
│  - ADHD 점수 (원형 프로그레스)        │
│  - 성향 레벨 (정상/경계/주의/고위험)   │
├─────────────────────────────────────┤
│  레이더 차트                         │
│  - 현재 vs 이전 결과 비교             │
│  - 5개 영역 시각화                   │
├─────────────────────────────────────┤
│  비밀번호 변경                       │
└─────────────────────────────────────┘
```

---

## 주요 기능

### 1. 다중 평가 방식
- **DSM-5 설문조사**: 20문항으로 주의력 및 충동 조절 평가
- **인지능력검사(CAT)**: 5개 인지 영역을 측정하는 전문 테스트
- **AI 분석**: ML 모델이 ADHD 확률을 0-100 점수로 예측

### 2. 실시간 포즈 감지
- MediaPipe Face Mesh를 활용한 실시간 포즈 추적
- 검사 중 고개 돌림, 기울임, 자리 이탈 감지
- 검사 집중도 메트릭 측정

### 3. AI 진단 분석
- 설문 + CAT 데이터를 AI 서버로 전송
- 종합 ADHD 확률 점수 반환
- 5개 영역별 세부 점수 제공:
  - 단순선택주의력
  - 지속억제주의력
  - 간섭선택주의력
  - 분할주의력
  - 작업기억력

### 4. AI 행동 코칭 챗봇
- 사용자 고민에 대한 공감적 응답
- ADHD 증상의 신경과학적 설명
- 실천 가능한 마이크로 스텝 제안
- 실시간 스트리밍 응답 (SSE)
- 채팅 기록 저장 및 관리

### 5. 결과 추적 및 비교
- 요일별 검사 결과 저장
- 현재 vs 이전 결과 비교
- 레이더 차트로 패턴 시각화
- 반복 검사를 통한 변화 추적

### 6. 인증 및 보안
- JWT 기반 인증 (Access + Refresh Token)
- 소셜 로그인 (Google, Naver, Kakao)
- 자동 토큰 갱신
- 401 응답 시 자동 로그아웃

---

## API 연동

### 백엔드 API
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/auth/signin` | 로그인 |
| POST | `/auth/signup` | 회원가입 |
| POST | `/auth/refresh` | 토큰 갱신 |
| GET | `/user/my` | 내 정보 조회 |
| PATCH | `/user/password` | 비밀번호 변경 |
| GET | `/report` | 전체 결과 조회 |
| POST | `/report` | 결과 저장 |
| GET | `/chat/list` | 채팅 목록 |
| POST | `/chat/stream` | 메시지 전송 (SSE) |

### AI 서버 API
| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| POST | `/predict` | ADHD 예측 분석 |

---

## 스크립트

```bash
npm run dev      # 개발 서버 실행 (Turbopack)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 실행
npm run lint     # ESLint 검사
```