/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Player, StockDetail, StockOwnership } from '../types';
import { CHARACTER_OPTIONS, BOARD_TILES, calculateProgressivePayout, STOCKS_DATA, getHyperDriftRate } from '../data';
import { Landmark, TrendingUp, HandCoins, UserPlus, X, HeartHandshake, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface StockInfoModalProps {
  stock: StockDetail;
  players: Player[];
  ownership: StockOwnership;
  onClose: () => void;
  onBuyShares: (playerId: string, sharesCount: number) => void;
  onSellShares: (playerId: string, sharesCount: number) => void;
  onPayDividend: (fromPlayerId: string) => void;
  onTransferStockOwnership?: (
    fromPlayerId: string,
    toPlayerId: string,
    transferStockId: number,
    sharesToTransfer: number,
    cashAdjustment: number
  ) => void;
  onReassignStockOwner?: (stockId: number, fromPlayerId: string, toPlayerId: string) => void;
}

export default function StockInfoModal({
  stock,
  players,
  ownership,
  onClose,
  onBuyShares,
  onSellShares,
  onPayDividend,
  onTransferStockOwnership,
  onReassignStockOwner
}: StockInfoModalProps) {
  const [activeSettlementDebtorId, setActiveSettlementDebtorId] = useState<string | null>(null);
  const [reassigningFromPlayerId, setReassigningFromPlayerId] = useState<string | null>(null);
  // Get current owners of this stock
  const stockOwners = ownership[stock.id] ? Object.keys(ownership[stock.id]) : [];
  const totalSharesOwned = stockOwners.reduce((sum, pId) => sum + (ownership[stock.id]?.[pId] || 0), 0);
  const remainingShares = 4 - totalSharesOwned;

  // Find corresponding board tile to check who is standing on it
  const stockTile = BOARD_TILES.find(t => t.type === 'STOCK' && t.stockId === stock.id);
  const playersOnStockTile = stockTile
    ? players.filter(p => p.position === stockTile.index && !p.isBankrupt)
    : [];

  const getPlayerDisplay = (pId: string) => {
    const p = players.find(x => x.id === pId);
    if (!p) return null;
    const opt = CHARACTER_OPTIONS.find(o => o.color === p.color);
    return { name: p.name, colorHex: opt?.hex || '#ccc', playerObj: p };
  };

  const getSuperBonusMultiplier = () => {
    // Super Bonus = 1 owner owns all 4 shares -> payout becomes 2x
    if (stockOwners.length === 1 && ownership[stock.id]?.[stockOwners[0]] === 4) {
      return 2;
    }
    return 1;
  };

  const isCoOwned = stockOwners.length > 1;
  const isSingleOwned = stockOwners.length === 1;
  const bonusMultiplier = getSuperBonusMultiplier();

  const ownersMap = ownership[stock.id] || {};
  const creditorIds = stockOwners.filter(id => id !== activeSettlementDebtorId);

  // Calculate total dividend deductions owed to other co-owners of this stock
  let totalDeductions = 0;
  if (activeSettlementDebtorId) {
    creditorIds.forEach(cId => {
      const sharesNum = ownersMap[cId];
      const defaultPayout = stock.pricings.find(x => x.shares === sharesNum)?.payout || 0;
      const basePayout = defaultPayout * bonusMultiplier;
      const creditorObj = players.find(p => p.id === cId);
      const creditorLap = creditorObj ? creditorObj.lapCount || 1 : 1;
      totalDeductions += calculateProgressivePayout(basePayout, creditorLap);
    });
  }

  // Find other stocks owned by debtor
  const debtorOwnedStocks: { stock: StockDetail; shares: number; value: number }[] = [];
  if (activeSettlementDebtorId) {
    STOCKS_DATA.forEach(s => {
      if (s.id === stock.id) return; // Skip current stock to avoid circular transfer
      const shares = ownership[s.id]?.[activeSettlementDebtorId] || 0;
      if (shares > 0) {
        const value = s.pricings.find(p => p.shares === shares)?.price || 0;
        debtorOwnedStocks.push({ stock: s, shares, value });
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="stock-modal-backdrop">
      <div className="bg-white border border-slate-200 max-w-lg w-full rounded-lg shadow-xl overflow-hidden relative text-slate-800 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-50 p-5 px-6 border-b border-slate-200 flex justify-between items-center" id="stock-modal-header">
          <div className="flex items-center gap-2.5">
            <div className="bg-indigo-50 p-2 rounded text-indigo-600 border border-indigo-200/50">
              <Landmark size={20} />
            </div>
            <div>
              <h2 className="text-[17px] font-extrabold text-indigo-950 flex items-center gap-2 font-sans uppercase tracking-tight">
                ใบร่วมลงทุนหลักทรัพย์หุ้นที่ {stock.id}: {stock.name}
              </h2>
              <div className="mt-1 flex">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xxs">
                  <TrendingUp size={12} className="text-emerald-600 animate-pulse" />
                  อัตรากำไรปันผลพื้นฐาน {stock.ratePercent}%
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 bg-white hover:bg-slate-100 hover:text-slate-800 text-slate-500 transition-all rounded border border-slate-200 cursor-pointer"
            id="modal-close-icon-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6" id="stock-modal-body">
          {activeSettlementDebtorId ? (
            <div className="flex flex-col gap-5 text-left animate-fade-in" id="settlement-container">
              {/* Header info */}
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-rose-700 font-extrabold uppercase tracking-wider font-sans">ช่องทางการเคลียร์หนี้ค่าปันผล</span>
                  <button
                    onClick={() => setActiveSettlementDebtorId(null)}
                    className="text-xs text-slate-500 hover:text-slate-850 underline transition-all font-bold cursor-pointer"
                  >
                    ย้อนกลับ
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-slate-200 border border-black/10 flex items-center justify-center text-sm shrink-0">
                    {players.find(p => p.id === activeSettlementDebtorId)?.emoji}
                  </span>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">
                      {players.find(p => p.id === activeSettlementDebtorId)?.name} (ผู้ตกช่องหุ้น)
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium font-sans">
                      เงินสดคงเหลือ: <strong className="text-[#059669]">{(players.find(p => p.id === activeSettlementDebtorId)?.money || 0).toLocaleString()} บาท</strong>
                    </span>
                  </div>
                </div>
                <div className="border-t border-rose-200/50 pt-2.5 flex items-center justify-between text-xs">
                  <span className="text-rose-900 font-semibold font-sans">ยอดหนี้ค่าปันผลที่ต้องชำระ:</span>
                  <span className="font-black text-rose-700 font-mono text-base">{totalDeductions.toLocaleString()} บาท</span>
                </div>
              </div>

              {/* Option 1: Cash payment */}
              <div className="border border-slate-200/80 rounded-xl p-4 flex flex-col gap-2.5 bg-white shadow-xxs">
                <span className="text-xs text-slate-700 font-extrabold uppercase tracking-wide font-sans">💵 ช่องทางที่ 1: ชำระด้วยเงินสด</span>
                <button
                  onClick={() => {
                    onPayDividend(activeSettlementDebtorId);
                    setActiveSettlementDebtorId(null);
                  }}
                  disabled={(players.find(p => p.id === activeSettlementDebtorId)?.money || 0) < totalDeductions}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-extrabold text-xs rounded shadow-xs transition-colors cursor-pointer text-center"
                >
                  จ่ายเงินสดเต็มจำนวน ({totalDeductions.toLocaleString()} ฿)
                </button>
                {(players.find(p => p.id === activeSettlementDebtorId)?.money || 0) < totalDeductions && (
                  <span className="text-[10px] text-rose-600 font-bold block text-center">
                    ⚠️ เงินสดมีไม่พอกับจำนวนที่ต้องชำระ! กรุณาใช้สิทธิ์โอนหุ้นชำระหนี้ด้านล่าง
                  </span>
                )}
              </div>

              {/* Option 2: Share Transfer */}
              <div className="border border-slate-200/80 rounded-xl p-4 flex flex-col gap-3 bg-white shadow-xxs">
                <div>
                  <span className="text-xs text-indigo-800 font-extrabold uppercase tracking-wide flex items-center gap-1.5 font-sans">
                    🤝 ช่องทางที่ 2: โอนหุ้นสิทธิ์ชำระหนี้ (Speedrun Rule 4)
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1 leading-relaxed font-sans">
                    โอนสิทธิ์หุ้นที่ตนเองถือครองอยู่ แทนการจ่ายเงินสด โดยคิดมูลค่าหุ้นเต็มอัตราหน้าบอร์ด (100%) เพื่อล้างหนี้ค่าสิทธิ์ ส่วนต่างที่เกินจะทอนกลับ หรือส่วนต่างที่ขาดจะจ่ายเพิ่มเป็นเงินสด
                  </p>
                </div>

                {debtorOwnedStocks.length === 0 ? (
                  <div className="p-5 bg-slate-50 text-center text-slate-400 text-xs rounded border border-slate-200 border-dashed font-sans">
                    คุณไม่มีใบหุ้นร่วมหลักทรัพย์อื่นในครอบครอง ที่จะสามารถทำธุรกรรมโอนเพื่อล้างหนี้ได้
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                    {debtorOwnedStocks.map(({ stock: st, shares, value }) => {
                      const creditorId = creditorIds[0];
                      const creditor = players.find(p => p.id === creditorId);
                      if (!creditor) return null;

                      const diff = value - totalDeductions;
                      const debtorCash = players.find(p => p.id === activeSettlementDebtorId)?.money || 0;
                      const canAffordDiff = diff >= 0 || debtorCash >= Math.abs(diff);
                      const creditorCanAffordChange = diff <= 0 || creditor.money >= diff;

                      return (
                        <div key={st.id} className="p-3 bg-slate-50 border border-slate-200 rounded flex flex-col gap-2 text-left">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-extrabold text-slate-800 text-xs block">หุ้นที่ {st.id}: {st.name}</span>
                              <span className="text-[10px] text-slate-500 font-medium font-sans">ถือครองร่วมกัน {shares} หุ้น (ราคาเต็ม 100% = {value.toLocaleString()} ฿)</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-700 font-extrabold rounded font-mono shrink-0">
                              {value.toLocaleString()} ฿
                            </span>
                          </div>

                          <div className="bg-white border border-slate-200 rounded p-2 text-[10px] flex flex-col gap-1.5 text-slate-700">
                            <div className="flex justify-between items-center font-semibold font-sans">
                              <span>ผลการประเมินส่วนต่างมูลค่า:</span>
                              <span className={diff >= 0 ? "text-emerald-600 font-bold" : "text-rose-600 font-bold"}>
                                {diff > 0 
                                  ? `ได้รับเงินทอนกลับ +${diff.toLocaleString()} บาท` 
                                  : diff < 0 
                                    ? `ต้องจ่ายเงินสดเพิ่มอีก -${Math.abs(diff).toLocaleString()} บาท` 
                                    : 'มูลค่าเท่ากับยอดหนี้พอดี'}
                              </span>
                            </div>
                            
                            {diff > 0 && !creditorCanAffordChange && (
                              <span className="text-[9px] text-rose-500 font-bold font-sans">
                                ⚠️ เจ้าหนี้ ({creditor.name}) มีเงินสดไม่พอชำระเงินทอนส่วนต่าง ({creditor.money.toLocaleString()} ฿)
                              </span>
                            )}
                            {diff < 0 && !canAffordDiff && (
                              <span className="text-[9px] text-rose-500 font-bold font-sans">
                                ⚠️ คุณมีเงินสดไม่พอจ่ายส่วนต่างเพิ่ม! (ต้องจ่ายเพิ่ม {Math.abs(diff).toLocaleString()} ฿)
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            disabled={!canAffordDiff || (diff > 0 && !creditorCanAffordChange)}
                            onClick={() => {
                              if (onTransferStockOwnership) {
                                onTransferStockOwnership(
                                  activeSettlementDebtorId,
                                  creditorId,
                                  st.id,
                                  shares,
                                  diff
                                );
                                setActiveSettlementDebtorId(null);
                              }
                            }}
                            className="w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-extrabold text-[10.5px] rounded transition-all cursor-pointer text-center font-sans"
                          >
                            🤝 ยืนยันธุรกรรมโอนสิทธิ์หุ้นเพื่อล้างหนี้
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Prices Grid */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-slate-400 mb-2.5 font-bold flex items-center gap-1.5"><TrendingUp size={14} className="text-[#059669]" /> ตารางมูลค่าลงทุนและเงินปันผล</h3>
                <div className="grid grid-cols-4 gap-2 text-center" id="stock-pricing-table">
                  {stock.pricings.map((p) => (
                    <div key={p.shares} className="bg-slate-50 p-2.5 border border-slate-200 rounded">
                      <div className="text-xs text-slate-500 mb-0.5 font-medium">{p.shares} หุ้น</div>
                      <div className="text-sm font-extrabold text-slate-900 font-mono">{p.price.toLocaleString()} บ.</div>
                      <div className="text-[10px] text-indigo-650 font-bold mt-1">ปันผล {p.payout.toLocaleString()} บ.</div>
                    </div>
                  ))}
                </div>
                {bonusMultiplier > 1 && (
                  <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200/60 text-emerald-800 p-2 rounded text-center flex items-center justify-center gap-1.5 animate-pulse font-medium">
                    🌟 Super Bonus ทำงาน! ถือครองครบ 4 หุ้นคนเดียว รับปันผลทวีคูณเป็น **2 เท่า** ({(stock.pricings[3].payout * 2).toLocaleString()} บาท)
                  </div>
                )}
              </div>

              {/* Current Owners Section */}
              <div>
                <div className="flex justify-between items-center mb-2.5 flex-wrap gap-2">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold">บัญชีรายชื่อผู้ถือหุ้นปัจจุบัน ({totalSharesOwned}/4 หุ้น)</h3>
                  <span className="text-[9.5px] text-indigo-600 font-extrabold bg-indigo-50 border border-indigo-150 px-1.5 py-0.5 rounded animate-pulse">
                    💡 คลิกอีโมจิ เพื่อสลับโอนสิทธิ์เปลี่ยนเจ้าของได้
                  </span>
                </div>
                {stockOwners.length === 0 ? (
                  <div className="p-4 bg-slate-50 text-center text-slate-500 text-xs rounded border border-slate-250 border-dashed">
                    บริษัทนี้ยังไม่มีผู้ใดซื้อหุ้น/ครอบครองกิจการ สามารถเลือกซื้อเพื่อจับจองสิทธิ์ได้
                  </div>
                ) : (
                  <div className="flex flex-col gap-2" id="stock-ownership-list">
                    {stockOwners.map(pId => {
                      const pDisp = getPlayerDisplay(pId);
                      if (!pDisp) return null;
                      
                      const ownerLap = pDisp.playerObj.lapCount || 1;
                      const shareCount = ownership[stock.id]?.[pId] || 0;
                      const sharePriceObj = stock.pricings.find(x => x.shares === shareCount);
                      const basePayout = sharePriceObj ? sharePriceObj.payout * bonusMultiplier : 0;
                      const payoutShare = calculateProgressivePayout(basePayout, ownerLap);

                      if (reassigningFromPlayerId === pId) {
                        return (
                          <div key={pId} className="flex flex-col gap-2.5 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl animate-fade-in text-left shadow-xxs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5 font-sans">
                                👑 ย้ายสิทธิ์หุ้น {pDisp.playerObj.emoji} {pDisp.name} ({shareCount} หุ้น) ให้กับ:
                              </span>
                              <button
                                type="button"
                                onClick={() => setReassigningFromPlayerId(null)}
                                className="text-[10px] text-slate-500 hover:text-slate-850 transition-colors underline cursor-pointer font-bold"
                              >
                                ยกเลิก
                              </button>
                            </div>
                            <div className="flex gap-2 flex-wrap mt-1">
                              {players
                                .filter(p => !p.isBankrupt && p.id !== pId)
                                .map(p => {
                                  const opt = CHARACTER_OPTIONS.find(o => o.color === p.color) || CHARACTER_OPTIONS[0];
                                  return (
                                    <button
                                      key={p.id}
                                      type="button"
                                      onClick={() => {
                                        if (onReassignStockOwner) {
                                          onReassignStockOwner(stock.id, pId, p.id);
                                        }
                                        setReassigningFromPlayerId(null);
                                      }}
                                      className="flex-1 min-w-[80px] py-1.5 px-2 bg-white hover:bg-indigo-600 border border-slate-200 hover:border-indigo-600 text-slate-700 hover:text-white transition-all rounded text-xs font-bold cursor-pointer flex items-center justify-center gap-1.5 shadow-xxs"
                                    >
                                      <span>{p.emoji}</span>
                                      <span>{p.name}</span>
                                    </button>
                                  );
                                })}
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={pId} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-205 rounded">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => setReassigningFromPlayerId(pId)}
                              className="w-7 h-7 rounded-full border border-black/10 shrink-0 flex items-center justify-center text-sm hover:scale-110 active:scale-95 hover:ring-2 hover:ring-indigo-400 transition-all cursor-pointer shadow-xs"
                              style={{ backgroundColor: pDisp.colorHex }}
                              title="คลิกเพื่อโอนสิทธิ์เปลี่ยนเจ้าของหุ้นนี้"
                            >
                              {pDisp.playerObj.emoji}
                            </button>
                            <div>
                              <span className="font-bold text-slate-800">{pDisp.name}</span>
                              <span className="block text-[10px] text-slate-500 font-medium font-sans">ถือครองเบี้ย {shareCount === 1 ? 'เบี้ยเล็ก (1 หุ้น)' : shareCount === 2 ? 'เบี้ยใหญ่ (2 หุ้น)' : `${shareCount} หุ้น`}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-sm font-extrabold text-indigo-600">รับปันผล {payoutShare.toLocaleString()} บ.</span>
                            <span className="block text-[9.5px] text-indigo-500 font-bold mb-1">
                              รอบที่ {ownerLap} (ดริฟต์คูณ {getHyperDriftRate(ownerLap)} เท่า)
                            </span>
                            <button
                              onClick={() => onSellShares(pId, 1)}
                              className="text-[10px] text-rose-600 hover:text-rose-700 transition-all underline cursor-pointer font-bold block ml-auto"
                            >
                              ขายคืน/ปลดออก 1 หุ้น (+{( (sharePriceObj?.price || 0) * 0.5 ).toLocaleString()} บ.)
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions Block */}
              {players.some(p => !p.isBankrupt) && (
                <div className="border-t border-slate-205 pt-4 flex flex-col gap-4">
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1"><HandCoins size={14} className="text-indigo-600" /> ดำเนินการโดยธนาคารกลาง</h3>

                  {/* BUY NEW SHARES (LAND ON TOP) */}
                  {remainingShares > 0 ? (
                    <div className="p-4 bg-slate-50 border border-slate-205 rounded font-sans" id="modal-buy-controls">
                      <div className="flex justify-between items-center mb-2.5">
                        <span className="text-xs text-slate-700 font-extrabold flex items-center gap-1.5 uppercase">
                          📥 ซื้อหุ้น / ร่วมทุนเพิ่ม (เหลืออยู่ {remainingShares} หุ้น)
                        </span>
                      </div>

                      {playersOnStockTile.length === 0 ? (
                        <div className="p-3 bg-amber-50/60 border border-amber-200 rounded text-amber-900 text-xs flex items-start gap-2">
                          <AlertCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">กฎการเล่น: ต้องเดินตกช่องนี้จึงจะลงทุนได้</span>
                            ขณะนี้ไม่มีผู้เล่นคนใดหยุดอยู่บนช่อง <strong>{stock.name}</strong> (ช่องที่ {stockTile?.index}) มีเพียงผู้เล่นที่เดินมาตกช่องนี้ในเทิร์นเท่านั้นจึงจะซื้อสิทธิ์ร่วมได้
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5 w-full">
                          {playersOnStockTile.map(p => {
                            const opt = CHARACTER_OPTIONS.find(o => o.color === p.color) || CHARACTER_OPTIONS[0];
                            const hasCurrentShares = ownership[stock.id]?.[p.id] || 0;
                            // Max they can buy is what remains
                            const buyOptions = [1, 2, 3, 4].filter(num => num <= remainingShares);

                            return (
                              <div key={p.id} className="p-3 bg-white border border-indigo-200/80 rounded flex flex-col justify-between shadow-xs ring-1 ring-indigo-50 w-full" id={`buy-card-for-${p.color}`}>
                                <div className="flex items-center gap-2 mb-2 w-full">
                                  <span className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center text-xs" style={{ backgroundColor: opt.hex }}>
                                    {p.emoji}
                                  </span>
                                  <span className="text-xs font-bold text-slate-800">{p.name} <span className="text-[9px] text-[#059669] bg-emerald-50 px-1 rounded">ตกช่องนี้อยู่</span></span>
                                  <span className="text-[10px] text-slate-500 ml-auto font-mono font-bold">({p.money.toLocaleString()} บ.)</span>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-2.5">
                                  {buyOptions.map(num => {
                                    const pricing = stock.pricings.find(x => x.shares === num)!;
                                    const canAfford = p.money >= pricing.price;
                                    return (
                                      <button
                                        key={num}
                                        disabled={!canAfford}
                                        onClick={() => onBuyShares(p.id, num)}
                                        className={`py-1.5 text-[10px] font-bold rounded hover:shadow-xs transition-colors cursor-pointer w-full text-center ${
                                          canAfford 
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs' 
                                            : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                        }`}
                                        title={`ค่ายื่นขอซื้อ ${num} หุ้น ในราคา ${pricing.price} บาท`}
                                      >
                                        +{num} หุ้น ({pricing.price.toLocaleString()} บ.)
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 border border-slate-205 rounded text-center text-xs text-slate-500 flex items-center justify-center gap-2 font-sans">
                      <HeartHandshake size={15} className="text-slate-400" />
                      <span>บริษัทนี้ซื้อหุ้นครบเต็มจำนวน 4 หุ้นแล้ว ไม่สามารถเปิดรับหุ้นส่วนใหม่ได้</span>
                    </div>
                  )}

                  {/* PAY DIVIDEND TRIGGERS */}
                  {stockOwners.length > 0 && (
                    <div className="p-4 bg-slate-50 border border-slate-205 rounded" id="modal-pay-controls">
                      <div className="flex justify-between items-center mb-2 flex-wrap gap-1.5">
                        <span className="text-xs text-slate-700 font-bold font-sans">💸 ลงจ่ายเงินปันผล (เมื่อเดินตกตรงจุดนี้)</span>
                        <span className="text-[9.5px] text-rose-650 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded font-extrabold">
                          ⚠️ เฉพาะผู้เล่นที่อยู่บนช่องนี้เท่านั้นที่จ่ายได้
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap font-sans">
                        {players
                          .filter(p => !p.isBankrupt && !stockOwners.includes(p.id))
                          .map(p => {
                            const isLanded = playersOnStockTile.some(tileP => tileP.id === p.id);
                            const opt = CHARACTER_OPTIONS.find(o => o.color === p.color) || CHARACTER_OPTIONS[0];
                            return (
                              <button
                                key={p.id}
                                disabled={!isLanded}
                                onClick={() => setActiveSettlementDebtorId(p.id)}
                                className={`flex-1 min-w-[140px] px-3 py-2 border transition-all rounded text-xs font-bold flex items-center gap-2 ${
                                  isLanded
                                    ? 'bg-rose-50 border-rose-200 hover:bg-rose-100 hover:border-rose-300 text-rose-750 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-xxs'
                                    : 'bg-slate-100/70 border-slate-200/50 text-slate-400 cursor-not-allowed opacity-50'
                                }`}
                                title={isLanded ? `คลิกเพื่อจ่ายค่าปันผลสำหรับ ${p.name}` : `${p.name} ไม่ได้อยู่บนช่องนี้`}
                              >
                                <span 
                                  className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs border border-black/5" 
                                  style={{ backgroundColor: isLanded ? opt.hex : '#e2e8f0' }}
                                >
                                  {p.emoji}
                                </span>
                                <div className="flex flex-col text-left">
                                  <span className="leading-tight">{p.name}</span>
                                  <span className={`text-[8.5px] font-bold ${isLanded ? 'text-rose-600 animate-pulse' : 'text-slate-400'}`}>
                                    {isLanded ? '📍 ตกช่องนี้อยู่' : 'ไม่ได้อยู่ช่องนี้'}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
