import React from 'react';
import Repeat from '../components/control/Repeat';
import Wait from '../components/control/Wait';
import MoveX from '../components/motion/MoveX';
import MoveXY from '../components/motion/MoveXY';
import MoveY from '../components/motion/MoveY';
import TurnAntiClockWise from '../components/motion/TurnAntiClockwise';
import TurnClockWise from '../components/motion/TurnClockwise';

export const renderSideBarComponentBasedOnType = (componentType, id, spriteId) => {
  switch (componentType) {
    case 'MOVE_X':
      return <MoveX componentId={id} spriteId={spriteId} />;
    case 'MOVE_Y':
      return <MoveY componentId={id} spriteId={spriteId}/>;
    case 'MOVE_XY':
      return <MoveXY componentId={id} spriteId={spriteId}/>;
    case 'TURN_CLOCKWISE':
      return <TurnClockWise componentId={id} spriteId={spriteId}/>;
    case 'TURN_ANTI_CLOCKWISE':
      return <TurnAntiClockWise componentId={id} spriteId={spriteId}/>;

    case 'WAIT':
      return <Wait componentId={id}/>;
    case 'REPEAT':
      return <Repeat componentId={id} />;
    default:
      return null;
  }
};
