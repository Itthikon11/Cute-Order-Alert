// Web Audio Synthesizer, Mixer, and WAV File Exporter

// Convert AudioBuffer to standard 16-bit PCM WAV Blob
export function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const length = buffer.length * blockAlign;
  const bufferLength = 44 + length;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  // RIFF identifier
  writeString(view, 0, 'RIFF');
  // file length minus RIFF identifier and length
  view.setUint32(4, 36 + length, true);
  // RIFF type
  writeString(view, 8, 'WAVE');
  // format chunk identifier
  writeString(view, 12, 'fmt ');
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, format, true);
  // channel count
  view.setUint16(22, numChannels, true);
  // sample rate
  view.setUint32(24, sampleRate, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, sampleRate * blockAlign, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, blockAlign, true);
  // bits per sample
  view.setUint16(34, bitDepth, true);
  // data chunk identifier
  writeString(view, 36, 'data');
  // data chunk length
  view.setUint32(40, length, true);

  // Write interleaved PCM samples
  const channels: Float32Array[] = [];
  for (let i = 0; i < numChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numChannels; channel++) {
      let sample = channels[channel][i];
      // Clamp between -1 and 1
      sample = Math.max(-1, Math.min(1, sample));
      // Scale to 16-bit signed integer
      const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

// Convert Base64 string to ArrayBuffer
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Synthesize sound effects into an AudioBuffer using OfflineAudioContext
export async function synthesizeChimeBuffer(
  type: 'bell' | 'cash' | 'pop' | 'dingdong' | 'coin' | 'marimba' | 'none',
  sampleRate = 44100
): Promise<AudioBuffer | null> {
  if (type === 'none') return null;

  const duration = type === 'cash' ? 1.0 : type === 'dingdong' ? 1.2 : 0.8;
  const offlineCtx = new OfflineAudioContext(2, Math.ceil(sampleRate * duration), sampleRate);

  if (type === 'bell') {
    // Sparkling Crystal Bell
    const frequencies = [1318.51, 1567.98, 2093.0, 2637.02];
    frequencies.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, 0);

      const startTime = idx * 0.04;
      gain.gain.setValueAtTime(0, 0);
      gain.gain.setValueAtTime(0.3 / (idx + 1), startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.65);

      osc.connect(gain);
      gain.connect(offlineCtx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.7);
    });
  } else if (type === 'cash') {
    // Ka-ching cash register sound
    // Clink 1
    const osc1 = offlineCtx.createOscillator();
    const gain1 = offlineCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1800, 0);
    osc1.frequency.exponentialRampToValueAtTime(2400, 0.08);
    gain1.gain.setValueAtTime(0.35, 0);
    gain1.gain.exponentialRampToValueAtTime(0.001, 0.15);
    osc1.connect(gain1);
    gain1.connect(offlineCtx.destination);
    osc1.start(0);
    osc1.stop(0.18);

    // Clink 2 (higher)
    const osc2 = offlineCtx.createOscillator();
    const gain2 = offlineCtx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(2400, 0.08);
    osc2.frequency.exponentialRampToValueAtTime(3200, 0.16);
    gain2.gain.setValueAtTime(0.4, 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.0001, 0.7);
    osc2.connect(gain2);
    gain2.connect(offlineCtx.destination);
    osc2.start(0.08);
    osc2.stop(0.75);

    // Register drawer spring ping
    const osc3 = offlineCtx.createOscillator();
    const gain3 = offlineCtx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(987.77, 0.12); // B5
    gain3.gain.setValueAtTime(0.2, 0.12);
    gain3.gain.exponentialRampToValueAtTime(0.001, 0.5);
    osc3.connect(gain3);
    gain3.connect(offlineCtx.destination);
    osc3.start(0.12);
    osc3.stop(0.55);
  } else if (type === 'pop') {
    // Cute bubble pop
    const osc = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, 0);
    osc.frequency.exponentialRampToValueAtTime(1400, 0.08);
    gain.gain.setValueAtTime(0.5, 0);
    gain.gain.exponentialRampToValueAtTime(0.001, 0.25);
    osc.connect(gain);
    gain.connect(offlineCtx.destination);
    osc.start(0);
    osc.stop(0.3);
  } else if (type === 'dingdong') {
    // Two-tone friendly chime (G5 -> E5)
    // Tone 1: G5 (783.99 Hz)
    const osc1 = offlineCtx.createOscillator();
    const gain1 = offlineCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(783.99, 0);
    gain1.gain.setValueAtTime(0.4, 0);
    gain1.gain.exponentialRampToValueAtTime(0.001, 0.5);
    osc1.connect(gain1);
    gain1.connect(offlineCtx.destination);
    osc1.start(0);
    osc1.stop(0.55);

    // Tone 2: E5 (659.25 Hz)
    const osc2 = offlineCtx.createOscillator();
    const gain2 = offlineCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, 0.25);
    gain2.gain.setValueAtTime(0.45, 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.0001, 0.95);
    osc2.connect(gain2);
    gain2.connect(offlineCtx.destination);
    osc2.start(0.25);
    osc2.stop(1.0);
  } else if (type === 'coin') {
    // 8-bit retro coin
    const osc1 = offlineCtx.createOscillator();
    const gain1 = offlineCtx.createGain();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(987.77, 0); // B5
    osc1.frequency.setValueAtTime(1318.51, 0.08); // E6
    gain1.gain.setValueAtTime(0.25, 0);
    gain1.gain.exponentialRampToValueAtTime(0.001, 0.45);
    osc1.connect(gain1);
    gain1.connect(offlineCtx.destination);
    osc1.start(0);
    osc1.stop(0.5);
  } else if (type === 'marimba') {
    // Warm Marimba chime chord
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, idx) => {
      const osc = offlineCtx.createOscillator();
      const gain = offlineCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, idx * 0.08);
      gain.gain.setValueAtTime(0.35, idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, idx * 0.08 + 0.35);
      osc.connect(gain);
      gain.connect(offlineCtx.destination);
      osc.start(idx * 0.08);
      osc.stop(idx * 0.08 + 0.4);
    });
  }

  return await offlineCtx.startRendering();
}

// Mix intro chime and speech buffer into a combined AudioBuffer
export async function mixAudioBuffers(
  chimeBuffer: AudioBuffer | null,
  speechBuffer: AudioBuffer,
  options: {
    pitch?: number; // playbackRate for speech
    speed?: number;
    chimeVolume?: number;
    voiceVolume?: number;
    introDelay?: number;
  }
): Promise<AudioBuffer> {
  const sampleRate = speechBuffer.sampleRate;
  const pitchRate = options.pitch ?? 1.0;
  const chimeVol = options.chimeVolume ?? 0.9;
  const voiceVol = options.voiceVolume ?? 1.0;
  const introDelay = options.introDelay ?? (chimeBuffer ? 0.35 : 0.0);

  // Calculate speech duration adjusted by pitch/speed
  const speechAdjustedDuration = speechBuffer.duration / pitchRate;
  const chimeDuration = chimeBuffer ? chimeBuffer.duration : 0;
  const totalDuration = Math.max(chimeDuration, introDelay + speechAdjustedDuration) + 0.3;

  const offlineCtx = new OfflineAudioContext(
    2,
    Math.ceil(sampleRate * totalDuration),
    sampleRate
  );

  // If chime buffer exists, schedule it
  if (chimeBuffer) {
    const chimeSource = offlineCtx.createBufferSource();
    chimeSource.buffer = chimeBuffer;
    const chimeGain = offlineCtx.createGain();
    chimeGain.gain.value = chimeVol;
    chimeSource.connect(chimeGain);
    chimeGain.connect(offlineCtx.destination);
    chimeSource.start(0);
  }

  // Schedule speech buffer
  const speechSource = offlineCtx.createBufferSource();
  speechSource.buffer = speechBuffer;
  speechSource.playbackRate.value = pitchRate;

  const speechGain = offlineCtx.createGain();
  speechGain.gain.value = voiceVol;

  speechSource.connect(speechGain);
  speechGain.connect(offlineCtx.destination);

  speechSource.start(introDelay);

  return await offlineCtx.startRendering();
}

// Play native device speech synthesis with cute pitch
export function playNativeCuteSpeech(
  text: string,
  pitch = 1.35,
  rate = 1.05
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'th-TH';
      utter.pitch = Math.min(2, Math.max(0.5, pitch));
      utter.rate = Math.min(1.5, Math.max(0.7, rate));

      // Try to find a Thai or high-pitched female voice
      const voices = window.speechSynthesis.getVoices();
      const thaiVoice =
        voices.find(
          (v) =>
            v.lang.toLowerCase().includes('th') &&
            (v.name.toLowerCase().includes('female') ||
              v.name.toLowerCase().includes('kanya') ||
              v.name.toLowerCase().includes('siri') ||
              v.name.toLowerCase().includes('prem') ||
              v.name.toLowerCase().includes('google'))
        ) || voices.find((v) => v.lang.toLowerCase().includes('th'));

      if (thaiVoice) {
        utter.voice = thaiVoice;
      }

      utter.onend = () => resolve();
      utter.onerror = () => resolve();

      window.speechSynthesis.speak(utter);

      // Failsafe timeout in case onend doesn't trigger
      setTimeout(() => resolve(), 3000);
    } catch (e) {
      resolve();
    }
  });
}

// Generate fallback speech audio with distinct voice personality for each character
export async function generateFallbackSpeechBuffer(
  text: string,
  voiceName: 'Aoede' | 'Kore' | 'Zephyr' | 'Puck' = 'Aoede',
  sampleRate = 44100
): Promise<AudioBuffer> {
  const duration = 2.4;
  const offlineCtx = new OfflineAudioContext(2, Math.ceil(sampleRate * duration), sampleRate);

  // Character-specific frequency profiles
  const profiles: Record<
    'Aoede' | 'Kore' | 'Zephyr' | 'Puck',
    {
      baseScale: number;
      type: OscillatorType;
      vibrato: boolean;
      attack: number;
      decay: number;
      gainLevel: number;
    }
  > = {
    Aoede: {
      // High cute anime girl tone
      baseScale: 1.35,
      type: 'triangle',
      vibrato: true,
      attack: 0.02,
      decay: 0.35,
      gainLevel: 0.32,
    },
    Kore: {
      // Warm clear melodious tone
      baseScale: 0.95,
      type: 'sine',
      vibrato: false,
      attack: 0.05,
      decay: 0.45,
      gainLevel: 0.38,
    },
    Zephyr: {
      // Cozy café soft mellow tone
      baseScale: 0.78,
      type: 'sine',
      vibrato: false,
      attack: 0.08,
      decay: 0.55,
      gainLevel: 0.35,
    },
    Puck: {
      // Bouncy playful chibi kid tone
      baseScale: 1.55,
      type: 'triangle',
      vibrato: true,
      attack: 0.015,
      decay: 0.22,
      gainLevel: 0.28,
    },
  };

  const prof = profiles[voiceName] || profiles.Aoede;

  // Melody representing Thai phrase cadence: "ออ" - "เดอร์" - "เข้า" - "แย้ว~"
  const rawMelody = [
    { note: 659.25, start: 0.0, dur: 0.24 }, // ออ
    { note: 783.99, start: 0.25, dur: 0.28 }, // เดอร์
    { note: 987.77, start: 0.55, dur: 0.35 }, // เข้า
    { note: 1174.66, start: 0.92, dur: 0.65 }, // แย้ว~~
    { note: 1318.51, start: 1.35, dur: 0.4 }, // (sparkle)
  ];

  rawMelody.forEach((item) => {
    const freq = item.note * prof.baseScale;
    const osc = offlineCtx.createOscillator();
    const gain = offlineCtx.createGain();

    osc.type = prof.type;
    osc.frequency.setValueAtTime(freq, item.start);

    // Cute pitch inflection at start of syllable
    osc.frequency.exponentialRampToValueAtTime(freq * 1.06, item.start + 0.06);
    osc.frequency.exponentialRampToValueAtTime(freq, item.start + item.dur);

    gain.gain.setValueAtTime(0, item.start);
    gain.gain.linearRampToValueAtTime(prof.gainLevel, item.start + prof.attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, item.start + item.dur);

    osc.connect(gain);
    gain.connect(offlineCtx.destination);

    // Warm harmonic layer
    const harmonicOsc = offlineCtx.createOscillator();
    const harmonicGain = offlineCtx.createGain();
    harmonicOsc.type = 'sine';
    harmonicOsc.frequency.setValueAtTime(freq * 2, item.start);
    harmonicGain.gain.setValueAtTime(0, item.start);
    harmonicGain.gain.linearRampToValueAtTime(prof.gainLevel * 0.35, item.start + prof.attack);
    harmonicGain.gain.exponentialRampToValueAtTime(0.0001, item.start + item.dur);

    harmonicOsc.connect(harmonicGain);
    harmonicGain.connect(offlineCtx.destination);

    osc.start(item.start);
    osc.stop(item.start + item.dur + 0.05);
    harmonicOsc.start(item.start);
    harmonicOsc.stop(item.start + item.dur + 0.05);
  });

  return await offlineCtx.startRendering();
}
