import { useReducer, useEffect, useRef, useCallback } from 'react';
import questionsData from '../data/questions.json';
import { playSfx, playBg, stopBg, bgForLevel } from '../utils/soundManager';

// ─── MONEY LADDER ────────────────────────────────────────────────────────────
export const MONEY_LADDER = [
  { label: '$100',         value: 100,       isSafetyNet: false },
  { label: '$200',         value: 200,       isSafetyNet: false },
  { label: '$300',         value: 300,       isSafetyNet: false },
  { label: '$500',         value: 500,       isSafetyNet: false },
  { label: '$1,000',       value: 1000,      isSafetyNet: true  },
  { label: '$2,000',       value: 2000,      isSafetyNet: false },
  { label: '$4,000',       value: 4000,      isSafetyNet: false },
  { label: '$8,000',       value: 8000,      isSafetyNet: false },
  { label: '$16,000',      value: 16000,     isSafetyNet: false },
  { label: '$32,000',      value: 32000,     isSafetyNet: true  },
  { label: '$64,000',      value: 64000,     isSafetyNet: false },
  { label: '$125,000',     value: 125000,    isSafetyNet: false },
  { label: '$250,000',     value: 250000,    isSafetyNet: false },
  { label: '$500,000',     value: 500000,    isSafetyNet: false },
  { label: '$1,000,000',   value: 1000000,   isSafetyNet: false },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickN(arr, n) {
  return shuffle(arr).slice(0, n);
}

/** Build a fresh 15-question game from the pool */
function selectQuestions() {
  const { easy, medium, hard, expert } = questionsData;
  return [
    ...pickN(easy, 5),
    ...pickN(medium, 5),
    ...pickN(hard, 3),
    ...pickN(expert, 2),
  ];
}

/**
 * Compute the safety-net amount a player has secured so far.
 * It locks in once the player has correctly answered a safety-net question.
 * `questionIndex` is the NEXT question (i.e. the one they're about to answer).
 */
function computeSafetyNet(questionIndex) {
  if (questionIndex > 9) return 32000;
  if (questionIndex > 4) return 1000;
  return 0;
}

/** Generate audience poll percentages (correct answer gets a boost). */
function generateAudienceResults(correctIndex, optionCount = 4) {
  const correctShare = Math.floor(Math.random() * 36) + 45; // 45–80 %
  const remaining = 100 - correctShare;
  const others = [];
  let sum = 0;
  for (let i = 0; i < optionCount - 2; i++) {
    const v = Math.floor(Math.random() * remaining * 0.6);
    others.push(v);
    sum += v;
  }
  others.push(remaining - sum);

  const results = Array(optionCount).fill(0);
  let otherIdx = 0;
  for (let i = 0; i < optionCount; i++) {
    if (i === correctIndex) {
      results[i] = correctShare;
    } else {
      results[i] = others[otherIdx++] ?? 0;
    }
  }
  return results;
}

/** Generate a phone-a-friend hint message. */
function generatePhoneHint(question, correctIndex) {
  const confidence = Math.random();
  const letters = ['A', 'B', 'C', 'D'];
  const correctLetter = letters[correctIndex];
  const correctText = question.options[correctIndex];

  if (confidence > 0.6) {
    return `"I'm pretty confident on this one — I'd go with ${correctLetter}: ${correctText}. I'm fairly certain that's right!"`;
  } else if (confidence > 0.3) {
    return `"Hmm, this is tricky. I think it might be ${correctLetter}: ${correctText}, but I'm not 100% sure. I'd say about 60–70% confident."`;
  } else {
    // Friend guesses wrong occasionally
    const wrongIdx = (correctIndex + 1) % 4;
    const wrongLetter = letters[wrongIdx];
    const wrongText = question.options[wrongIdx];
    return `"I'm not too sure on this one... if I had to guess, maybe ${wrongLetter}: ${wrongText}? But honestly I'm only about 30% confident."`;
  }
}

// ─── STATE SHAPE ─────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  /** 'start' | 'question' | 'pending' | 'revealing' | 'correct' | 'wrong' | 'won' | 'walkaway' */
  phase: 'start',
  questions: [],
  currentIndex: 0,       // 0-based; index into MONEY_LADDER too
  selectedAnswer: null,  // 0-3 | null
  eliminatedAnswers: [], // indices removed by 50:50
  audienceResults: null, // number[4] | null
  phoneHint: null,       // string | null
  activeLifeline: null,  // 'audience' | 'phone' | null  (which modal is open)
  lifelines: {
    fiftyFifty:    false,
    phoneAFriend:  false,
    askAudience:   false,
  },
  safetyNetAmount: 0,
  wonAmount: 0,
};

// ─── REDUCER ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'START_GAME':
      return {
        ...INITIAL_STATE,
        phase: 'question',
        questions: selectQuestions(),
        currentIndex: 0,
      };

    case 'SELECT_ANSWER':
      if (state.phase !== 'question') return state;
      return { ...state, phase: 'pending', selectedAnswer: action.index };

    case 'REVEAL_ANSWER': {
      const q = state.questions[state.currentIndex];
      const isCorrect = state.selectedAnswer === q.correctIndex;
      if (isCorrect) {
        const won = MONEY_LADDER[state.currentIndex].value;
        const safetyNet = computeSafetyNet(state.currentIndex + 1);
        if (state.currentIndex === 14) {
          // Final question — WIN
          return { ...state, phase: 'won', wonAmount: 1000000, safetyNetAmount: safetyNet };
        }
        return { ...state, phase: 'correct', wonAmount: won, safetyNetAmount: safetyNet };
      } else {
        return { ...state, phase: 'wrong', wonAmount: state.safetyNetAmount };
      }
    }

    case 'NEXT_QUESTION':
      if (state.phase !== 'correct') return state;
      return {
        ...state,
        phase: 'question',
        currentIndex: state.currentIndex + 1,
        selectedAnswer: null,
        eliminatedAnswers: [],
        audienceResults: null,
        phoneHint: null,
        activeLifeline: null,
      };

    case 'WALK_AWAY': {
      const earned = state.currentIndex > 0
        ? MONEY_LADDER[state.currentIndex - 1].value
        : 0;
      return { ...state, phase: 'walkaway', wonAmount: earned };
    }

    case 'USE_FIFTY_FIFTY': {
      if (state.lifelines.fiftyFifty) return state;
      const q = state.questions[state.currentIndex];
      const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.correctIndex);
      const toEliminate = pickN(wrongIndices, 2);
      return {
        ...state,
        lifelines: { ...state.lifelines, fiftyFifty: true },
        eliminatedAnswers: toEliminate,
      };
    }

    case 'USE_PHONE': {
      if (state.lifelines.phoneAFriend) return state;
      const q = state.questions[state.currentIndex];
      return {
        ...state,
        lifelines: { ...state.lifelines, phoneAFriend: true },
        phoneHint: generatePhoneHint(q, q.correctIndex),
        activeLifeline: 'phone',
      };
    }

    case 'USE_AUDIENCE': {
      if (state.lifelines.askAudience) return state;
      const q = state.questions[state.currentIndex];
      return {
        ...state,
        lifelines: { ...state.lifelines, askAudience: true },
        audienceResults: generateAudienceResults(q.correctIndex),
        activeLifeline: 'audience',
      };
    }

    case 'DISMISS_LIFELINE':
      return { ...state, activeLifeline: null };

    case 'RESET':
      return INITIAL_STATE;

    default:
      return state;
  }
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useGameState() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const revealTimerRef = useRef(null);

  // Auto-reveal after dramatic pause when an answer is pending
  useEffect(() => {
    if (state.phase === 'pending') {
      playSfx('finalAnswer');
      revealTimerRef.current = setTimeout(() => {
        dispatch({ type: 'REVEAL_ANSWER' });
      }, 2200);
    }
    return () => clearTimeout(revealTimerRef.current);
  }, [state.phase, state.selectedAnswer]);

  // Sound effects on phase transitions
  useEffect(() => {
    if (state.phase === 'question') {
      playBg(bgForLevel(state.currentIndex));
      playSfx('questionAppear');
    }
    if (state.phase === 'correct') playSfx('correct');
    if (state.phase === 'wrong')   playSfx('wrong');
    if (state.phase === 'won')     { stopBg(); playSfx('million'); }
    if (state.phase === 'walkaway') { stopBg(); playSfx('walkAway'); }
  }, [state.phase, state.currentIndex]);

  // ── Actions ──────────────────────────────────────────────────────────────
  const startGame   = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const selectAnswer = useCallback(i => dispatch({ type: 'SELECT_ANSWER', index: i }), []);
  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), []);
  const walkAway     = useCallback(() => dispatch({ type: 'WALK_AWAY' }), []);
  const useFiftyFifty   = useCallback(() => { playSfx('lifelineUsed'); dispatch({ type: 'USE_FIFTY_FIFTY' }); }, []);
  const usePhoneAFriend = useCallback(() => { playSfx('phonering'); dispatch({ type: 'USE_PHONE' }); }, []);
  const useAskAudience  = useCallback(() => { playSfx('lifelineUsed'); dispatch({ type: 'USE_AUDIENCE' }); }, []);
  const dismissLifeline = useCallback(() => dispatch({ type: 'DISMISS_LIFELINE' }), []);
  const resetGame       = useCallback(() => { stopBg(); dispatch({ type: 'RESET' }); }, []);

  // ── Derived helpers ───────────────────────────────────────────────────────
  const currentQuestion = state.questions[state.currentIndex] ?? null;

  /** Per-button display state: 'default' | 'eliminated' | 'pending' | 'correct' | 'wrong' | 'reveal-correct' */
  function getAnswerState(optionIndex) {
    if (state.eliminatedAnswers.includes(optionIndex)) return 'eliminated';
    const isSelected   = state.selectedAnswer === optionIndex;
    const isCorrect    = currentQuestion && optionIndex === currentQuestion.correctIndex;

    if (state.phase === 'pending') {
      return isSelected ? 'pending' : 'default';
    }
    if (state.phase === 'correct' || state.phase === 'wrong' || state.phase === 'won') {
      if (isSelected && isCorrect)   return 'correct';
      if (isSelected && !isCorrect)  return 'wrong';
      if (!isSelected && isCorrect)  return 'reveal-correct'; // always show correct answer
      return 'default';
    }
    return 'default';
  }

  return {
    state,
    currentQuestion,
    getAnswerState,
    // actions
    startGame,
    selectAnswer,
    nextQuestion,
    walkAway,
    useFiftyFifty,
    usePhoneAFriend,
    useAskAudience,
    dismissLifeline,
    resetGame,
  };
}
