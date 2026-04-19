# 하이라이트 사용법

### 일반적인 경우

- 길게 누름 → 색상 팔레트 등장
- 색상 선택 시 저장
- 다시 길게 누름 -> 하이라이트 지우기

### 문단(paragraph)의 경우

- 길게 누름 → 문장 모달 열림
- 문장 2~3개 선택 후 저장
- 다시 길게 누름 → “문장 하이라이트 모두 지우기” 노출 확인

---

## eas.json은 gitignore에 추가

앱을 APK 빌드할 때 환경변수가 포함되지 않을 수 있으므로, eas.json에 환경변수 입력.

```json
{
  {
  "cli": {
    "version": ">= 16.0.0"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://bnkrsrdizbijgzxvapec.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "네_anon_key",
        "EXPO_PUBLIC_API_BASE_URL": "https://serene-queijadas-4b6434.netlify.app/"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://bnkrsrdizbijgzxvapec.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "네_anon_key",
        "EXPO_PUBLIC_API_BASE_URL": "https://serene-queijadas-4b6434.netlify.app/"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}
}
```
