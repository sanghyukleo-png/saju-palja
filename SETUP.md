# 백엔드(Supabase) 연동 가이드

프론트엔드는 완성되어 있고, 아래 순서대로 하면 회원가입·로그인·마이페이지가 실제로 동작해요.
현재는 이메일 로그인 위주로 연결되어 있고, Google/카카오 버튼도 화면에 있지만 Supabase에서 해당 공급자를 켜기 전까지는 눌러도 에러가 떠요 (아래 5번 참고).

## 1. Supabase 프로젝트 만들기

1) https://supabase.com 접속 → 회원가입/로그인
2) "New Project" 클릭 → 프로젝트 이름(예: `saju-palja`), 데이터베이스 비밀번호, 리전(가까운 곳, 예: Northeast Asia (Seoul) 있으면 그걸로) 선택 후 생성
3) 프로젝트가 뜰 때까지 1~2분 기다리기

## 2. API 키 복사해서 .env 파일에 넣기

1) Supabase 프로젝트 대시보드 → 왼쪽 메뉴 **Project Settings → API**
2) `Project URL`과 `anon public` 키를 복사
3) 이 프로젝트 루트(`bboggl/`)에 `.env.local` 파일을 새로 만들고 아래처럼 채우기 (`.env.example` 파일을 복사해서 이름만 바꿔도 돼요)

```
VITE_SUPABASE_URL=여기에_Project_URL_붙여넣기
VITE_SUPABASE_ANON_KEY=여기에_anon_public_키_붙여넣기
```

4) 저장 후 개발 서버를 껐다 다시 켜기 (`npm run dev`) — Vite는 `.env` 값을 서버 시작 시점에 읽어요.

## 3. 데이터베이스 테이블 만들기

1) Supabase 대시보드 → 왼쪽 메뉴 **SQL Editor** → "New query"
2) 이 프로젝트의 [`supabase/schema.sql`](supabase/schema.sql) 파일 내용을 전체 복사해서 붙여넣고 **Run** 클릭
3) 성공하면 `profiles` 테이블과 회원가입 시 자동으로 프로필을 만들어주는 트리거가 생겨요

## 4. 이메일 로그인 확인

- Supabase는 기본적으로 이메일 로그인이 켜져 있어요 (Authentication → Providers → Email).
- 사이트의 `/login`에서 회원가입 → 이메일로 인증 메일이 오면 링크 클릭 → 로그인하면 `/mypage`에서 실제 프로필을 조회·수정할 수 있어요.
- 개발 중 이메일 인증 단계를 건너뛰고 싶다면 Authentication → Providers → Email → "Confirm email"을 꺼두면 가입 즉시 로그인돼요 (운영 배포 전에는 다시 켜는 걸 추천해요).

## 5. (선택) Google / 카카오 로그인 켜기

- **Google**: Supabase 대시보드 → Authentication → Providers → Google 활성화 → Google Cloud Console에서 OAuth 클라이언트 ID/Secret 발급 후 입력. Redirect URL은 Supabase가 안내하는 값을 그대로 Google Cloud Console에 등록.
- **카카오**: Supabase 대시보드 → Authentication → Providers → Kakao 활성화 → 카카오 디벨로퍼스에서 REST API 키 발급 후 입력.
- 코드는 이미 두 버튼 모두 `supabase.auth.signInWithOAuth()`를 호출하도록 되어 있어서, 위 설정만 마치면 코드를 다시 건드릴 필요 없이 바로 동작해요.

## 6. 배포 시 환경변수

Vercel/Netlify 등에 배포할 때는 `.env.local`이 올라가지 않으니, 배포 플랫폼의 Environment Variables 설정에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`를 동일하게 등록해야 해요.

## 지금 상태 (백엔드 연결 전)

`.env.local`을 아직 안 만들었다면 사이트는 "데모 모드"로 동작해요:
- `/login`, `/mypage`에 "백엔드가 아직 연결되지 않았어요" 안내가 보여요.
- 폼을 채워도 실제로 저장되지 않지만, 화면 확인은 그대로 가능해요.
