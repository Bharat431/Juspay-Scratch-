import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const MoveX = ({ componentId, spriteId }) => {
  // const activeSprite = useSelector((state) => state.spriteUseCase.activeSprite);
  const activeSprite = "sprite1"
  const [steps, setSteps] = useState(0);

  const handleClick = () => {
    const el = document.getElementById(`${spriteId}-div`);
    // const el = document.getElementById(componentId);
    const facingDirection = el.style.transform === 'scaleX(-1)' ? -1 : 1;
    var left = el.offsetLeft;
    el.style.position = 'relative';
    el.style.left = left + facingDirection * steps + 'px';
  };

  return (
    <div>
      <div
        id={componentId}
        className={`text-center rounded bg-blue-400 text-white p-2 my-2 text-sm cursor-pointer mx-auto`}
        onClick={handleClick}
      >
        Move X{' '}
        <input
          type='number'
          className='text-black text-center w-16 mx-2'
          value={steps}
          onChange={(e) => setSteps(parseInt(e.target.value))}
        />{' '}
        steps{' '}
        <div className='flex justify-center'>
          <button
            className={`px-2 py-1 rounded-l bg-blue-400 text-white border border-blue-400 ${
              steps >= 0 ? 'bg-blue-600' : ''
            }`}
            onClick={() => setSteps(Math.abs(steps))}
          >
            Forward
          </button>
          <button
            className={`px-2 py-1 rounded-r bg-blue-400 text-white border border-blue-400 ${
              steps < 0 ? 'bg-blue-600' : ''
            }`}
            onClick={() => setSteps(-Math.abs(steps))}
          >
            Backward
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveX;

