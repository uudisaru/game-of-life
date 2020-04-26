import * as React from 'react';
import { ButtonGroup, Flex, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, FormLabel, Tooltip, IconButton, FormControl, Select } from "@chakra-ui/core";
import { MdPause, MdPlayArrow, MdRefresh, MdClear, MdTouchApp } from "react-icons/md";
import { patterns, GamePattern } from "./game/patterns";

export enum GameState {
  Initial = "initial",
  Selecting = "selecting",
  Playing = "playing",
}

export interface IGameControlsProps {
  changeInterval: (val: number) => void;
  changeState: (state: GameState) => void;
  clear: () => void;
  hasAliveCells: boolean;
  interval: number;
  pattern: string;
  random: () => void;
  selectPattern?: (id: string, pattern: GamePattern) => void;
  state: GameState;
}

export default function GameControls(props: IGameControlsProps) {
  const isSelecting = props.state === GameState.Selecting;
  const isInitial = isSelecting || props.state === GameState.Initial;
  const playing = props.state === GameState.Playing;
  const playLabel = playing ? "Pause" : (isInitial ? "Start" : "Continue");

  return (
    <Flex className="controls" justify="center" height="110px">
      <Flex direction="column" justify="center">
        <ButtonGroup mt={3} mb={2}>
          <Tooltip hasArrow aria-label={playLabel} label={playLabel + " game"} placement="bottom" zIndex={2}>
            <IconButton aria-label={playLabel}
              icon={playing ? MdPause : MdPlayArrow}
              isDisabled={!props.hasAliveCells}
              onClick={() => {
                props.changeState(
                  props.state === GameState.Playing ? GameState.Initial : GameState.Playing
                );
              }}
              variantColor="teal" />
          </Tooltip>
          <Tooltip hasArrow aria-label="Select" label="Select random cells" placement="bottom" zIndex={2}>
            <IconButton aria-label="Select"
              className={isSelecting ? "checked-button" : "unchecked-button"}
              icon={MdTouchApp}
              isDisabled={!isInitial}
              ml={3}
              onClick={() => {
                props.changeState(isSelecting ? GameState.Initial : GameState.Selecting);
              }}
              variantColor="teal" />
          </Tooltip>
          <Tooltip hasArrow aria-label="Random" label="Select random cells" placement="bottom" zIndex={2}>
            <IconButton aria-label="Random"
              icon={MdRefresh}
              isDisabled={!isInitial}
              ml={3}
              onClick={props.random}
              variantColor="teal" />
          </Tooltip>
          <Tooltip hasArrow aria-label="Clear" label="Clear all cells" placement="bottom" zIndex={2}>
            <IconButton aria-label="Clear"
              icon={MdClear}
              isDisabled={!isInitial || !props.hasAliveCells}
              ml={3}
              onClick={props.clear}
              variantColor="teal" />
          </Tooltip>
        </ButtonGroup>
        <Flex>
          <FormLabel mt={2} htmlFor="interval" isDisabled={playing}>Refresh ms:</FormLabel>
          <NumberInput id="interval"
            isDisabled={playing}
            max={10000}
            mb="7px"
            min={100}
            onChange={(val) => {
              props.changeInterval(Number(val));
            }}
            step={100}
            value={props.interval}
            w={100}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Flex>
      </Flex>
      <FormControl ml={4} mt={4} isDisabled={!isInitial}>
        <FormLabel htmlFor="pattern">Preselected patterns</FormLabel>
        <Select id="pattern"
          placeholder="Select pattern"
          onChange={(e) => {
            const value = e.target?.value;
            if (value && props.selectPattern) {
              props.selectPattern(value, patterns[value]);
            }
          }}
          value={props.pattern}
          >
          {Object.entries(patterns).map(([key, pattern]) =>
            (<option key={key} value={key}>
              {pattern.type + " - " + (pattern.name || key)}
            </option>)
          )}
        </Select>
      </FormControl>
    </Flex>
  );
}
