import React, { useCallback, useLayoutEffect, useRef } from "react";
import BoardCell, { CELL_WIDTH } from './BoardCell';
import { CellIndex } from "./game/CellIndex";
import { GameState } from "./GameControls";

export interface IBoardProps {
  alive: CellIndex[];
  columns?: number;
  rows?: number;
  setDimensions: (dimensions: Dimensions) => void;
  select: (index: CellIndex) => void;
  state: GameState;
}

export interface Dimensions {
  columns: number;
  rows: number;
}

export default function Board(props: IBoardProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const {state, select, setDimensions} = props;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (state === GameState.Selecting) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        const index = {
          column: Math.floor((x - 11) / CELL_WIDTH),
          row: Math.floor((y - 1) / CELL_WIDTH),
        };
        select(index);
      }
    }, [select, state]);
  useLayoutEffect(() => {
    if (targetRef.current) {
      const width = targetRef.current!.offsetWidth;
      const height = targetRef.current!.offsetHeight;
      // Leave padding 
      const columns = Math.floor((width - 20) / CELL_WIDTH);
      const rows = Math.floor((height - 20) / CELL_WIDTH);
      setDimensions({columns, rows});
    }
  }, [setDimensions]);

  let className = "board";
  let columnBorders = [];
  let rowBorders = [];
  if (props.state === GameState.Selecting && props.columns && props.rows) {
    className += " grid"
    for (let col = 1; col < props.columns; col++) {
      columnBorders.push(<div className="column" key={col} style={{left: 10 + CELL_WIDTH * col}}/>)
    }
    for (let row = 1; row < props.rows; row++) {
      rowBorders.push(<div className="row" key={row} style={{top: CELL_WIDTH * row}}/>)
    }
  }
  return (
    <div className={className} onClick={handleClick} ref={targetRef}>
      {props.alive.map((cell, index) => {
        return <BoardCell key={index} column={cell.column} row={cell.row} />
      })}
      {columnBorders}
      {rowBorders}
    </div>
  );
}
