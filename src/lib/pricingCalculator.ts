/**
 * PATCH PRICING CALCULATOR - Updated with new pricing
 * NOW STARTING FROM 1 PATCH!
 */

// Embroidery Pricing
// Qty breaks: 1-9 (graduated: $80 flat at 1pc, $100 total at 2pc, then linear toward 10pc total),
//             then 10, 25, 50, 100, 200, 500, 1000, 2500, 5000
// Size = Math.floor((width + height) / 2) | Sizes 1-14
// Sizes 13-14 extrapolated from size 11-12 progression (+4.75 at 10pc, +2.37 at 25/50pc, +1.18-1.19 at 100pc+)
const embroideryPricing = {
  qtyBreaks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 2500, 5000],
  prices: {
    //          1      2      3      4      5      6      7      8      9     10      25      50     100    200    500   1000   2500   5000
    1:  [80.00, 50.00, 34.12, 26.18, 21.41, 18.23, 15.96, 14.26, 12.94, 11.88,  5.34,  3.56,  2.20,  1.72,  0.95,  0.83,  0.75,  0.71],
    2:  [80.00, 50.00, 34.12, 26.18, 21.41, 18.23, 15.96, 14.26, 12.94, 11.88,  5.34,  3.56,  2.20,  1.72,  0.95,  0.83,  0.75,  0.71],
    3:  [80.00, 50.00, 34.12, 26.18, 21.41, 18.23, 15.96, 14.26, 12.94, 11.88,  5.34,  3.56,  2.32,  1.78,  1.07,  0.95,  0.87,  0.82],
    4:  [80.00, 50.00, 34.12, 26.18, 21.41, 18.23, 15.96, 14.26, 12.94, 11.88,  5.94,  3.86,  2.38,  1.90,  1.31,  1.07,  0.97,  0.91],
    5:  [80.00, 50.00, 35.10, 27.66, 23.19, 20.21, 18.08, 16.48, 15.24, 14.25,  7.13,  4.75,  3.56,  2.38,  1.54,  1.48,  1.38,  1.30],
    6:  [80.00, 50.00, 36.10, 29.14, 24.97, 22.19, 20.21, 18.72, 17.56, 16.63, 10.69,  8.31,  4.75,  3.56,  2.97,  2.38,  2.20,  2.09],
    7:  [80.00, 50.00, 36.59, 29.88, 25.86, 23.18, 21.26, 19.82, 18.70, 17.81, 13.06,  9.50,  5.94,  4.75,  4.16,  3.56,  3.30,  3.10],
    8:  [80.00, 50.00, 37.08, 30.63, 26.75, 24.17, 22.32, 20.94, 19.86, 19.00, 15.44, 11.88,  8.31,  5.94,  5.34,  4.75,  4.45,  4.20],
    9:  [80.00, 50.00, 38.08, 32.11, 28.54, 26.15, 24.45, 23.17, 22.18, 21.38, 16.63, 13.06,  9.50,  7.13,  6.53,  5.94,  5.60,  5.30],
    10: [80.00, 50.00, 38.57, 32.85, 29.42, 27.13, 25.50, 24.28, 23.32, 22.56, 19.00, 14.25, 10.69,  8.31,  7.72,  7.13,  6.75,  6.40],
    11: [80.00, 50.00, 39.56, 34.34, 31.21, 29.12, 27.63, 26.51, 25.64, 24.94, 21.38, 15.44, 11.88,  9.50,  8.91,  8.31,  7.90,  7.50],
    12: [80.00, 50.00, 41.54, 37.31, 34.77, 33.08, 31.87, 30.96, 30.25, 29.69, 23.75, 17.81, 13.06, 10.69, 10.09,  9.50,  9.05,  8.60],
    13: [80.00, 50.00, 43.52, 40.28, 38.33, 37.03, 36.11, 35.41, 34.87, 34.44, 26.12, 20.18, 14.24, 11.88, 11.27, 10.69, 10.20,  9.70],
    14: [80.00, 50.00, 45.50, 43.24, 41.89, 40.99, 40.35, 39.87, 39.49, 39.19, 28.49, 22.55, 15.42, 13.07, 12.45, 11.88, 11.35, 10.80],
  },
  minSize: 1,
  maxSize: 14
};

// Chenille/TPU/Glitter Pricing - competitor-benchmarked, 5% below market
// Qty breaks 1-9: totals graduate smoothly from $80 (1pc flat) toward the 10pc total for each size.
// Formula: total_q = 80 + (total_10 - 80) * (q - 1) / 9, unit = total_q / q
// Qty breaks: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 5000
const chenillePricing = {
  qtyBreaks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //          1      2      3      4      5      6      7      8      9     10      25      50     100    200    500   1000   5000
    1:  [80.00, 42.16, 29.54, 23.23, 19.45, 16.93, 15.12, 13.77, 12.72, 11.88,  5.94,  3.27,  2.97,  2.08,  1.48,  1.19,  1.19],
    2:  [80.00, 42.16, 29.54, 23.23, 19.45, 16.93, 15.12, 13.77, 12.72, 11.88,  5.94,  3.27,  2.97,  2.08,  1.48,  1.19,  1.19],
    3:  [80.00, 42.16, 29.54, 23.23, 19.45, 16.93, 15.12, 13.77, 12.72, 11.88,  5.94,  4.16,  3.56,  2.67,  1.79,  1.48,  1.48],
    4:  [80.00, 42.81, 30.41, 24.22, 20.50, 18.02, 16.25, 14.92, 13.89, 13.06,  6.54,  4.75,  4.16,  3.56,  2.38,  2.08,  2.08],
    5:  [80.00, 43.47, 31.30, 25.21, 21.56, 19.12, 17.38, 16.08, 15.06, 14.25,  7.72,  6.54,  5.94,  4.16,  2.97,  2.67,  2.67],
    6:  [80.00, 44.80, 33.06, 27.19, 23.67, 21.32, 19.65, 18.39, 17.41, 16.63, 10.69,  8.91,  7.13,  4.75,  4.16,  3.56,  3.56],
    7:  [80.00, 45.45, 33.93, 28.18, 24.72, 22.42, 20.77, 19.54, 18.58, 17.81, 13.06, 10.69,  8.31,  5.94,  5.35,  4.75,  4.75],
    8:  [80.00, 46.11, 34.81, 29.17, 25.78, 23.52, 21.90, 20.69, 19.75, 19.00, 16.63, 14.25, 10.69,  9.21,  7.13,  6.54,  6.54],
    9:  [80.00, 47.44, 36.58, 31.15, 27.89, 25.72, 24.17, 23.01, 22.10, 21.38, 19.00, 16.63, 13.06, 10.10,  8.31,  7.72,  7.72],
    10: [80.00, 48.09, 37.45, 32.13, 28.94, 26.82, 25.30, 24.16, 23.27, 22.56, 21.38, 17.81, 14.25, 11.29,  9.50,  8.91,  8.91],
    11: [80.00, 49.41, 39.21, 34.12, 31.06, 29.02, 27.56, 26.47, 25.62, 24.94, 22.56, 19.00, 16.63, 11.88, 10.10,  9.50,  9.50],
    12: [80.00, 52.05, 42.73, 38.08, 35.28, 33.42, 32.09, 31.09, 30.31, 29.69, 23.75, 21.38, 17.81, 12.47, 10.69, 10.10, 10.10],
    13: [80.00, 54.03, 45.37, 41.04, 38.44, 36.71, 35.48, 34.55, 33.83, 33.25, 26.60, 23.95, 19.95, 13.97, 11.97, 11.31, 11.31],
    14: [80.00, 56.25, 48.33, 44.38, 42.00, 40.42, 39.29, 38.44, 37.78, 37.25, 29.79, 26.82, 22.34, 15.65, 13.41, 12.67, 12.67],
  },
  minSize: 1,
  maxSize: 14
};

// TPU Patches Pricing - Chenille + 10% on all qty 10+ prices
// Qty 1 = $80 flat, qty 2-9 graduated using: total_q = 80 + (total_10 - 80) * (q-1) / 9
// Sizes 1-14 | Same structure as Chenille
const tpuPricing = {
  qtyBreaks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //          1      2      3      4      5      6      7      8      9     10      25      50     100    200    500   1000   5000
    1:  [80.00, 42.82, 30.42, 24.23, 20.51, 18.03, 16.26, 14.93, 13.90, 13.07,  6.53,  3.60,  3.27,  2.29,  1.63,  1.31,  1.31],
    2:  [80.00, 42.82, 30.42, 24.23, 20.51, 18.03, 16.26, 14.93, 13.90, 13.07,  6.53,  3.60,  3.27,  2.29,  1.63,  1.31,  1.31],
    3:  [80.00, 42.82, 30.42, 24.23, 20.51, 18.03, 16.26, 14.93, 13.90, 13.07,  6.53,  4.58,  3.92,  2.94,  1.97,  1.63,  1.63],
    4:  [80.00, 43.54, 31.39, 25.31, 21.66, 19.23, 17.50, 16.19, 15.18, 14.37,  7.19,  5.23,  4.58,  3.92,  2.62,  2.29,  2.29],
    5:  [80.00, 44.27, 32.36, 26.40, 22.83, 20.44, 18.74, 17.47, 16.47, 15.68,  8.49,  7.19,  6.53,  4.58,  3.27,  2.94,  2.94],
    6:  [80.00, 45.72, 34.29, 28.58, 25.15, 22.86, 21.23, 20.00, 19.05, 18.29, 11.76,  9.80,  7.84,  5.23,  4.58,  3.92,  3.92],
    7:  [80.00, 46.44, 35.25, 29.66, 26.30, 24.06, 22.47, 21.27, 20.34, 19.59, 14.37, 11.76,  9.14,  6.53,  5.89,  5.23,  5.23],
    8:  [80.00, 47.17, 36.22, 30.75, 27.47, 25.28, 23.71, 22.54, 21.63, 20.90, 18.29, 15.68, 11.76, 10.13,  7.84,  7.19,  7.19],
    9:  [80.00, 48.62, 38.16, 32.93, 29.80, 27.70, 26.21, 25.09, 24.22, 23.52, 20.90, 18.29, 14.37, 11.11,  9.14,  8.49,  8.49],
    10: [80.00, 49.34, 39.13, 34.02, 30.95, 28.91, 27.45, 26.35, 25.50, 24.82, 23.52, 19.59, 15.68, 12.42, 10.45,  9.80,  9.80],
    11: [80.00, 50.79, 41.06, 36.19, 33.27, 31.32, 29.93, 28.89, 28.08, 27.43, 24.82, 20.90, 18.29, 13.07, 11.11, 10.45, 10.45],
    12: [80.00, 53.70, 44.93, 40.55, 37.92, 36.17, 34.91, 33.98, 33.24, 32.66, 26.13, 23.52, 19.59, 13.72, 11.76, 11.11, 11.11],
    13: [80.00, 55.88, 47.84, 43.82, 41.40, 39.80, 38.65, 37.79, 37.12, 36.58, 29.26, 26.35, 21.95, 15.37, 13.17, 12.44, 12.44],
    14: [80.00, 58.32, 51.10, 47.48, 45.32, 43.87, 42.84, 42.06, 41.46, 40.98, 32.77, 29.50, 24.57, 17.22, 14.75, 13.94, 13.94],
  },
  minSize: 1,
  maxSize: 14
};

// Glitter Patches Pricing - identical to TPU (Chenille + 10%)
const glitterPricing = tpuPricing;

// 3D Embroidery Transfer Pricing
const threeDEmbroideryPricing = {
  qtyBreaks: [10, 25, 50, 100, 250, 500, 1000, 5000],
  prices: {
    // Up to 3 inches
    2:  [13.00, 6.00, 4.00, 2.50, 1.80, 1.60, 1.20, 0.80],
    3:  [13.00, 6.00, 4.00, 2.50, 1.80, 1.60, 1.20, 0.80],
    // Scales up
    4:  [14.00, 6.50, 4.50, 2.80, 2.00, 1.80, 1.35, 0.90],
    5:  [15.00, 7.00, 5.00, 3.50, 2.50, 2.00, 1.50, 1.00],
    6:  [16.00, 8.00, 6.00, 4.00, 3.00, 2.50, 2.00, 1.30],
    7:  [18.00, 10.00, 7.00, 5.00, 3.50, 3.00, 2.50, 1.70],
    8:  [20.00, 12.00, 9.00, 6.00, 4.50, 3.80, 3.00, 2.00],
    9:  [22.00, 14.00, 11.00, 7.00, 5.50, 4.50, 3.50, 2.50],
    10: [25.00, 16.00, 13.00, 9.00, 6.50, 5.50, 4.50, 3.00],
    11: [28.00, 18.00, 14.00, 10.00, 7.50, 6.50, 5.00, 3.50],
    12: [32.00, 20.00, 16.00, 12.00, 9.00, 8.00, 6.00, 4.00]
  },
  minSize: 2,
  maxSize: 12
};

// PVC Pricing - 10% reduction applied, qty 1-9 added
// Qty 1 = $100 flat, qty 2 = $120 total ($60/pc), qty 3-9 interpolates to 10pc total
// Formula: total_q = 120 + (total_10 - 120) * (q-2) / 8, unit = total_q / q
// Qty breaks: 1-9 graduated, then 10, 25, 50, 100, 200, 500, 1000, 5000 | Sizes 1-8
const pvcPricing = {
  qtyBreaks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //           1      2      3      4      5      6      7      8      9     10      25      50     100    200    500   1000   5000
    1:  [100.00, 60.00, 40.16, 30.24, 24.29, 20.32, 17.48, 15.36, 13.70, 12.38,  6.75,  4.50,  3.10,  2.25,  1.69,  1.40,  1.40],
    2:  [100.00, 60.00, 40.16, 30.24, 24.29, 20.32, 17.48, 15.36, 13.70, 12.38,  6.75,  4.50,  3.10,  2.25,  1.69,  1.40,  1.40],
    3:  [100.00, 60.00, 41.10, 31.64, 25.97, 22.19, 19.49, 17.47, 15.89, 14.63,  7.88,  5.63,  3.94,  3.38,  2.82,  2.53,  2.53],
    4:  [100.00, 60.00, 42.03, 33.05, 27.66, 24.07, 21.50, 19.58, 18.08, 16.88,  9.00,  6.75,  5.63,  4.50,  3.94,  3.38,  3.38],
    5:  [100.00, 60.00, 43.44, 35.16, 30.19, 26.88, 24.51, 22.73, 21.35, 20.25, 13.50,  7.32,  6.57,  5.54,  4.50,  4.05,  4.05],
    6:  [100.00, 60.00, 43.91, 35.86, 31.04, 27.82, 25.52, 23.79, 22.45, 21.38, 14.63,  8.10,  6.98,  5.89,  5.43,  4.32,  4.32],
    7:  [100.00, 60.00, 45.78, 38.68, 34.41, 31.57, 29.54, 28.01, 26.83, 25.88, 15.75, 10.13,  8.10,  7.48,  6.66,  5.54,  5.54],
    8:  [100.00, 60.00, 46.72, 40.08, 36.10, 33.44, 31.54, 30.12, 29.01, 28.13, 20.25, 13.50,  9.12,  8.10,  7.16,  5.63,  5.63],
  },
  minSize: 1,
  maxSize: 8
};

// Woven Pricing - 10% below previous benchmark (additional 5% off competitor-benchmarked prices)
// Minimum order: 10 patches | Qty breaks: 10, 25, 50, 100, 200, 500, 1000, 5000 | Sizes 1-8
const wovenPricing = {
  qtyBreaks: [10, 25, 50, 100, 200, 500, 1000, 5000],
  minQty: 10,
  prices: {
    //         10      25      50     100    200    500   1000   5000
    1:  [11.29,  5.08,  4.51,  2.62,  2.46,  1.63,  1.49,  1.49],
    2:  [12.41,  5.08,  4.51,  3.38,  3.11,  2.54,  1.98,  1.98],
    3:  [13.54,  7.33,  4.87,  3.61,  3.51,  2.82,  2.26,  2.26],
    4:  [15.80,  7.89,  5.08,  3.95,  3.67,  3.11,  2.54,  2.54],
    5:  [18.05,  9.25,  5.87,  4.63,  4.07,  3.61,  2.94,  2.94],
    6:  [20.31,  9.64,  6.49,  5.46,  4.43,  4.07,  3.07,  3.07],
    7:  [22.56,  9.98,  6.91,  5.90,  5.02,  4.63,  3.61,  3.61],
    8:  [22.56,  9.98,  6.91,  5.90,  5.02,  4.63,  3.61,  3.61],
  },
  minSize: 1,
  maxSize: 8
};

// Leather Pricing - 10% below previous benchmark
// Qty 1 = $80 flat, qty 2 = $95 total ($47.50/pc), qty 3-9 interpolates to 10pc total
// Qty breaks: 1-9 graduated, then 10, 25, 50, 100, 200, 500, 1000, 5000 | Sizes 1-8
const leatherPricing = {
  qtyBreaks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //          1      2      3      4      5      6      7      8      9     10      25      50     100    200    500   1000   5000
    1:  [80.00, 47.50, 32.16, 24.49, 19.89, 16.83, 14.63, 12.99, 11.71, 10.69,  5.35,  4.11,  3.20,  2.47,  1.74,  1.29,  1.29],
    2:  [80.00, 47.50, 32.38, 24.83, 20.29, 17.27, 15.11, 13.49, 12.23, 11.22,  5.61,  4.19,  3.20,  2.67,  1.97,  1.41,  1.41],
    3:  [80.00, 47.50, 32.83, 25.49, 21.09, 18.16, 16.06, 14.49, 13.27, 12.29,  6.15,  4.53,  3.74,  3.20,  2.14,  1.49,  1.49],
    4:  [80.00, 47.50, 33.05, 25.83, 21.50, 18.61, 16.54, 15.00, 13.79, 12.83,  6.42,  4.82,  4.11,  3.55,  2.40,  2.14,  2.14],
    5:  [80.00, 47.50, 33.95, 27.17, 23.10, 20.39, 18.46, 17.00, 15.87, 14.97,  7.29,  5.18,  4.38,  3.74,  2.67,  2.39,  2.39],
    6:  [80.00, 47.50, 35.73, 29.84, 26.31, 23.95, 22.27, 21.01, 20.03, 19.24,  9.22,  5.89,  5.35,  3.20,  3.20,  2.67,  2.67],
    7:  [80.00, 47.50, 35.73, 29.84, 26.31, 23.95, 22.27, 21.01, 20.03, 19.24,  9.22,  5.89,  5.35,  3.20,  3.20,  2.67,  2.67],
    8:  [80.00, 47.50, 35.73, 29.84, 26.31, 23.95, 22.27, 21.01, 20.03, 19.24,  9.22,  5.89,  5.35,  3.20,  3.20,  2.67,  2.67],
  },
  minSize: 1,
  maxSize: 8
};

// Silicone / Woven Labels Pricing - 10% reduction applied, qty 1-9 added (like PVC)
// Qty 1 = $100 flat, qty 2-9: total_q = 100 + (total_10 - 100) * (q-1) / 9
// Qty breaks: 1-9 graduated, then 10, 25, 50, 100, 200, 500, 1000, 5000 | Sizes 1-4
const siliconePricing = {
  qtyBreaks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //           1      2      3      4      5      6      7      8      9     10     25     50    100    200    500   1000   5000
    1:  [100.00, 50.38, 33.84, 25.58, 20.61, 17.31, 14.94, 13.17, 11.79, 10.69, 4.71,  2.67,  1.55,  1.07,  0.86,  0.77,  0.77],
    2:  [100.00, 50.97, 34.63, 26.46, 21.56, 18.29, 15.95, 14.20, 12.84, 11.75, 4.96,  2.91,  1.74,  1.41,  0.96,  0.95,  0.95],
    3:  [100.00, 51.57, 35.43, 27.36, 22.52, 19.29, 16.98, 15.25, 13.91, 12.83, 6.68,  3.98,  2.83,  2.39,  1.33,  1.07,  1.07],
    4:  [100.00, 52.76, 37.01, 29.14, 24.42, 21.27, 19.02, 17.33, 16.02, 14.97, 7.48,  4.28,  3.20,  3.00,  1.55,  1.31,  1.31],
  },
  minSize: 1,
  maxSize: 4
};

// Sublimated/Printed Pricing - 5% reduction applied, qty 1-9 added
// Qty 1 = $80 flat, qty 2 = $100 total ($50/pc), qty 3-9 interpolates to 10pc total
// Formula: total_q = 100 + (total_10 - 100) * (q-2) / 8, unit = total_q / q
// Qty breaks: 1-9 graduated, then 10, 25, 50, 100, 200, 500, 1000, 5000 | Sizes 1-12
const sublimatedPricing = {
  qtyBreaks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 100, 200, 500, 1000, 5000],
  prices: {
    //          1      2      3      4      5      6      7      8      9     10      25      50     100    200    500   1000   5000
    1:  [80.00, 50.00, 33.87, 25.81, 20.97, 17.74, 15.44, 13.71, 12.37, 11.29,  4.79,  3.67,  1.98,  1.36,  0.85,  0.67,  0.67],
    2:  [80.00, 50.00, 33.87, 25.81, 20.97, 17.74, 15.44, 13.71, 12.37, 11.29,  4.79,  3.67,  1.98,  1.36,  0.85,  0.67,  0.67],
    3:  [80.00, 50.00, 33.87, 25.81, 20.97, 17.74, 15.44, 13.71, 12.37, 11.29,  5.08,  4.24,  2.54,  1.70,  1.02,  0.90,  0.90],
    4:  [80.00, 50.00, 33.87, 25.81, 20.97, 17.74, 15.44, 13.71, 12.37, 11.29,  5.36,  5.08,  3.11,  1.98,  1.13,  1.02,  1.02],
    5:  [80.00, 50.00, 33.87, 25.81, 20.97, 17.74, 15.44, 13.71, 12.37, 11.29,  6.77,  5.64,  3.67,  2.82,  1.70,  1.41,  1.41],
    6:  [80.00, 50.00, 34.81, 27.21, 22.66, 19.62, 17.45, 15.82, 14.55, 13.54, 10.16,  8.46,  5.64,  4.51,  3.38,  2.54,  2.54],
    7:  [80.00, 50.00, 36.22, 29.33, 25.19, 22.43, 20.46, 18.99, 17.84, 16.92, 13.54, 10.16,  8.46,  6.21,  5.08,  4.51,  4.51],
    8:  [80.00, 50.00, 37.16, 30.74, 26.89, 24.32, 22.48, 21.11, 20.04, 19.18, 14.67, 12.41, 10.16,  7.62,  6.77,  5.64,  5.64],
    9:  [80.00, 50.00, 37.63, 31.44, 27.73, 25.26, 23.49, 22.17, 21.14, 20.31, 16.92, 14.67, 13.54, 10.16,  8.46,  6.77,  6.77],
    10: [80.00, 50.00, 39.04, 33.56, 30.27, 28.08, 26.51, 25.33, 24.42, 23.69, 20.31, 16.92, 14.67, 12.41, 10.16,  8.46,  8.46],
    11: [80.00, 50.00, 39.98, 34.96, 31.96, 29.95, 28.52, 27.44, 26.61, 25.94, 22.56, 20.31, 16.92, 14.67, 12.41, 10.16, 10.16],
    12: [80.00, 50.00, 41.39, 37.09, 34.51, 32.78, 31.55, 30.63, 29.92, 29.34, 25.94, 22.56, 20.31, 16.92, 14.67, 12.41, 12.41],
  },
  minSize: 1,
  maxSize: 12
};

// Sequin Pricing - Same as TPU/Glitter (Chenille + 10%, 1-9 graduated from $80)
const sequinPricing = tpuPricing;

interface PricingTable {
  qtyBreaks: number[];
  prices: Record<number, number[]>;
  minSize: number;
  maxSize: number;
  minQty?: number;
}

// Product name to pricing table mapping (exact match first)
const productPricingMap: Record<string, PricingTable> = {
  'Custom Chenille Patches': chenillePricing,
  'Custom Chenille TPU Patches': tpuPricing,
  'Custom Chenille Glitter Patches': glitterPricing,
  'Custom Embroidered Patches': embroideryPricing,
  'Custom Embroidery Patches': embroideryPricing,
  'Custom PVC Patches': pvcPricing,
  'Custom Woven Patches': wovenPricing,
  'Custom Sublimation Patches': sublimatedPricing,
  'Custom Sublimated Patches': sublimatedPricing,
  'Custom Printed Patches': sublimatedPricing,
  'Custom 3D Embroidered Transfer': tpuPricing,
  'Custom 3D Embroidery Transfer': tpuPricing,
  'Custom 3D Embroidered Transfers': tpuPricing,
  'Custom Leather Patches': leatherPricing,
  'Custom Silicone Labels': siliconePricing,
  'Custom Silicone Patches': siliconePricing,
  'Custom Sequin Patches': sequinPricing,
};

// Keyword-based fallback: handles Sanity titles like "Custom Chenille Patches No Minimum"
function getPricingTable(productName: string): PricingTable {
  // 1. Try exact match first
  if (productPricingMap[productName]) return productPricingMap[productName];

  // 2. Keyword match (case-insensitive) — ordered most-specific first
  const name = productName.toLowerCase();
  if (name.includes('tpu'))                               return tpuPricing;
  if (name.includes('glitter'))                           return glitterPricing;
  if (name.includes('chenille'))                          return chenillePricing;
  if (name.includes('3d embroid') || name.includes('3d embroider')) return tpuPricing;
  if (name.includes('pvc'))                               return pvcPricing;
  if (name.includes('woven'))                             return wovenPricing;
  if (name.includes('leather'))                           return leatherPricing;
  if (name.includes('silicone'))                          return siliconePricing;
  if (name.includes('sublim') || name.includes('print')) return sublimatedPricing;
  if (name.includes('sequin'))                            return sequinPricing;
  if (name.includes('embroid'))                           return embroideryPricing;

  // 3. Default to embroidery
  return embroideryPricing;
}

interface PriceResult {
  unitPrice: number;
  totalPrice: number;
  patchSize: number;
  error?: string;
}

/**
 * Calculate patch price based on product type, dimensions, and quantity
 */
export function calculatePatchPrice(
  productName: string,
  width: number,
  height: number,
  quantity: number
): PriceResult {
  const pricing = getPricingTable(productName);

  // Calculate average size (round down to match industry standard for non-square patches)
  const avgSize = Math.floor((width + height) / 2);

  // Bound size to available range
  const lookupSize = Math.max(pricing.minSize, Math.min(pricing.maxSize, avgSize));

  // Enforce per-product minimum quantity
  const minQty: number = pricing.minQty ?? 1;
  if (quantity < minQty) {
    return {
      unitPrice: 0,
      totalPrice: 0,
      patchSize: lookupSize,
      error: `Minimum order is ${minQty} patches for this product`
    };
  }

  // Find quantity tier
  let tierIndex = 0;
  for (let i = 0; i < pricing.qtyBreaks.length; i++) {
    if (quantity >= pricing.qtyBreaks[i]) {
      tierIndex = i;
    }
  }

  // Get unit price
  const unitPrice = pricing.prices[lookupSize][tierIndex];
  const totalPrice = unitPrice * quantity;

  return {
    unitPrice,
    totalPrice,
    patchSize: lookupSize
  };
}

/**
 * Get upsell tiers showing savings at higher quantities
 */
export interface UpsellTier {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  savingsPercent: number;
}

export function getUpsellTiers(
  productName: string,
  width: number,
  height: number,
  currentQuantity: number
): UpsellTier[] {
  const pricing = getPricingTable(productName);
  const avgSize = Math.floor((width + height) / 2);
  const lookupSize = Math.max(pricing.minSize, Math.min(pricing.maxSize, avgSize));

  // Find current tier index
  let currentTierIndex = -1;
  for (let i = 0; i < pricing.qtyBreaks.length; i++) {
    if (currentQuantity >= pricing.qtyBreaks[i]) {
      currentTierIndex = i;
    }
  }

  if (currentTierIndex < 0) return [];

  const currentUnitPrice = pricing.prices[lookupSize][currentTierIndex];

  // Get next 2 tiers
  const upsells: UpsellTier[] = [];
  for (let i = currentTierIndex + 1; i < pricing.qtyBreaks.length && upsells.length < 2; i++) {
    const nextQty = pricing.qtyBreaks[i];
    const nextUnitPrice = pricing.prices[lookupSize][i];
    const savingsPercent = Math.round(((currentUnitPrice - nextUnitPrice) / currentUnitPrice) * 100);

    if (savingsPercent > 0) {
      upsells.push({
        quantity: nextQty,
        unitPrice: nextUnitPrice,
        totalPrice: nextQty * nextUnitPrice,
        savingsPercent,
      });
    }
  }

  return upsells;
}

/**
 * Get representative pricing tiers for structured data schema (server-side).
 * Uses a standard 3" patch (size 3) at common quantity breaks.
 */
export function getSchemaPricingTiers(productName: string): { minQuantity: number; unitPrice: number }[] {
  const pricing = getPricingTable(productName);
  const lookupSize = Math.max(pricing.minSize, Math.min(pricing.maxSize, 3));
  const schemaQtys = [25, 50, 100, 500, 1000];

  return schemaQtys
    .filter(qty => pricing.qtyBreaks.includes(qty))
    .map(qty => {
      const tierIndex = pricing.qtyBreaks.indexOf(qty);
      return { minQuantity: qty, unitPrice: pricing.prices[lookupSize][tierIndex] };
    });
}
