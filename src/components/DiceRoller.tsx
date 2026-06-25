/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, useAnimation } from 'motion/react';
import { Dices, RefreshCw, ArrowRight, Keyboard, Settings } from 'lucide-react';

interface DiceRollerProps {
  onRollComplete: (val1: number, val2: number, total: number) => void;
  disabled?: boolean;
  hasRolled?: boolean;
  onAdvanceTurn?: () => void;
}

export default function DiceRoller({ 
  onRollComplete, 
  disabled = false, 
  hasRolled = false, 
  onAdvanceTurn 
}: DiceRollerProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [diceValues, setDiceValues] = useState<[number, number]>([1, 1]);
  const [useTwoDice, setUseTwoDice] = useState(true);
  const [manualDice1, setManualDice1] = useState<number>(3);
  const [manualDice2, setManualDice2] = useState<number>(4);

  const controls1 = useAnimation();
  const controls2 = useAnimation();

  const handleRoll = async () => {
    if (isRolling || disabled) return;
    setIsRolling(true);

    // Randomize intermediate values during roll
    const interval = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1
      ]);
    }, 80);

    // Animate shaking and spinning
    const animateRoll = (ctrl: any) => {
      return ctrl.start({
        rotate: [0, 180, -90, 360, 15, -15, 0],
        x: [0, 12, -15, 8, -6, 4, 0],
        y: [0, -10, 12, -8, 5, -3, 0],
        scale: [1, 1.2, 0.9, 1.1, 1],
        transition: { duration: 0.8, ease: 'easeInOut' }
      });
    };

    await Promise.all([
      animateRoll(controls1),
      ...(useTwoDice ? [animateRoll(controls2)] : [])
    ]);

    clearInterval(interval);

    // Roll final results
    const f1 = Math.floor(Math.random() * 6) + 1;
    const f2 = useTwoDice ? Math.floor(Math.random() * 6) + 1 : 0;
    const total = f1 + f2;

    setDiceValues([f1, f2 || 1]);
    setIsRolling(false);

    onRollComplete(f1, f2, total);
  };

  const handleConfirmManualRoll = () => {
    setDiceValues([manualDice1, manualDice2]);
    onRollComplete(manualDice1, manualDice2, manualDice1 + manualDice2);
  };

  const renderDiceFace = (val: number, control: any) => {
    // Standard dot coordinates for 6 dice faces in SVG
    const dotConfigs: { [key: number]: [number, number][] } = {
      1: [[12, 12]],
      2: [[6, 6], [18, 18]],
      3: [[6, 6], [12, 12], [18, 18]],
      4: [[6, 6], [6, 18], [18, 6], [18, 18]],
      5: [[6, 6], [6, 18], [12, 12], [18, 6], [18, 18]],
      6: [[6, 6], [6, 12], [6, 18], [18, 6], [18, 12], [18, 18]]
    };

    const dots = dotConfigs[val] || dotConfigs[1];

    return (
      <motion.div
        animate={control}
        className="w-16 h-16 bg-white border border-zinc-300 rounded-xl shadow-lg relative flex items-center justify-center cursor-pointer select-none"
        style={{
          boxShadow: '0 6px 16px rgba(0,0,0,0.15), inset 0 -4px 8px rgba(0,0,0,0.12), inset 0 2px 4px rgba(255,255,255,0.8)'
        }}
      >
        <svg viewBox="0 0 24 24" className="w-full h-full p-2.5">
          {dots.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="2" className="fill-red-650" style={{ fill: '#b91c1c' }} />
          ))}
        </svg>
      </motion.div>
    );
  };

  return (
    <div className="p-5 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center gap-4 text-center w-full shadow-xs" id="board-dice-roller">
      <div className="flex justify-between items-center w-full pb-1 border-b border-slate-200">
        <span className="text-[10px] text-slate-550 font-bold flex items-center gap-1.5 uppercase tracking-wider">
          <Dices size={15} className="text-indigo-600" /> 
          {isManualMode ? 'ใช้ลูกเต๋าจริง (จิ้มเลือกหน้าเต๋า)' : 'ลูกเต๋าเคลื่อนที่'}
        </span>
        <button
          type="button"
          onClick={() => !isRolling && setIsManualMode(!isManualMode)}
          disabled={hasRolled}
          className={`flex items-center gap-1 px-2 py-0.5 rounded text-[8.5px] font-extrabold border transition-all cursor-pointer ${
            hasRolled 
              ? 'opacity-30 cursor-not-allowed'
              : isManualMode
                ? 'bg-amber-50 text-amber-700 border-amber-250'
                : 'bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100'
          }`}
          id="toggle-manual-mode-btn"
        >
          <Keyboard size={10} />
          {isManualMode ? 'สลับเป็นทอดเต๋าจำลอง' : 'ใส่แต้มแมนนวล'}
        </button>
      </div>

      {isManualMode && !hasRolled ? (
        <div className="w-full flex flex-col gap-5 bg-slate-50/50 p-5 rounded-2xl border border-slate-150 shadow-inner" id="manual-dice-config">
          <div className="flex flex-col gap-4 text-left" id="manual-dice-picker">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none flex items-center gap-1">
                🎲 ลูกที่ 1 <span className="text-indigo-600">(เลือกแต้ม)</span>
              </span>
              <div className="grid grid-cols-6 gap-2 mt-1">
                {[1, 2, 3, 4, 5, 6].map((val) => (
                  <button
                    key={`d1-${val}`}
                    type="button"
                    onClick={() => setManualDice1(val)}
                    className={`py-3.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-[1.08] active:scale-95 ${
                      manualDice1 === val
                        ? 'border-indigo-600 bg-indigo-600 text-white scale-105 shadow-md ring-4 ring-indigo-200 font-black'
                        : 'border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-700'
                    }`}
                  >
                    <span className="text-3xl leading-none">
                      {val === 1 && '⚀'}
                      {val === 2 && '⚁'}
                      {val === 3 && '⚂'}
                      {val === 4 && '⚃'}
                      {val === 5 && '⚄'}
                      {val === 6 && '⚅'}
                    </span>
                    <span className="text-xs sm:text-sm font-black mt-1 font-sans">{val}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none flex items-center gap-1">
                🎲 ลูกที่ 2 <span className="text-indigo-600">(เลือกแต้ม)</span>
              </span>
              <div className="grid grid-cols-6 gap-2 mt-1">
                {[1, 2, 3, 4, 5, 6].map((val) => (
                  <button
                    key={`d2-${val}`}
                    type="button"
                    onClick={() => setManualDice2(val)}
                    className={`py-3.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-[1.08] active:scale-95 ${
                      manualDice2 === val
                        ? 'border-indigo-600 bg-indigo-600 text-white scale-105 shadow-md ring-4 ring-indigo-200 font-black'
                        : 'border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-slate-700'
                    }`}
                  >
                    <span className="text-3xl leading-none">
                      {val === 1 && '⚀'}
                      {val === 2 && '⚁'}
                      {val === 3 && '⚂'}
                      {val === 4 && '⚃'}
                      {val === 5 && '⚄'}
                      {val === 6 && '⚅'}
                    </span>
                    <span className="text-xs sm:text-sm font-black mt-1 font-sans">{val}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-2.5 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-extrabold">แต้มเต๋า 1 + เต๋า 2:</span>
            <div className="flex items-center gap-1.5">
              {manualDice1 === manualDice2 && (
                <span className="bg-amber-100 text-amber-800 border border-amber-200 text-[9px] font-extrabold px-1.5 py-0.5 rounded animate-pulse">
                  🔥 ดับเบิ้ล!
                </span>
              )}
              <span className="font-extrabold text-indigo-650 font-mono text-xs bg-indigo-50 border border-indigo-100/70 px-3 py-0.5 rounded-full">
                {manualDice1} + {manualDice2} = {manualDice1 + manualDice2} แต้ม
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmManualRoll}
            disabled={disabled}
            className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              disabled
                ? 'bg-slate-100 text-slate-400 border border-slate-250 cursor-not-allowed opacity-60'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95'
            }`}
            id="confirm-manual-dice-btn"
          >
            ยืนยันจำนวนแต้ม ({manualDice1 + manualDice2})
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-4 items-center justify-center py-2 h-20">
            {renderDiceFace(diceValues[0], controls1)}
            {useTwoDice && renderDiceFace(diceValues[1], controls2)}
          </div>

          <div className="w-full">
            {hasRolled && onAdvanceTurn ? (
              <button
                onClick={onAdvanceTurn}
                className="w-full py-2.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer bg-[#059669] hover:bg-emerald-700 text-white shadow-xs active:scale-95"
                id="finish-turn-btn"
              >
                <span>จบเทิร์น / ส่งต่อตาเพื่อน</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleRoll}
                disabled={isRolling || disabled}
                className={`w-full py-2.5 rounded text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isRolling || disabled
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs active:scale-95'
                }`}
                id="roll-dice-action-btn"
              >
                <RefreshCw size={14} className={isRolling ? 'animate-spin' : ''} />
                {isRolling ? 'กำลังทอดเต๋า...' : 'ทอดลูกเต๋า'}
              </button>
            )}
            
            {!isRolling && (
              <div className="mt-2 text-xs text-slate-500" id="dice-roll-total-lbl">
                {useTwoDice ? (
                  <span>แต้มที่ได้: {diceValues[0]} + {diceValues[1]} = <strong className="text-indigo-650 font-extrabold text-sm">{diceValues[0] + diceValues[1]}</strong></span>
                ) : (
                  <span>แต้มที่ได้: <strong className="text-indigo-650 font-extrabold text-sm">{diceValues[0]}</strong></span>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
