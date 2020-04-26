import * as React from 'react';

export const CELL_WIDTH = 20;
export interface IBoardCellProps {
  column: number;
  row: number;
}

export default function BoardCell (props: IBoardCellProps) {
  const style: React.CSSProperties = {
    left: 11 + props.column * CELL_WIDTH,
    top: 1 + props.row * CELL_WIDTH,
  }
  return (
    <div className="cell alive" data-column={props.column} data-row={props.row} style={style}/>
  );
}
