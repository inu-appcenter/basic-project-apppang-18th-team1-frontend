# 폴더 구조

## 디렉토리 구조

```
src/
├── assets/              # 이미지, SVG 등 정적 파일
├── components/          # 재사용 가능한 공통 UI 컴포넌트
│   ├── Header.tsx
│   ├── NavigationBar.tsx
│   └── Modal.tsx
├── layouts/             # 페이지 레이아웃
│   ├── CommonLayout.tsx # 헤더 + 네비게이션 바 포함
│   └── AuthLayout.tsx   # 인증 페이지용 (헤더/네비 없음)
├── pages/               # 라우트 단위 페이지 컴포넌트
│   ├── MainPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── SearchPage.tsx
│   ├── ProductListPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── ChatbotPage.tsx
│   ├── CartPage.tsx
│   ├── MyPage.tsx
│   └── NotFoundPage.tsx
├── hooks/               # 커스텀 훅
├── store/               # zustand 전역 상태 스토어
├── api/                 # axios instance 및 API 함수
│   └── instance.ts
├── types/               # TypeScript 공통 타입 정의
├── utils/               # 유틸 함수
├── constants/           # 상수 정의
├── App.tsx              # 라우팅 설정
├── main.tsx
└── index.css            # 디자인 토큰 (TailwindCSS @theme)
```

## 규칙

- `components/` — 여러 페이지에서 공통으로 사용하는 UI 컴포넌트
- `pages/` — 라우트 1개당 파일 1개, 조합만 담당 (비즈니스 로직 최소화)
- `hooks/` — 상태·사이드이펙트 로직 분리
- `store/` — zustand 스토어 (도메인별 파일 분리)
- `api/` — `instance.ts`의 axios 인스턴스 사용, 도메인별 파일 분리
- `types/` — 공통 타입만 관리 (컴포넌트 전용 타입은 해당 파일 내 선언)
- import: `@/` 절대경로 사용 (예: `@/components/Header`)
