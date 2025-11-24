# 🚀 빠른 시작 가이드

## 1️⃣ Gemini API Key 발급받기

### 단계별 가이드

1. **Google AI Studio 접속**
   - 링크: https://aistudio.google.com/app/apikey
   - Google 계정으로 로그인

2. **API Key 생성**
   - "Get API Key" 또는 "Create API Key" 버튼 클릭
   - 새 프로젝트 생성 또는 기존 프로젝트 선택
   - API Key가 생성되면 **복사**하여 안전한 곳에 보관

3. **무료 할당량 확인**
   - Gemini 1.5 Flash 모델 사용 중
   - 무료 버전: 분당 60회 요청
   - 개인/교육 목적으로 충분함

---

## 2️⃣ 프로젝트에 API Key 설정

### 방법 1: .env.local 파일 수정 (권장)

프로젝트 루트의 `.env.local` 파일을 열고:

```bash
# 기존 내용:
GEMINI_API_KEY=your_api_key_here

# 변경 후:
GEMINI_API_KEY=AIzaSyD_실제발급받은키_여기에붙여넣기
```

### 방법 2: 터미널에서 직접 생성

```bash
# 프로젝트 루트에서 실행
echo "GEMINI_API_KEY=AIzaSyD_실제발급받은키" > .env.local
```

---

## 3️⃣ 개발 서버 재시작

환경 변수를 적용하려면 서버를 재시작해야 합니다:

```bash
# 현재 실행 중인 서버 종료 (Ctrl + C)
# 그 다음:
npm run dev
```

서버 시작 시 다음과 같이 표시되면 성공:

```
▲ Next.js 16.0.3 (Turbopack)
- Local:         http://localhost:3000

✓ Ready in XXXms
Reload env: .env.local  ← 이 메시지가 보이면 성공!
```

---

## 4️⃣ 테스트하기

### 브라우저에서 테스트

1. http://localhost:3000 접속
2. 다음 정보를 입력:
   ```
   Bean Name: Ethiopian Yirgacheffe
   Roast Level: Light (슬라이더 왼쪽)
   Grinder Model: Comandante C40
   Grind Size: 20 clicks
   ```
3. "Analyze Coffee" 버튼 클릭
4. 로딩 애니메이션 확인 (커피 입자들이 움직임)
5. 결과 화면에서 **AI가 생성한 코멘트** 확인
   - Mock 데이터: 고정된 패턴의 문장
   - **실제 Gemini**: 원두 이름을 언급하며 더 자연스러운 분석

---

## ✅ API 연동 확인 방법

### Console 로그 확인

브라우저에서 `F12` → Console 탭:

| 메시지 | 의미 |
|--------|------|
| `GEMINI_API_KEY is not set` | ❌ API Key 미설정 (Mock 모드) |
| (에러 없음) | ✅ Gemini API 정상 작동 |
| `Failed to parse Gemini response` | ⚠️ API 호출 성공, 응답 파싱 실패 (Mock으로 Fallback) |

### 터미널 로그 확인

개발 서버 실행 중인 터미널:

```
POST /api/analyze 200 in 2.5s  ← 정상 (2-5초는 Gemini 응답 시간)
```

---

## 🔧 문제 해결 (Troubleshooting)

### 1. API Key가 작동하지 않아요

**증상**: 계속 Mock 데이터가 나옴

**해결책**:
```bash
# 1. .env.local 파일 위치 확인
ls -la .env.local

# 2. 파일 내용 확인
cat .env.local

# 3. API Key 앞뒤 공백 제거
GEMINI_API_KEY=AIza...  # ✅ 올바름
GEMINI_API_KEY= AIza... # ❌ 공백 있음
GEMINI_API_KEY="AIza..." # ❌ 따옴표 사용하지 말 것

# 4. 서버 완전 재시작
# Ctrl+C로 종료 후
npm run dev
```

### 2. 429 Too Many Requests 에러

**증상**: API 호출 실패, 에러 메시지 표시

**원인**: 무료 할당량 초과 (분당 60회)

**해결책**:
- 1분 대기 후 재시도
- 또는 Google Cloud에서 유료 플랜 활성화

### 3. 403 Forbidden 에러

**증상**: API Key가 거부됨

**원인**:
- 잘못된 API Key
- API Key가 비활성화됨
- Google AI Studio에서 제한 설정

**해결책**:
1. https://aistudio.google.com/app/apikey 에서 새 키 발급
2. 기존 키가 활성화되어 있는지 확인

### 4. 로딩 후 입력 폼으로 돌아가요

**증상**: 로딩 → 에러 메시지 → 입력 폼 복귀

**원인**: API 호출 중 에러 발생

**해결책**:
1. 브라우저 Console (F12) 확인
2. 터미널 로그 확인
3. 인터넷 연결 확인
4. API Key 유효성 재확인

---

## 📊 Mock vs Gemini 비교

| 항목 | Mock 모드 | Gemini 모드 |
|------|-----------|-------------|
| 응답 속도 | 즉시 | 2-5초 |
| 코멘트 품질 | 패턴화된 문장 | 자연스러운 AI 분석 |
| 추천 정확도 | 로스팅 레벨 기반 | 추출 과학 기반 정밀 분석 |
| 원두별 차이 | 없음 (로스팅만 반영) | 원두 특성 반영 |
| 비용 | 무료 | 무료 (할당량 내) |

---

## 🎯 다음 단계

### 프로덕션 배포 (Vercel)

1. GitHub에 코드 푸시
2. Vercel에서 Import
3. Environment Variables 설정:
   ```
   Key: GEMINI_API_KEY
   Value: (발급받은 키)
   ```
4. Deploy 클릭

### 커스터마이징

- **프롬프트 수정**: `app/api/analyze/route.ts`의 `prompt` 변수
- **모델 변경**: `gemini-1.5-flash` → `gemini-1.5-pro` (더 정확하지만 느림)
- **애니메이션 속도**: 각 컴포넌트의 `transition` 속성

---

## 📚 추가 문서

- [API_FORMAT.md](./API_FORMAT.md) - API 상세 스펙
- [README.md](./README.md) - 전체 프로젝트 문서
- [Google Gemini API Docs](https://ai.google.dev/docs) - 공식 문서

---

## 💡 팁

1. **개발 중에는 Mock 모드 권장**
   - API 할당량 절약
   - 빠른 테스트 가능
   - 배포 전에만 Gemini 활성화

2. **여러 원두 테스트**
   - "Colombian Supremo", "Kenyan AA", "Brazilian Santos" 등
   - Gemini가 원두별로 다른 분석 제공

3. **로딩 시간 조정**
   - `app/page.tsx`에서 `setTimeout` 제거하면 즉시 결과 표시
   - 단, 사용자 경험을 위해 최소 1초 권장

---

**마지막 업데이트**: 2024-11-24
**작성자**: Claude Code Agent
