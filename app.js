// 질문 데이터
const QUESTIONS = [
  { q: "우리 아이는 어떤 친구 관계를 더 편안해하나요?",
    a: "같은 아파트(동네) 친구들과 자주 만나 놀고, 함께 다니는 걸 좋아해요.",
    b: "처음 만난 친구와도 금방 어울리고, 새로운 모임에도 잘 끼어요." },
  { q: "우리 아이는 어떤 방식의 칭찬을 더 좋아하나요?",
    a: "칭찬스티커/도장처럼 '기준을 채우면 주는 보상'을 좋아해요.",
    b: "'여기 이렇게 해서 좋았어'처럼 아이가 한 걸 자세히 봐주는 칭찬에 더 동기가 생겨요." },
  { q: "우리 아이는 시끌벅적한 자리에서 어떻게 반응하나요?",
    a: "행사나 소리가 큰 곳에서는 쉽게 지치고, 조용한 곳을 찾으려 해요.",
    b: "떠들썩해도 잠깐 쉬면 다시 잘 놀고 금방 적응해요." },
  { q: "우리 가족은 아이 교육에서 무엇을 더 우선하나요?",
    a: "기본기부터 탄탄하게 쌓고, 체계적으로 학습하는 걸 더 중시해요.",
    b: "협력·탐구·체험 같은 과정과 경험에서 배우는 성장을 더 중시해요." },
  { q: "우리 아이는 특별히 선호하는 특성화 활동이 있나요?",
    a: "피아노/미술/체육/언어 같은 '특별 활동'에 깊은 관심과 선호가 있어요.",
    b: "별히 선호하는 '특별 활동'이 있지는 않아요." },
  { q: "우리 아이는 언어·다문화 노출에 어떻게 반응하나요?",
    a: "한국어 설명이 편하고, 영어는 노래 따라 부르기 정도면 충분해요.",
    b: "간단한 영어 지시·놀이도 좋아하고, 다른 문화 이야기에도 호기심이 커요." },
  { q: "우리 가족은 기관(유치원)과의 소통에서 어떤 방식을 더 선호하나요?",
    a: "알림장/가정통신문처럼 일정이 정리되어 오는 방식이면 충분해요.",
    b: "사진·영상 공유, 설명회·행사 안내처럼 자주 소통해 주면 더 안심돼요." },
  { q: "우리 아이는 어떤 활동에서 더 몰입하나요?",
    a: "따라 쓰기, 숫자 세기, 책 읽기처럼 '차근차근 따라하는 활동'에서 더 집중해요.",
    b: "만들기, 실험, 발표·공연, 체험처럼 '자유롭게 표현하는 활동'에 더 성취감을 느껴요." },
  { q: "우리 가족은 학교 선택·지원 방식에 대해 어떻게 생각하나요?",
    a: "배정된 학교로 가는 일반 절차가 마음이 편하고, 추가 지원은 부담돼요.",
    b: "아이와 잘 맞는 학교를 찾기 위해 지원/면접 절차를 시간을 들여 알아보고, 고액의 학비도 부담할 의향이 있어요." },
  { q: "우리 가족은 통학·생활 방식에서 무엇을 더 중요하게 보나요?",
    a: "통학 시간은 최대한 짧게, 안정적인 생활 환경을 가졌으면 해요.",
    b: "좋은 학교라면 장거리 통학이나 기숙학교도 선택할 수 있어요." }
];

// 학교 유형별 가중치 (A선택지, B선택지 분리)
const WEIGHTS = {
  "공립": {
    A: [2, 1, 1, 2, 0, 1, 2, 2, 2, 3],
    B: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0]
  },
  "국립": {
    A: [0, 1, 0, 1, 1, 1, 0, 1, 1, 0],
    B: [1, 1, 1, 1, 0, 0, 2, 1, 1, 1]
  },
  "사립": {
    A: [1, 0, 0, 1, 2, 0, 0, 0, 0, 0],
    B: [0, 2, 1, 1, 0, 1, 2, 1, 1, 1]
  },
  "대안": {
    A: [1, 0, 2, 0, 0, 0, 0, 0, 0, 0],
    B: [0, 2, 0, 2, 0, 0, 0, 2, 1, 1]
  },
  "외국인": {
    A: [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
    B: [1, 0, 1, 0, 0, 2, 0, 1, 2, 3]
  }
};

// 타이브레이커 우선순위
const TIE_PRIOR = {
  "10A": ["공립", "국립", "사립", "대안", "외국인"],
  "10B": ["사립", "외국인", "대안", "국립", "공립"],
  "1A": ["공립", "대안", "국립", "사립", "외국인"],
  "1B": ["국립", "사립", "외국인", "공립", "대안"],
  "6A": ["공립", "국립", "대안", "사립", "외국인"],
  "6B": ["사립", "외국인", "국립", "대안", "공립"],
  "4A": ["공립", "국립", "사립", "외국인", "대안"],
  "4B": ["대안", "국립", "사립", "공립", "외국인"],
  "3A": ["대안", "사립", "공립", "국립", "외국인"],
  "3B": ["국립", "사립", "외국인", "공립", "대안"]
};

// 학교 유형별 이미지 파일명
const SCHOOL_IMAGES = {
  "공립": "public.png",
  "사립": "private.png",
  "국립": "national.png",
  "외국인": "international.png",
  "대안": "alternative.png"
};

// 학교 유형별 결과 텍스트
const SCHOOL_RESULTS = {
  "공립": "공립초등학교",
  "사립": "사립초등학교",
  "국립": "국립초등학교",
  "외국인": "국제학교⋅외국인학교",
  "대안": "대안학교"
};

// 전역 상태
let currentQ = 0;
let answers = [];

// DOM 요소들 (에러 처리 포함)
let intro, quiz, result, startBtn, qText, optA, optB;
let prevBtn, nextBtn, qIndex, barFill, topType, resultImg;
let shareBtn, retryBtn;

// DOM 초기화 함수
function initializeDOM() {
  try {
    intro = document.getElementById('intro');
    quiz = document.getElementById('quiz');
    result = document.getElementById('result');
    startBtn = document.getElementById('startBtn');
    qText = document.getElementById('qText');
    optA = document.getElementById('optA');
    optB = document.getElementById('optB');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    qIndex = document.getElementById('qIndex');
    barFill = document.getElementById('barFill');
    topType = document.getElementById('topType');
    resultImg = document.getElementById('resultImg');
    shareBtn = document.getElementById('shareTest');
    retryBtn = document.getElementById('retry');

    // 필수 요소들 존재 확인
    const requiredElements = [intro, quiz, result, startBtn, qText, optA, optB];
    for (const element of requiredElements) {
      if (!element) {
        throw new Error('필수 DOM 요소가 존재하지 않습니다.');
      }
    }
    
    return true;
  } catch (error) {
    console.error('DOM 초기화 실패:', error);
    return false;
  }
}

// 타이브레이커 함수
function applyTiebreaker(tiedSchools, answers) {
  try {
    const questionsToCheck = [9, 0, 5, 3, 2]; // Q10, Q1, Q6, Q4, Q3 (0-based)

    for (const qIndex of questionsToCheck) {
      if (qIndex < 0 || qIndex >= answers.length || !answers[qIndex]) continue;
      
      const key = (qIndex + 1) + answers[qIndex];
      const priorityList = TIE_PRIOR[key];
      
      if (!priorityList) continue;

      for (const school of priorityList) {
        if (tiedSchools.includes(school)) {
          return school;
        }
      }
    }

    return tiedSchools[0];
  } catch (error) {
    console.error('타이브레이커 적용 실패:', error);
    return tiedSchools[0];
  }
}

// 결과 계산 함수 (수정됨)
function showResult() {
  try {
    const scores = {};
    
    // 점수 계산
    for (const type in WEIGHTS) {
      scores[type] = 0;
      
      for (let i = 0; i < answers.length; i++) {
        if (i >= QUESTIONS.length) break; // 범위 확인
        
        if (answers[i] === 'A' && WEIGHTS[type].A && WEIGHTS[type].A[i] !== undefined) {
          scores[type] += WEIGHTS[type].A[i];
        } else if (answers[i] === 'B' && WEIGHTS[type].B && WEIGHTS[type].B[i] !== undefined) {
          scores[type] += WEIGHTS[type].B[i];
        }
      }
    }
    
    // 최고 점수 찾기
    let topSchools = [];
    let maxScore = Math.max(...Object.values(scores));
    
    for (const type in scores) {
      if (scores[type] === maxScore) {
        topSchools.push(type);
      }
    }
    
    // 타이브레이커 적용
    let finalSchool = topSchools[0];
    if (topSchools.length > 1) {
      finalSchool = applyTiebreaker(topSchools, answers);
    }
    
    // 결과 표시
    if (topType) {
      topType.textContent = SCHOOL_RESULTS[finalSchool] || '추천 결과';
    }
    
    if (resultImg && SCHOOL_IMAGES[finalSchool]) {
      resultImg.src = SCHOOL_IMAGES[finalSchool];
      resultImg.alt = (SCHOOL_RESULTS[finalSchool] || '') + ' 결과 이미지';
      
      // 이미지 로드 에러 처리
      resultImg.onerror = function() {
        this.style.display = 'none';
        console.warn('이미지 로드 실패:', this.src);
      };
    }
    
    // 화면 전환
    if (quiz) quiz.classList.add('hidden');
    if (result) result.classList.remove('hidden');
    
  } catch (error) {
    console.error('결과 계산 실패:', error);
    alert('결과 계산 중 오류가 발생했습니다. 다시 시도해주세요.');
  }
}

// 이벤트 리스너 등록
function setupEventListeners() {
  try {
    if (startBtn) startBtn.addEventListener('click', startQuiz);
    if (optA) optA.addEventListener('click', () => selectOption('A'));
    if (optB) optB.addEventListener('click', () => selectOption('B'));
    if (prevBtn) prevBtn.addEventListener('click', prevQuestion);
    if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
    if (shareBtn) shareBtn.addEventListener('click', shareTest);
    if (retryBtn) retryBtn.addEventListener('click', restart);
  } catch (error) {
    console.error('이벤트 리스너 등록 실패:', error);
  }
}

// 퀴즈 시작
function startQuiz() {
  try {
    if (intro) intro.classList.add('hidden');
    if (quiz) quiz.classList.remove('hidden');
    showQuestion();
  } catch (error) {
    console.error('퀴즈 시작 실패:', error);
  }
}

// 질문 표시
function showQuestion() {
  try {
    if (currentQ < 0 || currentQ >= QUESTIONS.length) return;
    
    const q = QUESTIONS[currentQ];
    if (qText) qText.textContent = q.q || '';
    if (optA) optA.textContent = q.a || '';
    if (optB) optB.textContent = q.b || '';

    if (qIndex) qIndex.textContent = currentQ + 1;
    if (barFill) {
      barFill.style.width = ((currentQ + 1) / QUESTIONS.length * 100) + '%';
    }

    // 선택 상태 초기화
    if (optA) optA.classList.remove('selected');
    if (optB) optB.classList.remove('selected');
    if (nextBtn) nextBtn.disabled = true;

    // 이전 선택 복원
    if (answers[currentQ]) {
      const selectedOpt = answers[currentQ] === 'A' ? optA : optB;
      if (selectedOpt) selectedOpt.classList.add('selected');
      if (nextBtn) nextBtn.disabled = false;
    }

    // 이전 버튼 상태
    if (prevBtn) prevBtn.disabled = currentQ === 0;
  } catch (error) {
    console.error('질문 표시 실패:', error);
  }
}

// 옵션 선택
function selectOption(option) {
  try {
    if (optA) optA.classList.remove('selected');
    if (optB) optB.classList.remove('selected');
    
    const selectedOpt = option === 'A' ? optA : optB;
    if (selectedOpt) selectedOpt.classList.add('selected');

    answers[currentQ] = option;
    if (nextBtn) nextBtn.disabled = false;
  } catch (error) {
    console.error('옵션 선택 실패:', error);
  }
}

// 이전 질문
function prevQuestion() {
  try {
    if (currentQ > 0) {
      currentQ--;
      showQuestion();
    }
  } catch (error) {
    console.error('이전 질문 이동 실패:', error);
  }
}

// 다음 질문
function nextQuestion() {
  try {
    if (currentQ < QUESTIONS.length - 1) {
      currentQ++;
      showQuestion();
    } else {
      showResult();
    }
  } catch (error) {
    console.error('다음 질문 이동 실패:', error);
  }
}

// 공유하기 (수정됨)
function shareTest() {
  try {
    const url = window.location.href;
    const text = '우리 아이 학교 유형 테스트 - 엘리하이 키즈';
    
    // Web Share API 지원 확인 (모바일)
    if (navigator.share) {
      navigator.share({
        title: text,
        text: '우리 아이에게 맞는 학교 유형을 찾아보세요!',
        url: url
      }).catch(err => console.log('공유 실패:', err));
    } 
    // 클립보드 복사 (데스크톱)
    else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(`${text}\n${url}`)
        .then(() => alert('링크가 클립보드에 복사되었습니다!'))
        .catch(() => fallbackCopy(url));
    }
    // 폴백 방법
    else {
      fallbackCopy(url);
    }
  } catch (error) {
    console.error('공유 실패:', error);
    fallbackCopy(window.location.href);
  }
}

// 폴백 복사 함수 (메모리 누수 방지)
function fallbackCopy(text) {
  let textarea = null;
  try {
    textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    const success = document.execCommand('copy');
    if (success) {
      alert('링크가 클립보드에 복사되었습니다!');
    } else {
      throw new Error('복사 실패');
    }
  } catch (err) {
    console.error('복사 실패:', err);
    alert('링크 복사에 실패했습니다. 수동으로 복사해주세요:\n' + text);
  } finally {
    // 메모리 누수 방지
    if (textarea && textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
  }
}

// 다시하기
function restart() {
  try {
    currentQ = 0;
    answers = [];
    if (result) result.classList.add('hidden');
    if (intro) intro.classList.remove('hidden');
  } catch (error) {
    console.error('재시작 실패:', error);
  }
}

// 초기화
document.addEventListener('DOMContentLoaded', function() {
  if (initializeDOM()) {
    setupEventListeners();
    console.log('퀴즈 애플리케이션이 성공적으로 초기화되었습니다.');
  } else {
    console.error('퀴즈 애플리케이션 초기화에 실패했습니다.');
  }
});
