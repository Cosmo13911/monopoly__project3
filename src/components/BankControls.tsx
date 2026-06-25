/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, StockDetail, StockOwnership } from '../types';
import { CHARACTER_OPTIONS } from '../data';
import { Landmark, ArrowLeftRight, HeartCrack, ChevronRight, DollarSign } from 'lucide-react';

interface BankControlsProps {
  players: Player[];
  stocks: StockDetail[];
  ownership: StockOwnership;
  onModifyMoney: (playerId: string, amount: number, logMsg: string) => void;
  onTransferMoney: (fromPlayerId: string, toPlayerId: string, amount: number) => void;
  onResetGame: () => void;
  onDeclareBankruptcy: (playerId: string) => void;
  onSelectStock: (stock: StockDetail) => void;
}

export default function BankControls({
  players,
  stocks,
  ownership,
  onModifyMoney,
  onTransferMoney,
  onResetGame,
  onDeclareBankruptcy,
  onSelectStock
}: BankControlsProps) {
  // Transfer state
  const [transferFrom, setTransferFrom] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState<number>(0);

  // Manual Adjust State
  const [adjustTargetPlayer, setAdjustTargetPlayer] = useState('');
  const [adjustAmount, setAdjustAmount] = useState<number>(0);

  // Replaces alerts with inline state feedback
  const [transferError, setTransferError] = useState('');
  const [adjustError, setAdjustError] = useState('');

  // Replaces confirms with two-step inline state
  const [bankruptcyConfirmId, setBankruptcyConfirmId] = useState<string | null>(null);
  const [resetConfirming, setResetConfirming] = useState(false);

  const activePlayers = players.filter(p => !p.isBankrupt);

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'ธนาคารกลาง';

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    setTransferError('');
    if (!transferFrom || !transferTo || transferFrom === transferTo || transferAmount <= 0) return;

    const fromP = players.find(p => p.id === transferFrom);
    if (fromP && fromP.money < transferAmount) {
      setTransferError(`❌ ผู้โอน (${fromP.name}) มีเงินสดไม่เพียงพอ!`);
      return;
    }

    onTransferMoney(transferFrom, transferTo, transferAmount);
    // Reset inputs
    setTransferAmount(0);
  };

  const handleAdjustMoney = (type: 'add' | 'deduct') => {
    setAdjustError('');
    if (!adjustTargetPlayer || adjustAmount <= 0) return;
    const amountVal = type === 'add' ? adjustAmount : -adjustAmount;
    const desc = type === 'add' 
      ? `ธนาคารมอบเงินทุนสนับสนุน ${adjustAmount.toLocaleString()} บาท` 
      : `ธนาคารเรียกเก็บค่าปรับ/ค่าบริการ ${adjustAmount.toLocaleString()} บาท`;
    
    const p = players.find(x => x.id === adjustTargetPlayer);
    if (p && type === 'deduct' && p.money < adjustAmount) {
      setAdjustError(`❌ ${p.name} มีเงินสดไม่พอให้หัก!`);
      return;
    }

    onModifyMoney(adjustTargetPlayer, amountVal, desc);
    setAdjustAmount(0);
  };

  return (
    <div className="flex flex-col gap-6" id="bank-companion-controls">
      {/* SECTION 1: QUICK RE-BALANCING LEDGER */}
      <div className="bg-slate-50 p-5 border border-slate-200 rounded-lg" id="banker-adjuster-pane">
        <h3 className="text-slate-800 text-sm font-extrabold flex items-center gap-2 mb-3.5 border-b border-slate-200 pb-2">
          <Landmark size={16} className="text-indigo-650" /> ตู้เซฟธนาคารแบบแตะด่วน (จัดการเงินรายบุคคล)
        </h3>
        <div className="flex flex-col gap-4">
          {/* Target Player Grid Buttons */}
          <div className="flex flex-col gap-2">
            <span className="block text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
              👤 เลือกผู้เล่นเป้าหมาย (Target Player)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" id="adjust-tar-buttons">
              {activePlayers.map(p => {
                const opt = CHARACTER_OPTIONS.find(o => o.color === p.color);
                const isSelected = adjustTargetPlayer === p.id;
                return (
                  <button
                    key={`adjust-tar-${p.id}`}
                    type="button"
                    onClick={() => {
                      setAdjustTargetPlayer(isSelected ? '' : p.id);
                      setAdjustError('');
                    }}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-bold text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 scale-[1.02] ring-2 ring-indigo-550/20'
                        : 'border-slate-200 bg-white hover:bg-slate-550/5 text-slate-700'
                    }`}
                    id={`adjust-tar-btn-${p.id}`}
                  >
                    <span 
                      className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-xxs shrink-0" 
                      style={{ backgroundColor: opt?.hex, boxShadow: isSelected ? `0 0 8px ${opt?.shadow}` : 'none' }}
                    >
                      {p.emoji}
                    </span>
                    <div className="overflow-hidden min-w-0">
                      <span className="block truncate leading-tight">{p.name}</span>
                      <span className="block text-[9px] text-slate-400 font-normal mt-0.5">{p.money.toLocaleString()} ฿</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Cash Stacking Stack for Adjust */}
          <div className="flex flex-col gap-2.5 bg-white border border-slate-200 p-4 rounded-xl shadow-xs" id="adjust-cash-stacker">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="block text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                💵 ยอดเงินปรับปรุงสะสม (Stacking Adjust):
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-black text-indigo-750 bg-indigo-50 border border-indigo-150 px-3.5 py-1 rounded-md">
                  {adjustAmount.toLocaleString()} บาท
                </span>
                {adjustAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustAmount(0);
                      setAdjustError('');
                    }}
                    className="text-[10px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 px-2.5 py-1 rounded transition-all cursor-pointer"
                    id="reset-adjust-amount-btn"
                  >
                    รีเซ็ตค่า
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-1" id="adjust-cash-quick-buttons">
              {[10, 50, 100, 500, 1000, 5000].map(val => (
                <button
                  key={`adjust-cash-${val}`}
                  type="button"
                  onClick={() => {
                    setAdjustAmount(prev => prev + val);
                    setAdjustError('');
                  }}
                  className="py-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-black text-slate-700 transition-all cursor-pointer shadow-3xs active:scale-95 flex items-center justify-center gap-0.5"
                >
                  <span className="text-[10px] font-semibold text-slate-400">+</span>
                  {val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {adjustError && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-slate-200 p-2 rounded text-center font-semibold mb-1">
              {adjustError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mt-1">
            <button
              type="button"
              onClick={() => handleAdjustMoney('deduct')}
              disabled={!adjustTargetPlayer || adjustAmount <= 0}
              className="py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-30 disabled:pointer-events-none text-white font-extrabold rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              id="adjust-deduct-confirm-btn"
            >
              <HeartCrack size={14} /> 
              {!adjustTargetPlayer 
                ? 'เลือกเป้าหมาย' 
                : `หักเงิน -${adjustAmount.toLocaleString()} ฿`}
            </button>
            <button
              type="button"
              onClick={() => handleAdjustMoney('add')}
              disabled={!adjustTargetPlayer || adjustAmount <= 0}
              className="py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-30 disabled:pointer-events-none text-white font-extrabold rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
              id="adjust-add-confirm-btn"
            >
              <DollarSign size={14} /> 
              {!adjustTargetPlayer 
                ? 'เลือกเป้าหมาย' 
                : `เพิ่มเงิน +${adjustAmount.toLocaleString()} ฿`}
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 2: INTER-PLAYER TRANSACTION ENGINE */}
      <div className="bg-slate-50 p-5 border border-slate-200 rounded-lg" id="peer-transact-pane">
        <h3 className="text-slate-800 text-sm font-extrabold flex items-center gap-2 mb-3.5 border-b border-slate-200 pb-2">
          <ArrowLeftRight size={16} className="text-indigo-650" /> ห้องทำธุรกรรมแบบเร่งด่วน (Fast Banking)
        </h3>
        <form onSubmit={handleTransfer} className="flex flex-col gap-4">
          {transferError && (
            <div className="text-xs text-rose-600 bg-rose-50 border border-slate-200 p-2 rounded text-center font-semibold">
              {transferError}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sender Choice Column */}
            <div className="flex flex-col gap-2">
              <span className="block text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                👤 ผู้โอนเงิน (Sender)
              </span>
              <div className="grid grid-cols-2 gap-2" id="t-from-buttons">
                {activePlayers.map(p => {
                  const opt = CHARACTER_OPTIONS.find(o => o.color === p.color);
                  const isSelected = transferFrom === p.id;
                  return (
                    <button
                      key={`from-${p.id}`}
                      type="button"
                      onClick={() => {
                        const newFrom = isSelected ? '' : p.id;
                        setTransferFrom(newFrom);
                        if (transferTo === newFrom) {
                          setTransferTo('');
                        }
                        setTransferError('');
                      }}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-bold text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-950 scale-[1.02] ring-2 ring-indigo-550/20'
                          : 'border-slate-200 bg-white hover:bg-slate-550/5 text-slate-700'
                      }`}
                      id={`from-btn-${p.id}`}
                    >
                      <span 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-xxs shrink-0" 
                        style={{ backgroundColor: opt?.hex, boxShadow: isSelected ? `0 0 8px ${opt?.shadow}` : 'none' }}
                      >
                        {p.emoji}
                      </span>
                      <div className="overflow-hidden min-w-0">
                        <span className="block truncate leading-tight">{p.name}</span>
                        <span className="block text-[9px] text-slate-400 font-normal mt-0.5">{p.money.toLocaleString()} ฿</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Receiver Choice Column */}
            <div className="flex flex-col gap-2">
              <span className="block text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                📥 ผู้รับเงิน (Receiver)
              </span>
              <div className="grid grid-cols-2 gap-2" id="t-to-buttons">
                {activePlayers.map(p => {
                  const opt = CHARACTER_OPTIONS.find(o => o.color === p.color);
                  const isSelected = transferTo === p.id;
                  const isSender = transferFrom === p.id;
                  return (
                    <button
                      key={`to-${p.id}`}
                      type="button"
                      disabled={isSender}
                      onClick={() => {
                        setTransferTo(isSelected ? '' : p.id);
                        setTransferError('');
                      }}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border text-xs font-bold text-left transition-all ${
                        isSender
                          ? 'border-slate-200 bg-slate-100 text-slate-350 cursor-not-allowed opacity-40'
                          : isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-950 scale-[1.02] ring-2 ring-indigo-550/20 cursor-pointer'
                            : 'border-slate-200 bg-white hover:bg-slate-550/5 text-slate-700 cursor-pointer'
                      }`}
                      id={`to-btn-${p.id}`}
                    >
                      <span 
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-xxs shrink-0 animate-fade-in" 
                        style={{ backgroundColor: isSender ? '#cbd5e1' : opt?.hex, boxShadow: isSelected ? `0 0 8px ${opt?.shadow}` : 'none' }}
                      >
                        {isSender ? '❌' : p.emoji}
                      </span>
                      <div className="overflow-hidden min-w-0">
                        <span className={`block truncate leading-tight ${isSender ? 'line-through text-slate-400' : ''}`}>
                          {p.name}
                        </span>
                        <span className="block text-[9px] text-slate-400 font-normal mt-0.5">{p.money.toLocaleString()} ฿</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Cash Buttons Stack */}
          <div className="flex flex-col gap-2.5 bg-white border border-slate-200 p-4 rounded-xl shadow-xs" id="t-cash-stacker">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="block text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
                💵 ยอดโอนชำระสะสม (Stacking Cash):
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-black text-indigo-750 bg-indigo-50 border border-indigo-150 px-3.5 py-1 rounded-md">
                  {transferAmount.toLocaleString()} บาท
                </span>
                {transferAmount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setTransferAmount(0);
                      setTransferError('');
                    }}
                    className="text-[10px] font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 px-2.5 py-1 rounded transition-all cursor-pointer"
                    id="reset-transfer-amount-btn"
                  >
                    รีเซ็ตค่า
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-1" id="cash-quick-buttons">
              {[10, 50, 100, 500, 1000, 5000].map(val => (
                <button
                  key={`cash-${val}`}
                  type="button"
                  onClick={() => {
                    setTransferAmount(prev => prev + val);
                    setTransferError('');
                  }}
                  className="py-2.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-black text-slate-700 transition-all cursor-pointer shadow-3xs active:scale-95 flex items-center justify-center gap-0.5"
                >
                  <span className="text-[10px] font-semibold text-slate-400">+</span>
                  {val.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!transferFrom || !transferTo || transferFrom === transferTo || transferAmount <= 0}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-lg text-xs transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
            id="transfer-confirm-btn"
          >
            <ArrowLeftRight size={14} /> 
            {!transferFrom || !transferTo 
              ? 'กรุณาเลือกผู้โอนและผู้รับเงิน' 
              : `ยืนยันการโอนเงินจำนวน ${transferAmount.toLocaleString()} บาท`}
          </button>
        </form>
      </div>


    </div>
  );
}
