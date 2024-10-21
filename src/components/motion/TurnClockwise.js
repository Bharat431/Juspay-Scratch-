import Paper from '@material-ui/core/Paper';
import RedoIcon from '@material-ui/icons/Redo';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAngleOfSprite } from '../../redux/sprites.slice';

const TurnClockWise = ({ componentId, spriteId }) => {
  const [angle, setAngle] = useState(0);

  const dispatch = useDispatch();

  const state = useSelector((state) => state.spriteUseCase);

  const handleClick = () => {
    const el = document.getElementById(`${spriteId}-div`);
    const character_angle = state.sprites.find(
      (x) => x.id === spriteId
    );
    if (character_angle) {
      el.style.transform = `rotate(${character_angle.angle + angle}deg)`;
      dispatch(setAngleOfSprite(character_angle.angle + angle));
    }
  };

  return (
    <Paper elevation={3}>
      <div className='text-center rounded bg-blue-500 p-2 my-3'>
        <div className='grid grid-cols-2'>
          <div className='text-white'>Rotate By:</div>
          <input
            className='mx-2 p-1 py-0 text-center'
            type='number'
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
          />
        </div>
        <div
          id={componentId}
          className={`flex bg-blue-400 text-white px-2 py-1 mt-3 mb-1 text-sm cursor-pointer text-center`}
          onClick={() => handleClick()}
        >
          <div className='flex mx-auto'>
            Turn
            <RedoIcon className='mx-2' /> {angle} degrees
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default TurnClockWise;
