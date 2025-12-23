export const analysisData = {
  focus: {
    title: '주의력 집중',
    subtitle: 'Attention & Focus',
    score: 100,
    evaluation: '지속적인 주의력 유지 능력이 양호합니다. 과제 수행 중 산만함이 적고, 외부 자극에 대한 저항력이 우수합니다.',
    details: [
      { label: '지속 주의력', status: '우수' },
      { label: '선택 주의력', status: '우수' },
      { label: '분할 주의력', status: '양호' }
    ]
  },
  impulse: {
    title: '충동 반응',
    subtitle: 'Impulse Control',
    score: 85,
    evaluation: '충동 조절 능력이 양호한 편입니다. 즉각적인 반응을 억제하고 신중하게 판단하는 능력이 적절히 발달되어 있습니다.',
    details: [
      { label: '반응 억제력', status: '양호' },
      { label: '충동 조절', status: '우수' },
      { label: '행동 통제', status: '양호' }
    ]
  },
  speed: {
    title: '반응 속도',
    subtitle: 'Response Speed',
    score: 92,
    evaluation: '정보 처리 속도가 빠르고 효율적입니다. 자극에 대한 반응 시간이 적절하며, 빠른 의사결정 능력을 보입니다.',
    details: [
      { label: '처리 속도', status: '우수' },
      { label: '반응 시간', status: '우수' },
      { label: '정확도', status: '양호' }
    ]
  },
  memory: {
    title: '작업 기억',
    subtitle: 'Working Memory',
    score: 88,
    evaluation: '단기 기억 및 작업 기억 능력이 우수합니다. 정보를 일시적으로 저장하고 처리하는 능력이 잘 발달되어 있습니다.',
    details: [
      { label: '단기 기억', status: '우수' },
      { label: '작업 기억 용량', status: '양호' },
      { label: '정보 유지력', status: '우수' }
    ]
  }
};

export const solutionData = [
  {
    emoji: '🏃',
    title: '규칙적인 운동',
    description: '주 3회 이상 유산소 운동으로 집중력 향상',
    examples: '조깅, 수영, 자전거 등'
  },
  {
    emoji: '🧘',
    title: '명상과 이완',
    description: '하루 10분 명상으로 마음의 안정 찾기',
    examples: '호흡 명상, 요가, 스트레칭'
  },
  {
    emoji: '📅',
    title: '일정 관리',
    description: '체계적인 스케줄로 시간 관리 능력 향상',
    examples: '플래너 작성, 알람 설정'
  }
];
