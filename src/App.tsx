/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import PlayerSelection from './components/PlayerSelection';
import GameBoard from './components/GameBoard';
import { Player } from './types';
import { Landmark } from 'lucide-react';

export default function App() {
  const [players, setPlayers] = useState<Player[] | null>(null);

  const handleStartGame = (selectedPlayers: Player[]) => {
    setPlayers(selectedPlayers);
  };

  const handleResetGame = () => {
    setPlayers(null);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between selection:bg-indigo-500/20 selection:text-indigo-900">
      {/* Dynamic ambient background glow of Geometric Balance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] rounded-full bg-slate-400/10 blur-[100px]" />
      </div>



      <main className="relative z-10 flex-1 flex flex-col justify-center py-6">
        {!players ? (
          <PlayerSelection onStartGame={handleStartGame} />
        ) : (
          <GameBoard initialPlayers={players} onResetGame={handleResetGame} />
        )}
      </main>

      <footer className="relative z-10 p-4 border-t border-slate-200 bg-white/40 text-center text-[10px] text-slate-500 max-w-7xl mx-auto w-full mb-2 rounded-b-xl">
        <span>ท็อปเกมส์ เศรษฐีใหญ่ โชค 2 ชั้น มอบระบบสุ่มโชคประจำวัน อัตราหลักทรัพย์ หุ้น และระบบปันผลเสถียร 100% (2026)</span>
      </footer>
    </div>
  );
}

