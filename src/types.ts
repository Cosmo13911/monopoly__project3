/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CharacterColor {
  Green = 'Green',
  Blue = 'Blue',
  Brown = 'Brown',
  Pink = 'Pink',
  Gray = 'Gray',
  Black = 'Black'
}

export interface Player {
  id: string;
  name: string;
  color: CharacterColor;
  emoji: string;
  money: number;
  position: number;
  isBankrupt: boolean;
  inactiveTurns: number; // For stop turn rules (ตึกถล่ม = 1, สงกรานต์ = 2, จราจร = 3)
  lapCount: number; // Speedrun Rule 1: Track round count for progressive scale
}

export interface SharePricing {
  shares: number; // 1, 2, 3, or 4
  price: number;  // Price to buy
  payout: number; // Dividend paid matching the number of shares
}

export interface StockDetail {
  id: number;       // 1 - 25
  name: string;
  ratePercent: number; // 10%, 20%, 30% dividend rate
  pricings: SharePricing[]; // Details for 1, 2, 3, 4 shares
}

export type TileType = 'START' | 'STOCK' | 'STOP_CARD' | 'SPECIAL_FINANCE' | 'PRISON_1' | 'PRISON_2' | 'PRISON_3';

export interface BoardTile {
  index: number;
  name: string;
  type: TileType;
  stockId?: number; // 1 to 25 if type === 'STOCK'
  cost?: number;    // Cost/Pay penalty if type === 'SPECIAL_FINANCE'
  effectDescription: string;
  colorTheme?: string; // styling help
}

export interface GameLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'danger' | 'dice' | 'transaction';
}

export interface StockOwnership {
  [stockId: number]: {
    [playerId: string]: number; // playerId -> number of shares (1 to 4)
  };
}

export interface AppNotification {
  id: string;
  timestamp: string;
  type: 'money_in' | 'money_out' | 'stopped' | 'info';
  playerName: string;
  playerEmoji: string;
  title: string;
  message: string;
  amount?: number;
}
