import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const MoveXY = ({ componentId, spriteId }) => {
  const activeSprite = useSelector((state) => state.spriteUseCase.activeSprite);

  const [state, setState] = useState({
    goto_x: 0,
    goto_y: 0,
  });

  const moveToXY = () => {
    const el = document.getElementById(`${spriteId}-div`);
    el.style.position = 'relative';
    el.style.left = state.goto_x + 'px';
    el.style.top = state.goto_y + 'px';
  };

  return (
    <Paper elevation={3}>
      <div className='text-center rounded bg-blue-400 p-2 my-3'>
        <div className='grid grid-cols-2 my-2'>
          <div className='text-white'> X</div>
          <input
            className='mx-2 p-1 py-0 text-center'
            type='number'
            value={state.goto_x}
            onChange={(e) => {
              parseInt(e.target.value) !== 0 &&
                setState({ ...state, goto_x: parseInt(e.target.value) });
            }}
          />
        </div>
        <div className='grid grid-cols-2 my-2'>
          <div className='text-white'>Y</div>
          <input
            className='mx-2 p-1 py-0 text-center'
            type='number'
            value={state.goto_y}
            onChange={(e) => {
              parseInt(e.target.value) !== 0 &&
                setState({ ...state, goto_y: parseInt(e.target.value) });
            }}
          />
        </div>
        <div
          id={componentId}
          className='text-center bg-blue-400 text-white px-2 py-1 my-2 text-sm cursor-pointer'
          onClick={() => moveToXY()}
        >
          Go to X : {state.goto_x} Y : {state.goto_y}
        </div>
      </div>
    </Paper>
  );
};

export default MoveXY;
