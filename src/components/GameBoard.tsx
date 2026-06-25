/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Player, BoardTile, StockDetail, StockOwnership, GameLog, AppNotification } from '../types';
import { BOARD_TILES, STOCKS_DATA, CHARACTER_OPTIONS, calculateProgressivePayout, getHyperDriftRate, getHyperDriftSettings, saveHyperDriftSettings, HyperDriftSettings } from '../data';
import StockInfoModal from './StockInfoModal';
import DiceRoller from './DiceRoller';
import WheelSpinner from './WheelSpinner';
import BankControls from './BankControls';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Landmark, Users, ArrowRight, BellRing, Sparkles, HelpCircle, AlertCircle, AlertTriangle, Play, 
  Flag, HeartHandshake, Palmtree, Heart, Route, Coins, FileCheck, ShieldCheck, 
  Palette, Trees, Gift, Utensils, Home, Zap, Film, Gem, Plane, Smile, Fuel, 
  ShoppingBag, Hammer, Wrench, CupSoda, Dumbbell, Shirt, Hotel, Printer, TrendingUp, 
  Globe, Tv, HardHat, Beer, TrendingDown, X, Filter
} from 'lucide-react';

// Helper to resolve specific beautiful Lucide icon for each board tile
function getTileIcon(tile: BoardTile) {
  const size = 18;
  const className = "text-indigo-600 group-hover:scale-115 transition-transform duration-200 mt-0.5 shrink-0";
  
  if (tile.type === 'START') {
    return <Flag size={20} className="text-emerald-600 animate-bounce mt-0.5 shrink-0" />;
  }
  if (tile.type.startsWith('PRISON')) {
    if (tile.type === 'PRISON_1') return <HeartHandshake size={size} className="text-rose-500 mt-0.5 shrink-0" />;
    if (tile.type === 'PRISON_2') return <Palmtree size={size} className="text-sky-500 mt-0.5 shrink-0" />;
    return <AlertTriangle size={size} className="text-red-500 mt-0.5 shrink-0 animate-pulse" />; // PRISON_3
  }
  if (tile.type === 'STOP_CARD') {
    if (tile.name.includes('?')) {
      return <HelpCircle size={size} className="text-amber-500 animate-pulse mt-0.5 shrink-0" />;
    } else {
      return <AlertCircle size={size} className="text-amber-500 animate-pulse mt-0.5 shrink-0" />;
    }
  }
  if (tile.type === 'SPECIAL_FINANCE') {
    if (tile.name.includes("บริจาค")) return <Heart size={size} className="text-rose-500 mt-0.5 shrink-0" />;
    if (tile.name.includes("บำรุงทาง")) return <Route size={size} className="text-amber-600 mt-0.5 shrink-0" />;
    if (tile.name.includes("ภาษี")) return <Coins size={size} className="text-rose-600 mt-0.5 shrink-0" />;
    if (tile.name.includes("ใบอนุญาต")) return <FileCheck size={size} className="text-amber-500 mt-0.5 shrink-0" />;
    if (tile.name.includes("ประกัน")) return <ShieldCheck size={size} className="text-[#059669] mt-0.5 shrink-0" />;
    if (tile.name.includes("ภูมิทัศน์")) return <Palette size={size} className="text-blue-500 mt-0.5 shrink-0" />;
    if (tile.name.includes("ปลูกป่า")) return <Trees size={size} className="text-emerald-600 mt-0.5 shrink-0" />;
    if (tile.name.includes("โรงแรม")) return <Hotel size={size} className="text-emerald-600 mt-0.5 shrink-0" />;
    if (tile.name.includes("เที่ยว") || tile.name.includes("ทัวร์")) return <Plane size={size} className="text-teal-500 mt-0.5 shrink-0" />;
    return <Coins size={size} className="text-rose-500 mt-0.5 shrink-0" />;
  }
  if (tile.type === 'STOCK' && tile.stockId) {
    switch (tile.stockId) {
      case 1: return <Gift size={size} className="text-sky-500 mt-0.5 shrink-0" />;
      case 2: return <Utensils size={size} className="text-amber-500 mt-0.5 shrink-0" />;
      case 3: return <Home size={size} className="text-emerald-500 mt-0.5 shrink-0" />;
      case 4: return <Zap size={size} className="text-yellow-500 mt-0.5 shrink-0" />;
      case 5: return <Film size={size} className="text-indigo-500 mt-0.5 shrink-0" />;
      case 6: return <Gem size={size} className="text-blue-400 mt-0.5 shrink-0" />;
      case 7: return <Plane size={size} className="text-teal-500 mt-0.5 shrink-0" />;
      case 8: return <Smile size={size} className="text-pink-500 mt-0.5 shrink-0" />;
      case 9: return <Fuel size={size} className="text-zinc-650 mt-0.5 shrink-0" />;
      case 10: return <ShoppingBag size={size} className="text-purple-500 mt-0.5 shrink-0" />;
      case 11: return <Hammer size={size} className="text-amber-700 mt-0.5 shrink-0" />;
      case 12: return <Wrench size={size} className="text-blue-500 mt-0.5 shrink-0" />;
      case 13: return <CupSoda size={size} className="text-red-500 mt-0.5 shrink-0" />;
      case 14: return <ShoppingBag size={size} className="text-amber-600 mt-0.5 shrink-0" />;
      case 15: return <Dumbbell size={size} className="text-slate-750 mt-0.5 shrink-0" />;
      case 16: return <Shirt size={size} className="text-violet-500 mt-0.5 shrink-0" />;
      case 17: return <Hotel size={size} className="text-emerald-600 mt-0.5 shrink-0" />;
      case 18: return <Printer size={size} className="text-indigo-650 mt-0.5 shrink-0" />;
      case 19: return <TrendingUp size={size} className="text-emerald-600 mt-0.5 shrink-0" />;
      case 20: return <Globe size={size} className="text-sky-600 mt-0.5 shrink-0" />;
      case 21: return <Utensils size={size} className="text-orange-500 mt-0.5 shrink-0" />;
      case 22: return <Tv size={size} className="text-cyan-500 mt-0.5 shrink-0" />;
      case 23: return <Trees size={size} className="text-emerald-700 mt-0.5 shrink-0" />;
      case 24: return <HardHat size={size} className="text-zinc-700 mt-0.5 shrink-0" />;
      case 25: return <Beer size={size} className="text-amber-650 mt-0.5 shrink-0" />;
      default: return <TrendingUp size={size} className="text-indigo-600 mt-0.5 shrink-0" />;
    }
  }
  return <HelpCircle size={size} className={className} />;
}

interface GameBoardProps {
  initialPlayers: Player[];
  onResetGame: () => void;
}

// 11x11 layout position map rotated -90 degrees so Start is at Bottom-Right (RHS)
const TILE_COORDS: { [index: number]: { col: number; row: number } } = {
  0: { col: 11, row: 11 },  // Start Bottom-Right Corner (RHS)
  // Bottom Edge going LEFT (indices 1 - 9)
  1: { col: 10, row: 11 },
  2: { col: 9, row: 11 },
  3: { col: 8, row: 11 },
  4: { col: 7, row: 11 },
  5: { col: 6, row: 11 },
  6: { col: 5, row: 11 },
  7: { col: 4, row: 11 },
  8: { col: 3, row: 11 },
  9: { col: 2, row: 11 },
  10: { col: 1, row: 11 },  // Prison 1 Bottom-Left Corner
  // Left Edge going UP (indices 11 - 19)
  11: { col: 1, row: 10 },
  12: { col: 1, row: 9 },
  13: { col: 1, row: 8 },
  14: { col: 1, row: 7 },
  15: { col: 1, row: 6 },
  16: { col: 1, row: 5 },
  17: { col: 1, row: 4 },
  18: { col: 1, row: 3 },
  19: { col: 1, row: 2 },
  20: { col: 1, row: 1 },   // Prison 2 Top-Left Corner
  // Top Edge going RIGHT (indices 21 - 29)
  21: { col: 2, row: 1 },
  22: { col: 3, row: 1 },
  23: { col: 4, row: 1 },
  24: { col: 5, row: 1 },
  25: { col: 6, row: 1 },
  26: { col: 7, row: 1 },
  27: { col: 8, row: 1 },
  28: { col: 9, row: 1 },
  29: { col: 10, row: 1 },
  30: { col: 11, row: 1 },  // Prison 3 Top-Right Corner
  // Right Edge going DOWN (indices 31 - 39)
  31: { col: 11, row: 2 },
  32: { col: 11, row: 3 },
  33: { col: 11, row: 4 },
  34: { col: 11, row: 5 },
  35: { col: 11, row: 6 },
  36: { col: 11, row: 7 },
  37: { col: 11, row: 8 },
  38: { col: 11, row: 9 },
  39: { col: 11, row: 10 }
};

interface GameHistoryState {
  players: Player[];
  activeTurnIdx: number;
  ownership: StockOwnership;
  logs: GameLog[];
  notifications: AppNotification[];
  pendingPaymentTile: BoardTile | null;
  pendingPaymentPlayerId: string | null;
  showWheel: boolean;
  wheelSuperBonus: boolean;
  wheelPendingPlayerId: string | null;
  hasRolledThisTurn: boolean;
}

export default function GameBoard({ initialPlayers, onResetGame }: GameBoardProps) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [activeTurnIdx, setActiveTurnIdx] = useState(0);
  const [ownership, setOwnership] = useState<StockOwnership>({});
  const [history, setHistory] = useState<GameHistoryState[]>([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const saveSnapshot = () => {
    const snapshot: GameHistoryState = {
      players: JSON.parse(JSON.stringify(players)),
      activeTurnIdx,
      ownership: JSON.parse(JSON.stringify(ownership)),
      logs: [...logs],
      notifications: [...notifications],
      pendingPaymentTile,
      pendingPaymentPlayerId,
      showWheel,
      wheelSuperBonus,
      wheelPendingPlayerId,
      hasRolledThisTurn,
    };
    setHistory(prev => [...prev, snapshot]);
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));
    
    setPlayers(previous.players);
    setActiveTurnIdx(previous.activeTurnIdx);
    setOwnership(previous.ownership);
    setLogs(previous.logs);
    setNotifications(previous.notifications);
    setPendingPaymentTile(previous.pendingPaymentTile);
    setPendingPaymentPlayerId(previous.pendingPaymentPlayerId);
    setShowWheel(previous.showWheel);
    setWheelSuperBonus(previous.wheelSuperBonus);
    setWheelPendingPlayerId(previous.wheelPendingPlayerId);
    setHasRolledThisTurn(previous.hasRolledThisTurn);
    
    // Add specific logs/notifications
    const newLog: GameLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('th-TH'),
      message: '⏪ ย้อนกลับ/กู้คืนสถานะ: ย้อนสถานะผู้เล่น ตำแหน่ง เงินทุน เทิร์น และสิทธิ์ดับเบิ้ลกลับคืน 1 ตาเรียบร้อยแล้ว',
      type: 'info'
    };
    setLogs(prev => [newLog, ...previous.logs]);
  };

  const [logs, setLogs] = useState<GameLog[]>([
    {
      id: 'l_init',
      timestamp: new Date().toLocaleTimeString('th-TH'),
      message: 'เริ่มต้นระบบผู้ช่วยเล่นเกมเศรษฐีใหญ่ โชค 2 ชั้น มอบเงินทุนตั้งต้น 15,000 บาทให้ผู้เล่นทุกคนแล้ว',
      type: 'info'
    }
  ]);

  // Modal displays
  const [selectedStock, setSelectedStock] = useState<StockDetail | null>(null);
  
  // Real-time notifications on LHS
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Special finance tile landing invoice/bill
  const [pendingPaymentTile, setPendingPaymentTile] = useState<BoardTile | null>(null);
  const [pendingPaymentPlayerId, setPendingPaymentPlayerId] = useState<string | null>(null);

  // Wheel spinner flags
  const [showWheel, setShowWheel] = useState(false);
  const [wheelSuperBonus, setWheelSuperBonus] = useState(false);
  const [wheelPendingPlayerId, setWheelPendingPlayerId] = useState<string | null>(null);

  // Stop turns tracker for current turn
  const [hasRolledThisTurn, setHasRolledThisTurn] = useState(false);

  // Stock Owner Filter & Highlight States
  const [selectedOwner, setSelectedOwner] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [reassigningStockId, setReassigningStockId] = useState<number | null>(null);
  const [reassigningFromPlayerId, setReassigningFromPlayerId] = useState<string | null>(null);

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsForm, setSettingsForm] = useState<HyperDriftSettings>(() => getHyperDriftSettings());

  const addNotification = (
    type: AppNotification['type'],
    playerId: string | 'system',
    title: string,
    message: string,
    amount?: number
  ) => {
    const player = players.find(p => p.id === playerId);
    const notiId = 'noti_' + Math.random().toString(36).substring(2, 9);
    const newNoti: AppNotification = {
      id: notiId,
      timestamp: new Date().toLocaleTimeString('th-TH'),
      type,
      playerName: player ? player.name : 'ระบบ',
      playerEmoji: player ? player.emoji : '📢',
      title,
      message,
      amount
    };
    setNotifications(prev => [newNoti, ...prev].slice(0, 50));

    // Auto dismiss after 5.5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notiId));
    }, 5500);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addLog = (message: string, type: GameLog['type'] = 'info') => {
    const newLog: GameLog = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('th-TH'),
      message,
      type
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const activePlayer = players[activeTurnIdx];

  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'ธนาคารกลาง';

  // Advance to next active player turn
  const advanceTurn = () => {
    setHasRolledThisTurn(false);
    
    let nextIdx = (activeTurnIdx + 1) % players.length;
    // Skip bankrupt players
    let attempts = 0;
    while (players[nextIdx].isBankrupt && attempts < players.length) {
      nextIdx = (nextIdx + 1) % players.length;
      attempts++;
    }

    setActiveTurnIdx(nextIdx);
  };

  // Roll dice completed and trigger position update
  const handleDiceRollComplete = (d1: number, d2: number, total: number) => {
    if (hasRolledThisTurn) return;
    
    // Save snapshot before roll
    saveSnapshot();

    const isDouble = d1 === d2 && d1 > 0;
    if (isDouble) {
      setHasRolledThisTurn(false); // keep false so they can roll again on this turn
    } else {
      setHasRolledThisTurn(true);
    }

    const oldPosition = activePlayer.position;
    // Calculate new position (wrapping according to total tiles dynamically)
    let newPosition = (oldPosition + total) % BOARD_TILES.length;

    addLog(`${activePlayer.name} ทอดลูกเต๋าได้แต้ม ${total} ${isDouble ? '(🎲 ดับเบิ้ล!) ' : ''}มุ่งหน้าจากช่องที่ ${oldPosition} ไปยังช่องที่ ${newPosition}`, 'dice');
    if (isDouble) {
      addLog(`🎲 ดับเบิ้ล! ${activePlayer.name} ทอยได้ลูกเต๋าหน้าเหมือนกัน (${d1} กับ ${d2}) ได้สิทธิ์ทอดเต๋าต่อโดยยังไม่เปลี่ยนเทิร์น`, 'success');
      addNotification('info', activePlayer.id, 'สิทธิ์ทอยดับเบิ้ล', `ทอยได้คู่ ${d1} ได้สิทธิ์ทอยต่อทันที`);
    }

    // CHECK FOR PASSING START (index 0)
    // If the index wrapped around, player passed or landed on start!
    const passedStart = newPosition < oldPosition;

    let updatedPlayers = [...players];

    if (newPosition === 0) {
      // LANDED EXACTLY ON START -> Super Bonus!
      setWheelSuperBonus(true);
      setWheelPendingPlayerId(activePlayer.id);
      setShowWheel(true);
      addLog(`✨ สุดยอดแจ็คพอต! ${activePlayer.name} เดินตกช่องจุดเริ่มต้นพอดี รับโบนัส 5,000 บาท และโบนัสหมุนสุ่มรางวัลต่อ!`, 'success');
      addNotification('money_in', activePlayer.id, 'โบนัสตกช่องเริ่มต้น', 'แจ็คพอต! เดินลงจุดเริ่มต้นได้รับเงินทุน', 5000);
      
      updatedPlayers = players.map(p => {
        if (p.id === activePlayer.id) {
          const nextLap = (p.lapCount || 1) + 1;
          addLog(`📈 ${p.name} ผ่านจุดเริ่มต้น เข้าสู่รอบที่ ${nextLap}! ค่าปันผลพุ่งขึ้นเป็น +${8 + nextLap}%!`, 'info');
          return { ...p, money: p.money + 5000, position: 0, lapCount: nextLap };
        }
        return p;
      });
    } else if (passedStart) {
      // PASSED START STANDARD -> Trigger wheel spin
      setWheelSuperBonus(false);
      setWheelPendingPlayerId(activePlayer.id);
      setShowWheel(true);
      addLog(`${activePlayer.name} เดินผ่านครบรอบจุดเริ่มต้น ได้สิทธิ์สุ่มเงินโชคประจำวันจากธนาคาร`, 'info');
      addNotification('info', activePlayer.id, 'ครบรอบกระดาน', 'เดินผ่านจุดเริ่มต้นเพื่อปลดล็อกรอบสุ่มโชค');
      
      updatedPlayers = players.map(p => {
        if (p.id === activePlayer.id) {
          const nextLap = (p.lapCount || 1) + 1;
          addLog(`📈 ${p.name} ผ่านจุดเริ่มต้น เข้าสู่รอบที่ ${nextLap}! ค่าปันผลพุ่งขึ้นเป็น +${8 + nextLap}%!`, 'info');
          return { ...p, position: newPosition, lapCount: nextLap };
        }
        return p;
      });
    } else {
      // Normal moving
      updatedPlayers = players.map(p => {
        if (p.id === activePlayer.id) {
          return { ...p, position: newPosition };
        }
        return p;
      });
    }

    setPlayers(updatedPlayers);

    // TRIGER AUTOMATED SYSTEM ACTIONS ON LANDING LANDINGS:
    const tile = BOARD_TILES[newPosition];

    // Landing on special financial space
    if (tile.type === 'SPECIAL_FINANCE' && tile.cost) {
      setTimeout(() => {
        setPendingPaymentTile(tile);
        setPendingPaymentPlayerId(activePlayer.id);
        addLog(`🎫 ใบสั่งเก็บเงิน: ${activePlayer.name} ตกช่องพิเศษ '${tile.name}' ต้องชำระเงิน ${tile.cost?.toLocaleString()} บาท กดหักเงินได้เลย`, 'warn');
      }, 500);
    }

    // Landing on prison/jail markers (ตึกถล่ม, สงกรานต์, กฎจราจร)
    if (tile.type === 'PRISON_1') {
      setTimeout(() => {
        setPlayers(prev => prev.map(p => {
          if (p.id === activePlayer.id) {
            return { ...p, inactiveTurns: 1 };
          }
          return p;
        }));
        addLog(`🛑 ตึกถล่มแถวนั้น! ${activePlayer.name} ต้องหยุดเดินในรอบถัดไป 1 ครั้งเพื่อช่วยเหลือผู้ประสบภัย`, 'warn');
        addNotification('stopped', activePlayer.id, 'ตึกถล่ม (หยุด 1 ตา)', 'ต้องเข้าช่วยเหลือพื้นที่อุบัติภัยชั่วคราว');
      }, 600);
    } else if (tile.type === 'PRISON_2') {
      setTimeout(() => {
        setPlayers(prev => prev.map(p => {
          if (p.id === activePlayer.id) {
            return { ...p, inactiveTurns: 2 };
          }
          return p;
        }));
        addLog(`💦 สุขสันต์วันสงกรานต์! ${activePlayer.name} ร่วมเล่นสาดน้ำเพลินไปหน่อย ต้องหยุดพักผ่อน 2 รอบการเล่น`, 'warn');
        addNotification('stopped', activePlayer.id, 'เล่นสงกรานต์ (หยุด 2 ตา)', 'สาดน้ำเมามันส์จนเกินเวลา ขอกักตัวพักผ่อน');
      }, 600);
    } else if (tile.type === 'PRISON_3') {
      setTimeout(() => {
        setPlayers(prev => prev.map(p => {
          if (p.id === activePlayer.id) {
            return { ...p, inactiveTurns: 3 };
          }
          return p;
        }));
        addLog(`🚨 ตำรวจจราจรแจ้งใบสั่งจับข้อหาขับรถสวนเลน! ${activePlayer.name} ต้องหยุดทอดลูกเต๋า 3 รอบการเล่นเพื่อเข้าอบรมวินัย`, 'warn');
        addNotification('stopped', activePlayer.id, 'ผิดกฎจราจร (หยุด 3 ตา)', 'ถูกยึดใบขับขี่และเข้าแถวอบรมความประพฤติ');
      }, 600);
    }

    // Landing on stop_cards (! or ?)
    if (tile.type === 'STOP_CARD') {
      setTimeout(() => {
        addLog(`💡 ${activePlayer.name} ตกที่ช่องแผ่นป้ายอัจฉริยะ ลุ้นรางวัลหรือจ่ายภาษีนอกรอบสะสม!`, 'info');
      }, 600);
    }

    // Auto open stock info when landing in case it is stock
    if (tile.type === 'STOCK' && tile.stockId) {
      setTimeout(() => {
        const stockObj = STOCKS_DATA.find(x => x.id === tile.stockId);
        if (stockObj) {
          setSelectedStock(stockObj);
        }
      }, 800);
    }
  };

  // Complete rolling start-pass daily lucky spin
  const handleWheelSpinComplete = (amount: number, label: string) => {
    if (!wheelPendingPlayerId) return;
    saveSnapshot();

    setPlayers(prev => prev.map(p => {
      if (p.id === wheelPendingPlayerId) {
        return { ...p, money: p.money + amount };
      }
      return p;
    }));

    addLog(`🎡 ${getPlayerName(wheelPendingPlayerId)} หมุนวงล้อนำโชคสำเร็จ รับเงินเพิ่ม ${amount.toLocaleString()} บาท (${label})`, 'success');
    addNotification('money_in', wheelPendingPlayerId, 'โชคดีจากเงินหมุนเวียน', label, amount);

    // Clear state
    setTimeout(() => {
       setShowWheel(false);
       setWheelPendingPlayerId(null);
    }, 1500);
  };

  // Bankers manually adjust players' money
  const handleModifyMoney = (playerId: string, amount: number, logMsg: string) => {
    saveSnapshot();
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, money: p.money + amount };
      }
      return p;
    }));
    addLog(`${getPlayerName(playerId)}: ${logMsg}`, amount >= 0 ? 'success' : 'danger');
    
    addNotification(
      amount >= 0 ? 'money_in' : 'money_out',
      playerId,
      amount >= 0 ? 'ธนาคารโอนเงินให้' : 'ธนาคารปรับตัดค่าใช้จ่าย',
      logMsg,
      Math.abs(amount)
    );
  };

  // Player transfers money directly to Player
  const handleTransferMoney = (fromPlayerId: string, toPlayerId: string, amount: number) => {
    saveSnapshot();
    setPlayers(prev => prev.map(p => {
      if (p.id === fromPlayerId) {
        return { ...p, money: p.money - amount };
      }
      if (p.id === toPlayerId) {
        return { ...p, money: p.money + amount };
      }
      return p;
    }));
    addLog(`💸 ${getPlayerName(fromPlayerId)} ได้ทำรายการชำระ/โอนเงินสด ${amount.toLocaleString()} บาทให้กับ ${getPlayerName(toPlayerId)}`, 'transaction');
    addNotification('money_out', fromPlayerId, 'ทำรายการโอมเงินสด', `ชำระ/จ่ายโอนเงินตรงไปหา ${getPlayerName(toPlayerId)}`, amount);
    addNotification('money_in', toPlayerId, 'ยอมรับยอดจ่ายโอน', `ได้รับยอดชำระโดยตรงจากผู้เล่น ${getPlayerName(fromPlayerId)}`, amount);
  };

  // Buy shares trigger
  const handleBuyShares = (playerId: string, sharesCount: number) => {
    if (!selectedStock) return;
    const buyer = players.find(p => p.id === playerId);
    if (!buyer) return;

    // Pricing checking
    const pricing = selectedStock.pricings.find(x => x.shares === sharesCount);
    if (!pricing) return;

    if (buyer.money < pricing.price) {
      addLog(`⚠️ การร่วมลงทุนล้มเหลว: เงินสดของ ${buyer.name} ไม่เพียงพอกับราคามูลค่าหุ้นรวม ${pricing.price.toLocaleString()} บาท`, 'danger');
      return;
    }

    saveSnapshot();
    // Process Purchase
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, money: p.money - pricing.price };
      }
      return p;
    }));

    setOwnership(prev => {
      const stockOwnedMap = prev[selectedStock.id] || {};
      const preCount = stockOwnedMap[playerId] || 0;
      return {
        ...prev,
        [selectedStock.id]: {
          ...stockOwnedMap,
          [playerId]: preCount + sharesCount
        }
      };
    });

    addLog(`📈 ${buyer.name} ได้ประเมินจับจองและซื้อหุ้นเพิ่ม #${selectedStock.id} '${selectedStock.name}' จำนวน ${sharesCount} หุ้น ทุ่มเงินลงทุน ${pricing.price.toLocaleString()} บาท`, 'success');
    addNotification('money_out', playerId, `ซื้อหลักทรัพย์: ${selectedStock.name}`, `ซื้อหุ้นเพิ่มจำนวน ${sharesCount} หุ้น เพื่อเก็งกำไรปันผล`, pricing.price);

    // Force close modal or refresh
    setSelectedStock(null);
  };

  // Sell shares trigger
  const handleSellShares = (playerId: string, sharesCount: number) => {
    if (!selectedStock) return;
    const ownerShares = ownership[selectedStock.id]?.[playerId] || 0;
    if (ownerShares <= 0) return;

    saveSnapshot();
    const singleSharePrice = selectedStock.pricings.find(x => x.shares === 1)?.price || 500;
    const refund = Math.floor(singleSharePrice * 0.5 * sharesCount);

    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, money: p.money + refund };
      }
      return p;
    }));

    setOwnership(prev => {
      const stockOwnedMap = { ...prev[selectedStock.id] };
      const nextShares = ownerShares - sharesCount;
      if (nextShares <= 0) {
        delete stockOwnedMap[playerId];
      } else {
        stockOwnedMap[playerId] = nextShares;
      }

      return {
        ...prev,
        [selectedStock.id]: stockOwnedMap
      };
    });

    addLog(`📉 ${getPlayerName(playerId)} ได้ทำการขายทอดตลาดหุ้นหลักทรัพย์ #${selectedStock.id} '${selectedStock.name}' ออก 1 หุ้น ได้รับส่วนลดธนาคารแลกคืน ${refund.toLocaleString()} บาท (หักครึ่งราคา)`, 'warn');
    addNotification('money_in', playerId, `ขายหุ้นคืน: ${selectedStock.name}`, `ปลดสิทธิ์หลักทรัพย์แลกเปลี่ยนเงินช่วยเหลือฉุกเฉิน`, refund);
    setSelectedStock(null);
  };

  // Lay down manual dividend payout when falling on owned stock
  const handlePayDividend = (fromPlayerId: string) => {
    if (!selectedStock) return;
    const payer = players.find(p => p.id === fromPlayerId);
    if (!payer) return;

    const ownersMap = ownership[selectedStock.id] || {};
    const ownersIds = Object.keys(ownersMap);
    if (ownersIds.length === 0) return;

    // Check doubling super bonus (single player owns all 4)
    let bonusMultiplier = 1;
    if (ownersIds.length === 1 && ownersMap[ownersIds[0]] === 4) {
      bonusMultiplier = 2; // dividend DOUBLED
    }

    // Process calculation
    let payoutsText: string[] = [];
    let updatedPlayers = [...players];
    let totalDeductions = 0;

    ownersIds.forEach(ownerId => {
      const ownerObj = players.find(p => p.id === ownerId);
      const ownerLap = ownerObj ? ownerObj.lapCount || 1 : 1;
      
      const rateMultiplier = getHyperDriftRate(ownerLap);

      const sharesNum = ownersMap[ownerId];
      const defaultPayout = selectedStock.pricings.find(x => x.shares === sharesNum)?.payout || 0;
      const basePayout = defaultPayout * bonusMultiplier;
      const finalPayout = calculateProgressivePayout(basePayout, ownerLap);

      totalDeductions += finalPayout;

      updatedPlayers = updatedPlayers.map(p => {
        if (p.id === ownerId) {
          return { ...p, money: p.money + finalPayout };
        }
        return p;
      });

      payoutsText.push(`${getPlayerName(ownerId)} ได้รับ +${finalPayout.toLocaleString()} บาท (รอบที่ ${ownerLap}: เรตคูณไฮเปอร์ดริฟต์ ${rateMultiplier} เท่า, ${sharesNum} หุ้น ${bonusMultiplier > 1 ? '🌟โบนัสครบ 4 หุ้น' : ''})`);
      addNotification('money_in', ownerId, `ปันผลรับ: ${selectedStock.name}`, `ถือหลักสิทธิ์ร่วม ได้รับค่าปันผลจาก ${payer.name} (รอบ ${ownerLap})`, finalPayout);
    });

    if (payer.money < totalDeductions) {
      addLog(`⚠️ ชำระปันผลล้มเหลว: เงินสดของ ${payer.name} (${payer.money.toLocaleString()} บาท) ไม่เพียงพอต่อการจ่ายคืนค่าปันผลรวม ${totalDeductions.toLocaleString()} บาทให้กับคณะหุ้นส่วน! กรุณาดำเนินการปรับเงิน ขายหุ้น หรือประกาศล้มละลายหากหมดสภาพคล่อง`, 'danger');
      return;
    }

    saveSnapshot();
    // Subtract from payer
    updatedPlayers = updatedPlayers.map(p => {
      if (p.id === fromPlayerId) {
        return { ...p, money: p.money - totalDeductions };
      }
      return p;
    });

    setPlayers(updatedPlayers);
    addLog(`💸 ${payer.name} เดินตกในช่องหุ้น #${selectedStock.id} '${selectedStock.name}' จึงชำระค่าสิทธิ์ปันผลให้พันธมิตรผู้ถือหุ้นรวม ${totalDeductions.toLocaleString()} บ. รายละเอียด: ${payoutsText.join(' | ')}`, 'transaction');
    addNotification('money_out', fromPlayerId, `จ่ายปันผล: ${selectedStock.name}`, `เดินลงช่องพอร์ตของผู้อื่น ชำระให้คณะหุ้นรวม`, totalDeductions);
    setSelectedStock(null);
  };

  const handleTransferStockOwnership = (
    fromPlayerId: string,
    toPlayerId: string,
    transferStockId: number,
    sharesToTransfer: number,
    cashAdjustment: number
  ) => {
    saveSnapshot();

    const debtor = players.find(p => p.id === fromPlayerId);
    const creditor = players.find(p => p.id === toPlayerId);
    const trStock = STOCKS_DATA.find(s => s.id === transferStockId);

    if (!debtor || !creditor || !trStock) return;

    // Check ownership of transferStock
    const currentDebtorShares = ownership[transferStockId]?.[fromPlayerId] || 0;
    if (currentDebtorShares < sharesToTransfer) {
      alert("ผู้โอนมีหุ้นไม่เพียงพอสำหรับการโอนสิทธิ์!");
      return;
    }

    // Process player cash adjustment
    // If cashAdjustment > 0, creditor pays change to debtor
    // If cashAdjustment < 0, debtor pays cash diff to creditor
    let updatedPlayers = players.map(p => {
      if (p.id === fromPlayerId) {
        return { ...p, money: p.money + cashAdjustment };
      }
      if (p.id === toPlayerId) {
        return { ...p, money: p.money - cashAdjustment };
      }
      return p;
    });

    // Process Stock Ownership update
    const updatedOwnership = { ...ownership };
    const stockMap = { ...(updatedOwnership[transferStockId] || {}) };
    
    // Subtract from debtor
    const newDebtorShares = currentDebtorShares - sharesToTransfer;
    if (newDebtorShares <= 0) {
      delete stockMap[fromPlayerId];
    } else {
      stockMap[fromPlayerId] = newDebtorShares;
    }

    // Add to creditor
    const currentCreditorShares = stockMap[toPlayerId] || 0;
    stockMap[toPlayerId] = currentCreditorShares + sharesToTransfer;

    updatedOwnership[transferStockId] = stockMap;

    setPlayers(updatedPlayers);
    setOwnership(updatedOwnership);

    const absAdj = Math.abs(cashAdjustment);
    const transferStockValue = trStock.pricings.find(x => x.shares === sharesToTransfer)?.price || 0;
    
    let detailMsg = "";
    if (cashAdjustment > 0) {
      detailMsg = `โดยมูลค่าหุ้นสูงกว่าหนี้ เจ้าหนี้ (${creditor.name}) จึงจ่ายเงินทอนให้ ${debtor.name} จำนวน ${absAdj.toLocaleString()} บาท`;
    } else if (cashAdjustment < 0) {
      detailMsg = `โดยมูลค่าหุ้นต่ำกว่าหนี้ ${debtor.name} จึงจ่ายเงินสดส่วนต่างเพิ่มให้ ${creditor.name} จำนวน ${absAdj.toLocaleString()} บาท`;
    } else {
      detailMsg = `โดยมูลค่าหุ้นเท่ากับมูลค่าหนี้ปันผลพอดี ไม่มีการแลกเปลี่ยนเงินสดเพิ่มเติม`;
    }

    addLog(`🤝 [กฎโอนหุ้นล้างหนี้] ${debtor.name} ได้โอนสิทธิ์หุ้น #${transferStockId} '${trStock.name}' จำนวน ${sharesToTransfer} หุ้น (มูลค่า 100% = ${transferStockValue.toLocaleString()} บาท) ให้กับ ${creditor.name} เพื่อล้างหนี้ปันผล! ${detailMsg}`, 'success');
    addNotification('money_out', fromPlayerId, 'โอนหุ้นล้างหนี้', `โอนหุ้น ${trStock.name} จำนวน ${sharesToTransfer} หุ้นให้ ${creditor.name}`, cashAdjustment < 0 ? absAdj : 0);
    addNotification('money_in', toPlayerId, 'รับโอนหุ้นแทนเงินสด', `ได้รับโอนหุ้น ${trStock.name} จำนวน ${sharesToTransfer} หุ้นจาก ${debtor.name}`, cashAdjustment > 0 ? absAdj : 0);

    setSelectedStock(null);
  };

  // Reassign stock ownership directly
  const handleReassignStockOwner = (stockId: number, fromPlayerId: string, toPlayerId: string) => {
    saveSnapshot();

    const fromPlayer = players.find(p => p.id === fromPlayerId);
    const toPlayer = players.find(p => p.id === toPlayerId);
    const targetStock = STOCKS_DATA.find(s => s.id === stockId);

    if (!fromPlayer || !toPlayer || !targetStock) return;

    const sharesToTransfer = ownership[stockId]?.[fromPlayerId] || 0;
    if (sharesToTransfer <= 0) return;

    setOwnership(prev => {
      const stockOwnedMap = { ...prev[stockId] };
      
      // Remove from fromPlayer
      delete stockOwnedMap[fromPlayerId];

      // Add to toPlayer (combine, cap at 4 shares)
      const existingShares = stockOwnedMap[toPlayerId] || 0;
      const nextShares = Math.min(4, existingShares + sharesToTransfer);
      stockOwnedMap[toPlayerId] = nextShares;

      return {
        ...prev,
        [stockId]: stockOwnedMap
      };
    });

    addLog(`👑 [เปลี่ยนสิทธิ์ครอบครอง] ได้ย้ายกรรมสิทธิ์หุ้น #${stockId} '${targetStock.name}' จำนวน ${sharesToTransfer} หุ้น จาก ${fromPlayer.name} ให้กับ ${toPlayer.name}!`, 'info');
    addNotification('money_in', toPlayerId, 'ได้รับสิทธิ์หุ้นใหม่', `ได้รับโอนสิทธิ์หุ้น ${targetStock.name} จาก ${fromPlayer.name}`, 0);

    setSelectedStock(null);
  };

  // Declare Bankruptcy
  const handleDeclareBankruptcy = (playerId: string) => {
    saveSnapshot();
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, money: 0, isBankrupt: true };
      }
      return p;
    }));

    // Reclaim all shares from this insolvent player back to bank pool
    setOwnership(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(stockId => {
        const ownersMap = { ...updated[parseInt(stockId)] };
        if (ownersMap[playerId]) {
          delete ownersMap[playerId];
        }
        updated[parseInt(stockId)] = ownersMap;
      });
      return updated;
    });

    addLog(`💀 [สูญสลายล้มละลาย] ${getPlayerName(playerId)} ล้มละลายออกจากวงการ กิจการและหลักทรัพย์ทั้งหมดถูกยึดคืนคืนธนาคารกลางทันที!`, 'danger');
  };

  // Settle special financial space penalty
  const handlePaySpecialFinance = () => {
    if (!pendingPaymentTile || !pendingPaymentPlayerId) return;
    const tile = pendingPaymentTile;
    const playerId = pendingPaymentPlayerId;
    const pObj = players.find(p => p.id === playerId);
    if (!pObj) return;

    const cost = tile.cost || 0;
    
    saveSnapshot();
    // Deduct money
    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, money: p.money - cost };
      }
      return p;
    }));

    // Add log
    addLog(`💸 ${pObj.name} ชำระค่าธรรมเนียม '${tile.name}' จำนวน ${cost.toLocaleString()} บาทเรียบร้อย`, 'success');
    addNotification('money_out', playerId, `ชำระแล้ว: ${tile.name}`, `จ่ายค่าปรับ/กิจกรรมสมทบเข้าส่วนกลางสำเร็จ`, cost);

    // Clear state
    setPendingPaymentTile(null);
    setPendingPaymentPlayerId(null);
  };

  // Quick sell from billing panel
  const handleQuickSellShare = (stockId: number) => {
    if (!pendingPaymentPlayerId) return;
    const playerId = pendingPaymentPlayerId;
    const ownerShares = ownership[stockId]?.[playerId] || 0;
    if (ownerShares <= 0) return;

    const stockObj = STOCKS_DATA.find(x => x.id === stockId);
    if (!stockObj) return;

    const singleSharePrice = stockObj.pricings.find(x => x.shares === 1)?.price || 500;
    const refund = Math.floor(singleSharePrice * 0.5);

    setPlayers(prev => prev.map(p => {
      if (p.id === playerId) {
        return { ...p, money: p.money + refund };
      }
      return p;
    }));

    setOwnership(prev => {
      const stockOwnedMap = { ...prev[stockId] };
      const nextShares = ownerShares - 1;
      if (nextShares <= 0) {
        delete stockOwnedMap[playerId];
      } else {
        stockOwnedMap[playerId] = nextShares;
      }
      return {
        ...prev,
        [stockId]: stockOwnedMap
      };
    });

    addLog(`📉 [ขายด่วนช่วงชำระ] ${getPlayerName(playerId)} ขายหุ้น #${stockId} '${stockObj.name}' คืน 1 หุ้น ได้รับเงินสดแลกคืน ${refund.toLocaleString()} บาท`, 'warn');
    addNotification('money_in', playerId, 'ขายหุ้นด่วนเพื่อปลดหนี้', `ขายหลักทรัพย์ด่วนเพื่อชำระยอดสั่งปรับ ${stockObj.name}`, refund);
  };

  const handleBankruptcyInPayment = () => {
    if (!pendingPaymentPlayerId) return;
    handleDeclareBankruptcy(pendingPaymentPlayerId);
    setPendingPaymentTile(null);
    setPendingPaymentPlayerId(null);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-[1300px] mx-auto relative" id="companion-workspace">
      {/* FLOATING REAL-TIME NOTIFICATION TOAST NOTIFICATIONS (Only visible when there are active notifications) */}
      <div className="fixed bottom-6 left-6 z-[95] w-80 max-w-[calc(100vw-3rem)] flex flex-col gap-2.5 pointer-events-none p-4 sm:p-0" id="floating-notification-toast-container">
        <AnimatePresence>
          {notifications.map((noti) => {
            let cardBg = 'bg-white border-slate-200 shadow-xl';
            let amountText = null;
            let iconElement = <BellRing size={15} className="text-rose-500" />;

            if (noti.type === 'money_in') {
              cardBg = 'bg-emerald-50/95 border-emerald-250 shadow-emerald-100/40 shadow-lg ring-1 ring-emerald-500/5 backdrop-blur-xs';
              iconElement = <Coins size={15} className="text-emerald-650" />;
              if (noti.amount !== undefined) {
                amountText = <span className="text-[12.5px] font-black font-mono text-emerald-650">+{noti.amount.toLocaleString()} ฿</span>;
              }
            } else if (noti.type === 'money_out') {
              cardBg = 'bg-rose-50/95 border-rose-250 shadow-rose-100/40 shadow-lg ring-1 ring-rose-500/5 backdrop-blur-xs';
              iconElement = <TrendingDown size={15} className="text-rose-650" />;
              if (noti.amount !== undefined) {
                amountText = <span className="text-[12.5px] font-black font-mono text-rose-650">-{noti.amount.toLocaleString()} ฿</span>;
              }
            } else if (noti.type === 'stopped') {
              cardBg = 'bg-amber-50/95 border-amber-250 shadow-amber-100/30 shadow-lg ring-1 ring-amber-500/5 backdrop-blur-xs';
              iconElement = <AlertCircle size={15} className="text-amber-650" />;
            }

            return (
              <motion.div
                layout
                initial={{ opacity: 0, x: -60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -40, scale: 0.95, transition: { duration: 0.18 } }}
                key={noti.id}
                className={`p-3.5 rounded-xl border flex flex-col gap-1.5 text-xs hover:scale-101 hover:shadow-2xl hover:border-slate-350 transition-all duration-150 pointer-events-auto relative ${cardBg}`}
              >
                <button
                  type="button"
                  onClick={() => dismissNotification(noti.id)}
                  className="absolute top-2.5 right-2.5 p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-all"
                >
                  <X size={12} />
                </button>

                <div className="flex items-center justify-between gap-1 pr-6">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 rounded bg-white/70 border border-slate-200/40 flex items-center justify-center shrink-0">
                      {iconElement}
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-mono">{noti.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 bg-white/80 border border-slate-200/20 px-1.5 py-0.5 rounded-full shadow-xxs">
                    <span className="text-[11.5px]">{noti.playerEmoji}</span>
                    <span className="font-extrabold text-slate-800 text-[10px] truncate max-w-[80px]">{noti.playerName}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-1 border-t border-slate-200/30 pt-1.5">
                  <span className="font-bold text-slate-900 tracking-tight text-[11px] truncate max-w-[155px]">{noti.title}</span>
                  {amountText}
                </div>

                <p className="text-[10.5px] text-slate-500 leading-snug font-sans">{noti.message}</p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* CENTER COLUMN: THE MONOPOLY BOARD */}
      <div className="flex-1 max-w-[1050px] w-full bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col gap-4" id="board-diagram-wrapper">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-600 text-white rounded-md flex items-center justify-center"><Landmark size={18} /></span>
            <span className="text-slate-900 font-extrabold text-base sm:text-lg uppercase tracking-tight">กระดานเศรษฐีใหญ่ ท็อปเกมส์ (โชคนำทาง)</span>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Stock Owner Map Filter Button */}
            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-xs active:scale-95 ${
                selectedOwner !== null
                  ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 ring-2 ring-amber-400/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              id="map-filter-trigger-btn"
              title="คัดกรองผู้ถือหุ้นและแสดงผลไฮไลท์บนแผนที่แบบเรียลไทม์"
            >
              <Filter size={14} className={selectedOwner !== null ? "text-amber-600 animate-pulse" : "text-slate-500"} />
              {selectedOwner !== null ? (
                <span className="flex items-center gap-1.5">
                  <span>แผนที่:</span>
                  <span className="text-[13px] leading-none">{players.find(p => p.id === selectedOwner)?.emoji}</span>
                  <span className="font-extrabold">{players.find(p => p.id === selectedOwner)?.name}</span>
                  <span 
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering modal opening
                      setSelectedOwner(null);
                    }}
                    className="ml-1 p-0.5 hover:bg-amber-200/60 rounded text-amber-700 hover:text-red-650 transition-colors flex items-center justify-center shrink-0"
                    title="ล้างตัวกรอง"
                  >
                    <X size={10} strokeWidth={3} />
                  </span>
                </span>
              ) : (
                <span>ตัวกรองหุ้นแผนที่</span>
              )}
            </button>

            <button
              onClick={handleUndo}
              disabled={history.length === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                history.length === 0
                  ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed opacity-50'
                  : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 shadow-xs active:scale-95'
              }`}
              id="undo-action-btn"
              title="ย้อนสถานะผู้เล่น ตำแหน่ง และยอดเงิน 1 ตา"
            >
              <span>⏪ ย้อนกลับ / กดผิด</span>
              <span className="bg-rose-200/50 text-rose-850 text-[9px] px-1.5 py-0.2 rounded-full font-black font-mono">
                {history.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSettingsForm(getHyperDriftSettings());
                setShowSettingsModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all cursor-pointer shadow-xs active:scale-95"
              id="open-hyperdrift-settings-btn"
            >
              <span>⚙️ ตั้งค่าปันผลไฮเปอร์ดริฟต์</span>
            </button>
            {!showResetConfirm ? (
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer shadow-xs active:scale-95"
                id="reset-whole-game-btn"
              >
                <span>🔄 ตั้งค่าเริ่มต้นโปรแกรมใหม่</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1.5 rounded-lg animate-fade-in shadow-xs">
                <span className="text-[10px] text-rose-700 font-extrabold px-1">เริ่มใหม่?</span>
                <button
                  type="button"
                  onClick={() => {
                    onResetGame();
                    setShowResetConfirm(false);
                  }}
                  className="px-2 py-1 bg-red-600 text-white rounded font-bold text-[10px] hover:bg-red-700 cursor-pointer"
                >
                  ใช่
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded font-bold text-[10px] hover:bg-slate-50 cursor-pointer"
                >
                  ไม่ใช่
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CSS GRID MONOPOLY BOARD */}
        <div className="relative grid grid-cols-11 grid-rows-11 border-2 border-slate-300 rounded-lg overflow-hidden aspect-square bg-slate-50 p-1 pb-3 w-full shadow-md" id="millionaire-digital-board">
          
          {/* CENTER HOLE CONTENT */}
          <div className="col-start-2 col-end-11 row-start-2 row-end-11 p-4 shrink-0 flex flex-col justify-between overflow-y-auto text-slate-800 bg-slate-100 border border-slate-200 shadow-inner rounded-lg" id="board-center-dashboard">
            <div className="flex flex-col gap-3">
              {/* Turn indicator card */}
              <div className="bg-white p-4 border border-slate-200 shadow-xs rounded-lg flex items-center justify-between" id="active-turn-notifier">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full border border-black/10 flex items-center justify-center text-white text-2xl shadow animate-pulse relative"
                    style={{ 
                      backgroundColor: CHARACTER_OPTIONS.find(o => o.color === activePlayer.color)?.hex || '#ef4444',
                      boxShadow: `0 2px 8px ${CHARACTER_OPTIONS.find(o => o.color === activePlayer.color)?.shadow || 'rgba(0,0,0,0.1)'}`
                    }}
                  >
                    <span>{activePlayer.emoji}</span>
                    <span className="absolute -top-1.5 -right-1.5 text-xs bg-slate-900 border border-slate-700 p-0.5 rounded-full">👑</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-650 font-bold uppercase tracking-wider block">ถึงตาผู้เล่นคนนี้</span>
                    <h4 className="text-sm font-extrabold text-slate-900">{activePlayer.name}</h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">เงินทุนปัจจุบัน</span>
                  <span className="text-sm font-extrabold text-[#059669] font-mono">{activePlayer.money.toLocaleString()} ฿</span>
                </div>
              </div>

              {/* Action and controls depending on state */}
              <div className="flex justify-center my-1 w-full" id="active-turn-controller">
                <div className="w-full">
                  {activePlayer.inactiveTurns > 0 ? (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col gap-4 my-1 shadow-sm text-left" id="survival-pay-panel">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">🛑</span>
                        <div className="text-left">
                          <h5 className="font-extrabold text-amber-950 text-sm">คุณมีสถานะหยุดเดินคงเหลือ {activePlayer.inactiveTurns} รอบ</h5>
                          <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
                            <strong>กฎพิเศษแบ่งจ่ายสู้ชีวิต (Speedrun Rule 2):</strong> คุณสามารถจ่าย 200 บาท ต่อจำนวนรอบเพื่อขอลดโทษหยุดเดินได้ทันที หรือเลือกยอมรับการหยุดพักเพื่อประหยัดเงินสำรอง
                          </p>
                        </div>
                      </div>

                      {/* Split Payment Buttons Option */}
                      <div className="flex flex-col gap-2.5 mt-1">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none block text-left">
                          💸 เลือกแบ่งจ่ายเงินลดโทษหยุดเดิน (รอบละ 200 ฿):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {Array.from({ length: activePlayer.inactiveTurns }, (_, idx) => {
                            const turnsToPay = idx + 1;
                            const cost = turnsToPay * 200;
                            const canAfford = activePlayer.money >= cost;
                            const isAll = turnsToPay === activePlayer.inactiveTurns;
                            return (
                              <button
                                key={`pay-${turnsToPay}`}
                                type="button"
                                disabled={!canAfford}
                                onClick={() => {
                                  saveSnapshot();
                                  const nextInactiveTurns = activePlayer.inactiveTurns - turnsToPay;
                                  const updatedPlayers = players.map(p => {
                                    if (p.id === activePlayer.id) {
                                      return { 
                                        ...p, 
                                        money: p.money - cost, 
                                        inactiveTurns: nextInactiveTurns 
                                      };
                                    }
                                    return p;
                                  });
                                  setPlayers(updatedPlayers);
                                  
                                  if (nextInactiveTurns === 0) {
                                    addLog(`⚡ จ่ายเงินสู้ชีวิตสำเร็จ! ${activePlayer.name} ยอมจ่ายเงินสด ${cost} บาท แก่ธนาคาร เพื่อปลดโทษหยุดเดินทั้งหมดและเล่นต่อทันที!`, 'success');
                                    addNotification('money_out', activePlayer.id, 'ปลดโทษหยุดเดินสำเร็จ', 'เล่นต่อได้ทันที!', cost);
                                  } else {
                                    addLog(`⚡ แบ่งจ่ายสู้ชีวิต! ${activePlayer.name} ยอมจ่ายเงินสด ${cost} บาท ลดโทษลง ${turnsToPay} รอบ (เหลือหยุดเดินคงเหลือ ${nextInactiveTurns} รอบ)`, 'success');
                                    addNotification('money_out', activePlayer.id, 'แบ่งจ่ายสู้ชีวิต', `ลดโทษลง ${turnsToPay} รอบ`, cost);
                                  }
                                }}
                                className={`py-3 px-3.5 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer text-center relative ${
                                  canAfford
                                    ? isAll
                                      ? 'border-emerald-500 bg-emerald-50 hover:bg-emerald-600 text-emerald-950 hover:text-white hover:border-emerald-600 shadow-sm active:scale-95 font-black'
                                      : 'border-indigo-200 bg-white hover:bg-indigo-600 text-slate-800 hover:text-white hover:border-indigo-600 shadow-sm active:scale-95'
                                    : 'border-slate-100 bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                                }`}
                                title={canAfford ? `จ่าย ${cost} บาท เพื่อลดโทษหยุดเดินลง ${turnsToPay} รอบ` : `เงินไม่พอจ่าย ${cost} บาท`}
                              >
                                <span className="text-xs font-black font-sans flex items-center gap-1">
                                  {isAll ? '👑 ปลดโทษทั้งหมด' : `⚡ ลดโทษ -${turnsToPay} รอบ`}
                                </span>
                                <span className="text-[10.5px] font-extrabold mt-0.5 font-mono">
                                  จ่าย {cost.toLocaleString()} ฿
                                </span>
                                {isAll && canAfford && (
                                  <span className="absolute -top-2 -right-1.5 text-[8.5px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-extrabold animate-pulse uppercase tracking-wide">
                                    ROLL NOW!
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Stay stopped choice */}
                      <div className="border-t border-amber-200/50 pt-3 mt-1 flex flex-col gap-2">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none block text-left">
                          💤 หรือ เลือกหยุดพักเพื่อเซฟเงินสด:
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            saveSnapshot();
                            const nextInactiveTurns = activePlayer.inactiveTurns - 1;
                            const updatedPlayers = players.map(p => {
                              if (p.id === activePlayer.id) {
                                return { ...p, inactiveTurns: nextInactiveTurns };
                              }
                              return p;
                            });
                            setPlayers(updatedPlayers);
                            addLog(`💤 ${activePlayer.name} ยอมรับกฎหยุดเดินเพื่อพักผ่อนในรอบนี้ (เหลือสถานะหยุดเดินอีก ${nextInactiveTurns} รอบ)`, 'warn');
                            addNotification('stopped', activePlayer.id, 'ยอมรับหยุดเดิน', `พักผ่อนรอบนี้ (เหลือคงเหลือ ${nextInactiveTurns} รอบ)`);
                            
                            // Go to next turn
                            setTimeout(() => {
                              advanceTurn();
                            }, 500);
                          }}
                          className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all text-center flex items-center justify-center gap-2 active:scale-95 hover:scale-[1.01]"
                        >
                          <span>💤 ยอมหยุดเดินผ่านตานี้</span>
                          <span className="bg-amber-800 text-[10.5px] px-2.5 py-0.5 rounded-full font-sans font-bold">
                            คงเหลือ {activePlayer.inactiveTurns - 1} รอบถัดไป
                          </span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <DiceRoller 
                      onRollComplete={handleDiceRollComplete} 
                      disabled={hasRolledThisTurn || showWheel} 
                      hasRolled={hasRolledThisTurn}
                      onAdvanceTurn={advanceTurn}
                    />
                  )}
                </div>
              </div>

            </div>

            {/* Players Financial Cards in Center (Millionaire Status) */}
            <div className="mt-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-md flex flex-col gap-3 h-auto" id="live-console-feed">
              <div className="flex flex-col gap-2.5 h-auto w-full">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-1 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="p-1 px-1.5 bg-indigo-50 text-indigo-700 rounded-lg flex items-center justify-center shrink-0 border border-indigo-100/50">
                      <Users size={13} className="text-indigo-600" />
                    </span>
                    <span className="text-[11px] font-extrabold tracking-wider text-slate-800 font-sans uppercase">
                      สถานะมหาเศรษฐี & บัญชีเงินสด (Millionaire Status)
                    </span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 bg-slate-100 text-slate-500 font-bold rounded-full font-mono uppercase tracking-wider">
                    DECK LIST
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 w-full" id="players-financial-deck-center">
                  {players.map(p => {
                    const opt = CHARACTER_OPTIONS.find(o => p.color === o.color) || CHARACTER_OPTIONS[0];
                    
                    // Calculate total assets
                    const ownedStocksCount = Object.keys(ownership).filter(stockId => ownership[parseInt(stockId)]?.[p.id]);
                    const totalStockPortfolioCount = ownedStocksCount.length;

                    return (
                      <div 
                        key={p.id} 
                        className={`py-3 px-3.5 rounded-xl border-y border-r border-l-[5px] text-xs transition-all flex items-center justify-between w-full hover:shadow-xs ${
                          p.isBankrupt 
                            ? 'bg-slate-50 border-slate-200 opacity-40 select-none' 
                            : p.id === activePlayer.id
                              ? 'bg-indigo-50/40 border-slate-200/90 shadow-2xs ring-1 ring-indigo-500/10'
                              : 'bg-white border-slate-200/70 hover:border-slate-350'
                        }`}
                        style={{ borderLeftColor: opt.hex }}
                        id={`center-financial-card-${p.color}`}
                      >
                        <div className="flex items-center gap-2.5 truncate max-w-[62%]">
                          <span 
                            className="w-7 h-7 rounded-xl border border-black/10 shrink-0 shadow-xxs flex items-center justify-center text-sm"
                            style={{ backgroundColor: opt.hex }}
                          >
                            {p.emoji}
                          </span>
                          <div className="flex flex-col truncate min-w-0">
                            <span className="font-extrabold text-slate-850 truncate text-[12.5px] leading-snug">
                              {p.name}
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                              {p.isBankrupt ? (
                                <span className="text-[7.5px] px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-extrabold uppercase font-sans">ล้มละลาย</span>
                              ) : p.id === activePlayer.id ? (
                                <span className="text-[7.5px] px-1.5 py-0.2 bg-indigo-600 text-white rounded-md font-extrabold flex items-center gap-0.5 animate-pulse uppercase font-sans">
                                  <Sparkles size={7} className="fill-white" /> ตาของคุณ
                                </span>
                              ) : p.inactiveTurns > 0 ? (
                                <span className="text-[7.5px] bg-amber-50 text-amber-705 border border-amber-200 px-1.5 py-0.2 rounded-md font-extrabold uppercase font-sans">หยุด {p.inactiveTurns} ตา</span>
                              ) : (
                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider font-sans">ACTIVE PLAYER</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-slate-400 font-extrabold text-[10px] bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full select-none">
                            พอร์ต <strong className="text-indigo-600">{totalStockPortfolioCount}</strong> บ.
                          </span>
                          <div className="bg-emerald-50 border border-emerald-200/70 text-[#047857] px-3 py-1 rounded-xl text-[13.5px] font-extrabold tracking-tight shadow-3xs font-mono flex items-center gap-0.5 select-none">
                            <span>{p.isBankrupt ? '0' : p.money.toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-emerald-800 ml-0.5">฿</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* RENDER BOARD TILES */}
          {BOARD_TILES.map((tile) => {
            const coords = TILE_COORDS[tile.index] || { col: 1, row: 1 };
            // Find players currently on this space
            const playersOnTile = players.filter(p => p.position === tile.index && !p.isBankrupt);

            // Fetch ownership dots
            const ownersOfStock = tile.type === 'STOCK' && tile.stockId && ownership[tile.stockId]
              ? Object.keys(ownership[tile.stockId])
              : [];

            const stockDetail = tile.type === 'STOCK' && tile.stockId 
              ? STOCKS_DATA.find(s => s.id === tile.stockId) 
              : null;

            const isCorner = tile.type === 'START' || tile.type.startsWith('PRISON');

            const isStockTile = tile.type === 'STOCK';
            const isOwnedBySelectedFilter = selectedOwner && tile.stockId 
              ? (ownership[tile.stockId]?.[selectedOwner] || 0) > 0 
              : false;

            const isFilterActive = selectedOwner !== null;
            const isDimmed = isFilterActive && (!isStockTile || !isOwnedBySelectedFilter);
            
            const filterOwnerPlayer = selectedOwner ? players.find(p => p.id === selectedOwner) : null;
            const filterOwnerOpt = filterOwnerPlayer 
              ? CHARACTER_OPTIONS.find(o => o.color === filterOwnerPlayer.color) || CHARACTER_OPTIONS[0]
              : null;

            const tilePaddingClass = (tile.type === 'START' || tile.stockId)
              ? (ownersOfStock.length > 0 ? 'pt-[38px] sm:pt-[44px] px-1 pb-1' : 'pt-[24px] sm:pt-[28px] px-1.5 pb-1.5')
              : 'p-1.5';

            return (
              <div
                key={tile.index}
                onClick={() => {
                  if (tile.type === 'STOCK' && tile.stockId) {
                    const stObj = STOCKS_DATA.find(x => x.id === tile.stockId);
                    if (stObj) {
                      setSelectedStock(stObj);
                    }
                  } else {
                    addLog(`[สำรวจช่อง] ${tile.name}: ${tile.effectDescription}`, 'info');
                  }
                }}
                className={`border text-[10px] ${tilePaddingClass} flex flex-col justify-between items-center select-none cursor-pointer group rounded-md relative transition-all duration-300 ${
                  isDimmed 
                    ? 'opacity-20 grayscale-[40%] scale-95 border-slate-200 shadow-none' 
                    : isOwnedBySelectedFilter
                      ? 'ring-4 border-transparent shadow-xl animate-pulse-subtle'
                      : tile.type === 'STOCK'
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400'
                        : 'bg-rose-50 text-rose-950 border-rose-300 hover:bg-rose-100 hover:border-rose-400'
                } ${
                  isCorner 
                    ? 'font-extrabold ring-1 ring-rose-300 shadow-xs' 
                    : 'hover:shadow-md hover:-translate-y-0.5 active:scale-97 duration-200'
                }`}
                style={{
                  gridColumn: coords.col,
                  gridRow: coords.row,
                  minWidth: 0,
                  minHeight: 0,
                  ...(isOwnedBySelectedFilter && filterOwnerOpt ? {
                    borderColor: filterOwnerOpt.hex,
                    boxShadow: `0 0 25px ${filterOwnerOpt.hex}, inset 0 0 12px ${filterOwnerOpt.hex}`,
                    borderWidth: '3.5px',
                    transform: 'scale(1.06)',
                    zIndex: 30,
                    backgroundColor: '#fff'
                  } : {})
                }}
                id={`board-tile-${tile.index}`}
                title={`${tile.name}: ${tile.effectDescription}${stockDetail ? ` (ปันผล ${stockDetail.ratePercent}%)` : ''}`}
              >
                {/* 1. TOP CONTAINER: Stock badge prefix and Owner share count badges (Absolutely positioned at the top) */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-0.5 w-full max-w-[95%] pointer-events-none" id="tile-top-container">
                  {(tile.type === 'START' || tile.stockId) && (
                    <div className="w-full flex justify-center" id="tile-badge-prefix">
                      <span className="font-sans text-[10px] font-black tracking-tight text-indigo-950 bg-white/95 px-2 py-0.5 rounded-full border border-slate-300 shadow-xxs shrink-0">
                        {tile.type === 'START' ? '🏁 START' : `หุ้น ${tile.stockId}`}
                      </span>
                    </div>
                  )}

                  {/* 5. TOP CENTER: Custom Owner share count block */}
                  {ownersOfStock.length > 0 && (
                    <div className="flex gap-1 justify-center items-center w-full shrink-0" id="tile-owners-badge">
                      {ownersOfStock.map(oId => {
                        const p = players.find(x => x.id === oId);
                        const opt = CHARACTER_OPTIONS.find(o => o.color === p?.color) || CHARACTER_OPTIONS[0];
                        const shares = ownership[tile.stockId!]?.[oId] || 0;
                        return (
                          <div 
                            key={oId} 
                            className="flex items-center gap-1 font-mono text-[13px] sm:text-[15px] font-black text-slate-850 bg-white/95 border border-slate-300 py-1 px-2.5 rounded-md shadow-xxs shrink-0" 
                            title={`${p?.name} ถือหุ้นอยู่ ${shares} หุ้น`}
                          >
                            <span className="text-slate-700">{shares} {p?.emoji}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2. DYNAMIC THEMED LUCIDE ICON */}
                <div className="my-[4px] flex items-center justify-center shrink-0">
                  {getTileIcon(tile)}
                </div>

                {/* 3. TILE NAME: Wrap text without truncate */}
                <div 
                  className={`text-[9.5px] leading-snug font-black tracking-tight text-center text-wrap break-words max-w-full px-0.5 flex-1 flex items-center justify-center ${
                    isCorner ? 'text-indigo-950 font-black' : 'text-slate-800'
                  }`}
                >
                  {tile.name}
                </div>

                {/* (4. Dividend overlay removed as requested) */}

                {/* 6. CENTER FLOATING PAWNS OVERLAY (FLUID & ALWAYS CENTERED ON TOP OF ICON/THEME) */}
                {playersOnTile.length > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-indigo-900/5 backdrop-blur-[0.2px] z-10 p-0.5 rounded-md pointer-events-none">
                    <div className="flex gap-1 flex-wrap justify-center items-center pointer-events-auto">
                      {playersOnTile.map(p => {
                        const opt = CHARACTER_OPTIONS.find(o => o.color === p.color) || CHARACTER_OPTIONS[0];
                        return (
                          <motion.div
                            key={p.id}
                            layoutId={`pawn_${p.id}`}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white flex items-center justify-center text-sm sm:text-base shadow-lg shrink-0 select-none relative hover:scale-115 active:scale-95 duration-200"
                            style={{ 
                              backgroundColor: opt.hex,
                              boxShadow: `0 4px 8px ${opt.shadow}`
                            }}
                            title={`${p.name} อยู่ที่นี่`}
                          >
                            {p.emoji}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: BANKER TOOLKIT & STAT PANELS */}
      <div className="w-full xl:w-96 bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col gap-6" id="bank-administration-dock">
        <div>
          <h2 className="text-xl font-extrabold text-indigo-950 flex items-center gap-2 mb-1.5 font-sans uppercase">
            <Landmark size={18} /> ระบบควบคุมธนาคารกลาง (Banker)
          </h2>
          <p className="text-xs text-slate-500">
            ปรับปรุงงบประมาณทางการเงิน, การจ่ายชำระเงินโอน และจัดการระบบการเล่นหลักทรัพย์
          </p>
        </div>

        {/* Banker Adjustments Accordion */}
        <div className="border-t border-slate-200 pt-5">
          <BankControls
            players={players}
            stocks={STOCKS_DATA}
            ownership={ownership}
            onModifyMoney={handleModifyMoney}
            onTransferMoney={handleTransferMoney}
            onResetGame={onResetGame}
            onDeclareBankruptcy={handleDeclareBankruptcy}
            onSelectStock={(st) => setSelectedStock(st)}
          />
        </div>
      </div>

      {/* DETAILED STOCK MODAL INTERACTION */}
      {selectedStock && (
        <StockInfoModal
          stock={selectedStock}
          players={players}
          ownership={ownership}
          onClose={() => setSelectedStock(null)}
          onBuyShares={handleBuyShares}
          onSellShares={handleSellShares}
          onPayDividend={handlePayDividend}
          onTransferStockOwnership={handleTransferStockOwnership}
          onReassignStockOwner={handleReassignStockOwner}
        />
      )}

      {/* INTERACTIVE STOCK FILTER POPUP MODAL */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 25 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-250 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
              id="map-filter-popup-modal"
            >
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/30">
                    <Filter size={18} className="text-indigo-300 animate-pulse" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight font-sans">
                      ตัวคัดกรองหุ้นแผนที่และควบคุมสิทธิ์ด่วน
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium font-sans">
                      เลือกผู้เล่นเพื่อไฮไลท์บริษัทบนกระดาน และปรับแต่งสิทธิ์ปันผล / โอนหุ้น
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowFilterModal(false);
                    setReassigningStockId(null);
                    setReassigningFromPlayerId(null);
                  }}
                  className="p-1.5 bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white rounded-lg transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 flex flex-col gap-5 overflow-y-auto flex-1 bg-slate-50">
                {/* Filter Selector Bar */}
                <div className="flex flex-col gap-2">
                  <span className="block text-[10.5px] text-slate-400 font-extrabold uppercase tracking-wider">
                    👤 เลือกผู้ถือหุ้นเพื่อคัดกรองและแสดงผลบนแผนที่
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {/* [ All Stocks Option ] */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOwner(null);
                        setReassigningStockId(null);
                        setReassigningFromPlayerId(null);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-xxs ${
                        selectedOwner === null
                          ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/15'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-[11px]">🟢</span> ทั้งหมด (แสดงปกติ)
                    </button>

                    {/* Players List */}
                    {players
                      .filter(p => !p.isBankrupt)
                      .map(p => {
                        const opt = CHARACTER_OPTIONS.find(o => o.color === p.color) || CHARACTER_OPTIONS[0];
                        const isSelected = selectedOwner === p.id;
                        const ownedCount = Object.keys(ownership).filter(stId => (ownership[parseInt(stId)]?.[p.id] || 0) > 0).length;

                        return (
                          <button
                            key={`modal-filter-${p.id}`}
                            type="button"
                            onClick={() => {
                              setSelectedOwner(isSelected ? null : p.id);
                              setReassigningStockId(null);
                              setReassigningFromPlayerId(null);
                            }}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shadow-xxs ${
                              isSelected
                                ? 'text-white font-black'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                            style={{
                              backgroundColor: isSelected ? opt.hex : undefined,
                              borderColor: isSelected ? opt.hex : undefined,
                            }}
                          >
                            <span className="text-[14px] leading-none shrink-0">{p.emoji}</span>
                            <span>{p.name}</span>
                            <span className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-sans font-extrabold ${
                              isSelected ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {ownedCount} หุ้น
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>

                {/* Filter Visual State Alert */}
                {selectedOwner && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 shadow-3xs">
                    <Sparkles className="text-amber-600 shrink-0 mt-0.5 animate-pulse" size={16} />
                    <div className="text-xs text-amber-900 leading-normal">
                      ระบบกำลัง <strong className="font-extrabold text-amber-950 font-sans">"ไฮไลท์กล่องบริษัท"</strong> ของ 
                      <span className="font-extrabold"> {players.find(p => p.id === selectedOwner)?.emoji} {players.find(p => p.id === selectedOwner)?.name}</span> 
                      บนแผนที่กระดานด้วยวงแสงออร่าของสีหลัก และทำการหรี่แสงช่องอื่นๆ ลงชั่วคราว
                    </div>
                  </div>
                )}

                {/* Stocks list with responsive grid layout inside modal */}
                <div className="flex flex-col gap-3">
                  <span className="block text-[10.5px] text-slate-400 font-extrabold uppercase tracking-wider">
                    📋 รายการหลักทรัพย์ที่เข้าข่ายเงื่อนไข ({
                      (selectedOwner
                        ? STOCKS_DATA.filter(stock => (ownership[stock.id]?.[selectedOwner] || 0) > 0)
                        : STOCKS_DATA
                      ).length
                    } บริษัท)
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[42vh] overflow-y-auto pr-1" id="modal-stock-grid-container">
                    {(selectedOwner
                      ? STOCKS_DATA.filter(stock => (ownership[stock.id]?.[selectedOwner] || 0) > 0)
                      : STOCKS_DATA
                    ).length === 0 ? (
                      <div className="col-span-full text-center py-10 text-slate-500 text-xs bg-white border border-slate-200 border-dashed rounded-xl">
                        ไม่มีหุ้นในครอบครองของตัวละครนี้ในระบบขณะนี้
                      </div>
                    ) : (
                      (selectedOwner
                        ? STOCKS_DATA.filter(stock => (ownership[stock.id]?.[selectedOwner] || 0) > 0)
                        : STOCKS_DATA
                      ).map(stock => {
                        const stockOwnersMap = ownership[stock.id] || {};
                        const ownersOfThisStock = Object.keys(stockOwnersMap).filter(pId => stockOwnersMap[pId] > 0);

                        return (
                          <div 
                            key={`modal-stock-card-${stock.id}`}
                            onClick={() => {
                              // Close filter and open detailed info modal
                              setShowFilterModal(false);
                              setSelectedStock(stock);
                            }}
                            className="bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-4 shadow-3xs hover:shadow-2xs transition-all flex flex-col gap-3 cursor-pointer group hover:-translate-y-0.5 duration-150"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-150 shrink-0">
                                  หุ้น {stock.id}
                                </span>
                                <h4 className="text-xs font-black text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors">
                                  {stock.name}
                                </h4>
                              </div>
                              <span className="text-[9px] text-slate-400 font-bold bg-slate-50 border border-slate-100 px-1.5 py-0.2 rounded-full">
                                ปันผล {stock.ratePercent}%
                              </span>
                            </div>

                            {/* Owners & Dividends Inside Card */}
                            <div className="flex flex-col gap-2">
                              {ownersOfThisStock.length === 0 ? (
                                <span className="text-[10px] text-slate-400 italic font-sans block">
                                  🚫 ยังไม่มีเจ้าของครอบครอง
                                </span>
                              ) : (
                                ownersOfThisStock.map(ownerId => {
                                  const ownerObj = players.find(p => p.id === ownerId);
                                  if (!ownerObj) return null;

                                  const opt = CHARACTER_OPTIONS.find(o => o.color === ownerObj.color) || CHARACTER_OPTIONS[0];
                                  const sharesCount = stockOwnersMap[ownerId] || 0;
                                  const ownerLap = ownerObj.lapCount || 1;

                                  // Dividend calculations
                                  const sharePriceObj = stock.pricings.find(x => x.shares === sharesCount);
                                  const ownsAllShares = ownersOfThisStock.length === 1 && sharesCount === 4;
                                  const bonusMul = ownsAllShares ? 2 : 1;
                                  const defaultPayout = sharePriceObj ? sharePriceObj.payout * bonusMul : 0;
                                  const normalDividend = calculateProgressivePayout(defaultPayout, ownerLap);

                                  const isReassigningThis = reassigningStockId === stock.id && reassigningFromPlayerId === ownerId;

                                  return (
                                    <div 
                                      key={`modal-card-owner-${ownerId}`} 
                                      onClick={(e) => e.stopPropagation()} // Stop modal clicking
                                      className="bg-slate-50 border border-slate-150 rounded-lg p-2.5 flex flex-col gap-2"
                                    >
                                      <div className="flex items-center justify-between flex-wrap gap-1">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                          <span 
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white shrink-0"
                                            style={{ backgroundColor: opt.hex }}
                                          >
                                            {ownerObj.emoji}
                                          </span>
                                          <span className="text-[11px] font-bold text-slate-850 truncate">
                                            {ownerObj.name} <span className="text-[9.5px] text-slate-400 font-normal">({sharesCount} หุ้น, รอบ {ownerLap})</span>
                                          </span>
                                        </div>
                                        
                                        {!isReassigningThis && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setReassigningStockId(stock.id);
                                              setReassigningFromPlayerId(ownerId);
                                            }}
                                            className="text-[9px] bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-150 hover:border-indigo-600 px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-0.5 active:scale-95 shrink-0 animate-fade-in"
                                          >
                                            🔁 ย้ายผู้ถือ
                                          </button>
                                        )}
                                      </div>

                                      {/* Dividends Grid inside card */}
                                      <div className="grid grid-cols-2 gap-1.5 border-t border-slate-200/50 pt-2 text-center">
                                        <div className="bg-white border border-slate-150 p-1 rounded flex flex-col">
                                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">ปันผลฐาน</span>
                                          <span className="text-[11px] font-black text-slate-600 font-mono">
                                            {defaultPayout.toLocaleString()} ฿
                                          </span>
                                        </div>
                                        <div className="bg-amber-50/40 border border-amber-200/50 p-1 rounded flex flex-col">
                                          <span className="text-[8px] text-amber-700 font-bold uppercase tracking-wider font-sans">ปันผลไฮเปอร์ดริฟต์</span>
                                          <span className="text-[11px] font-black text-amber-850 font-mono">
                                            {normalDividend.toLocaleString()} ฿
                                          </span>
                                        </div>
                                      </div>

                                      {/* Reassign owner dropdown panel */}
                                      {isReassigningThis && (
                                        <div className="mt-2 p-2 bg-indigo-50 border border-indigo-150 rounded-lg flex flex-col gap-1.5 animate-fade-in text-left">
                                          <span className="text-[9px] font-bold text-indigo-950 block">
                                            👑 เลือกโอนสิทธิ์หุ้นทั้งหมดให้กับ:
                                          </span>
                                          <div className="grid grid-cols-2 gap-1">
                                            {players
                                              .filter(p => !p.isBankrupt && p.id !== ownerId)
                                              .map(p => (
                                                <button
                                                  key={`modal-target-${p.id}`}
                                                  type="button"
                                                  onClick={() => {
                                                    handleReassignStockOwner(stock.id, ownerId, p.id);
                                                    setReassigningStockId(null);
                                                    setReassigningFromPlayerId(null);
                                                  }}
                                                  className="py-1 px-1 bg-white hover:bg-indigo-600 text-slate-750 hover:text-white border border-slate-200 hover:border-indigo-600 rounded text-[9.5px] font-bold cursor-pointer transition-all truncate text-center"
                                                >
                                                  {p.emoji} {p.name}
                                                </button>
                                              ))}
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setReassigningStockId(null);
                                              setReassigningFromPlayerId(null);
                                            }}
                                            className="text-[8.5px] text-slate-500 hover:text-rose-600 text-center underline font-semibold mt-0.5"
                                          >
                                            ยกเลิก
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center shrink-0">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                  * คลิกที่กล่องบริษัทเพื่อเปิดหน้ารายละเอียดเต็มรูปแบบ
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowFilterModal(false);
                    setReassigningStockId(null);
                    setReassigningFromPlayerId(null);
                  }}
                  className="px-5 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition duration-150 cursor-pointer"
                >
                  เรียบร้อย
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN WHEEL OF FORTUNE POPUP MODAL */}
      <AnimatePresence>
        {showWheel && (
          <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 320 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col relative"
              id="spin-overlay-container"
            >
              {/* Decorative top dynamic neon gradient bar */}
              <div className="h-3 bg-gradient-to-r from-teal-400 via-indigo-600 via-purple-600 via-pink-500 to-amber-400 w-full animate-pulse" />
              
              <div className="p-6 md:p-8 flex flex-col items-center">
                {wheelPendingPlayerId && (
                  <div className="mb-4 flex items-center gap-3 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full shadow-xs">
                    <span className="text-2xl animate-bounce">{players.find(p => p.id === wheelPendingPlayerId)?.emoji}</span>
                    <span className="text-xs font-black text-indigo-950">
                      สิทธิ์สุ่มโชคของคุณ: <span className="text-sm text-indigo-700 font-extrabold">{players.find(p => p.id === wheelPendingPlayerId)?.name}</span>
                    </span>
                  </div>
                )}
                
                <div className="w-full">
                  <WheelSpinner onSpinComplete={handleWheelSpinComplete} isSuperBonus={wheelSuperBonus} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SPECIAL FINANCE LANDING BILL/POPUP MODAL */}
      <AnimatePresence>
        {pendingPaymentTile && pendingPaymentPlayerId && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl border border-rose-100 max-w-lg w-full overflow-hidden flex flex-col"
              id="special-payment-invoice-popup"
            >
              {/* Header with vibrant warning style */}
              <div className="bg-gradient-to-r from-rose-500 to-amber-500 p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
                    <TrendingDown size={20} className="text-white" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base tracking-tight font-sans">ใบแจ้งหนี้ค่าใช้จ่ายพิเศษ</h3>
                    <p className="text-[10px] text-white/85">ตกในช่องระบบการแลกเปลี่ยนพิเศษ</p>
                  </div>
                </div>
                <span className="text-[10px] bg-black/20 text-white font-mono px-2.5 py-1 rounded-full uppercase font-bold">
                  Invoice Required
                </span>
              </div>

              {/* Main content body */}
              <div className="p-6 flex flex-col gap-5">
                {/* Visual detail of the landing space */}
                <div className="bg-rose-50/50 border border-rose-100/70 p-4 rounded-xl flex items-start gap-3">
                  <span className="text-3xl p-1 bg-white border border-rose-200 rounded-xl shadow-xs shrink-0 animate-bounce">
                    ✈️
                  </span>
                  <div>
                    <span className="text-[10px] text-rose-600 font-extrabold tracking-wider uppercase block">
                      ใบเสร็จการแวะจอด
                    </span>
                    <h4 className="text-md font-black text-slate-900 mb-0.5">{pendingPaymentTile.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{pendingPaymentTile.effectDescription}</p>
                  </div>
                </div>

                {/* Bill Amount vs Cash balance */}
                {(() => {
                  const billPlayer = players.find(p => p.id === pendingPaymentPlayerId);
                  if (!billPlayer) return null;
                  const billCost = pendingPaymentTile.cost || 0;
                  const canAfford = billPlayer.money >= billCost;

                  // Find quick sell shares list
                  const playerOwnedSecurities: Array<{ stockId: number; name: string; sharesCount: number; refund: number }> = [];
                  Object.entries(ownership).forEach(([stIdStr, ownersMap]) => {
                    const stockId = parseInt(stIdStr);
                    const sharesCount = ownersMap[pendingPaymentPlayerId] || 0;
                    if (sharesCount > 0) {
                      const stObj = STOCKS_DATA.find(s => s.id === stockId);
                      if (stObj) {
                        const singleSharePrice = stObj.pricings.find(x => x.shares === 1)?.price || 500;
                        const refund = Math.floor(singleSharePrice * 0.5);
                        playerOwnedSecurities.push({
                          stockId,
                          name: stObj.name,
                          sharesCount,
                          refund
                        });
                      }
                    }
                  });

                  return (
                    <div className="flex flex-col gap-4">
                      {/* Cost vs Cash Balance Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                          <span className="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">
                            จำนวนเงินชำระ
                          </span>
                          <span className="text-lg font-black text-rose-600 font-mono">
                            {billCost.toLocaleString()} ฿
                          </span>
                        </div>
                        <div className={`p-3 rounded-lg border text-center ${canAfford ? 'bg-emerald-50/50 border-emerald-100' : 'bg-red-50/50 border-red-100'}`}>
                          <span className="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase tracking-wider">
                            เงินสดปัจจุบัน ({billPlayer.emoji} {billPlayer.name})
                          </span>
                          <span className={`text-lg font-black font-mono ${canAfford ? 'text-emerald-600' : 'text-red-600 animate-pulse'}`}>
                            {billPlayer.money.toLocaleString()} ฿
                          </span>
                        </div>
                      </div>

                      {/* Not enough funds warnings */}
                      {!canAfford && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5">
                          <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                          <div className="text-xs text-amber-900 leading-normal">
                            <span className="font-extrabold block mb-0.5">⚠️ สภาพคล่องไม่เพียงพอจ่ายชำระเต็มจำนวน</span>
                            ขัดสนสะสมเงินสด! ท่านต้องปรับแก้เงินผู้เล่น, ชำระแล้วยอมติดตัวติดลบ หรือคลิก <span className="font-bold underline text-rose-705">ขายหุ้นด่วน</span> ด้านล่างนี้เพื่อเพิ่มทุนสดก่อนกดผ่าชำระทรัพย์สิน
                          </div>
                        </div>
                      )}

                      {/* Quick Sell Share Panel if they own stocks */}
                      {playerOwnedSecurities.length > 0 && (
                        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col gap-2">
                          <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase block">
                            ถอนหลักทรัพย์ช่วยเหลือด่วน (ขายคืนคุณครึ่งราคา)
                          </span>
                          <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
                            {playerOwnedSecurities.map(sec => (
                              <div key={sec.stockId} className="flex justify-between items-center bg-white p-2 border border-slate-200/80 rounded-md shadow-xxs">
                                <div>
                                  <span className="text-[11px] font-bold text-slate-800">{sec.name}</span>
                                  <span className="text-[10px] text-slate-400 ml-1.5 block sm:inline">(ถือ {sec.sharesCount} หุ้น)</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleQuickSellShare(sec.stockId)}
                                  className="text-[10px] bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-250 rounded px-2.5 py-1 font-bold active:scale-95 duration-100"
                                >
                                  ขาย 1 หุ้น (+{sec.refund.toLocaleString()} ฿)
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Control Settle Buttons */}
                      <div className="flex gap-2.5 mt-2">
                        <button
                          type="button"
                          onClick={handleBankruptcyInPayment}
                          className="flex-1 py-2.5 text-xs font-bold text-slate-650 hover:text-rose-700 border border-slate-200 bg-white hover:bg-rose-50/40 rounded-xl transition duration-200"
                        >
                          💀 ประกาศล้มละลาย
                        </button>
                        <button
                          type="button"
                          onClick={handlePaySpecialFinance}
                          className="flex-[2] py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 active:translate-y-0- translate-y-0 transform duration-150 flex items-center justify-center gap-1.5"
                        >
                          💰 ยอมจ่ายยอดปรับ ({billCost.toLocaleString()} บาท)
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </div>
        )}

        {showSettingsModal && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto animate-fade-in" id="hyperdrift-settings-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-150 w-full max-w-md overflow-hidden text-slate-800"
              id="hyperdrift-settings-modal-card"
            >
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚙️</span>
                  <div>
                    <h3 className="font-extrabold text-sm tracking-tight font-sans">ตั้งค่าปันผลระบบไฮเปอร์ดริฟต์</h3>
                    <p className="text-[10px] text-amber-100 font-medium">Hyper-Drift Dividend Configuration</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="p-1.5 hover:bg-white/20 rounded-lg text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="bg-amber-50 border border-amber-200/50 p-3 rounded-xl text-amber-900 text-xs flex gap-2.5">
                  <span className="text-base shrink-0">📈</span>
                  <div className="leading-relaxed">
                    ปรับแต่งเรตการคำนวณ ความแรง และการทอยของระบบปันผล เพื่อให้เหมาะกับการตั้งราคาในสไตล์การเล่นของคุณเอง
                  </div>
                </div>

                <div className="space-y-3.5">
                  {/* 1. Base Rate */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                      <span>1. ตัวคูณเริ่มต้นรอบแรก (Base Rate)</span>
                      <span className="text-amber-700 font-mono font-black">{settingsForm.baseRate}x</span>
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={settingsForm.baseRate}
                      onChange={(e) => setSettingsForm({ ...settingsForm, baseRate: parseFloat(e.target.value) })}
                      className="w-full accent-amber-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-slate-400 font-bold px-0.5 mt-0.5">
                      <span>0.5x (ต่ำมาก)</span>
                      <span>1.5x (ปกติ)</span>
                      <span>5.0x (บ้าคลั่ง)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* 3. Floor Limit */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        2. เกณฑ์ขั้นต่ำดักเบรก
                      </label>
                      <input
                        type="number"
                        min="100"
                        max="10000"
                        step="100"
                        value={settingsForm.floorLimit}
                        onChange={(e) => setSettingsForm({ ...settingsForm, floorLimit: parseInt(e.target.value) || 1000 })}
                        className="w-full text-xs font-bold font-mono px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* 4. Small Multiplier */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        3. ตัวคูณหุ้นเล็ก (ทบ)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        step="0.5"
                        value={settingsForm.smallMultiplier}
                        onChange={(e) => setSettingsForm({ ...settingsForm, smallMultiplier: parseFloat(e.target.value) || 3 })}
                        className="w-full text-xs font-bold font-mono px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* 5. Rounding Mode */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      4. โหมดการปัดเศษปันผลสุทธิ
                    </label>
                    <select
                      value={settingsForm.roundingMode}
                      onChange={(e) => setSettingsForm({ ...settingsForm, roundingMode: e.target.value as any })}
                      className="w-full text-xs font-bold px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="unit">ปัดเศษหลักหน่วยลงเป็น 0 (เช่น 1,234 ฿ ➡️ 1,230 ฿)</option>
                      <option value="ten">ปัดเศษหลักสิบลงเป็น 0 (เช่น 1,234 ฿ ➡️ 1,200 ฿)</option>
                      <option value="none">ไม่ปัดเศษเลย (เฉพาะจำนวนเต็ม)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 border-t border-slate-150 p-4 flex gap-2.5 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const defaultSettings = {
                      baseRate: 1.5,
                      floorLimit: 1000,
                      smallMultiplier: 3,
                      roundingMode: 'unit' as const
                    };
                    setSettingsForm(defaultSettings);
                  }}
                  className="px-3.5 py-2 text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl transition duration-150 cursor-pointer"
                >
                  คืนค่าเริ่มต้นของระบบ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    saveHyperDriftSettings(settingsForm);
                    addLog('⚙️ [ระบบ] บันทึกการตั้งค่าปันผลไฮเปอร์ดริฟต์ใหม่เรียบร้อยแล้ว!', 'success');
                    setShowSettingsModal(false);
                  }}
                  className="px-4 py-2 text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-md shadow-amber-600/10 hover:shadow-amber-600/20 active:scale-95 transition duration-150 flex items-center gap-1 cursor-pointer"
                >
                  💾 บันทึกการตั้งค่า
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
