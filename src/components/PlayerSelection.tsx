/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, CharacterColor } from '../types';
import { CHARACTER_OPTIONS } from '../data';
import { Users, UserPlus, Play, Trash2, ShieldCheck, Shuffle } from 'lucide-react';

interface PlayerSelectionProps {
  onStartGame: (players: Player[]) => void;
}

interface TempPlayer {
  id: string;
  name: string;
  color: CharacterColor;
  emoji: string;
}

const SUGGESTED_EMOJIS = [
  '🐷', '🐶', '🦛', '🦖', '🦕', '🐯', '🦁', '🦊', '🐱', '🐼',
  '🐨', '🐸', '🐰', '🐵', '🐘', '🦒', '🐮', '🐭', '🐔', '🐴'
];

export default function PlayerSelection({ onStartGame }: PlayerSelectionProps) {
  const [players, setPlayers] = useState<TempPlayer[]>([
    { id: '1', name: 'ผู้เล่น 1', color: CharacterColor.Green, emoji: '🦊' },
    { id: '2', name: 'ผู้เล่น 2', color: CharacterColor.Blue, emoji: '🐨' }
  ]);
  const [selectedColor, setSelectedColor] = useState<CharacterColor>(CharacterColor.Green);
  const [selectedEmoji, setSelectedEmoji] = useState('🐷');

  const isEmojiTaken = selectedEmoji.trim() !== '' && players.some(
    p => p.emoji.trim() === selectedEmoji.trim()
  );
  const isEmojiEmpty = selectedEmoji.trim() === '';

  // Filter out colors already taken
  const availableColors = CHARACTER_OPTIONS.filter(
    opt => !players.some(p => p.color === opt.color)
  );

  // Set default selected color to first available
  const playersColorsHash = players.map(p => p.color).join(',');

  React.useEffect(() => {
    const isStillAvailable = availableColors.some(opt => opt.color === selectedColor);
    if (availableColors.length > 0 && !isStillAvailable) {
      setSelectedColor(availableColors[0].color as CharacterColor);
    }
  }, [playersColorsHash, selectedColor]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (players.length >= 6) return;

    const opt = CHARACTER_OPTIONS.find(o => o.color === selectedColor);
    const resolvedName = opt ? `ผู้เล่น${opt.name}` : `ผู้เล่น ${players.length + 1}`;

    const newPlayer: TempPlayer = {
      id: Math.random().toString(36).substring(2, 9),
      name: resolvedName,
      color: selectedColor,
      emoji: selectedEmoji.trim() || '🐱'
    };

    setPlayers([...players, newPlayer]);
    // Select a different random suggested emoji for the next player
    const unusedEmojis = SUGGESTED_EMOJIS.filter(emo => !players.some(p => p.emoji === emo) && emo !== selectedEmoji);
    if (unusedEmojis.length > 0) {
      setSelectedEmoji(unusedEmojis[Math.floor(Math.random() * unusedEmojis.length)]);
    }
  };

  const handleRemovePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const handleShufflePlayers = () => {
    if (players.length < 2) return;
    const shuffled = [...players];
    // Fisher-Yates Shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setPlayers(shuffled);
  };

  const handleStartGame = () => {
    if (players.length < 2) return;
    // Map to actual game Player objects with starting money and position
    const actualPlayers: Player[] = players.map(p => ({
      id: p.id,
      name: p.name,
      color: p.color,
      emoji: p.emoji,
      money: 15000, // starting money 15,000 Baht according to Rule.md
      position: 0,  // start at start space (0)
      isBankrupt: false,
      inactiveTurns: 0,
      lapCount: 1
    }));
    onStartGame(actualPlayers);
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-8 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-800" id="player-setup-card">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-indigo-950 mb-2 font-sans uppercase" id="game-title">
          ท็อปเกมส์ เศรษฐีใหญ่ โชค 2 ชั้น
        </h1>
        <p className="text-sm text-slate-500">
          ระบบบริหารและเครื่องมือคำนวณเงิน หุ้น วงล้อสุ่ม และระบบเทิร์น
        </p>
      </div>

      {/* Register player form */}
      {players.length < 6 ? (
        <form onSubmit={handleAddPlayer} className="p-5 bg-slate-50 border border-slate-200 rounded-lg mb-6 flex flex-col gap-4" id="add-player-form">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <UserPlus size={18} className="text-indigo-600" /> ลงทะเบียนผู้เล่นใหม่ (สูงสุด 6 คน)
          </h2>
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <label className="block text-[10px] text-slate-400 mb-1.5 font-bold uppercase tracking-wider">เลือกตัวเดินประจำตัว (ตามกระดานจริง)</label>
              <div className="flex gap-2.5 flex-wrap py-1">
                {CHARACTER_OPTIONS.map(opt => {
                  const isTaken = players.some(p => p.color === opt.color);
                  const isSelected = selectedColor === opt.color;
                  return (
                    <button
                      key={opt.color}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setSelectedColor(opt.color as CharacterColor)}
                      className={`relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                        isSelected 
                          ? 'scale-110 border-slate-900 ring-4 ring-indigo-600/20' 
                          : isTaken 
                            ? 'opacity-25 border-slate-100 cursor-not-allowed scale-90' 
                            : 'border-transparent hover:scale-105'
                      }`}
                      style={{ 
                        backgroundColor: opt.hex,
                        boxShadow: isSelected ? `0 0 10px ${opt.shadow}` : 'none'
                      }}
                      title={opt.name + (isTaken ? ' (ถูกเลือกแล้ว)' : '')}
                    >
                      {/* Drawing the miniature pawn shape */}
                      <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow-md text-white fill-white opacity-90">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M12 11c-3.5 0-5 2-5 5h10c0-3-1.5-5-5-5z" />
                        <ellipse cx="12" cy="18" rx="6" ry="2" />
                      </svg>
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Emoji Selection Section */}
          <div className="bg-white p-3.5 border border-slate-200 rounded-md flex flex-col gap-2">
            <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
              <span>🌟</span> เลือกสัญลักษณ์การ์ตูน / อีโมจิ หรือพิมพ์ใส่ตามใจชอบ (ห้ามซ้ำกัน):
            </span>
            
            <div className="flex gap-4 items-center">
              {/* Emoji input style preview */}
              <div className="relative shrink-0">
                <input
                  type="text"
                  value={selectedEmoji}
                  onChange={(e) => setSelectedEmoji(e.target.value)}
                  placeholder="พิมพ์..."
                  maxLength={10}
                  className={`w-20 text-center font-sans text-2xl px-2 py-1.5 border-2 rounded bg-indigo-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                    isEmojiTaken ? 'border-rose-500 bg-rose-50/40 text-rose-700' : 'border-indigo-500'
                  }`}
                  title="ใส่สัญลักษณ์ อีโมจิ หรือข้อความสั้นๆ"
                />
                <div className={`absolute -top-2 left-1/2 -translate-x-1/2 text-[8px] text-white font-extrabold px-1 rounded whitespace-nowrap ${
                  isEmojiTaken ? 'bg-rose-600' : 'bg-indigo-600'
                }`}>
                  กำหนดเอง
                </div>
              </div>
              
              {/* Suggested emojis list scroll */}
              <div className="flex gap-1.5 flex-wrap flex-1 p-1.5 border border-dashed border-slate-200 rounded bg-slate-50/50 max-h-[100px] overflow-y-auto">
                {SUGGESTED_EMOJIS.map(emo => {
                  const isSelected = selectedEmoji === emo;
                  const isTaken = players.some(p => p.emoji === emo);
                  return (
                    <button
                      key={emo}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setSelectedEmoji(emo)}
                      className={`w-9 h-9 rounded text-xl transition-all flex items-center justify-center ${
                        isSelected 
                          ? 'bg-indigo-100 border border-indigo-400 scale-110 shadow-xs cursor-pointer' 
                          : isTaken
                            ? 'opacity-30 bg-slate-200 border border-slate-300 cursor-not-allowed line-through scale-90'
                            : 'hover:bg-white bg-slate-100/70 border border-slate-200 shadow-xxs cursor-pointer hover:scale-115 hover:rotate-6'
                      }`}
                      title={isTaken ? 'สัญลักษณ์นี้ถูกผู้อื่นเลือกแล้ว' : `เลือก ${emo}`}
                    >
                      {emo}
                    </button>
                  );
                })}
              </div>
            </div>

            {isEmojiTaken && (
              <span className="text-[11px] text-rose-600 font-semibold flex items-center gap-1 mt-1 animate-pulse">
                ⚠️ สัญลักษณ์/อีโมจินี้ถูกผู้เล่นอื่นเลือกใช้งานแล้ว กรุณาเลือกตัวอื่น
              </span>
            )}
            {isEmojiEmpty && (
              <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 mt-1 animate-pulse">
                ⚠️ กรุณาเลือกหรือใส่สัญลักษณ์การ์ตูน/อีโมจิประจำตัว
              </span>
            )}
          </div>

          <div className="flex justify-end mt-1">
            <button
              type="submit"
              disabled={isEmojiTaken || isEmojiEmpty}
              className="px-6 py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 transition-all font-bold rounded text-sm cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0"
              id="submit-palyer-btn"
            >
              <UserPlus size={16} /> ตกลง เพิ่มผู้เล่น
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-6 text-center text-sm text-slate-500">
          ลงทะเบียนผู้เล่นครบจำนวนสูงสุดแล้ว (6 คน)
        </div>
      )}

      {/* Players List */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-3">
          <h2 className="text-slate-505 text-slate-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
            <Users size={16} className="text-indigo-600" /> รายชื่อผู้เล่นจริง ({players.length}/6 คน)
          </h2>
          {players.length >= 2 && (
            <button
              type="button"
              onClick={handleShufflePlayers}
              className="text-xs px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-250 text-amber-800 font-extrabold rounded-md flex items-center gap-1.5 transition-all cursor-pointer shadow-3xs active:scale-95 shrink-0"
              id="shuffle-turn-order-btn"
            >
              <Shuffle size={12} className="text-amber-600" />
              <span>🎲 สุ่มลำดับเทิร์นผู้เล่น (ใครเริ่มก่อนหลัง)</span>
            </button>
          )}
        </div>
        
        {players.length === 0 ? (
          <div className="py-8 bg-slate-50 text-center text-slate-400 text-sm rounded-lg border border-slate-200 border-dashed">
            ยังไม่มีผู้เล่นอยู่ในระบบ กรุณาเพิ่มผู้เล่นอย่างน้อย 2 คนก่อนเริ่มเกม
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="players-selection-list">
            {players.map((p, index) => {
              const opt = CHARACTER_OPTIONS.find(o => o.color === p.color)!;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 bg-white border border-slate-200 hover:border-slate-300 transition-all rounded-xl shadow-sm relative overflow-hidden"
                  id={`player-row-${p.color}`}
                >
                  <div className="absolute top-0 left-0 bottom-0 w-1" style={{ backgroundColor: opt.hex }} />
                  <div className="flex items-center gap-3 pl-1.5">
                    <div 
                      className="w-10 h-10 rounded-xl border border-slate-200/80 flex items-center justify-center text-xl shadow-xxs relative shrink-0"
                      style={{ 
                        backgroundColor: opt.hex,
                        boxShadow: `0 2px 6px ${opt.shadow}`
                      }}
                    >
                      {p.emoji}
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[9.5px] font-black border border-white shadow-2xs select-none">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-850 block text-sm leading-tight">{p.name}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.2 bg-indigo-50 border border-indigo-150 text-indigo-750 rounded shrink-0 select-none uppercase font-sans">
                          ตาที่ {index + 1}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-1 rounded block mt-0.5">ตัวเดินสี{opt.name}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePlayer(p.id)}
                    className="p-1 px-3 bg-slate-100 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 transition-all rounded text-xs flex items-center gap-1 cursor-pointer font-medium text-slate-600 shrink-0"
                    title="ลบผู้เล่น"
                  >
                    <Trash2 size={13} /> ลบ
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 pt-6 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-indigo-50/50 p-3 rounded border border-indigo-100/70 max-w-xl text-center">
          <ShieldCheck size={16} className="text-indigo-600 shrink-0" />
          <span>ผู้เล่นแต่ละคนจะเริ่มต้นด้วยทุนสำรอง **15,000 บาท** กระจายประเภทธนบัตรรรวมกันตามกติกา จัดการหุ้นเบี้ยตามสีของตัวเอง</span>
        </div>
        <button
          type="button"
          onClick={handleStartGame}
          disabled={players.length < 2}
          className="w-full md:w-auto px-10 py-3.5 bg-indigo-600 text-white hover:bg-indigo-700 font-extrabold rounded shadow-sm hover:shadow-md text-base transition-all scale-100 hover:scale-[1.01] disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
          id="start-companion-btn"
        >
          <Play size={18} fill="currentColor" /> เริ่มต้นระบบช่วยเล่น
        </button>
      </div>
    </div>
  );
}
