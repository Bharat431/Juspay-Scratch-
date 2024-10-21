import Paper from '@material-ui/core/Paper';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setWaitEvents } from '../../redux/sprites.slice';

const Wait = ({ componentId }) => {
  const [wait, setStateWait] = useState(0);

  const dispatch = useDispatch();
  const waitState = useSelector((state) => state.spriteUseCase.wait);

  // Set Wait value for current component
  function handleChange(e) {
    let val = parseInt(e.target.value);
    setStateWait(val);
    let curr = waitState;
    curr = { ...curr, [componentId]: val };
    dispatch(setWaitEvents(curr));
  }
  return (
    // Wait Component
    <Paper elevation={3}>
      <div className=' text-center rounded bg-red-400 p-2 my-3'>
        <div className='grid grid-cols-2 my-2'>
          <div className='text-white'>Wait</div>
          <input
            className='mx-2 p-1 py-0 text-center'
            type='number'
            value={wait}
            onChange={handleChange}
          />
        </div>
        <div
          id={componentId}
          className='text-center bg-red-600 text-white px-2 py-1 my-2 text-sm cursor-pointer'
        >
          Wait {wait} seconds
        </div>
      </div>
    </Paper>
  );
};

export default Wait;
