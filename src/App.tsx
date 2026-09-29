/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Sparkles,
  Download,
  Play,
  Square,
  HelpCircle,
  Smartphone,
  Store,
  CheckCircle2,
  Volume2,
  Heart,
  Share2,
  Layers,
  Flame,
  Music,
} from 'lucide-react';
import { SOUND_PRESETS } from './data/presets';
import { SoundPreset, VoiceGenerationOptions } from './types';
import {
  synthesizeChimeBuffer,
  mixAudioBuffers,
  audioBufferToWav,
  base64ToArrayBuffer,
  generateFallbackSpeechBuffer,
} from './utils/audioSynthesizer';
import { Navbar } from './components/Navbar';
import { PresetCard } from './components/PresetCard';
import { VoiceStudio } from './components/VoiceStudio';
import { NotificationSimulator } from './components/NotificationSimulator';
import { InstallGuideModal } from './components/InstallGuideModal';
import { VoiceCharacter } from './types';
import { VOICE_CHARACTERS } from './data/characters';
import { PREBUILT_SPEECH_AUDIO } from './data/cachedAudioData';

export default function App() {
  // Audio state & Caches to strictly honor Gemini Free Tier limit (3 RPM)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentSourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const presetCacheRef = useRef<Map<string, AudioBuffer>>(new Map());
  const studioCacheRef = useRef<Map<string, AudioBuffer>>(new Map());

  const [currentBuffer, setCurrentBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playingPresetId, setPlayingPresetId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('classic-cute');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentSource, setCurrentSource] = useState<'ai' | 'preset' | 'mixed'>('preset');

  // Studio Options - Initialized with Aoede's cute anime character
  const [studioOptions, setStudioOptions] = useState<VoiceGenerationOptions>({
    text: 'ออเดอร์เข้าแย้ว!',
    voiceName: 'Aoede',
    style:
      'High-pitched, very cute, bubbly Japanese anime girl voice speaking enthusiastically in Thai: ออเดอร์เข้าแย้ว!',
    chimeType: 'bell',
    pitch: 1.20,
    speed: 1.05,
    reverb: true,
    chimeVolume: 0.9,
    voiceVolume: 1.0,
    introDelay: 0.35,
  });

  const simulatorSectionRef = useRef<HTMLDivElement | null>(null);

  // Initialize or get AudioContext
  const getAudioContext = (): AudioContext => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Stop any currently playing audio
  const stopAudio = () => {
    if (currentSourceNodeRef.current) {
      try {
        currentSourceNodeRef.current.stop();
      } catch (e) {
        // ignore
      }
      currentSourceNodeRef.current = null;
    }
    setIsPlaying(false);
    setPlayingPresetId(null);
  };

  // Play an AudioBuffer
  const playBuffer = async (buffer: AudioBuffer, onEndedCallback?: () => void) => {
    stopAudio();
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch (e) {
        // ignore
      }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    source.onended = () => {
      setIsPlaying(false);
      setPlayingPresetId(null);
      if (onEndedCallback) onEndedCallback();
    };

    currentSourceNodeRef.current = source;
    source.start(0);
    setIsPlaying(true);
  };

  // Build audio buffer for a specific preset with persistent caching
  const buildBufferForPreset = async (preset: SoundPreset): Promise<AudioBuffer> => {
    if (presetCacheRef.current.has(preset.id)) {
      return presetCacheRef.current.get(preset.id)!;
    }

    const ctx = getAudioContext();
    const chimeBuf = await synthesizeChimeBuffer(preset.chimeType, ctx.sampleRate);

    // Call server AI voice endpoint with preset config
    try {
      const res = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: preset.text,
          voiceName: preset.voiceName,
          style: preset.voiceStyle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const arrayBuf = base64ToArrayBuffer(data.audio);
          const speechBuf = await ctx.decodeAudioData(arrayBuf);
          const mixed = await mixAudioBuffers(chimeBuf, speechBuf, {
            pitch: preset.pitch,
            speed: preset.speed,
            introDelay: preset.introDelay,
          });
          presetCacheRef.current.set(preset.id, mixed);
          return mixed;
        }
      }
    } catch (err) {
      console.warn('Network issue, using prebuilt speech fallback:', err);
    }

    // High quality offline fallback with real voice
    const prebuiltKey = `${preset.voiceName}_default`;
    const prebuiltAudio = PREBUILT_SPEECH_AUDIO[prebuiltKey] || PREBUILT_SPEECH_AUDIO['Aoede_default'];
    if (prebuiltAudio) {
      const arrayBuf = base64ToArrayBuffer(prebuiltAudio);
      const speechBuf = await ctx.decodeAudioData(arrayBuf);
      const mixedFallback = await mixAudioBuffers(chimeBuf, speechBuf, {
        pitch: preset.pitch,
        speed: preset.speed,
        introDelay: preset.introDelay,
      });
      presetCacheRef.current.set(preset.id, mixedFallback);
      return mixedFallback;
    }

    const fallbackSpeech = await generateFallbackSpeechBuffer(preset.text, preset.voiceName, ctx.sampleRate);
    const mixedFallback = await mixAudioBuffers(chimeBuf, fallbackSpeech, {
      pitch: preset.pitch,
      speed: preset.speed,
      introDelay: preset.introDelay,
    });
    presetCacheRef.current.set(preset.id, mixedFallback);
    return mixedFallback;
  };

  // Build audio buffer from explicit options
  const buildStudioBufferWithOpts = async (opts: VoiceGenerationOptions): Promise<AudioBuffer> => {
    const cacheKey = `${opts.text.trim()}_${opts.voiceName}_${opts.chimeType}_${opts.pitch.toFixed(2)}_${opts.speed.toFixed(2)}_${opts.style}`;
    if (studioCacheRef.current.has(cacheKey)) {
      return studioCacheRef.current.get(cacheKey)!;
    }

    const ctx = getAudioContext();
    const chimeBuf = await synthesizeChimeBuffer(opts.chimeType, ctx.sampleRate);

    try {
      const res = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: opts.text,
          voiceName: opts.voiceName,
          style: opts.style,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const arrayBuf = base64ToArrayBuffer(data.audio);
          const speechBuf = await ctx.decodeAudioData(arrayBuf);
          const mixed = await mixAudioBuffers(chimeBuf, speechBuf, {
            pitch: opts.pitch,
            speed: opts.speed,
            chimeVolume: opts.chimeVolume,
            voiceVolume: opts.voiceVolume,
            introDelay: opts.introDelay,
          });
          studioCacheRef.current.set(cacheKey, mixed);
          return mixed;
        }
      }
    } catch (e) {
      console.warn('Using local prebuilt speech fallback:', e);
    }

    // High quality offline fallback with real voice
    const prebuiltKey = `${opts.voiceName}_default`;
    const prebuiltAudio = PREBUILT_SPEECH_AUDIO[prebuiltKey] || PREBUILT_SPEECH_AUDIO['Aoede_default'];
    if (prebuiltAudio) {
      const arrayBuf = base64ToArrayBuffer(prebuiltAudio);
      const speechBuf = await ctx.decodeAudioData(arrayBuf);
      const mixed = await mixAudioBuffers(chimeBuf, speechBuf, {
        pitch: opts.pitch,
        speed: opts.speed,
        chimeVolume: opts.chimeVolume,
        voiceVolume: opts.voiceVolume,
        introDelay: opts.introDelay,
      });
      studioCacheRef.current.set(cacheKey, mixed);
      return mixed;
    }

    const fallbackSpeech = await generateFallbackSpeechBuffer(opts.text, opts.voiceName, ctx.sampleRate);
    const mixed = await mixAudioBuffers(chimeBuf, fallbackSpeech, {
      pitch: opts.pitch,
      speed: opts.speed,
      chimeVolume: opts.chimeVolume,
      voiceVolume: opts.voiceVolume,
      introDelay: opts.introDelay,
    });
    studioCacheRef.current.set(cacheKey, mixed);
    return mixed;
  };

  // Build audio buffer from current Studio options
  const buildCurrentStudioBuffer = async (): Promise<AudioBuffer> => {
    return await buildStudioBufferWithOpts(studioOptions);
  };

  // Handle changing character directly
  const handleSelectCharacter = async (char: VoiceCharacter) => {
    stopAudio();
    const newStyle = `${char.stylePrompt}${studioOptions.text}`;
    const newOpts: VoiceGenerationOptions = {
      ...studioOptions,
      voiceName: char.id,
      pitch: char.defaultPitch,
      speed: char.defaultSpeed,
      style: newStyle,
    };
    setStudioOptions(newOpts);
    setCurrentBuffer(null);
    showToast(`✨ สลับเป็นเสียง ${char.title} (${char.tag})`);

    // Build and play the character's voice immediately
    setIsGenerating(true);
    try {
      const buf = await buildStudioBufferWithOpts(newOpts);
      setCurrentBuffer(buf);
      setCurrentSource('ai');
      playBuffer(buf);
    } catch (e) {
      // fallback
      const ctx = getAudioContext();
      const chimeBuf = await synthesizeChimeBuffer(newOpts.chimeType, ctx.sampleRate);
      const fallbackSpeech = await generateFallbackSpeechBuffer(newOpts.text, newOpts.voiceName, ctx.sampleRate);
      const mixed = await mixAudioBuffers(chimeBuf, fallbackSpeech, {
        pitch: newOpts.pitch,
        speed: newOpts.speed,
        chimeVolume: newOpts.chimeVolume,
        voiceVolume: newOpts.voiceVolume,
        introDelay: newOpts.introDelay,
      });
      setCurrentBuffer(mixed);
      setCurrentSource('mixed');
      playBuffer(mixed);
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate voice with AI
  const handleGenerateAI = async () => {
    setIsGenerating(true);
    stopAudio();

    try {
      const newBuf = await buildCurrentStudioBuffer();
      setCurrentBuffer(newBuf);
      setCurrentSource('ai');
      showToast('🎉 สร้างเสียงพูด AI สำเร็จแล้ว! กำลังเล่นเสียงตัวอย่าง...');
      playBuffer(newBuf);
    } catch (error: any) {
      showToast('ใช้เสียงสังเคราะห์น่ารักประจำตัวละคร');
      const ctx = getAudioContext();
      const chimeBuf = await synthesizeChimeBuffer(studioOptions.chimeType, ctx.sampleRate);
      const fallbackSpeech = await generateFallbackSpeechBuffer(studioOptions.text, studioOptions.voiceName, ctx.sampleRate);
      const mixed = await mixAudioBuffers(chimeBuf, fallbackSpeech, {
        pitch: studioOptions.pitch,
        chimeVolume: studioOptions.chimeVolume,
        voiceVolume: studioOptions.voiceVolume,
        introDelay: studioOptions.introDelay,
      });
      setCurrentBuffer(mixed);
      setCurrentSource('mixed');
      playBuffer(mixed);
    } finally {
      setIsGenerating(false);
    }
  };

  // Play currently selected studio sound
  const handlePlayStudio = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }

    if (currentBuffer) {
      playBuffer(currentBuffer);
      return;
    }

    // If no buffer loaded yet, build it
    setIsGenerating(true);
    try {
      const buf = await buildCurrentStudioBuffer();
      setCurrentBuffer(buf);
      setCurrentSource('ai');
      playBuffer(buf);
    } catch (e) {
      const ctx = getAudioContext();
      const chimeBuf = await synthesizeChimeBuffer(studioOptions.chimeType, ctx.sampleRate);
      const fallback = await generateFallbackSpeechBuffer(studioOptions.text, studioOptions.voiceName, ctx.sampleRate);
      const mixed = await mixAudioBuffers(chimeBuf, fallback, {
        pitch: studioOptions.pitch,
        introDelay: studioOptions.introDelay,
      });
      setCurrentBuffer(mixed);
      setCurrentSource('mixed');
      playBuffer(mixed);
    } finally {
      setIsGenerating(false);
    }
  };

  // Play a preset card
  const handlePlayPreset = async (preset: SoundPreset) => {
    stopAudio();
    setPlayingPresetId(preset.id);

    try {
      const buf = await buildBufferForPreset(preset);
      setCurrentBuffer(buf);
      setSelectedPresetId(preset.id);
      setCurrentSource('preset');
      playBuffer(buf);
    } catch (e) {
      console.error(e);
      setPlayingPresetId(null);
    }
  };

  // Load preset into Studio
  const handleSelectPreset = (preset: SoundPreset) => {
    setSelectedPresetId(preset.id);
    setStudioOptions({
      text: preset.text,
      voiceName: preset.voiceName,
      style: preset.voiceStyle,
      chimeType: preset.chimeType,
      pitch: preset.pitch,
      speed: preset.speed,
      reverb: preset.reverb,
      chimeVolume: 0.9,
      voiceVolume: 1.0,
      introDelay: preset.introDelay,
    });
    showToast(`โหลดสไตล์ "${preset.title}" เข้าสตูดิโอแล้ว`);
    // Scroll smoothly to studio
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Download AudioBuffer as WAV
  const downloadBufferAsWav = (buffer: AudioBuffer, filename = 'ออเดอร์เข้าแย้ว.wav') => {
    const blob = audioBufferToWav(buffer);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`📥 ดาวน์โหลด "${filename}" สำเร็จ!`);
  };

  // Download current studio audio
  const handleDownloadCurrentWav = async () => {
    if (currentBuffer) {
      downloadBufferAsWav(currentBuffer, `เสียงแจ้งเตือน_${studioOptions.text.replace(/[^a-zA-Z0-9ก-๙]/g, '_')}.wav`);
    } else {
      setIsGenerating(true);
      try {
        const buf = await buildCurrentStudioBuffer();
        setCurrentBuffer(buf);
        downloadBufferAsWav(buf, `เสียงแจ้งเตือน_${studioOptions.text.replace(/[^a-zA-Z0-9ก-๙]/g, '_')}.wav`);
      } catch (err: any) {
        showToast(`⚠️ เกิดข้อผิดพลาด: ${err.message}`);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  // Download a preset directly
  const handleDownloadPreset = async (preset: SoundPreset) => {
    showToast(`กำลังเตรียมไฟล์ "${preset.title}"...`);
    try {
      const buf = await buildBufferForPreset(preset);
      downloadBufferAsWav(buf, `เสียงแจ้งเตือน_${preset.title}.wav`);
    } catch (e) {
      showToast('⚠️ ไม่สามารถดาวน์โหลดได้ในขณะนี้');
    }
  };

  // Initialize with the first preset preloaded on mount
  useEffect(() => {
    const initDefaultSound = async () => {
      try {
        const defaultPreset = SOUND_PRESETS[0];
        const ctx = getAudioContext();
        const chime = await synthesizeChimeBuffer(defaultPreset.chimeType, ctx.sampleRate);
        const base64Audio = PREBUILT_SPEECH_AUDIO['Aoede_default'];
        if (base64Audio) {
          const arrayBuf = base64ToArrayBuffer(base64Audio);
          const speechBuf = await ctx.decodeAudioData(arrayBuf);
          const mixed = await mixAudioBuffers(chime, speechBuf, {
            pitch: defaultPreset.pitch,
            introDelay: defaultPreset.introDelay,
          });
          setCurrentBuffer(mixed);
          presetCacheRef.current.set(defaultPreset.id, mixed);
        }
      } catch (e) {
        // ignore
      }
    };
    initDefaultSound();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-['Prompt',sans-serif]">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 text-white px-5 py-3 rounded-2xl shadow-2xl border border-pink-500/30 flex items-center gap-3 text-xs sm:text-sm animate-in slide-in-from-bottom duration-300">
          <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenGuide={() => setIsGuideOpen(true)}
        onScrollToSimulator={() =>
          simulatorSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-2">
          <div className="inline-flex items-center gap-2 bg-pink-100/80 border border-pink-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-pink-700 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>เสียงแจ้งเตือนออเดอร์เข้าแย้ว เสียงผู้หญิงน่ารักๆ คุณภาพสูง 16-Bit WAV</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-['Mitr'] tracking-tight leading-tight">
            สร้างเสียงเตือน{' '}
            <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 bg-clip-text text-transparent">
              "ออเดอร์เข้าแย้ว!"
            </span>{' '}
            <br className="hidden sm:block" />
            เสียงผู้หญิงน่ารัก คาวาอี้ สำหรับร้านค้า
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            ออกแบบเสียงกริ่งและเสียงพูดให้เหมาะกับร้านของคุณ ทั้งคาเฟ่ เบเกอรี่ ร้านอาหาร และเดลิเวอรี
            ดาวน์โหลดเป็นไฟล์ <code className="bg-pink-100 text-pink-800 font-mono px-1.5 py-0.5 rounded text-xs">.WAV</code> ไปตั้งเป็นเสียงแจ้งเตือนบน Android, iPhone, Shopee, Grab หรือ LINE MAN ได้ทันที!
          </p>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2 text-xs">
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              มิกซ์เสียงกริ่ง + เสียงพูดในไฟล์เดียว
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ขับเคลื่อนด้วย Gemini AI TTS
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ดาวน์โหลดฟรี ไม่ติดลิขสิทธิ์
            </span>
          </div>
        </section>

        {/* Preset Cards Library Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900 font-['Mitr']">
                  คอลเลกชันเสียงยอดนิยม (พร้อมฟังและดาวน์โหลดทันที)
                </h2>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">
                  6 สไตล์
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                คลิก <b>"ฟังเสียง"</b> เพื่อฟังตัวอย่าง หรือกด <b>"ปรับแต่ง"</b> เพื่อนำไปดัดแปลงต่อในสตูดิโอ
              </p>
            </div>
            <button
              onClick={() => setIsGuideOpen(true)}
              className="text-xs font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1 hover:underline self-start sm:self-auto"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>ดูวิธีติดตั้งไฟล์เสียงลงมือถือ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {SOUND_PRESETS.map((preset) => (
              <PresetCard
                key={preset.id}
                preset={preset}
                isPlaying={isPlaying && playingPresetId === preset.id}
                onPlay={handlePlayPreset}
                onStop={stopAudio}
                onSelect={handleSelectPreset}
                onDownload={handleDownloadPreset}
                isSelected={selectedPresetId === preset.id}
              />
            ))}
          </div>
        </section>

        {/* Voice Studio Customizer Section */}
        <section id="studio-section" className="space-y-4">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Mitr']">
                สตูดิโอปรับแต่งเสียงตามใจคุณ (Custom Studio)
              </h2>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                ปรับแต่งละเอียด
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              พิมพ์ข้อความที่ต้องการ เลือกระดับความน่ารัก เสียงกริ่งนำหน้า แล้วกดปุ่มสร้างเสียง AI
            </p>
          </div>

          <VoiceStudio
            options={studioOptions}
            onChangeOptions={(newOpts) => {
              setStudioOptions((prev) => ({ ...prev, ...newOpts }));
              setCurrentBuffer(null);
            }}
            onSelectCharacter={handleSelectCharacter}
            onGenerateAI={handleGenerateAI}
            isGenerating={isGenerating}
            onPlay={handlePlayStudio}
            onStop={stopAudio}
            isPlaying={isPlaying && !playingPresetId}
            onDownloadWav={handleDownloadCurrentWav}
            hasAudio={Boolean(currentBuffer)}
            currentSource={currentSource}
          />
        </section>

        {/* Live Notification Simulator Section */}
        <section ref={simulatorSectionRef} className="space-y-4 pt-4">
          <div className="border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 font-['Mitr']">
                ห้องจำลองการแจ้งเตือนจริง (Order Alert Simulator)
              </h2>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                ทดสอบจริง
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ทดสอบรับคำสั่งซื้อจำลองจาก LINE MAN, Grab, Shopee Food พร้อมระบบเตือนซ้ำสำหรับแท็บเล็ตในครัว
            </p>
          </div>

          <NotificationSimulator
            isPlaying={isPlaying}
            onTriggerSound={() => {
              if (currentBuffer) {
                playBuffer(currentBuffer);
              } else {
                handlePlayStudio();
              }
            }}
            soundTitle={studioOptions.text}
          />
        </section>

        {/* FAQ & Setup Tips */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              💡
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Mitr']">
                คำถามที่พบบ่อยเกี่ยวกับการนำเสียงไปใช้
              </h3>
              <p className="text-xs text-slate-500">
                เคล็ดลับการตั้งค่าเสียงให้ได้ยินชัดเจน ไม่หลับ และไม่พลาดออเดอร์
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                ไฟล์ .WAV กับ .MP3 ต่างกันอย่างไร?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                ไฟล์ .WAV เป็นเสียงแบบไม่บีบอัด (Uncompressed PCM) มีความคมชัดสูงสุด เสียงกริ่งจะใสสะอาดและเสียงพูดจะไม่อู้อี้ เหมาะสำหรับการนำไปเป็นเสียงแจ้งเตือนระบบของมือถือและแอป POS มากที่สุด
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                เสียงดังไม่พอในครัว ทำอย่างไรดี?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                แนะนำให้เลือกสไตล์ที่มีเสียง <b>"กริ่งแก้ว"</b> หรือ <b>"เงินเข้า Ka-ching"</b> นำหน้า เพราะเสียงความถี่สูงจะทะลุเสียงทอดอาหารหรือเสียงเครื่องดูดควันในครัวได้ดีเยี่ยม และสามารถเชื่อมต่อมือถือเข้าลำโพงบลูทูธประจำเคาน์เตอร์ได้
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                เปิดหน้าเว็บนี้ค้างไว้เป็นกริ่งหน้าร้านได้ไหม?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                ได้แน่นอน! คุณสามารถเปิดหน้านี้บนแท็บเล็ตหน้าร้าน แล้วเปิด <b>"โหมดเฝ้าออเดอร์ (Alarm Mode)"</b> ในส่วนของ Simulator เพื่อใช้กดทดสอบ หรือใช้ร่วมกับเครื่องพิมพ์ใบเสร็จ/แจ้งเตือนได้ตลอดทั้งวัน
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <h4 className="font-semibold text-slate-900 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                นำไปใช้ในแอป LINE Official Account (LINE OA) ได้ไหม?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                ได้ครับ ในมือถือ Android สามารถกำหนดเสียงแจ้งเตือนเฉพาะห้องแชต LINE OA หรือเสียงแอป LINE ให้เป็นไฟล์เสียงออเดอร์เข้าแย้วนี้ได้เลย ทำให้เวลามีลูกค้าทักสั่งของ จะส่งเสียงน่ารักทันที
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 font-medium text-slate-700">
          <Bell className="w-4 h-4 text-pink-500" />
          <span>Cute Order Alert Studio • เสียงแจ้งเตือนออเดอร์เข้าแย้ว</span>
        </div>
        <p className="text-slate-400">
          สร้างขึ้นเพื่อพ่อค้าแม่ค้าและร้านค้าทุกท่าน ขอให้เฮงๆ รวยๆ ออเดอร์ปังๆ ตลอดปีนะคะ 💖
        </p>
      </footer>

      {/* Installation Guide Modal */}
      <InstallGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
