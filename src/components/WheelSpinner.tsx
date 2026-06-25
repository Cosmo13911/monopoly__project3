/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { WHEEL_RATE_DEFAULTS } from '../data';
import { Sparkles, Coins, Gift } from 'lucide-react';

interface WheelSpinnerProps {
  onSpinComplete: (amount: number, label: string) => void;
  isSuperBonus?: boolean; // Land on start = true, Pass start = false
}

export default function WheelSpinner({ onSpinComplete, isSuperBonus = false }: WheelSpinnerProps) {
  const [spinning, setSpinning] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const controls = useAnimation();

  const spinWheel = async () => {
    if (spinning) return;
    setSpinning(true);
    setResultText(null);

    // Roll percentage chance (0 to 99)
    const roll = Math.floor(Math.random() * 100);
    let chosenIndex = 0;

    if (roll < 30) {
      chosenIndex = 0; // 1,000 Baht (30% chance)
    } else if (roll < 50) {
      chosenIndex = 1; // 500 Baht (20% chance)
    } else if (roll < 65) {
      chosenIndex = 2; // 100 Baht (15% chance)
    } else if (roll < 80) {
      chosenIndex = 3; // 50 Baht (15% chance)
    } else if (roll < 90) {
      chosenIndex = 4; // 5,000 Baht (10% chance)
    } else {
      chosenIndex = 5; // 10 Baht (10% chance)
    }

    const item = WHEEL_RATE_DEFAULTS[chosenIndex];

    // Wedge math
    // 6 wedges of 60 degrees each. Let's arrange indices in clockwise order.
    // Index 0: 0-60 deg, Index 1: 60-120 deg, etc.
    // To stop at chosen index, we rotation by: 360 - (chosenIndex * 60) - 30 deg (offset to wedge center)
    const baseDegrees = 360 * 4; // 4 full loops
    const targetDegrees = baseDegrees + (360 - (chosenIndex * 60) - 30);

    // Run animation
    await controls.start({
      rotate: targetDegrees,
      transition: { duration: 2.5, ease: 'easeOut' }
    });

    setSpinning(false);
    const resultMsg = `${isSuperBonus ? 'Super Bonus 5,000 บาท + ' : ''}สุ่มโชคได้ธนบัตรใบละ ${item.item}`;
    setResultText(resultMsg);

    // Dispatch results
    onSpinComplete(item.amount, item.item);
  };

  const currentSegments = WHEEL_RATE_DEFAULTS;

  return (
    <div className="flex flex-col items-center justify-center p-2 w-full max-w-lg mx-auto" id="daily-wheel-spin-panel">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-black text-[#059669] flex items-center justify-center gap-2">
          {isSuperBonus ? (
            <span className="bg-rose-600 text-white text-xs px-3 py-1 rounded-full font-extrabold animate-pulse flex items-center gap-1.5 uppercase tracking-wide shadow-md">
              <Gift size={14} /> SUPER BONUS!
            </span>
          ) : (
            <span className="text-indigo-950 flex items-center gap-1.5 font-extrabold uppercase">
              <Sparkles size={20} className="text-amber-500 animate-spin" style={{ animationDuration: '3s' }} /> ระบบสุ่มโชคประจำวัน
            </span>
          )}
        </h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm font-medium">
          {isSuperBonus 
            ? 'เดินลงช่องจุดเริ่มต้นพอดี รับทันที 5,000 บ. + ได้สิทธิ์สุ่มเงินต่อฟรี 1 ครั้ง!' 
            : 'เดินผ่านครบรอบจุดเริ่มต้น ได้รับเงินรางวัลพิเศษจากวงล้อโชคดีคูณเท่าตัว!'}
        </p>
      </div>

      {/* Outer wrapper with pointing arrow */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-[340px] md:h-[340px] my-6 flex items-center justify-center">
        {/* Pointer ticker at the top */}
        <div className="absolute top-0 z-20 w-10 h-10 flex items-center justify-center" style={{ transform: 'translateY(-35%)' }}>
          <svg viewBox="0 0 24 24" className="w-10 h-10 fill-rose-600 text-rose-600 drop-shadow-lg">
            <path d="M12 21l-9-15h18z" />
          </svg>
        </div>

        {/* Dynamic circular segment wheel */}
        <motion.div
          animate={controls}
          initial={{ rotate: 0 }}
          className="w-full h-full rounded-full border-8 border-slate-900 shadow-2xl overflow-hidden relative cursor-pointer"
          style={{ transformOrigin: 'center' }}
          onClick={spinWheel}
        >
          {/* Slices container in SVG form */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {currentSegments.map((seg, i) => {
              const startAngle = i * 60;
              const angleRad = (startAngle * Math.PI) / 180;
              const endAngle = (i + 1) * 60;
              const endAngleRad = (endAngle * Math.PI) / 180;

              // Grid mapping vector for slice
              const x1 = 50 + 50 * Math.cos(angleRad - Math.PI/2);
              const y1 = 50 + 50 * Math.sin(angleRad - Math.PI/2);
              const x2 = 50 + 50 * Math.cos(endAngleRad - Math.PI/2);
              const y2 = 50 + 50 * Math.sin(endAngleRad - Math.PI/2);

              const colors = [
                '#3b82f6', // blue
                '#06b6d4', // cyan
                '#f59e0b', // amber
                '#a855f7', // purple
                '#eab308', // gold/yellow
                '#64748b'  // slate
              ];

              return (
                <g key={i}>
                  {/* Outer Sector */}
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={colors[i]}
                    className="stroke-white/30 stroke-[0.8]"
                  />
                  {/* Wedge label */}
                  <text
                    x="50"
                    y="18"
                    transform={`rotate(${startAngle + 30}, 50, 50)`}
                    textAnchor="middle"
                    className="fill-white font-black text-[4.8px]"
                    style={{ fill: '#ffffff', fontWeight: 900 }}
                  >
                    {seg.amount.toLocaleString()} ฿
                  </text>
                </g>
              );
            })}
            {/* Center ring */}
            <circle cx="50" cy="50" r="14" className="fill-slate-950 stroke-slate-800 stroke-[1.5]" />
          </svg>
          
          {/* Inner center labels */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-slate-950 border-2 border-slate-750 flex flex-col items-center justify-center text-xs font-black text-yellow-400 select-none shadow-xl">
              <span>โชค</span>
              <span className="text-[8px] text-slate-300">2 ชั้น</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-2">
        <button
          onClick={spinWheel}
          disabled={spinning}
          className={`w-full max-w-sm py-3.5 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            spinning 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
              : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md'
          }`}
          id="trigger-spin-wheel-btn"
        >
          <Coins size={18} /> {spinning ? 'กำลังหมุนหาโชค...' : 'หมุนเลย! ลุ้นรับรางวัลชนะเลิศ'}
        </button>

        {resultText && (
          <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-center mt-3 w-full max-w-sm animate-fade-in shadow-xs" id="wheel-payout-result-alert">
            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block mb-0.5">ยินดีด้วย! ได้รับรางวัล</span>
            <span className="text-base font-extrabold text-emerald-800 flex items-center justify-center gap-1.5">
              <Sparkles size={16} className="text-amber-500 animate-spin" /> {resultText}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
