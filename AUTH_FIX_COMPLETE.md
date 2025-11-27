# 🔧 Google Workspace MCP 인증 오류 수정 완료

## 📋 수정 내역

### 문제 진단 결과:
**OAuth 스코프 불완전** - auth converter가 일부 Google Workspace 서비스의 권한만 요청하고 있었습니다.

#### 기존 스코프 (4개만):
- ✓ Drive (read-only)
- ✓ Forms
- ✓ Sheets (read-only)
- ✓ Slides (read-only)

#### 누락된 서비스:
- ✗ Gmail
- ✗ Calendar
- ✗ Docs
- ✗ Chat
- ✗ Tasks
- ✗ Search

### 수정 사항:

**파일**: `server.js` (라인 1048-1091)

**변경 전:**
```javascript
const scopes = [
  'https://www.googleapis.com/auth/forms',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/presentations.readonly',
  'https://www.googleapis.com/auth/spreadsheets.readonly'
];
```

**변경 후:**
```javascript
const scopes = [
  // Gmail - 모든 기능 지원
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.labels',

  // Drive - 읽기 + 파일 생성
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',

  // Calendar - 읽기 + 이벤트 관리
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events',

  // Docs - 읽기 + 편집
  'https://www.googleapis.com/auth/documents.readonly',
  'https://www.googleapis.com/auth/documents',

  // Sheets - 읽기 + 편집
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/spreadsheets',

  // Slides - 읽기 + 편집
  'https://www.googleapis.com/auth/presentations.readonly',
  'https://www.googleapis.com/auth/presentations',

  // Forms
  'https://www.googleapis.com/auth/forms',

  // Tasks - 읽기 + 관리
  'https://www.googleapis.com/auth/tasks.readonly',
  'https://www.googleapis.com/auth/tasks',

  // Chat - 메시지 읽기 + 전송
  'https://www.googleapis.com/auth/chat.messages.readonly',
  'https://www.googleapis.com/auth/chat.messages',
  'https://www.googleapis.com/auth/chat.spaces.readonly',

  // Cloud Search
  'https://www.googleapis.com/auth/cloud_search.query'
];
```

## 🚀 다음 단계: 재인증 필요

스코프가 변경되었으므로 **반드시 재인증**해야 합니다.

### 방법 1: 웹 UI 사용 (권장)

1. **브라우저에서 auth converter 열기:**
   ```
   http://localhost:3000
   ```

2. **"MCP 인증" 탭으로 이동**

3. **인증 상태 확인 버튼 클릭**
   - intenet8821@gmail.com 계정을 찾습니다

4. **"재인증 시작" 버튼 클릭**
   - 새 OAuth URL이 생성됩니다 (모든 스코프 포함)

5. **브라우저에서 OAuth 승인**
   - Google 계정 로그인
   - **모든 권한 승인** (Gmail, Calendar, Docs 등)
   - 자동으로 리다이렉트됩니다

6. **완료 확인**
   - "인증 성공" 메시지 확인
   - 토큰 파일이 업데이트됩니다

### 방법 2: 명령줄 테스트

인증 후 다음 명령으로 검증:

```bash
cd "/Users/gwanli/Documents/GitHub/myproduct_v4/auth converter"
node test-mcp-auth.js
```

**기대 결과:**
```
✓ Token is VALID according to Google API
✓ Scopes: (30+ scopes including Gmail)
✓ Gmail API call successful!
✓ Token is working correctly!
```

### 방법 3: Workspace MCP 직접 재인증

```javascript
// Claude Code에서 실행
await mcp__workspace-mcp-intenet8821-v2__start_google_auth({
  user_google_email: 'intenet8821@gmail.com',
  service_name: 'Google Gmail'  // 모든 스코프 요청
});
```

## ✅ 인증 성공 확인

재인증 후 다음을 실행하여 확인:

```javascript
await mcp__workspace-mcp-intenet8821-v2__check_workspace_auth_status({
  user_google_email: 'intenet8821@gmail.com'
});
```

**기대 결과:**
```
✅ Authenticated: 10/10 services
  ✅ Gmail
  ✅ Drive
  ✅ Calendar
  ✅ Docs
  ✅ Sheets
  ✅ Slides
  ✅ Forms
  ✅ Chat
  ✅ Tasks
  ✅ Search
```

## 📝 중요 참고사항

1. **기존 토큰은 자동으로 만료됨**
   - 재인증하면 새 스코프로 토큰이 발급됩니다
   - 기존 토큰 파일: `~/.google_workspace_mcp/credentials/intenet8821@gmail.com.json`

2. **client_secret.json 필요**
   - 경로: `~/Documents/GitHub/myproduct_v4/google_workspace_mcp/client_secret_intenet8821/client_secret.json`
   - 없으면 auth converter에서 업로드 필요

3. **OAuth 포트**
   - 자동 감지된 포트: 8765 (intenet8821)
   - 포트 매핑: `~/.mcp-workspace/oauth_port_map.json`

4. **서버 재시작됨**
   - 업데이트된 server.js가 실행 중입니다
   - PID: 82591 (포트 3000, 8766)

## 🔄 재인증 전/후 비교

### 재인증 전:
```
⚠️ Summary: 3/10 services authenticated
  ✓ Drive
  ✓ Sheets
  ✓ Slides
  ✗ Gmail
  ✗ Calendar
  ✗ Docs
  ✗ Chat
  ✗ Forms
  ✗ Tasks
  ✗ Search
```

### 재인증 후 (기대):
```
✅ Summary: 10/10 services authenticated
  ✅ All services working!
```

## 💡 트러블슈팅

### 문제: "Insufficient permissions" 오류
**해결**: 재인증 시 **모든 권한을 승인**했는지 확인

### 문제: "Token expired" 오류
**해결**: 자동 갱신되어야 하지만, 안 되면 재인증 필요

### 문제: OAuth 콜백 실패
**해결**:
1. 포트 8765가 열려 있는지 확인: `lsof -i :8765`
2. client_secret.json의 redirect_uri 확인
3. 서버 로그 확인: auth converter에서 콘솔 확인

### 문제: 브라우저에서 승인 후 아무 일도 없음
**해결**:
1. OAuth 콜백 서버 실행 확인
2. 네트워크 방화벽 설정 확인
3. 브라우저 콘솔에서 에러 확인

## 📞 지원

문제가 계속되면:
1. `test-mcp-auth.js` 실행 후 로그 확인
2. `server.js` 콘솔 로그 확인
3. 토큰 파일 확인: `cat ~/.google_workspace_mcp/credentials/intenet8821@gmail.com.json`

---

**수정 일시**: 2025-11-14 16:12 KST
**수정자**: Claude Code (Opus 4)
**상태**: ✅ 코드 수정 완료, 재인증 대기 중