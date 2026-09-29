import React, { useState } from 'react';
import {
  Smartphone,
  Apple,
  HelpCircle,
  X,
  CheckCircle2,
  Store,
  FolderOpen,
  Volume2,
  Share2,
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'merchant'>(
    'android'
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-pink-100"
        role="dialog"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-['Mitr']">
                วิธีนำไฟล์เสียงไปใช้เป็นเสียงแจ้งเตือน
              </h2>
              <p className="text-xs text-pink-100">
                รองรับทั้ง Android, iPhone และแอปจัดการออเดอร์ร้านค้า
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-2 gap-2 text-sm">
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium transition-all ${
              activeTab === 'android'
                ? 'bg-white text-emerald-600 shadow-xs border border-emerald-100 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>มือถือ Android</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium transition-all ${
              activeTab === 'ios'
                ? 'bg-white text-rose-600 shadow-xs border border-rose-100 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Apple className="w-4 h-4 text-slate-800" />
            <span>iPhone (iOS)</span>
          </button>
          <button
            onClick={() => setActiveTab('merchant')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium transition-all ${
              activeTab === 'merchant'
                ? 'bg-white text-amber-600 shadow-xs border border-amber-100 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Store className="w-4 h-4 text-amber-500" />
            <span>แอปร้านค้า (LINE MAN / Grab)</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Android สามารถใช้ไฟล์ <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">.WAV</code> หรือ <code className="font-mono bg-emerald-100 px-1 py-0.5 rounded">.MP3</code> เป็นเสียงแจ้งเตือนได้ทันที เพียงย้ายไฟล์เข้าโฟลเดอร์ระบบ
                </p>
              </div>

              <ol className="space-y-3 relative border-l-2 border-emerald-200 ml-4 pl-4">
                <li className="relative">
                  <span className="absolute -left-[25px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <div className="font-medium text-slate-900">
                    ดาวน์โหลดไฟล์เสียงจากเว็บนี้
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    กดปุ่ม <b>"ดาวน์โหลดไฟล์ (.WAV)"</b> ไฟล์จะถูกบันทึกลงในโฟลเดอร์ Downloads ของมือถือ
                  </p>
                </li>

                <li className="relative">
                  <span className="absolute -left-[25px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center">
                    2
                  </span>
                  <div className="font-medium text-slate-900">
                    เปิดแอปจัดการไฟล์ (Files / My Files)
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <FolderOpen className="w-3.5 h-3.5 text-amber-500 inline" />
                    ย้ายไฟล์เสียงจาก <code className="bg-slate-100 px-1 rounded">Download</code> ไปยังโฟลเดอร์ <code className="bg-emerald-100 text-emerald-800 font-semibold px-1 rounded">Notifications</code> ในหน่วยความจำเครื่อง
                  </p>
                </li>

                <li className="relative">
                  <span className="absolute -left-[25px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center">
                    3
                  </span>
                  <div className="font-medium text-slate-900">
                    ไปที่การตั้งค่าเสียงของมือถือ
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    เข้าสู่ <b>Settings (การตั้งค่า) &gt; Sounds &amp; Vibration (เสียงและการสั่น) &gt; Notification Sound (เสียงแจ้งเตือน)</b> แล้วเลือกชื่อไฟล์เสียงออเดอร์เข้าแย้ว
                  </p>
                </li>
              </ol>
            </div>
          )}

          {activeTab === 'ios' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
                <Apple className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-900 leading-relaxed">
                  สำหรับ iPhone ระบบ iOS จำกัดการเปลี่ยนเสียงแจ้งเตือนทั่วไป แต่สามารถทำเป็นเสียงเรียกเข้า (Ringtone) หรือใช้ร่วมกับแอป GarageBand ได้สะดวกมาก
                </p>
              </div>

              <div className="space-y-3">
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center">
                      A
                    </span>
                    วิธีที่ 1: ติดตั้งผ่าน GarageBand (ฟรี ไม่ต้องใช้คอม)
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-1.5 ml-2 mt-2 list-disc list-inside">
                    <li>ดาวน์โหลดไฟล์เสียงจากเว็บนี้ลงแอป Files บน iPhone</li>
                    <li>เปิดแอป <b>GarageBand</b> เลือกแถบเครื่องดนตรี &gt; Audio Recorder</li>
                    <li>แตะไอคอน Tracks (แถบเสียง) แล้วแตะไอคอน Loops มุมขวาบน</li>
                    <li>เลือกแท็บ <b>Files (ไฟล์)</b> แล้วเลือกไฟล์เสียงที่ดาวน์โหลดมา ลากวางลงในไทม์ไลน์</li>
                    <li>แตะมุมซ้ายบนเพื่อบันทึก &gt; แตะค้างที่โปรเจกต์ &gt; กด <b>Share (แชร์) &gt; Ringtone (เสียงเรียกเข้า)</b></li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  <h4 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
                      B
                    </span>
                    วิธีที่ 2: ใช้แอป Ringtone Maker จาก App Store
                  </h4>
                  <p className="text-xs text-slate-600">
                    เปิดแอป Ringtone Maker โหลดไฟล์เสียงที่ดาวน์โหลดไว้ แล้วกดส่งออกไปยัง GarageBand เพียง 1 นาที เสียงจะเข้าไปอยู่ในระบบทันที
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'merchant' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <Store className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed">
                  ตั้งค่าในแอปร้านค้าเดลิเวอรียอดนิยม เพื่อให้เตือนชัดเจน ไม่พลาดทุกคำสั่งซื้อ
                </p>
              </div>

              <div className="space-y-3">
                <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-4">
                  <h4 className="font-semibold text-emerald-900 flex items-center justify-between">
                    <span>🟢 LINE MAN Wongnai Merchant App (WMA)</span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Android</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    เข้าสู่ <b>การตั้งค่าเครื่อง &gt; การแจ้งเตือน &gt; แอป Wongnai Merchant &gt; ประเภทการแจ้งเตือน "คำสั่งซื้อใหม่" &gt; เลือกเสียงแจ้งเตือนแบบกำหนดเอง</b> (เลือกไฟล์ ออเดอร์เข้าแย้ว.wav)
                  </p>
                </div>

                <div className="border border-green-100 bg-green-50/30 rounded-2xl p-4">
                  <h4 className="font-semibold text-green-900 flex items-center justify-between">
                    <span>🟢 Grab Merchant</span>
                    <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">ร้านค้า Grab</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    ในแอป Grab Merchant ไปที่ <b>บัญชี &gt; การแจ้งเตือน &gt; เสียงแจ้งเตือนคำสั่งซื้อ</b> และในการตั้งค่าการแจ้งเตือนของระบบ Android ให้ตั้งเสียงแจ้งเตือนของแอปให้เป็นไฟล์เสียงนี้
                  </p>
                </div>

                <div className="border border-orange-100 bg-orange-50/30 rounded-2xl p-4">
                  <h4 className="font-semibold text-orange-900 flex items-center justify-between">
                    <span>🟠 Shopee Partner / Food Merchant</span>
                    <span className="text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Shopee</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    ไปที่ <b>การตั้งค่าแอป Shopee Partner &gt; การแจ้งเตือนคำสั่งซื้อ &gt; เปิดระดับเสียงสูงสุด</b> หรือตั้งค่าเสียง App Notification ในระบบ Android ให้เรียกใช้ไฟล์นี้
                  </p>
                </div>

                <div className="border border-pink-100 bg-pink-50/30 rounded-2xl p-4">
                  <h4 className="font-semibold text-pink-900 flex items-center justify-between">
                    <span>💡 เคล็ดลับสำหรับแท็บเล็ตหน้าร้าน POS</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    สามารถเปิดหน้าเว็บนี้ค้างไว้บนแท็บเล็ต/คอมพิวเตอร์ แล้วเปิด <b>"โหมดเฝ้าออเดอร์ (Alarm Mode)"</b> เพื่อใช้เป็นกระดิ่งแจ้งเตือนสำรองเสียงดังฟังชัดได้ตลอดเวลา!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Cute Order Alert Studio • ไฟล์ .WAV คมชัด 16-Bit ไร้การบีบอัด
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-medium text-xs shadow-xs transition-colors"
          >
            เข้าใจแล้ว ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
