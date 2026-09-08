// Voice recognition helper (Turkish speech-to-text)
export function startVoiceRecognition({ onResult, onError, onEnd }) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (onError) onError('Tarayıcınızda ses tanıma özelliği desteklenmiyor.');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'tr-TR';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    if (event.results && event.results[0]) {
      const transcript = event.results[0][0].transcript;
      if (onResult) onResult(transcript);
    }
  };

  recognition.onerror = (event) => {
    console.warn('Speech error:', event.error);
    if (onError) onError(event.error);
  };

  recognition.onend = () => {
    if (onEnd) onEnd();
  };

  try {
    recognition.start();
    return recognition;
  } catch (err) {
    console.warn('Speech start error:', err);
    if (onError) onError(err);
    return null;
  }
}
