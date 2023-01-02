import {interpret, createMachine} from 'xstate';
import shuffle from 'array-shuffle';

import * as actions from './actions/index.js';
import * as guards from './guards/index.js';
import * as services from './services/index.js';
import machineDef from './main.definition.js';

const machine = () =>
  createMachine(machineDef(), {actions, guards, services});

// Returns a reference to the main machine as well as a function to start the game.
export default () => {
  const game = interpret(machine());
  const start = (events) => {
    game.start();
    // TODO: randomly select occupation cards and minor improvement cards.
    game.send(events ?? [{
      type: 'SETUP_GAME',
      rounds: [
        ...shuffle([ '1-sow-and-or-bake-bread'
                   , '1-major-or-minor-improvement'
                   , '1-sheep'
                   , '1-fences']),
        ...shuffle([ '2-stone'
                   , '2-after-renovation-also-major-or-minor-improvement'
                   , '2-after-family-growth-also-minor-improvement']),
        ...shuffle([ '3-vegetable'
                   , '3-wild-boar']),
        ...shuffle([ '4-stone'
                   , '4-cattle']),
        ...shuffle([ '5-plow-and-or-sow-field'
                   , '5-family-growth-even-without-room']),
                     '6-after-renovation-also-fences'
      ]
    }]);
  };
  return [game, start];
};
