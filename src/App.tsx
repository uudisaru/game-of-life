import React, { useRef, useCallback, useEffect } from 'react';
import './App.css';
import Board, { Dimensions } from "./Board";
import { theme, ThemeProvider, CSSReset } from "@chakra-ui/core";
import GameControls, { GameState } from "./GameControls";
import { useState } from 'react';
import { Game } from "./game/Game";
import { CellIndex } from "./game/CellIndex";

// Let's say you want to add custom colors
const customTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      900: "#1a365d",
      800: "#153e75",
      700: "#2a69ac",
    },
  },
};


function App() {
  const [alive, setAlive] = useState<CellIndex[]>([]);
  const [interval, setInterval] = useState(1000);
  const [pattern, setPattern] = useState<string>("");
  const [state, setState] = useState(GameState.Initial);
  const game = useRef<Game | null>(null);
  const initGame = useCallback(
    (dimensions: Dimensions) => {
      if (!game.current || game.current.rows !== dimensions.rows || game.current.columns !== dimensions.columns) {
        game.current = new Game(dimensions.rows, dimensions.columns);
        setAlive(game.current.alive());
      }
    },
    [],
  );
  const select = useCallback(
    (index: CellIndex) => {
      if (game.current) {
        // Ignore clicks outside of selected area
        if (index.column >= 0 && index.column < game.current.columns &&
          index.row >= 0 && index.row < game.current.rows) {
          game.current.select(index);
        }
        setAlive(game.current.alive());
      }
    }, []);
    const random = useCallback(
    () => {
      if (game.current) {
        setAlive(game.current.random());
      }
    }, []);
  
  useEffect(() => {
    let intervalId: number | null = null;
    if (state === GameState.Playing && !intervalId) {
      intervalId = window.setInterval(() => {
        game.current?.step();
        const nextState = game.current!.alive();
        setAlive(nextState);
        if (nextState.length === 0) {
          setState(GameState.Initial);
        }
      }, interval);
    }
    if (state === GameState.Initial && intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }

    return () => {
      if (!!intervalId) {
        window.clearInterval(intervalId);
        intervalId = null;
      }
    };
  }, [interval, state])


  return (
    <ThemeProvider theme={customTheme}>
      <CSSReset />
      <GameControls
        changeInterval={setInterval}
        changeState={setState}
        clear={() => {
          if (game.current) {
            game.current.clear();
            setAlive([]);
            setPattern("");
          }
        }}
        hasAliveCells={alive.length > 0}
        interval={interval}
        pattern={pattern}
        random={random}
        selectPattern={(id, pattern) => {
          if (game.current) {
            game.current.selectPattern(pattern);
            setAlive(game.current.alive());
            setPattern(id);
          }
          
        }}
        state={state} />
      <Board
        alive={alive}
        columns={game.current?.columns}
        rows={game.current?.rows}
        select={select}
        setDimensions={initGame}
        state={state} />
    </ThemeProvider>
  );
}

export default App;
