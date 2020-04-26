export enum PatternStyle {
  StillLife = "Still life",
  Oscillator = "Oscillator",
  Spaceship = "Spaceship",
}

export type PatternIndex = Array<[number, number]>;
export interface GamePattern {
  name?: string;
  pattern: PatternIndex;
  type: PatternStyle;
}

export interface GamePatterns {
  [key: string]: GamePattern;
}

const PULSAR_SECTOR: PatternIndex = [
  [0, 2], [0, 3], [0, 4],
  [2, 0], [2, 5],
  [3, 0], [3, 5],
  [4, 0], [4, 5],
  [5, 2], [5, 3], [5, 4],
];

const PENTA_DECA_HALF: PatternIndex = [
  [0, 2],
  [1, 1], [1, 2], [1, 3],
  [2, 0], [2, 1], [2, 2], [2, 3], [2, 4],
];

export function dimensions(pattern: PatternIndex) {
  let rows = -1;
  let columns = -1;
  pattern.forEach(element => {
    if (element[0] > rows) {
      rows = element[0];
    }
    if (element[1] > columns) {
      columns = element[1];
    }
  });

  return [rows, columns];
}

function move(index: PatternIndex, rows: number, colums: number): PatternIndex {
  return index.map(cell => [cell[0] + rows, cell[1] + colums]);
}

function flipRight(index: PatternIndex): PatternIndex {
  const columns = dimensions(index)[1];
  return index.map(cell => [cell[0], columns - cell[1]]);
}

function flipDown(index: PatternIndex): PatternIndex {
  const rows = dimensions(index)[0];
  return index.map(cell => [rows - cell[0], cell[1]]);
}

export const patterns: GamePatterns = {
  beehive: {
    pattern: [[0, 1], [0, 2], [1, 0], [1, 3], [2, 1], [2, 2]],
    type: PatternStyle.StillLife
  },
  block: {
    pattern: [[0, 0], [0, 1], [1, 0], [1, 1]],
    type: PatternStyle.StillLife
  },
  boat: {
    pattern: [[0, 0], [0, 1], [1, 0], [1, 2], [2, 1]],
    type: PatternStyle.StillLife
  },
  loaf: {
    pattern: [[0, 1], [0, 2], [1, 0], [1, 3], [2, 1], [2, 3], [3, 2]],
    type: PatternStyle.StillLife
  },
  tub: {
    pattern: [[0, 1], [1, 0], [1, 2], [2, 1]],
    type: PatternStyle.StillLife
  },
  beacon: {
    pattern: [
      [0, 0], [0, 1], [1, 0], [1, 1],
      [2, 2], [2, 3], [3, 2], [3, 3]
    ],
    type: PatternStyle.Oscillator
  },
  blinker: {
    pattern: [[0, 0], [0, 1], [0, 2]],
    type: PatternStyle.Oscillator
  },
  pulsar: {
    pattern: [
      ...PULSAR_SECTOR,
      ...move(flipDown(PULSAR_SECTOR), 7, 0),
      ...move(flipRight(PULSAR_SECTOR), 0, 7),
      ...move(flipRight(flipDown(PULSAR_SECTOR)), 7, 7),
    ],
    type: PatternStyle.Oscillator
  },
  pentaDecathlon: {
    name: "penta-decathlon",
    pattern: [
      ...PENTA_DECA_HALF,
      ...move(flipDown(PENTA_DECA_HALF), 9, 0),
    ],
    type: PatternStyle.Oscillator
  },
  toad: {
    pattern: [[0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 2]],
    type: PatternStyle.Oscillator
  },
  glider: {
    pattern: [
      [0, 1],
      [1, 2],
      [2, 0], [2, 1], [2, 2]
    ],
    type: PatternStyle.Spaceship
  },
  heavyweigt: {
    pattern: [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
      [1, 0], [1, 6],
      [2, 6],
      [3, 0], [3, 5],
      [4, 2], [4, 3],
    ],
    type: PatternStyle.Spaceship
  },
  lightweigt: {
    pattern: [
      [0, 0], [0, 3],
      [1, 4],
      [2, 0], [2, 4],
      [3, 1], [3, 2], [3, 3], [3, 4],
    ],
    type: PatternStyle.Spaceship
  },
  middleweigt: {
    pattern: [
      [0, 2],
      [1, 0], [1, 4],
      [2, 5],
      [3, 0], [3, 5],
      [4, 1], [4, 2], [4, 3], [4, 4], [4, 5],
    ],
    type: PatternStyle.Spaceship
  },
}
