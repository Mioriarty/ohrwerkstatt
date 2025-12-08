function generateQuestions(type) {
  switch (type) {
    case 'wrong-voice':
      return generateWrongVoiceQuestion();
    default:
      throw new Error(`Unknown question type: ${type}`);
  }
}

function generateWrongVoiceQuestion() {
  const onPlay = () => {
    const audio = new Audio('/assets/audio/sample-wrong-voice.mp3');
    audio.play();
  };

  return {
    onPlay,
    questions: [
      {
        question: 'Welche Stimme klingt falsch?',
        answers: ['Die Bass-Stimme', 'Die Tenor-Stimme', 'Die Alt-Stimme', 'Die Sopran-Stimme'],
        correctAnswer: 2,
      },
      {
        question: 'War sie zu hoch oder zu tief?',
        answers: ['Zu hoch', 'Zu tief'],
        correctAnswer: 1,
      },
    ],
  };
}
