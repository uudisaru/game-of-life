import { CellIndex } from './CellIndex';

export enum CellState {
  Alive,
  Dead,
}

export class Cell {
  private _state?: CellState;
  private _next?: CellState;
  
  constructor(readonly index: CellIndex) {}

  get state() {
    return this._state;
  }

  set next(value: CellState) {
    this._next = value;
  }

  public cycle() {
    this._state = this._next;
  }
}
