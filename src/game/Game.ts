import { Cell, CellState } from "./Cell";
import { CellIndex } from './CellIndex';
import { GamePattern, dimensions, PatternStyle } from "./patterns";

export class Game {
  private _grid: Cell[];

  /**
   * Initialize the Conway's game of life
   * @param rows Number of rows in the grid
   * @param columns Number of columns in the grid
   * @param chanceToLive Chance to live in the beginning (default 0.05 i.e. 5%)
   */
  constructor(
    readonly rows: number,
    readonly columns: number,
    readonly chanceToLive: number = 0.05,
    initGrid: boolean = true
  ) {
    this._grid = new Array(rows * columns);
    if (initGrid) {
      this.init();
    } else {
      this.initEmpty();
    }
  }

  public alive = () => {
    return this._grid
      .filter((cell) => cell.state === CellState.Alive)
      .map((cell) => cell.index);
  };

  public clear = () => {
    this._grid.forEach(cell => {
      cell.next = CellState.Dead;
      cell.cycle();
    });
  }

  get grid() {
    return this._grid;
  }

  public random = () => {
    this._grid.forEach(cell => {
      cell.next = this.randomState();
      cell.cycle();
    });

    return this.alive();
  }

  public select = (index: CellIndex) => {
    const cell = this.getCell(index);
    if (cell) {
      cell.next = cell.state === CellState.Alive ? CellState.Dead : CellState.Alive;
      cell.cycle();
    }
  };

  public selectPattern = (pattern: GamePattern) => {
    const [rows, columns] = dimensions(pattern.pattern)

    // Skip empty pattern
    if (rows >= 0 && columns >= 0) {
      const startRow = Math.floor((this.rows - rows) / 2);
      const startColumn = pattern.type === PatternStyle.Spaceship? 1 : Math.floor((this.columns - columns) / 2);

      this.clear();
      pattern.pattern.forEach(index => {
        const cell = this.getCell({row: startRow + index[0], column: startColumn + index[1]});
        if (cell) {
          cell.next = CellState.Alive;
          cell.cycle()
        }
      });
    }
  }

  public step = () => {
    this._grid.forEach((cell) => this.calcNext(cell));
    this._grid.forEach((cell) => cell.cycle());
  };


  private calcNext = (cell: Cell) => {
    const index = cell.index;
    const neighbors = [
      { row: index.row - 1, column: index.column - 1 },
      { row: index.row - 1, column: index.column },
      { row: index.row - 1, column: index.column + 1 },
      { row: index.row, column: index.column - 1 },
      { row: index.row, column: index.column + 1 },
      { row: index.row + 1, column: index.column - 1 },
      { row: index.row + 1, column: index.column },
      { row: index.row + 1, column: index.column + 1 },
    ]
    .map((neighbor) => this.getCell(neighbor))
    .filter((cell) => !!cell)
    .filter((cell) => cell!.state === CellState.Alive);

    const aliveNeighbors = neighbors.length;
    if (cell.state === CellState.Alive) {
      cell.next = (aliveNeighbors === 2 || aliveNeighbors === 3) ? CellState.Alive : CellState.Dead;
    } else {
      cell.next = aliveNeighbors === 3 ? CellState.Alive : CellState.Dead;
    }
  };

  private getCell = (index: CellIndex) => {
    if (this.isValidIndex(index)) {
      return this._grid[index.row * this.columns + index.column];
    }

    return null;
  }

  private init = () => {
    let i = 0;
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++, i++) {
        const cell = new Cell({ row, column });
        cell.next = this.randomState();
        cell.cycle();
        this._grid[i] = cell;
      }
    }
  };

  private initEmpty = () => {
    let i = 0;
    for (let row = 0; row < this.rows; row++) {
      for (let column = 0; column < this.columns; column++, i++) {
        const cell = new Cell({ row, column });
        cell.next = CellState.Dead;
        cell.cycle();
        this._grid[i] = cell;
      }
    }
  }

  private isValidIndex = (index: CellIndex) => {
    return index.row >= 0 && index.row < this.rows && index.column >= 0 && index.column < this.columns;
  }

  private randomState() {
    return Math.random() < this.chanceToLive ? CellState.Alive : CellState.Dead;
  }
}
