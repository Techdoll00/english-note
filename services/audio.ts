
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, slow: boolean = false) {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
  }

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Try to find a high quality English voice
  const voices = window.speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-US')) || voices[0];
  
  if (enVoice) utterance.voice = enVoice;
  
  utterance.rate = slow ? 0.75 : 1.0;
  utterance.pitch = 1.0;
  
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  
  return new Promise<void>((resolve) => {
    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };
  });
}

export function stopSpeaking() {
  window.speechSynthesis.cancel();
}
