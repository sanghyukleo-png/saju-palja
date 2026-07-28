export function Privacy() {
  return (
    <section>
      <h1 style={{ marginBottom: 8 }}>개인정보처리방침</h1>
      <p className="muted" style={{ marginBottom: 24 }}>시행일: 2026년 7월 28일</p>

      <div className="card">
        <h3>1. 수집하는 개인정보 항목</h3>
        <p>
          사주팔자 운세보기(이하 "사이트")는 회원가입 및 서비스 제공을 위해 아래 정보를 수집합니다.
        </p>
        <ul>
          <li>이메일 주소, 비밀번호 (회원가입 시, 비밀번호는 인증 서비스에 암호화되어 저장되며 사이트 운영자는 원문을 알 수 없습니다)</li>
          <li>닉네임 (마이페이지에서 이용자가 직접 입력한 경우)</li>
        </ul>
        <p>
          생년월일·성별·태어난 시간은 운세 결과를 화면에 보여주기 위해 브라우저에서만 사용되며,
          서버나 데이터베이스에 저장되지 않습니다.
        </p>
      </div>

      <div className="card">
        <h3>2. 개인정보의 수집 및 이용 목적</h3>
        <p>회원 식별, 로그인 유지, 마이페이지(프로필 조회·수정) 기능 제공을 위해 사용합니다.</p>
      </div>

      <div className="card">
        <h3>3. 개인정보의 보유 및 이용 기간</h3>
        <p>회원 탈퇴 시 지체 없이 파기하며, 관련 법령에 따라 보관이 필요한 경우 해당 기간 동안만 보관합니다.</p>
      </div>

      <div className="card">
        <h3>4. 개인정보 처리의 위탁</h3>
        <p>
          사이트는 회원 인증 및 데이터베이스 운영을 위해 Supabase(해외 인프라)에 처리를 위탁하고 있으며,
          위탁 업무 범위를 초과한 목적으로는 이용하지 않습니다.
        </p>
      </div>

      <div className="card">
        <h3>5. 쿠키 및 광고에 관한 사항</h3>
        <p>
          이 사이트는 Google을 포함한 제3자 광고 업체의 광고가 게재될 수 있습니다. 이러한 업체는 쿠키를
          사용하여 이용자가 이 사이트 또는 다른 사이트를 방문한 기록을 바탕으로 맞춤 광고를 제공할 수
          있습니다. 맞춤 광고 게재를 원하지 않는 경우{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
            Google 광고 설정
          </a>
          에서 거부할 수 있습니다.
        </p>
      </div>

      <div className="card">
        <h3>6. 이용자의 권리</h3>
        <p>이용자는 언제든지 자신의 개인정보를 열람·정정·삭제하거나 처리 정지를 요청할 수 있습니다.</p>
      </div>

      <div className="card">
        <h3>7. 문의처</h3>
        <p>개인정보 관련 문의는 아래 이메일로 연락해주세요.</p>
        <p>
          <a href="mailto:sajupalja3@gmail.com">sajupalja3@gmail.com</a>
        </p>
      </div>
    </section>
  );
}
