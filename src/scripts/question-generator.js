function generateQuestions(type) {
  switch (type) {
    case 'wrong-voice':
      return generateWrongVoiceQuestion();
    default:
      throw new Error(`Unknown question type: ${type}`);
  }
}

function generateWrongVoiceQuestion() {
  const detunedIndex = Math.floor(Math.random() * 4);
  const MAX_DETUNE_CENTS = 20;
  const detuneCents = Math.random() < 0.5 ? MAX_DETUNE_CENTS : -MAX_DETUNE_CENTS;
  console.log(`Detuning voice index ${detunedIndex} by ${detuneCents} cents`);

  const onPlay = async () => {
    const filePaths = [
      '/audio/Sopran (Da)/06 E4.wav',
      '/audio/Alt (Da)/07 C4.wav',
      '/audio/Tenor (Da)/12 A3.wav',
      '/audio/Bass (Da)/07 A2.wav',
    ];

    await _playAtSameTimeWithDetune(
      filePaths,
      [0, 0, 0, 0].map((v, i) => (i === detunedIndex ? detuneCents : v))
    );
  };

  return {
    onPlay,
    questions: [
      {
        question: 'Which voice is out of tune?',
        answers: ['Soprano', 'Alto', 'Tenor', 'Bass'],
        correctAnswer: detunedIndex,
      },
      {
        question: 'Was it too high or too low?',
        answers: ['Too high', 'Too low'],
        correctAnswer: detuneCents > 0 ? 0 : 1,
      },
    ],
  };
}

async function _playAtSameTimeWithDetune(files, detuneValues, duration = 1800) {
  const ctx = new AudioContext();

  // load and decode files
  const buffers = await Promise.all(
    files.map(async (path) => {
      const res = await fetch(path);
      const arr = await res.arrayBuffer();
      return ctx.decodeAudioData(arr);
    })
  );

  const sources = buffers.map((buffer, i) => {
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.detune.value = detuneValues[i];

    src.connect(ctx.destination);
    src.start();
    return src;
  });

  // stop all after 1.8s
  setTimeout(() => {
    sources.forEach((s) => s.stop());
    ctx.close(); // optional, frees resources
  }, duration);
}
