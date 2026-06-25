/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StockDetail, BoardTile } from './types';

export const STOCKS_DATA: StockDetail[] = [
  {
    id: 1,
    name: 'ได้รับมรดก',
    ratePercent: 20,
    pricings: [
      { shares: 1, price: 800, payout: 160 },
      { shares: 2, price: 1600, payout: 320 },
      { shares: 3, price: 2400, payout: 480 },
      { shares: 4, price: 3200, payout: 640 }
    ]
  },
  {
    id: 2,
    name: 'ภัตตาคาร',
    ratePercent: 20,
    pricings: [
      { shares: 1, price: 1000, payout: 200 },
      { shares: 2, price: 2000, payout: 400 },
      { shares: 3, price: 3000, payout: 600 },
      { shares: 4, price: 4000, payout: 800 }
    ]
  },
  {
    id: 3,
    name: 'หมู่บ้านจัดสรร',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 1200, payout: 120 },
      { shares: 2, price: 2400, payout: 240 },
      { shares: 3, price: 3600, payout: 360 },
      { shares: 4, price: 4800, payout: 480 }
    ]
  },
  {
    id: 4,
    name: 'โรงงานไฟฟ้า',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 800, payout: 80 },
      { shares: 2, price: 1600, payout: 160 },
      { shares: 3, price: 2400, payout: 240 },
      { shares: 4, price: 3200, payout: 320 }
    ]
  },
  {
    id: 5,
    name: 'โรงภาพยนตร์',
    ratePercent: 20,
    pricings: [
      { shares: 1, price: 1500, payout: 300 },
      { shares: 2, price: 3000, payout: 600 },
      { shares: 3, price: 4500, payout: 900 },
      { shares: 4, price: 6000, payout: 1200 }
    ]
  },
  {
    id: 6,
    name: 'ค้าเพชร',
    ratePercent: 20,
    pricings: [
      { shares: 1, price: 600, payout: 120 },
      { shares: 2, price: 1200, payout: 240 },
      { shares: 3, price: 1800, payout: 360 },
      { shares: 4, price: 2400, payout: 480 }
    ]
  },
  {
    id: 7,
    name: 'บริษัทท่องเที่ยว',
    ratePercent: 20,
    pricings: [
      { shares: 1, price: 1000, payout: 200 },
      { shares: 2, price: 2000, payout: 400 },
      { shares: 3, price: 3000, payout: 600 },
      { shares: 4, price: 4000, payout: 800 }
    ]
  },
  {
    id: 8,
    name: 'สวนสนุก',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 800, payout: 80 },
      { shares: 2, price: 1600, payout: 160 },
      { shares: 3, price: 2400, payout: 240 },
      { shares: 4, price: 3200, payout: 320 }
    ]
  },
  {
    id: 9,
    name: 'บริษัทน้ำมัน',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 500, payout: 50 },
      { shares: 2, price: 1000, payout: 100 },
      { shares: 3, price: 1500, payout: 150 },
      { shares: 4, price: 2000, payout: 200 }
    ]
  },
  {
    id: 10,
    name: 'ห้างสรรพสินค้า',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 800, payout: 80 },
      { shares: 2, price: 1600, payout: 160 },
      { shares: 3, price: 2400, payout: 240 },
      { shares: 4, price: 3200, payout: 320 }
    ]
  },
  {
    id: 11,
    name: 'เหมืองแร่',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 1000, payout: 100 },
      { shares: 2, price: 2000, payout: 200 },
      { shares: 3, price: 3000, payout: 300 },
      { shares: 4, price: 4000, payout: 400 }
    ]
  },
  {
    id: 12,
    name: 'เล่นเกมส์ทีวี',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 300, payout: 30 },
      { shares: 2, price: 600, payout: 60 },
      { shares: 3, price: 900, payout: 90 },
      { shares: 4, price: 1200, payout: 120 }
    ]
  },
  {
    id: 13,
    name: 'โรงงานน้ำอัดลม',
    ratePercent: 20,
    pricings: [
      { shares: 1, price: 1000, payout: 200 },
      { shares: 2, price: 2000, payout: 400 },
      { shares: 3, price: 3000, payout: 600 },
      { shares: 4, price: 4000, payout: 800 }
    ]
  },
  {
    id: 14,
    name: 'โรงงานทำกระเป๋า',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 800, payout: 80 },
      { shares: 2, price: 1600, payout: 160 },
      { shares: 3, price: 2400, payout: 240 },
      { shares: 4, price: 3200, payout: 320 }
    ]
  },
  {
    id: 15,
    name: 'สถานที่ออกกำลังกาย',
    ratePercent: 30,
    pricings: [
      { shares: 1, price: 800, payout: 240 },
      { shares: 2, price: 1600, payout: 480 },
      { shares: 3, price: 2400, payout: 720 },
      { shares: 4, price: 3200, payout: 960 }
    ]
  },
  {
    id: 16,
    name: 'โรงงานรองเท้า',
    ratePercent: 30,
    pricings: [
      { shares: 1, price: 800, payout: 240 },
      { shares: 2, price: 1600, payout: 480 },
      { shares: 3, price: 2400, payout: 720 },
      { shares: 4, price: 3200, payout: 960 }
    ]
  },
  {
    id: 17,
    name: 'โรงแรมหรู',
    ratePercent: 30,
    pricings: [
      { shares: 1, price: 1000, payout: 300 },
      { shares: 2, price: 2000, payout: 600 },
      { shares: 3, price: 3000, payout: 900 },
      { shares: 4, price: 4000, payout: 1200 }
    ]
  },
  {
    id: 18,
    name: 'โรงพิมพ์',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 1000, payout: 100 },
      { shares: 2, price: 2000, payout: 200 },
      { shares: 3, price: 3000, payout: 300 },
      { shares: 4, price: 4000, payout: 400 }
    ]
  },
  {
    id: 19,
    name: 'ตลาดหุ้น',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 800, payout: 80 },
      { shares: 2, price: 1600, payout: 160 },
      { shares: 3, price: 2400, payout: 240 },
      { shares: 4, price: 3200, payout: 320 }
    ]
  },
  {
    id: 20,
    name: 'ถอนเงินจากธนาคาร',
    ratePercent: 20,
    pricings: [
      { shares: 1, price: 1200, payout: 240 },
      { shares: 2, price: 2400, payout: 480 },
      { shares: 3, price: 3600, payout: 720 },
      { shares: 4, price: 4800, payout: 960 }
    ]
  },
  {
    id: 21,
    name: 'โรงงานขนมปัง',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 800, payout: 80 },
      { shares: 2, price: 1600, payout: 160 },
      { shares: 3, price: 2400, payout: 240 },
      { shares: 4, price: 3200, payout: 320 }
    ]
  },
  {
    id: 22,
    name: 'สถานีโทรทัศน์',
    ratePercent: 30,
    pricings: [
      { shares: 1, price: 1000, payout: 300 },
      { shares: 2, price: 2000, payout: 600 },
      { shares: 3, price: 3000, payout: 900 },
      { shares: 4, price: 4000, payout: 1200 }
    ]
  },
  {
    id: 23,
    name: 'ค้าไม้สำเร็จรูป',
    ratePercent: 20,
    pricings: [
      { shares: 1, price: 800, payout: 160 },
      { shares: 2, price: 1600, payout: 320 },
      { shares: 3, price: 2400, payout: 480 },
      { shares: 4, price: 3200, payout: 640 }
    ]
  },
  {
    id: 24,
    name: 'โรงงานปูนซีเมนต์',
    ratePercent: 10,
    pricings: [
      { shares: 1, price: 1000, payout: 100 },
      { shares: 2, price: 2000, payout: 200 },
      { shares: 3, price: 3000, payout: 300 },
      { shares: 4, price: 4000, payout: 400 }
    ]
  },
  {
    id: 25,
    name: 'โรงงานเบียร์',
    ratePercent: 20,
    pricings: [
      { shares: 1, price: 1000, payout: 200 },
      { shares: 2, price: 2000, payout: 400 },
      { shares: 3, price: 3000, payout: 600 },
      { shares: 4, price: 4000, payout: 800 }
    ]
  }
];

export const BOARD_TILES: BoardTile[] = [
  // 0: Start (Bottom-Left Corner)
  {
    index: 0,
    name: 'จุดเริ่มต้น',
    type: 'START',
    effectDescription: 'ครบรอบรับเงินสุ่มโชคประจำวัน หรือทอดเต๋าตกลงตัวได้โบนัส 5,000 บาท!',
    colorTheme: 'bg-emerald-600 text-white font-black'
  },
  // Left Edge going UP (1 - 9)
  {
    index: 1,
    name: 'ได้รับมรดก',
    type: 'STOCK',
    stockId: 1,
    effectDescription: 'หุ้นที่ 1 อัตราเงินปันผล 10%',
    colorTheme: 'bg-sky-50 text-sky-900 border-sky-300'
  },
  {
    index: 2,
    name: 'ภัตตาคาร',
    type: 'STOCK',
    stockId: 2,
    effectDescription: 'หุ้นที่ 2 อัตราเงินปันผล 20%',
    colorTheme: 'bg-sky-50 text-sky-900 border-sky-300'
  },
  {
    index: 3,
    name: 'หมู่บ้านจัดสรร',
    type: 'STOCK',
    stockId: 3,
    effectDescription: 'หุ้นที่ 3 อัตราเงินปันผล 20%',
    colorTheme: 'bg-sky-50 text-sky-900 border-sky-300'
  },
  {
    index: 4,
    name: '! STOP',
    type: 'STOP_CARD',
    effectDescription: 'เปิดแผ่นป้าย อัจฉริยะ ลุ้นโชคและโอกาสใหญ่!',
    colorTheme: 'bg-yellow-400 text-yellow-950 font-black border-yellow-500'
  },
  {
    index: 5,
    name: 'โรงงานไฟฟ้า',
    type: 'STOCK',
    stockId: 4,
    effectDescription: 'หุ้นที่ 4 อัตราเงินปันผล 10%',
    colorTheme: 'bg-amber-50 text-amber-900 border-amber-300'
  },
  {
    index: 6,
    name: 'โรงภาพยนตร์',
    type: 'STOCK',
    stockId: 5,
    effectDescription: 'หุ้นที่ 5 อัตราเงินปันผล 20%',
    colorTheme: 'bg-amber-50 text-amber-900 border-amber-300'
  },
  {
    index: 7,
    name: 'บริจาคช่วยเด็กพิการ',
    type: 'SPECIAL_FINANCE',
    cost: 100,
    effectDescription: 'บริจาคเงินช่วยเหลือและสนับสนุนเด็กผู้พิการหรือขาดโอกาส จ่าย 100 บาท',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-200'
  },
  {
    index: 8,
    name: 'ค้าเพชร',
    type: 'STOCK',
    stockId: 6,
    effectDescription: 'หุ้นที่ 6 อัตราเงินปันผล 20%',
    colorTheme: 'bg-amber-50 text-amber-900 border-amber-300'
  },
  {
    index: 9,
    name: 'บริษัทท่องเที่ยว',
    type: 'STOCK',
    stockId: 7,
    effectDescription: 'หุ้นที่ 7 อัตราเงินปันผล 20%',
    colorTheme: 'bg-amber-50 text-amber-900 border-amber-300'
  },
  // 10: Prison 1 (Top-Left Corner)
  {
    index: 10,
    name: 'ช่วยตึกถล่ม',
    type: 'PRISON_1',
    effectDescription: 'ช่วยเหลือผู้ประสบภัยจากตึกถล่ม หยุดเดิน 1 ครั้ง!',
    colorTheme: 'bg-red-500 text-white font-semibold'
  },
  // Top Edge going RIGHT (11 - 19)
  {
    index: 11,
    name: 'สวนสนุก',
    type: 'STOCK',
    stockId: 8,
    effectDescription: 'หุ้นที่ 8 อัตราเงินปันผล 10%',
    colorTheme: 'bg-indigo-50 text-indigo-900 border-indigo-300'
  },
  {
    index: 12,
    name: 'บริษัทน้ำมัน',
    type: 'STOCK',
    stockId: 9,
    effectDescription: 'หุ้นที่ 9 อัตราเงินปันผล 10%',
    colorTheme: 'bg-indigo-50 text-indigo-900 border-indigo-300'
  },
  {
    index: 13,
    name: 'ค่าโรงแรม',
    type: 'SPECIAL_FINANCE',
    cost: 200,
    effectDescription: 'จ่ายค่าพักแรมโรงแรมระหว่างเดินทางท่องเที่ยว จ่าย 200 บาท',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-300'
  },
  {
    index: 14,
    name: 'ห้างสรรพสินค้า',
    type: 'STOCK',
    stockId: 10,
    effectDescription: 'หุ้นที่ 10 อัตราเงินปันผล 10%',
    colorTheme: 'bg-indigo-50 text-indigo-900 border-indigo-300'
  },
  {
    index: 15,
    name: '? STOP',
    type: 'STOP_CARD',
    effectDescription: 'เปิดแผ่นป้าย อัจฉริยะ พลิกชะตาชีวิต!',
    colorTheme: 'bg-yellow-400 text-yellow-950 font-black border-yellow-500'
  },
  {
    index: 16,
    name: 'เหมืองแร่',
    type: 'STOCK',
    stockId: 11,
    effectDescription: 'หุ้นที่ 11 อัตราเงินปันผล 10%',
    colorTheme: 'bg-emerald-50 text-emerald-900 border-emerald-300'
  },
  {
    index: 17,
    name: 'อะไหล่รถยนต์',
    type: 'SPECIAL_FINANCE',
    cost: 500,
    effectDescription: 'จัดเตรียมอะไหล่สำรองและเครื่องยนต์ชำรุด จ่าย 500 บาท',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-200'
  },
  {
    index: 18,
    name: 'เล่นเกมส์ทีวี',
    type: 'STOCK',
    stockId: 12,
    effectDescription: 'หุ้นที่ 12 อัตราเงินปันผล 10%',
    colorTheme: 'bg-emerald-50 text-emerald-950 border-emerald-300'
  },
  {
    index: 19,
    name: 'โรงงานน้ำอัดลม',
    type: 'STOCK',
    stockId: 13,
    effectDescription: 'หุ้นที่ 13 อัตราเงินปันผล 20%',
    colorTheme: 'bg-emerald-50 text-emerald-950 border-emerald-300'
  },
  // 20: Prison 2 (Top-Right Corner)
  {
    index: 20,
    name: 'เล่นสงกรานต์',
    type: 'PRISON_2',
    effectDescription: 'ท่องเที่ยวเทศกาลสาดน้ำและเล่นสงกรานต์เพลิดเพลิน หยุดเดิน 2 ครั้ง!',
    colorTheme: 'bg-blue-500 text-white font-semibold'
  },
  // Right Edge going DOWN (21 - 29)
  {
    index: 21,
    name: 'โรงงานทำกระเป๋า',
    type: 'STOCK',
    stockId: 14,
    effectDescription: 'หุ้นที่ 14 อัตราเงินปันผล 10%',
    colorTheme: 'bg-emerald-50 text-emerald-950 border-emerald-300'
  },
  {
    index: 22,
    name: '! STOP',
    type: 'STOP_CARD',
    effectDescription: 'เปิดแผ่นป้าย อัจฉริยะ ลุ้นโชคและความเสี่ยงก้าวกระโดด!',
    colorTheme: 'bg-yellow-400 text-yellow-950 font-black border-yellow-500'
  },
  {
    index: 23,
    name: 'สถานที่ออกกำลังกาย',
    type: 'STOCK',
    stockId: 15,
    effectDescription: 'หุ้นที่ 15 อัตราเงินปันผล 30%',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-300'
  },
  {
    index: 24,
    name: 'โรงงานรองเท้า',
    type: 'STOCK',
    stockId: 16,
    effectDescription: 'หุ้นที่ 16 อัตราเงินปันผล 30%',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-300'
  },
  {
    index: 25,
    name: 'เที่ยวญี่ปุ่น',
    type: 'SPECIAL_FINANCE',
    cost: 250,
    effectDescription: 'ท่องเที่ยวพักผ่อนและอุดหนุนธุรกิจต่างชาติ จ่าย 250 บาท',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-200'
  },
  {
    index: 26,
    name: 'โรงแรมหรู',
    type: 'STOCK',
    stockId: 17,
    effectDescription: 'หุ้นที่ 17 อัตราเงินปันผล 30%',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-300'
  },
  {
    index: 27,
    name: 'โรงพิมพ์',
    type: 'STOCK',
    stockId: 18,
    effectDescription: 'หุ้นที่ 18 อัตราเงินปันผล 10%',
    colorTheme: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-300'
  },
  {
    index: 28,
    name: 'ซื้อรถคันใหม่',
    type: 'SPECIAL_FINANCE',
    cost: 500,
    effectDescription: 'ดาวน์และมัดจำออกรถใหม่เพิ่มความคล่องตัว จ่าย 500 บาท',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-200'
  },
  {
    index: 29,
    name: 'ตลาดหุ้น',
    type: 'STOCK',
    stockId: 19,
    effectDescription: 'หุ้นที่ 19 อัตราเงินปันผล 10%',
    colorTheme: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-300'
  },
  // 30: Prison 3 (Bottom-Right Corner)
  {
    index: 30,
    name: 'ทำผิดกฎจราจร',
    type: 'PRISON_3',
    effectDescription: 'ฝ่าฝืนสัญญาณและกฎข้อบังคับจราจร หยุดเดิน 3 ครั้ง!',
    colorTheme: 'bg-rose-600 text-white font-semibold'
  },
  // Bottom Edge going LEFT (31 - 39)
  {
    index: 31,
    name: 'ถอนเงินจากธนาคาร',
    type: 'STOCK',
    stockId: 20,
    effectDescription: 'หุ้นที่ 20 อัตราเงินปันผล 20%',
    colorTheme: 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-300'
  },
  {
    index: 32,
    name: 'ทัวร์อเมริกา',
    type: 'SPECIAL_FINANCE',
    cost: 1000,
    effectDescription: 'จ่ายค่ายื่นเอกสารตั๋วเดินทางทัวร์อเมริกา จ่าย 1,000 บาท',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-200'
  },
  {
    index: 33,
    name: 'โรงงานขนมปัง',
    type: 'STOCK',
    stockId: 21,
    effectDescription: 'หุ้นที่ 21 อัตราเงินปันผล 10%',
    colorTheme: 'bg-amber-50 text-amber-900 border-amber-300'
  },
  {
    index: 34,
    name: 'สถานีโทรทัศน์',
    type: 'STOCK',
    stockId: 22,
    effectDescription: 'หุ้นที่ 22 อัตราเงินปันผล 30%',
    colorTheme: 'bg-orange-50 text-orange-950 border-orange-300'
  },
  {
    index: 35,
    name: 'ค้าไม้สำเร็จรูป',
    type: 'STOCK',
    stockId: 23,
    effectDescription: 'หุ้นที่ 23 อัตราเงินปันผล 20%',
    colorTheme: 'bg-orange-50 text-orange-950 border-orange-300'
  },
  {
    index: 36,
    name: 'ปลูกป่า',
    type: 'SPECIAL_FINANCE',
    cost: 500,
    effectDescription: 'ร่วมฟื้นฟูธรรมชาติเพื่อชุมชนต้นน้ำและสร้างสิ่งแวดล้อมที่ยั่งยืน จ่าย 500 บาท',
    colorTheme: 'bg-rose-50 text-rose-900 border-rose-300'
  },
  {
    index: 37,
    name: 'โรงงานปูนซีเมนต์',
    type: 'STOCK',
    stockId: 24,
    effectDescription: 'หุ้นที่ 24 อัตราเงินปันผล 10%',
    colorTheme: 'bg-orange-50 text-orange-950 border-orange-300'
  },
  {
    index: 38,
    name: '? STOP',
    type: 'STOP_CARD',
    effectDescription: 'เปิดแผ่นป้าย อัจฉริยะ ลุ้นโชคและโอกาสใหญ่!',
    colorTheme: 'bg-yellow-400 text-yellow-950 font-black border-yellow-500'
  },
  {
    index: 39,
    name: 'โรงงานเบียร์',
    type: 'STOCK',
    stockId: 25,
    effectDescription: 'หุ้นที่ 25 อัตราเงินปันผล 20%',
    colorTheme: 'bg-orange-50 text-orange-950 border-orange-300'
  }
];

export const CHANCE_CARDS = [
  { id: 'c1', text: 'โชคดีมาก! ชนะรางวัลผู้บริโภคดีเด่น ได้รับเงินปันผลพิเศษ 1,500 บาท', amount: 1500, type: 'receive' },
  { id: 'c2', text: 'เจ็บป่วยออดๆ แอดๆ ต้องไปนอนคลินิก จ่ายค่าเวชภัณฑ์ 400 บาท', amount: -400, type: 'pay' },
  { id: 'c3', text: 'จอดรถในที่ห้ามจอดแถวห้างสรรพสินค้า โดนล็อคล้อ ปรับ 300 บาท', amount: -300, type: 'pay' },
  { id: 'c4', text: 'ถูกลอตเตอรี่เลขท้ายสองตัว รับเงินรางวัลจากธนาคารกลาง 2,000 บาท', amount: 2000, type: 'receive' },
  { id: 'c5', text: 'นำเข้าเครื่องจักรอุตสาหกรรมรุ่นใหม่ ปฏิวัติสายการผลิต จ่ายเพิ่ม 1,000 บาท', amount: -1000, type: 'pay' },
  { id: 'c6', text: 'ธนาคารกลางปันผลรายปีจากสินทรัพย์เสี่ยง รับเงินปันผล 800 บาท', amount: 800, type: 'receive' },
  { id: 'c7', text: 'ชำระค่าประกันสังคม และกองทุนสุขภาพพนักงานประจำปี จ่าย 500 บาท', amount: -500, type: 'pay' },
  { id: 'c8', text: 'รับโชคใหญ่จากผู้มีอุปการคุณช่วยเหลือธุรกิจ มอบเงินสดสนับสนุน 3,000 บาท', amount: 3000, type: 'receive' },
  { id: 'c9', text: 'โดนภาษีบำรุงท้องที่ย้อนหลังเนื่องจากขยายโกดัง จ่ายสะสาง 800 บาท', amount: -800, type: 'pay' },
  { id: 'c10', text: 'ฉลองความสำเร็จยอดขายทะลุเป้า เลี้ยงพนักงาน จ่ายค่าจัดเลี้ยงอาหารเบียร์ 600 บาท', amount: -600, type: 'pay' },
  { id: 'c11', text: 'โรงปูนและห้างสรรพสินค้ารายงานกำไรเกินคาด ได้รับส่วนแบ่งพิเศษ 1,200 บาท', amount: 1200, type: 'receive' },
  { id: 'c12', text: 'โทรศัพท์ตกลงท่อระบายน้ำกทม. ต้องซื้อเครื่องทดแทนอย่างเร่งด่วน จ่าย 1,000 บาท', amount: -1000, type: 'pay' }
];

export const WHEEL_RATE_DEFAULTS = [
  { item: '1,000 บาท (รางวัลปกติ)', amount: 1000, rate: 45, color: 'from-blue-500 to-indigo-600' },
  { item: '500 บาท', amount: 500, rate: 15, color: 'from-cyan-500 to-blue-600' },
  { item: '100 บาท', amount: 100, rate: 12, color: 'from-amber-500 to-orange-600' },
  { item: '50 บาท', amount: 50, rate: 11, color: 'from-purple-500 to-pink-600' },
  { item: '5,000 บาท (แจ็คพอต!)', amount: 5000, rate: 8, color: 'from-yellow-400 to-red-500 font-extrabold animate-bounce' },
  { item: '10 บาท (ปลอบใจ)', amount: 10, rate: 9, color: 'from-slate-500 to-zinc-650' }
];

export const CHARACTER_OPTIONS = [
  { color: 'Green', name: 'สีเขียว', hex: '#22c55e', border: '#15803d', shadow: 'rgba(34, 197, 94, 0.4)' },
  { color: 'Blue', name: 'สีฟ้า', hex: '#0ea5e9', border: '#0369a1', shadow: 'rgba(14, 165, 233, 0.4)' },
  { color: 'Brown', name: 'สีน้ำตาล', hex: '#b45309', border: '#78350f', shadow: 'rgba(180, 83, 9, 0.4)' },
  { color: 'Pink', name: 'สีชมพู', hex: '#ec4899', border: '#be185d', shadow: 'rgba(236, 72, 153, 0.4)' },
  { color: 'Gray', name: 'สีเทา', hex: '#6b7280', border: '#374151', shadow: 'rgba(107, 114, 128, 0.4)' },
  { color: 'Black', name: 'สีดำ', hex: '#18181b', border: '#09090b', shadow: 'rgba(24, 24, 27, 0.6)' }
];

export interface HyperDriftSettings {
  baseRate: number;         // default 1.5
  floorLimit: number;       // default 1000
  smallMultiplier: number;  // default 3
  roundingMode: 'unit' | 'ten' | 'none'; // default 'unit'
}

export const getHyperDriftSettings = (): HyperDriftSettings => {
  if (typeof window === 'undefined') {
    return {
      baseRate: 1.5,
      floorLimit: 1000,
      smallMultiplier: 3,
      roundingMode: 'unit'
    };
  }
  try {
    const saved = localStorage.getItem('hyperdrift_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        baseRate: typeof parsed.baseRate === 'number' ? parsed.baseRate : 1.5,
        floorLimit: typeof parsed.floorLimit === 'number' ? parsed.floorLimit : 1000,
        smallMultiplier: typeof parsed.smallMultiplier === 'number' ? parsed.smallMultiplier : 3,
        roundingMode: ['unit', 'ten', 'none'].includes(parsed.roundingMode) ? parsed.roundingMode : 'unit'
      };
    }
  } catch (e) {
    // ignore
  }
  return {
    baseRate: 1.5,
    floorLimit: 1000,
    smallMultiplier: 3,
    roundingMode: 'unit'
  };
};

export const saveHyperDriftSettings = (settings: HyperDriftSettings) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hyperdrift_settings', JSON.stringify(settings));
    // Dispatch custom event to let other components know settings updated
    window.dispatchEvent(new Event('hyperdrift_settings_changed'));
  }
};

export const getHyperDriftRate = (lapCount: number): number => {
  const settings = getHyperDriftSettings();
  const targetLap = Math.max(1, lapCount);
  return parseFloat(Math.pow(settings.baseRate, targetLap - 1).toFixed(4));
};

export const calculateProgressivePayout = (defaultPayout: number, lapCount: number = 1) => {
  const settings = getHyperDriftSettings();
  const targetLap = Math.max(1, lapCount);
  let previousRoundPayout = defaultPayout;

  for (let r = 1; r <= targetLap; r++) {
    // 1. Calculate compounding rate (compounding starts after completing 1 lap, so rate is baseRate^(r-1))
    const rate = Math.pow(settings.baseRate, r - 1);

    // 2. Normal calculation
    const normalCalc = defaultPayout * rate;

    let roundPayout = 0;
    if (normalCalc < settings.floorLimit) {
      const tryMultiplier = (r === 1) ? (defaultPayout * settings.smallMultiplier) : (previousRoundPayout * settings.smallMultiplier);
      if (tryMultiplier <= settings.floorLimit) {
        roundPayout = tryMultiplier;
      } else {
        // Brake works!
        const prevValue = (r === 1) ? defaultPayout : previousRoundPayout;
        roundPayout = prevValue * (r === 1 ? 1.0 : settings.baseRate);
      }
    } else {
      const prevValue = (r === 1) ? defaultPayout : previousRoundPayout;
      roundPayout = prevValue * (r === 1 ? 1.0 : settings.baseRate);
    }

    // 3. Rounding Mode
    if (settings.roundingMode === 'unit') {
      previousRoundPayout = Math.floor(roundPayout / 10) * 10;
    } else if (settings.roundingMode === 'ten') {
      previousRoundPayout = Math.floor(roundPayout / 100) * 100;
    } else {
      previousRoundPayout = Math.floor(roundPayout);
    }
  }

  return previousRoundPayout;
};
