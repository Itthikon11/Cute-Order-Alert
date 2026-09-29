import React, { useState, useEffect, useRef } from 'react';
import {
  Bell,
  CheckCircle2,
  Volume2,
  Vibrate,
  Smartphone,
  Repeat,
  Store,
  Clock,
  Sparkles,
  ShoppingBag,
  Flame,
  X,
  Play,
  Square,
} from 'lucide-react';
import { MockOrder } from '../types';

interface NotificationSimulatorProps {
  onTriggerSound: () => void;
  isPlaying: boolean;
  soundTitle?: string;
}

const SAMPLE_ORDERS: MockOrder[] = [
  {
    id: '1',
    app: 'lineman',
    appName: 'LINE MAN',
    orderNumber: '#LM-9942',
    customerName: 'คุณภัทรมน (089-xxx-4421)',
    items: ['ชานมไข่มุกไต้หวัน หวาน 50% x 2', 'ครัวซองต์เนยฝรั่งเศส x 1'],
    total: 215,
    timeAgo: 'เมื่อสักครู่',
  },
  {
    id: '2',
    app: 'grab',
    appName: 'GrabFood',
    orderNumber: '#GF-8831',
    customerName: 'คุณอรรถพล (081-xxx-9923)',
    items: ['กะเพราหมูกรอบไข่ดาวไม่สุก x 1', 'ต้มยำกุ้งน้ำข้น x 1'],
    total: 260,
    timeAgo: 'เมื่อสักครู่',
  },
  {
    id: '3',
    app: 'shopee',
    appName: 'ShopeeFood',
    orderNumber: '#SP-1049',
    customerName: 'คุณกัญญาณัฐ (095-xxx-1234)',
    items: ['ชาเขียวมัทฉะลาเต้ x 2', 'เค้กช็อกโกแลตฟัดจ์ x 1'],
    total: 195,
    timeAgo: 'เมื่อสักครู่',
  },
  {
    id: '4',
    app: 'tiktok',
    appName: 'TikTok Shop',
    orderNumber: '#TT-3301',
    customerName: 'คุณธนภัทร (086-xxx-7762)',
    items: ['ชุดเบเกอรี่เซ็ตโปรโมชั่น x 1', 'กาแฟสกัดเย็น Cold Brew x 1'],
    total: 350,
    timeAgo: 'เมื่อสักครู่',
  },
];

export const NotificationSimulator: React.FC<NotificationSimulatorProps> = ({
  onTriggerSound,
  isPlaying,
  soundTitle = 'ออเดอร์เข้าแย้ว!',
}) => {
  const [currentOrder, setCurrentOrder] = useState<MockOrder>(SAMPLE_ORDERS[0]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [isOrderAccepted, setIsOrderAccepted] = useState<boolean>(false);
  const [alarmMode, setAlarmMode] = useState<boolean>(false);
  const [alarmIntervalSeconds, setAlarmIntervalSeconds] = useState<number>(8);
  const alarmTimerRef = useRef<number | null>(null);

  // Trigger test alert
  const handleTriggerAlert = () => {
    // Pick random order
    const nextOrder = SAMPLE_ORDERS[Math.floor(Math.random() * SAMPLE_ORDERS.length)];
    setCurrentOrder(nextOrder);
    setShowPopup(true);
    setIsOrderAccepted(false);

    // Vibrate device if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([200, 100, 200, 100, 300]);
      } catch (e) {
        // ignore
      }
    }

    // Play alert sound
    onTriggerSound();
  };

  // Alarm loop mode effect
  useEffect(() => {
    if (alarmMode && !isOrderAccepted) {
      alarmTimerRef.current = window.setInterval(() => {
        handleTriggerAlert();
      }, alarmIntervalSeconds * 1000);
    } else {
      if (alarmTimerRef.current) {
        clearInterval(alarmTimerRef.current);
        alarmTimerRef.current = null;
      }
    }

    return () => {
      if (alarmTimerRef.current) {
        clearInterval(alarmTimerRef.current);
      }
    };
  }, [alarmMode, isOrderAccepted, alarmIntervalSeconds]);

  const handleAcceptOrder = () => {
    setIsOrderAccepted(true);
    setShowPopup(false);
  };

  const getAppStyle = (app: MockOrder['app']) => {
    switch (app) {
      case 'lineman':
        return {
          bg: 'bg-emerald-500',
          text: 'text-emerald-950',
          badge: 'bg-emerald-100 text-emerald-800',
          border: 'border-emerald-200',
        };
      case 'grab':
        return {
          bg: 'bg-green-600',
          text: 'text-green-950',
          badge: 'bg-green-100 text-green-800',
          border: 'border-green-200',
        };
      case 'shopee':
        return {
          bg: 'bg-orange-500',
          text: 'text-orange-950',
          badge: 'bg-orange-100 text-orange-800',
          border: 'border-orange-200',
        };
      case 'tiktok':
        return {
          bg: 'bg-slate-900',
          text: 'text-slate-950',
          badge: 'bg-slate-200 text-slate-800',
          border: 'border-slate-300',
        };
      default:
        return {
          bg: 'bg-pink-500',
          text: 'text-pink-950',
          badge: 'bg-pink-100 text-pink-800',
          border: 'border-pink-200',
        };
    }
  };

  const appStyle = getAppStyle(currentOrder.app);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      {/* Top Banner */}
      <div className="bg-slate-900 p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-400">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-['Mitr'] flex items-center gap-2">
              <span>จำลองการแจ้งเตือนหน้าร้าน</span>
              <span className="text-xs bg-pink-500 text-white px-2.5 py-0.5 rounded-full font-sans font-medium">
                Live Simulator
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ทดสอบว่าเสียง "ออเดอร์เข้าแย้ว" แจ้งเตือนดังชัดเจนและน่ารักแค่ไหนเมื่อมีออเดอร์เข้าจริง
            </p>
          </div>
        </div>

        {/* Alarm Loop Mode Toggle */}
        <div className="flex items-center gap-3 bg-slate-800/90 px-4 py-2.5 rounded-2xl border border-slate-700">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-amber-400" />
              โหมดเฝ้าออเดอร์ (Alarm Mode)
            </span>
            <span className="text-[10px] text-slate-400">
              เตือนซ้ำทุก {alarmIntervalSeconds} วิ จนกว่าจะกดรับ
            </span>
          </div>
          <button
            onClick={() => {
              setAlarmMode(!alarmMode);
              if (!alarmMode) {
                handleTriggerAlert();
              }
            }}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
              alarmMode ? 'bg-pink-500' : 'bg-slate-600'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform transform ${
                alarmMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Mock Phone Screen */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full max-w-sm rounded-[40px] p-3 bg-slate-900 shadow-2xl border-4 border-slate-800 relative">
            {/* Screen Inner */}
            <div className="w-full aspect-[9/16] max-h-[460px] bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 rounded-[32px] overflow-hidden p-4 flex flex-col justify-between relative text-white">
              {/* Dynamic Island / Notch */}
              <div className="w-28 h-6 bg-black rounded-full mx-auto flex items-center justify-between px-3 text-[10px] text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[9px]">POS Active</span>
              </div>

              {/* Status bar */}
              <div className="flex justify-between items-center text-[11px] text-slate-300 font-medium px-2 mt-1">
                <span>09:41</span>
                <div className="flex items-center gap-1.5">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Notification Banner (Animated when triggered) */}
              <div className="my-auto space-y-3">
                {showPopup ? (
                  <div className="animate-in slide-in-from-top duration-300 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-pink-200 text-slate-900">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-xl ${appStyle.bg} flex items-center justify-center text-white text-xs font-bold shadow-xs`}
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </span>
                        <div>
                          <div className="text-xs font-bold font-['Mitr'] flex items-center gap-1.5">
                            <span>{currentOrder.appName}</span>
                            <span className="text-[10px] text-pink-600 font-semibold bg-pink-100 px-1.5 py-0.2 rounded-full">
                              ออเดอร์ใหม่!
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {currentOrder.orderNumber} • {currentOrder.timeAgo}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-600">
                          ฿{currentOrder.total}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-slate-50 rounded-xl p-2.5 my-2 border border-slate-100 text-xs">
                      <div className="text-[11px] font-medium text-slate-500 mb-1">
                        ลูกค้า: {currentOrder.customerName}
                      </div>
                      <ul className="space-y-0.5 font-medium text-slate-800 text-[11px]">
                        {currentOrder.items.map((it, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Sound Alert Status */}
                    <div className="flex items-center gap-2 py-1 text-[11px] text-pink-600 font-medium">
                      <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                      <span>กำลังส่งเสียง: “{soundTitle}”</span>
                    </div>

                    {/* Accept Order Action */}
                    <button
                      onClick={handleAcceptOrder}
                      className="w-full mt-2 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>กดรับออเดอร์ (หยุดเสียงเตือน)</span>
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-10 px-4 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xs">
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-2">
                      <Bell className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="text-xs font-semibold text-slate-200">
                      ระบบพร้อมรับออเดอร์
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      กดปุ่ม <b>"ทดสอบส่งออเดอร์"</b> ด้านขวา เพื่อฟังเสียงเตือนจริง
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Home Bar */}
              <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mb-1" />
            </div>
          </div>
        </div>

        {/* Right: Controls & Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-pink-50/60 border border-pink-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 font-['Mitr'] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              ทดสอบเสียงกับสถานการณ์จริง
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              เมื่อมีออเดอร์เด้งเข้า ระบบจะเล่นเสียงกริ่งน่ารักพร้อมคำว่า <b>"ออเดอร์เข้าแย้ว"</b> เพื่อให้คนในร้านได้ยินชัดเจนแม้เปิดเครื่องทิ้งไว้ในครัวหรือเคาน์เตอร์
            </p>

            <button
              onClick={handleTriggerAlert}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm shadow-md shadow-pink-500/20 flex items-center justify-center gap-2 transition-all"
            >
              <Bell className="w-4 h-4" />
              <span>🔔 ทดสอบส่งออเดอร์ใหม่ (ยิงเสียงเตือน)</span>
            </button>
          </div>

          {/* Quick Tips */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-500" />
              ทำไมต้องใช้เสียง "ออเดอร์เข้าแย้ว" แบบน่ารัก?
            </div>
            <ul className="text-slate-600 space-y-1 pl-4 list-disc text-[11px] leading-relaxed">
              <li><b>ไม่น่ารำคาญ:</b> เสียงหวานใส ไม่ตกใจเหมือนเสียงกริ่งกระแทกทั่วไป</li>
              <li><b>จดจำง่าย:</b> ลูกค้าหน้าร้านหรือไรเดอร์ได้ยินแล้วอมยิ้ม เสริมภาพลักษณ์ร้านให้น่ารัก</li>
              <li><b>ไม่พลาดออเดอร์:</b> ช่วงชั่วโมงเร่งด่วน ได้ยินชัดว่ามีคำสั่งซื้อใหม่เข้ามา</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
