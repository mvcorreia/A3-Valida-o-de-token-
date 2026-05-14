export const speakText = (text: string) => {
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = "pt-BR";

  utterance.rate = 1;

  utterance.volume = 1;

  speechSynthesis.speak(utterance);
};
