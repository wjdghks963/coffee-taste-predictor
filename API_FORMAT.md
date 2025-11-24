# Gemini API Integration Format

이 문서는 Coffee Taste Predictor의 Gemini API 통합 방법과 요구되는 데이터 포맷을 설명합니다.

## API Endpoint

```
POST /api/analyze
```

## 요청 형식 (Request Format)

### Headers
```
Content-Type: application/json
```

### Request Body
```json
{
  "beanName": "Ethiopian Yirgacheffe",
  "roastLevel": 1,
  "grinderModel": "Comandante C40",
  "grindSize": 20,
  "grindUnit": "clicks"
}
```

### 필드 설명

| 필드 | 타입 | 필수 | 설명 | 예시 |
|------|------|------|------|------|
| `beanName` | string | ✅ | 커피 원두 이름 | "Ethiopian Yirgacheffe" |
| `roastLevel` | number | ✅ | 로스팅 레벨 (0-4) | 1 |
| `grinderModel` | string | ✅ | 그라인더 모델명 | "Comandante C40" |
| `grindSize` | number | ✅ | 분쇄도 설정값 | 20 |
| `grindUnit` | string | ✅ | 분쇄도 단위 ("clicks" or "microns") | "clicks" |

#### Roast Level 매핑
- `0`: Light
- `1`: Light-Medium
- `2`: Medium
- `3`: Medium-Dark
- `4`: Dark

---

## 응답 형식 (Response Format)

### 성공 응답 (200 OK)

```json
{
  "success": true,
  "data": {
    "tasteProfile": {
      "acidity": 85,
      "sweetness": 70,
      "bitterness": 35,
      "body": 65,
      "balance": 82
    },
    "overallScore": 78,
    "comment": "The light roast profile of Ethiopian Yirgacheffe brings bright acidity and delicate sweetness. Your current Comandante C40 settings should preserve the nuanced flavors well. This is approaching an optimal extraction window.",
    "recommendations": {
      "waterTemp": "93-96°C (higher range)",
      "grindAdjustment": "Decrease grind size by 1-2 clicks",
      "brewTime": "Extend to 3:30-4:00 min"
    }
  }
}
```

### 에러 응답 (400/500)

```json
{
  "success": false,
  "error": "Missing required fields"
}
```

### 응답 필드 설명

| 필드 | 타입 | 설명 | 범위/형식 |
|------|------|------|-----------|
| `success` | boolean | API 호출 성공 여부 | true/false |
| `data.tasteProfile.acidity` | number | 산미 점수 | 20-95 |
| `data.tasteProfile.sweetness` | number | 단맛 점수 | 20-95 |
| `data.tasteProfile.bitterness` | number | 쓴맛 점수 | 20-95 |
| `data.tasteProfile.body` | number | 바디감 점수 | 20-95 |
| `data.tasteProfile.balance` | number | 밸런스 점수 | 20-95 |
| `data.overallScore` | number | 전체 품질 점수 | 50-95 |
| `data.comment` | string | AI 생성 분석 코멘트 (1-2문장) | 자연어 텍스트 |
| `data.recommendations.waterTemp` | string | 추천 물 온도 | "XX-XX°C (context)" |
| `data.recommendations.grindAdjustment` | string | 분쇄도 조절 제안 | 구체적인 조정 방법 |
| `data.recommendations.brewTime` | string | 추출 시간 제안 | "X:XX-X:XX min" |
| `error` | string | 에러 메시지 (실패 시에만) | 에러 설명 텍스트 |

---

## Gemini API 프롬프트 구조

API route (`app/api/analyze/route.ts`)는 다음과 같은 구조의 프롬프트를 Gemini에 전달합니다:

```
You are a professional coffee expert and barista with deep knowledge of coffee extraction science, flavor profiles, and brewing parameters.

Analyze the following coffee brewing setup and provide a detailed taste prediction:

Coffee Bean: [beanName]
Roast Level: [roastLevelName] ([roastLevel]/4)
Grinder: [grinderModel]
Grind Size: [grindSize] [grindUnit]

You MUST respond with ONLY a valid JSON object in this EXACT format...
```

### 프롬프트 핵심 요소
1. **전문가 페르소나**: 커피 추출 과학과 맛 프로파일에 대한 깊은 지식을 가진 전문 바리스타
2. **입력 데이터**: 원두, 로스팅, 그라인더 정보
3. **출력 형식**: 엄격한 JSON 구조 (코드 블록 없음)
4. **추출 과학 원칙**: 로스팅 레벨과 분쇄도가 맛에 미치는 영향

---

## 환경 변수 설정

### 1. `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가:

```bash
GEMINI_API_KEY=your_actual_api_key_here
```

### 2. Gemini API Key 발급

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 접속
2. Google 계정으로 로그인
3. "Get API Key" 또는 "Create API Key" 클릭
4. 생성된 API Key를 복사하여 `.env.local`에 붙여넣기

### 3. API Key 검증

개발 서버를 재시작하여 환경 변수를 로드:

```bash
npm run dev
```

---

## Fallback 동작

API Key가 설정되지 않았거나 Gemini API 호출이 실패하는 경우, 시스템은 자동으로 **Mock 데이터**를 반환합니다.

Mock 데이터는 다음과 같은 로직으로 생성됩니다:

- **로스팅 레벨**에 따라 산미/쓴맛/바디감 조정
- **분쇄도**에 따라 추출 강도 추정
- **랜덤 변동**으로 현실적인 결과 생성

### Mock 동작 확인
```
Console Log: "GEMINI_API_KEY is not set in environment variables"
→ Mock data will be returned
```

---

## 테스트 방법

### 1. cURL로 API 직접 호출

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "beanName": "Colombian Supremo",
    "roastLevel": 2,
    "grinderModel": "Baratza Encore",
    "grindSize": 15,
    "grindUnit": "clicks"
  }'
```

### 2. Postman/Insomnia 사용

- Method: `POST`
- URL: `http://localhost:3000/api/analyze`
- Headers: `Content-Type: application/json`
- Body: 위의 JSON 예시 사용

### 3. 프론트엔드에서 테스트

웹 브라우저에서 `http://localhost:3000` 접속 후:
1. 폼에 데이터 입력
2. "Analyze Coffee" 버튼 클릭
3. 로딩 애니메이션 확인
4. 결과 화면에서 Radar Chart 및 추천 사항 확인

---

## 응답 시간

- **Mock 모드**: 즉시 응답 (~50ms)
- **Gemini API 모드**: 2-5초 (AI 추론 시간 포함)

로딩 애니메이션은 최소 3초간 표시되어 사용자 경험을 일관되게 유지합니다.

---

## 에러 처리

### 일반적인 에러 케이스

| 에러 | 원인 | 해결 방법 |
|------|------|-----------|
| `Missing required fields` | 필수 필드 누락 | 모든 필드 입력 확인 |
| `GEMINI_API_KEY is not set` | 환경 변수 미설정 | `.env.local` 파일 생성 및 API Key 입력 |
| `Failed to parse Gemini response` | AI 응답 형식 오류 | Mock 데이터로 자동 Fallback |
| `Network error` | API 연결 실패 | 인터넷 연결 및 API Key 유효성 확인 |

### 에러 발생 시 프론트엔드 동작

1. 에러 메시지 표시 (3초)
2. 자동으로 입력 폼으로 복귀
3. Console에 상세 에러 로그 출력

---

## 프로덕션 배포 시 주의사항

### 1. 환경 변수 설정

Vercel/Netlify 등에 배포 시 플랫폼의 환경 변수 설정에 `GEMINI_API_KEY` 추가

**Vercel 예시:**
```
Settings → Environment Variables → Add New
- Key: GEMINI_API_KEY
- Value: [your_api_key]
- Environment: Production, Preview, Development
```

### 2. Rate Limiting

Gemini API 무료 버전 제한:
- **요청 수**: 분당 60회
- **일일 한도**: 확인 필요 (Google AI Studio에서 확인)

사용량이 많을 경우 API Key 업그레이드 고려

### 3. 보안

- `.env.local` 파일은 **절대로 Git에 커밋하지 않음** (이미 `.gitignore`에 포함됨)
- API Key는 서버 사이드에서만 사용 (클라이언트에 노출 금지)
- Next.js API Routes는 자동으로 서버에서만 실행됨

---

## 추가 커스터마이징

### Gemini 모델 변경

`app/api/analyze/route.ts`에서 모델 변경 가능:

```typescript
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash'  // 또는 'gemini-pro', 'gemini-1.5-pro'
});
```

### 프롬프트 수정

더 구체적인 분석을 원할 경우 `route.ts`의 `prompt` 변수를 수정하여 AI에게 추가 지시 사항 전달 가능

---

## 라이선스 & 사용 권한

- Google Gemini API: [Google AI Terms of Service](https://ai.google.dev/terms) 준수 필요
- 무료 API Key는 개인/교육/비상업적 프로젝트에 적합
- 상업적 사용 시 Google Cloud의 유료 플랜 고려

---

## 문의 & 지원

문제 발생 시:
1. 브라우저 Console 확인 (`F12` → Console 탭)
2. 터미널의 Next.js 서버 로그 확인
3. API Key 유효성 검증 ([Google AI Studio](https://aistudio.google.com/))

---

**마지막 업데이트**: 2024-11-24
**API 버전**: 1.0.0
