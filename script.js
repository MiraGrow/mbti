/* ============================================================
   script.js  —  디즈니 MBTI 테스트
   ============================================================
   구조:
   1. MBTI 결과 데이터 (캐릭터 매핑)
   2. 질문 데이터 (12문항)
   3. 상태 관리 변수
   4. 화면 전환 함수
   5. 별 파티클 생성
   6. 질문 렌더링 & 점수 계산
   7. 결과 계산 & 표시
   8. 이벤트 리스너 등록
   9. 초기화 실행
   ============================================================ */


/* ─────────────────────────────────────────────────────────────
   1. MBTI 결과 데이터
   각 유형에 맞는 디즈니 캐릭터, 설명, 이모지를 포함합니다.
   image: 외부 이미지 로딩 실패 시 emoji로 대체됩니다.
───────────────────────────────────────────────────────────── */
const mbtiResults = {
  "INTJ": {
    character: "엘사",
    description: "전략적이고 독립적인 완벽주의자",
    detail: "자신의 신념과 목표에 따라 행동하며 깊은 내면 세계를 가진 인물",
    emoji: "❄️",
    image: "https://i.imgur.com/3QfQZ6P.png"
  },
  "INTP": {
    character: "벨",
    description: "논리적이고 호기심 많은 사색가",
    detail: "지식을 사랑하며 새로운 아이디어를 탐구하는 것을 즐김",
    emoji: "📚",
    image: "https://i.imgur.com/8Km9tLL.png"
  },
  "ENTJ": {
    character: "무파사",
    description: "카리스마 넘치는 리더",
    detail: "강한 책임감과 리더십으로 조직을 이끄는 인물",
    emoji: "🦁",
    image: "https://i.imgur.com/qIufhof.png"
  },
  "ENTP": {
    character: "지니",
    description: "재치 있고 창의적인 발명가",
    detail: "유머 감각이 뛰어나고 새로운 것을 시도하는 것을 좋아함",
    emoji: "🔮",
    image: "https://i.imgur.com/BxQ9Q7P.png"
  },
  "INFJ": {
    character: "포카혼타스",
    description: "이상주의적이고 통찰력 있는 조언자",
    detail: "깊은 공감 능력과 자연과의 연결을 중요시함",
    emoji: "🌿",
    image: "https://i.imgur.com/cH4s7nP.png"
  },
  "INFP": {
    character: "밤비",
    description: "감성적이고 순수한 이상주의자",
    detail: "따뜻한 마음과 깊은 감정을 지닌 인물",
    emoji: "🦌",
    image: "https://i.imgur.com/Vz8kP6Z.png"
  },
  "ENFJ": {
    character: "티아나",
    description: "사람을 이끄는 따뜻한 리더",
    detail: "타인을 돕고 성장시키는 데 큰 보람을 느낌",
    emoji: "🌟",
    image: "https://i.imgur.com/5gYyL8T.png"
  },
  "ENFP": {
    character: "라푼젤",
    description: "자유롭고 열정적인 탐험가",
    detail: "호기심 많고 긍정적인 에너지를 주변에 전파함",
    emoji: "☀️",
    image: "https://i.imgur.com/2DhmtJ4.png"
  },
  "ISTJ": {
    character: "신데렐라",
    description: "성실하고 책임감 있는 현실주의자",
    detail: "묵묵히 자신의 역할을 수행하며 신뢰를 쌓는 타입",
    emoji: "👑",
    image: "https://i.imgur.com/7QFZ6uP.png"
  },
  "ISFJ": {
    character: "안나",
    description: "헌신적이고 따뜻한 수호자",
    detail: "주변 사람들을 위해 희생을 아끼지 않는 성격",
    emoji: "💝",
    image: "https://i.imgur.com/eG7nR7m.png"
  },
  "ESTJ": {
    character: "티몬",
    description: "현실적이고 조직적인 관리자",
    detail: "체계적이고 효율적으로 일을 처리함",
    emoji: "📋",
    image: "https://i.imgur.com/fT9z0dL.png"
  },
  "ESFJ": {
    character: "세바스찬",
    description: "사교적이고 책임감 있는 조력자",
    detail: "주변 사람들을 챙기고 조화를 중요시함",
    emoji: "🦀",
    image: "https://i.imgur.com/h9YzK8L.png"
  },
  "ISTP": {
    character: "타잔",
    description: "조용하고 실용적인 탐험가",
    detail: "직접 경험하며 배우는 것을 선호",
    emoji: "🌴",
    image: "https://i.imgur.com/0mZ8k3T.png"
  },
  "ISFP": {
    character: "아리엘",
    description: "감성적이고 자유로운 예술가",
    detail: "자신의 감정과 꿈을 중요하게 생각함",
    emoji: "🧜",
    image: "https://i.imgur.com/1Yt5XkP.png"
  },
  "ESTP": {
    character: "알라딘",
    description: "모험심 강한 행동파",
    detail: "위기 상황에서도 빠르게 판단하고 행동",
    emoji: "🪄",
    image: "https://i.imgur.com/3t9dKfH.png"
  },
  "ESFP": {
    character: "올라프",
    description: "밝고 긍정적인 분위기 메이커",
    detail: "사람들과 즐거움을 나누는 것을 좋아함",
    emoji: "⛄",
    image: "https://i.imgur.com/N9Yt3d2.png"
  }
};


/* ─────────────────────────────────────────────────────────────
   2. 질문 데이터 (12문항)
   각 질문은 두 가지 선택지를 가집니다.
   score: { 지표: 값 } — 해당 선택지가 어떤 MBTI 지표에 점수를 더하는지 표시
   예) { E: 1 } → E(외향성) 점수 +1
───────────────────────────────────────────────────────────── */
const questions = [
  // ── E vs I (외향성 vs 내향성) ──
  {
    text: "주말에 가장 하고 싶은 것은?",
    options: [
      { label: "친구들과 파티나 모임을 즐긴다 🎉", score: { E: 1 } },
      { label: "집에서 혼자 조용히 쉰다 🏠", score: { I: 1 } }
    ]
  },
  {
    text: "처음 만나는 사람들과 함께할 때 나는?",
    options: [
      { label: "먼저 말을 걸고 분위기를 주도한다", score: { E: 1 } },
      { label: "상대방이 말을 걸어오길 기다린다", score: { I: 1 } }
    ]
  },
  {
    text: "오랫동안 혼자 있으면?",
    options: [
      { label: "답답하고 사람들이 보고 싶어진다", score: { E: 1 } },
      { label: "오히려 에너지가 충전되는 느낌이다", score: { I: 1 } }
    ]
  },

  // ── S vs N (감각 vs 직관) ──
  {
    text: "새로운 계획을 세울 때 나는?",
    options: [
      { label: "현실적인 방법과 구체적인 단계를 생각한다 📝", score: { S: 1 } },
      { label: "큰 그림과 가능성을 먼저 떠올린다 🌈", score: { N: 1 } }
    ]
  },
  {
    text: "나는 주로 어떤 것에 관심이 많은가?",
    options: [
      { label: "지금 당장 일어나고 있는 실제 상황과 사실", score: { S: 1 } },
      { label: "미래에 일어날 수 있는 가능성과 아이디어", score: { N: 1 } }
    ]
  },
  {
    text: "좋아하는 이야기 스타일은?",
    options: [
      { label: "구체적이고 세세한 묘사가 있는 이야기 🔍", score: { S: 1 } },
      { label: "상징적이고 상상력을 자극하는 이야기 ✨", score: { N: 1 } }
    ]
  },

  // ── T vs F (사고 vs 감정) ──
  {
    text: "친구가 고민을 털어놓을 때, 나는?",
    options: [
      { label: "문제를 해결할 방법을 조언해준다 💡", score: { T: 1 } },
      { label: "먼저 공감하고 마음을 헤아려준다 🤗", score: { F: 1 } }
    ]
  },
  {
    text: "중요한 결정을 내릴 때 더 중요한 것은?",
    options: [
      { label: "논리적으로 따져봤을 때 합리적인 선택", score: { T: 1 } },
      { label: "내가 느끼는 감정과 주변 사람들에게 미치는 영향", score: { F: 1 } }
    ]
  },
  {
    text: "갈등 상황에서 나는?",
    options: [
      { label: "감정보다 사실과 논리를 중심으로 해결한다 ⚖️", score: { T: 1 } },
      { label: "상대방의 기분을 먼저 고려하며 조율한다 💕", score: { F: 1 } }
    ]
  },

  // ── J vs P (판단 vs 인식) ──
  {
    text: "여행 계획을 세울 때 나는?",
    options: [
      { label: "일정, 숙소, 맛집을 미리 꼼꼼히 계획한다 🗓️", score: { J: 1 } },
      { label: "큰 목적지만 정하고 즉흥적으로 움직인다 🗺️", score: { P: 1 } }
    ]
  },
  {
    text: "마감 기한이 있는 과제가 있다면?",
    options: [
      { label: "미리 계획을 세워 기한 전에 완성한다", score: { J: 1 } },
      { label: "마감 직전에 집중해서 끝내는 편이다", score: { P: 1 } }
    ]
  },
  {
    text: "일상생활에서 나는?",
    options: [
      { label: "정해진 루틴과 규칙이 있어야 편하다 🏃", score: { J: 1 } },
      { label: "자유롭고 유연하게 상황에 맞게 행동한다 🌊", score: { P: 1 } }
    ]
  }
];


/* ─────────────────────────────────────────────────────────────
   3. 상태 관리 변수
───────────────────────────────────────────────────────────── */

// 현재 몇 번째 질문인지 (0부터 시작)
let currentQuestionIndex = 0;

// 각 MBTI 지표별 점수
let scores = {
  E: 0, I: 0,
  S: 0, N: 0,
  T: 0, F: 0,
  J: 0, P: 0
};

// 전체 질문 수
const TOTAL_QUESTIONS = questions.length;


/* ─────────────────────────────────────────────────────────────
   4. DOM 요소 참조
   자주 사용하는 요소를 미리 변수에 담아둡니다.
───────────────────────────────────────────────────────────── */
const screenStart    = document.getElementById('screenStart');
const screenQuestion = document.getElementById('screenQuestion');
const screenResult   = document.getElementById('screenResult');

const progressBar      = document.getElementById('progressBar');
const questionCounter  = document.getElementById('questionCounter');
const questionText     = document.getElementById('questionText');
const optionsWrap      = document.getElementById('optionsWrap');

const resultMbti       = document.getElementById('resultMbti');
const resultImg        = document.getElementById('resultImg');
const resultCharacter  = document.getElementById('resultCharacter');
const resultDescription = document.getElementById('resultDescription');
const resultDetail     = document.getElementById('resultDetail');

const btnStart   = document.getElementById('btnStart');
const btnRestart = document.getElementById('btnRestart');


/* ─────────────────────────────────────────────────────────────
   5. 별 파티클 생성
   배경에 랜덤한 크기와 위치의 별을 생성합니다.
───────────────────────────────────────────────────────────── */
function createStars() {
  const container = document.getElementById('starsBg');
  const count = 80; // 별 개수

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';

    // 랜덤 위치
    const x = Math.random() * 100;
    const y = Math.random() * 100;

    // 랜덤 크기 (1px ~ 3px)
    const size = Math.random() * 2 + 1;

    // 랜덤 애니메이션 지속시간 & 딜레이
    const duration = (Math.random() * 3 + 2).toFixed(1);
    const delay    = (Math.random() * 4).toFixed(1);

    // CSS 인라인 스타일 적용
    star.style.cssText = `
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      --dur: ${duration}s;
      --delay: ${delay}s;
    `;

    container.appendChild(star);
  }
}


/* ─────────────────────────────────────────────────────────────
   6. 화면 전환 함수
   화면 간 부드러운 전환을 처리합니다.
───────────────────────────────────────────────────────────── */

/**
 * 특정 화면을 보이게 하고, 나머지는 숨깁니다.
 * @param {HTMLElement} targetScreen - 표시할 화면 요소
 */
function showScreen(targetScreen) {
  // 모든 화면 숨기기
  [screenStart, screenQuestion, screenResult].forEach(screen => {
    screen.classList.add('hidden');
  });

  // 목표 화면 표시 (애니메이션을 위해 잠시 지연 후 제거)
  targetScreen.classList.remove('hidden');

  // 페이드인 애니메이션을 다시 실행하기 위해 animation 초기화
  targetScreen.style.animation = 'none';
  // 브라우저가 변경을 감지하도록 한 프레임 대기
  requestAnimationFrame(() => {
    targetScreen.style.animation = '';
  });
}


/* ─────────────────────────────────────────────────────────────
   7. 질문 렌더링
───────────────────────────────────────────────────────────── */

/**
 * 현재 인덱스에 해당하는 질문을 화면에 표시합니다.
 */
function renderQuestion() {
  const question = questions[currentQuestionIndex];

  // 진행률 바 업데이트
  const progress = (currentQuestionIndex / TOTAL_QUESTIONS) * 100;
  progressBar.style.width = `${progress}%`;

  // 질문 번호 업데이트
  questionCounter.textContent = `${currentQuestionIndex + 1} / ${TOTAL_QUESTIONS}`;

  // 질문 텍스트 업데이트 (카드 페이드 효과)
  questionText.textContent = question.text;

  // 선택지 버튼 생성
  optionsWrap.innerHTML = ''; // 기존 버튼 초기화

  question.options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = option.label;

    // 약간의 지연을 두어 순차적으로 나타나도록 (stagger animation)
    btn.style.animationDelay = `${index * 0.08}s`;
    btn.style.animation = `fadeInUp 0.4s ${index * 0.08}s ease both`;

    // 클릭 이벤트: 점수를 반영하고 다음 질문으로 이동
    btn.addEventListener('click', () => handleAnswer(option.score, btn));

    optionsWrap.appendChild(btn);
  });
}

/**
 * 사용자가 선택지를 클릭했을 때 처리합니다.
 * @param {Object} score - 선택한 옵션의 점수 ({ E: 1 } 형태)
 * @param {HTMLElement} clickedBtn - 클릭된 버튼 요소
 */
function handleAnswer(score, clickedBtn) {
  // 모든 버튼 비활성화 (중복 클릭 방지)
  const allBtns = optionsWrap.querySelectorAll('.option-btn');
  allBtns.forEach(btn => btn.disabled = true);

  // 선택한 버튼 강조
  clickedBtn.classList.add('selected');

  // 점수 반영
  for (const [key, value] of Object.entries(score)) {
    scores[key] += value;
  }

  // 0.35초 후 다음 질문으로 이동 (선택 피드백 확인 시간)
  setTimeout(() => {
    currentQuestionIndex++;

    if (currentQuestionIndex < TOTAL_QUESTIONS) {
      // 다음 질문이 있으면 렌더링
      renderQuestion();
    } else {
      // 모든 질문을 마쳤으면 결과 화면으로 이동
      showResult();
    }
  }, 350);
}


/* ─────────────────────────────────────────────────────────────
   8. MBTI 계산 & 결과 표시
───────────────────────────────────────────────────────────── */

/**
 * 점수를 기반으로 MBTI 유형을 계산합니다.
 * 각 지표에서 더 높은 점수를 가진 쪽을 선택합니다.
 * 동점인 경우 앞의 유형을 기본값으로 사용합니다.
 * @returns {string} 계산된 MBTI 유형 (예: "ENFP")
 */
function calculateMBTI() {
  const E_or_I = scores.E >= scores.I ? 'E' : 'I';
  const S_or_N = scores.S >= scores.N ? 'S' : 'N';
  const T_or_F = scores.T >= scores.F ? 'T' : 'F';
  const J_or_P = scores.J >= scores.P ? 'J' : 'P';

  return `${E_or_I}${S_or_N}${T_or_F}${J_or_P}`;
}

/**
 * 결과를 계산하고 결과 화면에 표시합니다.
 */
function showResult() {
  // 진행률 바 100%로 완성
  progressBar.style.width = '100%';

  // MBTI 유형 계산
  const mbtiType = calculateMBTI();

  // 해당 유형의 캐릭터 데이터 가져오기
  const result = mbtiResults[mbtiType];

  // 결과 화면 요소에 데이터 반영
  resultMbti.textContent = mbtiType;
  resultCharacter.textContent = result.character;
  resultDescription.textContent = result.description;
  resultDetail.textContent = result.detail;

  // 이미지 설정 (로딩 실패 시 이모지로 대체)
  loadCharacterImage(result.image, result.emoji, result.character);

  // 결과 화면으로 전환
  showScreen(screenResult);

  // 콘솔에 점수 로그 (개발/디버깅용)
  console.log('📊 최종 점수:', scores);
  console.log(`🎭 MBTI 유형: ${mbtiType} → ${result.character}`);
}

/**
 * 캐릭터 이미지를 로드합니다.
 * 이미지 로딩에 실패하면 이모지로 대체합니다.
 * @param {string} imageSrc - 이미지 URL
 * @param {string} emoji - 대체 이모지
 * @param {string} altText - 이미지 대체 텍스트
 */
function loadCharacterImage(imageSrc, emoji, altText) {
  const imgWrap = resultImg.parentElement;

  // 이미지 로드 시도
  resultImg.src = imageSrc;
  resultImg.alt = altText;
  resultImg.style.display = 'block';

  // 이미지 로딩 실패 시 이모지로 대체
  resultImg.onerror = function () {
    // 이미지 숨기기
    resultImg.style.display = 'none';

    // 기존 이모지 요소가 있으면 제거
    const existing = imgWrap.querySelector('.char-emoji-fallback');
    if (existing) existing.remove();

    // 이모지 요소 생성
    const emojiEl = document.createElement('div');
    emojiEl.className = 'char-emoji-fallback';
    emojiEl.textContent = emoji;
    imgWrap.appendChild(emojiEl);
  };
}


/* ─────────────────────────────────────────────────────────────
   9. 테스트 초기화
   다시하기 버튼을 눌렀을 때 상태를 리셋합니다.
───────────────────────────────────────────────────────────── */

/**
 * 테스트를 처음 상태로 초기화합니다.
 */
function resetTest() {
  // 인덱스 초기화
  currentQuestionIndex = 0;

  // 점수 초기화
  scores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  };

  // 진행률 바 초기화
  progressBar.style.width = '0%';

  // 이미지/이모지 초기화
  const imgWrap = resultImg.parentElement;
  const emojiFallback = imgWrap.querySelector('.char-emoji-fallback');
  if (emojiFallback) emojiFallback.remove();
  resultImg.style.display = 'block';
  resultImg.src = '';
}


/* ─────────────────────────────────────────────────────────────
   10. 이벤트 리스너 등록
───────────────────────────────────────────────────────────── */

// 시작 버튼 클릭 → 질문 화면으로 이동
btnStart.addEventListener('click', () => {
  showScreen(screenQuestion);
  renderQuestion();
});

// 다시하기 버튼 클릭 → 초기화 후 시작 화면으로 이동
btnRestart.addEventListener('click', () => {
  resetTest();
  showScreen(screenStart);
});


/* ─────────────────────────────────────────────────────────────
   11. 앱 초기화 실행
───────────────────────────────────────────────────────────── */

// 페이지 로드 시 별 파티클 생성
createStars();

// 시작 화면 표시
showScreen(screenStart);

console.log('🏰 디즈니 MBTI 테스트가 시작되었습니다!');
