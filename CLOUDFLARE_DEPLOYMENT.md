# ☁️ Cloudflare Pages 배포 가이드

이 가이드는 Coffee Taste Predictor를 Cloudflare Pages에 배포하는 전체 과정을 설명합니다.

## 🌟 Cloudflare Pages + Functions 아키텍처

```
┌─────────────────────────────────────────┐
│   Cloudflare Pages (Static Site)       │
│   - Next.js Static Export               │
│   - React Frontend                      │
│   - Framer Motion Animations            │
└─────────────┬───────────────────────────┘
              │
              │ API Calls
              ▼
┌─────────────────────────────────────────┐
│   Cloudflare Pages Functions            │
│   - /api/analyze endpoint               │
│   - Gemini API Integration              │
│   - Edge Computing (Fast!)              │
└─────────────────────────────────────────┘
```

**장점:**

- ⚡ **초고속**: 엣지 네트워크에서 실행
- 💰 **무료**: 10만 요청/일 (무료 플랜)
- 🌍 **글로벌**: 전 세계 275개 도시 배포
- 🔒 **안전**: API Key 서버에서만 사용

---

## 📋 배포 전 체크리스트

- ✅ Cloudflare 계정 생성
- ✅ GitHub에 프로젝트 푸시
- ✅ Gemini API Key 발급 완료
- ✅ 프로젝트 빌드 테스트

---

## 🚀 단계별 배포 가이드

### 1️⃣ GitHub에 코드 푸시

```bash
# Git 초기화 (이미 되어 있다면 건너뛰기)
git init
git add .
git commit -m "Initial commit - Coffee Taste Predictor"

# GitHub 레포지토리 연결
git remote add origin https://github.com/your-username/coffee-taste-predictor.git
git push -u origin main
```

---

### 2️⃣ Cloudflare Pages 프로젝트 생성

1. **Cloudflare Dashboard 접속**

   - https://dash.cloudflare.com/
   - 로그인 후 **Workers & Pages** 클릭

2. **새 프로젝트 생성**

   - "Create Application" 클릭
   - "Pages" 탭 선택
   - "Connect to Git" 클릭

3. **GitHub 연동**

   - GitHub 계정 연결
   - `coffee-taste-predictor` 레포지토리 선택

4. **빌드 설정**

   ```
   Project name: coffee-taste-predictor
   Production branch: main

   Build settings:
   ├─ Framework preset: Next.js
   ├─ Build command: npm run build
   ├─ Build output directory: out
   └─ Root directory: /
   ```

5. **환경 변수 설정** (매우 중요! ⚠️)

   - "Environment variables" 섹션에서 **Add variable** 클릭
   - 변수 추가:
     ```
     Variable name: GEMINI_API_KEY
     Value: dadsad
     ```
   - Environment: **Production**, **Preview** 둘 다 체크

6. **배포 시작**
   - "Save and Deploy" 클릭
   - 빌드 로그 확인 (약 2-3분 소요)

---

### 3️⃣ 배포 확인

빌드가 완료되면 다음과 같은 URL이 생성됩니다:

```
https://coffee-taste-predictor.pages.dev
```

**테스트 방법:**

1. 브라우저에서 URL 접속
2. 커피 정보 입력:
   ```
   Bean: Ethiopian Yirgacheffe
   Roast: Light
   Grinder: Comandante C40
   Grind Size: 20 clicks
   ```
3. "Analyze Coffee" 클릭
4. 로딩 애니메이션 확인
5. Gemini AI 분석 결과 확인 ✨

---

### 4️⃣ 커스텀 도메인 연결 (선택 사항)

1. Cloudflare Pages 대시보드에서 프로젝트 선택
2. "Custom domains" 탭 클릭
3. "Set up a custom domain" 클릭
4. 도메인 입력 (예: `coffee.yourdomain.com`)
5. DNS 레코드 자동 설정
6. SSL 인증서 자동 발급 (무료)

---

## 🔧 Cloudflare Pages Functions 작동 방식

### 파일 구조

```
functions/
└── api/
    └── analyze.ts  →  자동으로 /api/analyze 엔드포인트 생성
```

### Functions 코드 확인

`functions/api/analyze.ts`에서 다음 함수가 실행됩니다:

```typescript
export async function onRequestPost(context) {
  const { request, env } = context;
  const apiKey = env.GEMINI_API_KEY; // 환경 변수 접근

  // Gemini API 호출
  const response = await fetch(
    "https://generativelanguage.googleapis.com/...",
    {
      headers: { "x-goog-api-key": apiKey },
    }
  );

  return new Response(JSON.stringify(data));
}
```

### 로컬 테스트 (Wrangler)

Cloudflare Functions를 로컬에서 테스트하려면:

```bash
# Wrangler 설치
npm install -g wrangler

# 로컬 개발 서버 시작
npx wrangler pages dev out --binding GEMINI_API_KEY=your_api_key_here

# 테스트
curl -X POST http://localhost:8788/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"beanName":"Colombian","roastLevel":2,"grinderModel":"Baratza","grindSize":18,"grindUnit":"clicks"}'
```

---

## 📊 배포 후 모니터링

### 1. 실시간 로그 확인

Cloudflare Dashboard → **Workers & Pages** → 프로젝트 선택 → **Logs**

```
[INFO] POST /api/analyze - 200 OK (2.3s)
[INFO] Gemini API called successfully
```

### 2. 트래픽 분석

**Analytics** 탭에서 확인 가능:

- 총 요청 수
- 응답 시간
- 에러율
- 지역별 트래픽

### 3. 사용량 모니터링

무료 플랜 한도:

- ✅ **Functions**: 10만 요청/일
- ✅ **Bandwidth**: 무제한
- ✅ **Builds**: 500회/월

---

## 🔄 업데이트 및 재배포

코드를 수정하고 GitHub에 푸시하면 **자동으로 재배포**됩니다:

```bash
# 코드 수정 후
git add .
git commit -m "Update coffee analysis algorithm"
git push

# Cloudflare가 자동으로 감지하고 빌드 시작
# 약 2-3분 후 새 버전 배포 완료
```

**Preview Deployments:**

- Pull Request를 만들면 자동으로 Preview URL 생성
- 예: `https://abc123.coffee-taste-predictor.pages.dev`

---

## 🐛 문제 해결 (Troubleshooting)

### ❌ 빌드 실패: "Export encountered errors on following paths"

**원인:** Next.js API Routes는 static export에서 지원되지 않음

**해결:**

- `app/api/` 디렉토리 제거 또는 `.gitignore`에 추가
- Functions로 대체 (이미 완료됨 ✅)

### ❌ 404 Error on /api/analyze

**원인:** Functions 파일이 배포되지 않음

**해결:**

```bash
# functions 디렉토리 확인
ls -la functions/api/

# 있어야 하는 파일:
# functions/api/analyze.ts
```

### ❌ "GEMINI_API_KEY is not set"

**원인:** 환경 변수 설정 안 됨

**해결:**

1. Cloudflare Dashboard → 프로젝트 → **Settings** → **Environment variables**
2. `GEMINI_API_KEY` 추가
3. "Redeploy" 클릭

### ❌ 429 Too Many Requests (Gemini API)

**원인:** API 무료 한도 초과

**해결:**

- 잠시 대기 후 재시도
- Mock 모드로 자동 Fallback됨
- 또는 유료 플랜 업그레이드

### ❌ CORS Error

**원인:** 프론트엔드와 API 도메인 불일치

**해결:**

- Cloudflare Pages는 같은 도메인 사용 → CORS 없음
- 만약 발생하면 `functions/api/analyze.ts`에 헤더 추가:
  ```typescript
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
  ```

---

## 💡 최적화 팁

### 1. Edge Caching

자주 요청되는 커피 조합을 캐싱하려면:

```typescript
// functions/api/analyze.ts에 추가
const cacheKey = `${beanName}-${roastLevel}-${grindSize}`;
const cache = caches.default;
const cachedResponse = await cache.match(cacheKey);

if (cachedResponse) {
  return cachedResponse;
}

// ... Gemini API 호출 후
await cache.put(cacheKey, response.clone());
```

### 2. Rate Limiting

과도한 API 호출 방지:

```typescript
// functions/_middleware.ts 생성
export async function onRequest(context) {
  const clientIP = context.request.headers.get("CF-Connecting-IP");
  // Rate limiting 로직
}
```

### 3. Analytics 통합

Google Analytics 또는 Cloudflare Web Analytics 추가

---

## 📈 성능 벤치마크

**Cloudflare Pages vs 기타 플랫폼:**

| 플랫폼               | 첫 로드 | API 응답 | 글로벌 배포    |
| -------------------- | ------- | -------- | -------------- |
| **Cloudflare Pages** | 🟢 0.5s | 🟢 2-3s  | ✅ 275 cities  |
| Vercel               | 🟡 1.2s | 🟡 3-5s  | ✅ 20+ regions |
| Netlify              | 🟡 1.5s | 🟡 4-6s  | ✅ 10+ regions |

---

## 🔐 보안 체크리스트

- ✅ API Key는 환경 변수로만 관리
- ✅ `.env.local`은 `.gitignore`에 포함
- ✅ Functions는 서버사이드에서만 실행
- ✅ HTTPS 자동 적용
- ✅ DDoS 보호 (Cloudflare 기본 제공)

---

## 📞 지원 및 문의

**Cloudflare 공식 문서:**

- Pages: https://developers.cloudflare.com/pages/
- Functions: https://developers.cloudflare.com/pages/functions/

**커뮤니티:**

- Discord: https://discord.gg/cloudflaredev
- Forum: https://community.cloudflare.com/

**이 프로젝트:**

- GitHub Issues: [프로젝트 URL]/issues

---

## 🎉 배포 완료!

축하합니다! 이제 전 세계 어디서나 빠르게 접속 가능한 AI 커피 분석 서비스가 준비되었습니다.

**최종 확인:**

```bash
# 프로덕션 URL 테스트
curl https://coffee-taste-predictor.pages.dev/api/analyze \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"beanName":"Ethiopian Yirgacheffe","roastLevel":1,"grinderModel":"Comandante C40","grindSize":20,"grindUnit":"clicks"}'
```

**성공 응답:**

```json
{
  "success": true,
  "data": {
    "tasteProfile": { ... },
    "comment": "AI-generated analysis...",
    "recommendations": { ... }
  }
}
```

---

**마지막 업데이트**: 2024-11-24
**버전**: 1.0.0
