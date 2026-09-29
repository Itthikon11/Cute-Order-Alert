import { VoiceCharacter } from '../types';

export const VOICE_CHARACTERS: VoiceCharacter[] = [
  {
    id: 'Aoede',
    title: 'น้องไอโกะ (Aoede)',
    tag: 'คิ้วท์ใส อนิเมะ ✨',
    avatar: '👧🏻',
    desc: 'เสียงสาวน้อยน่ารักแบ๊วๆ น้ำเสียงหวานสดใส มีพลัง สไตล์การ์ตูนญี่ปุ่น คาวาอี้ ชัดเจน',
    defaultPitch: 1.20,
    defaultSpeed: 1.05,
    stylePrompt:
      'High-pitched, very cute, bubbly Japanese anime girl voice speaking enthusiastically in Thai: ',
    samplePhrase: 'ออเดอร์เข้าแย้ววว~ คาวาอี้!',
  },
  {
    id: 'Kore',
    title: 'พี่น้ำหวาน (Kore)',
    tag: 'หวานนุ่ม สุภาพ 🌸',
    avatar: '👩🏻',
    desc: 'เสียงใส ชัดเจน น่าฟัง สุภาพ เป็นมิตรกับลูกค้า โทนเสียงไพเราะ ผู้ดี นุ่มละมุน',
    defaultPitch: 1.05,
    defaultSpeed: 1.0,
    stylePrompt:
      'Sweet, elegant, polite, clear, friendly Thai female cashier voice, warm and melodious: ',
    samplePhrase: 'ออเดอร์เข้าแล้วค่ะ ขอให้ขายดีนะคะ',
  },
  {
    id: 'Zephyr',
    title: 'น้องมิ้นท์ (Zephyr)',
    tag: 'คาเฟ่ อบอุ่น ☕',
    avatar: '👱🏻‍♀️',
    desc: 'เสียงโทนอบอุ่น ละมุน ชวนฟัง สไตล์สาวบาริสต้า นุ่มนวลฟังสบาย ไม่หนวกหู',
    defaultPitch: 0.98,
    defaultSpeed: 0.96,
    stylePrompt:
      'Soft, cozy, gentle, relaxing whispering female barista voice speaking naturally in Thai: ',
    samplePhrase: 'มีออเดอร์ใหม่เข้าแล้วนะคะ',
  },
  {
    id: 'Puck',
    title: 'น้องเนเน่ (Puck)',
    tag: 'ขี้เล่น ซุกซน 🎀',
    avatar: '👧🏼',
    desc: 'เสียงเด็กสาวร่าเริง แฝงความขี้อ้อน ปุ๊กปิ๊ก ซุกซน เอนเนอร์จี้ล้นๆ รวดเร็ว',
    defaultPitch: 1.30,
    defaultSpeed: 1.10,
    stylePrompt:
      'Very energetic, cheeky, bouncy, playful chibi kid female voice with high intonation in Thai: ',
    samplePhrase: 'เย้! ออเดอร์เข้าแย้ว รีบเปิดเร็วเข้า!',
  },
];
