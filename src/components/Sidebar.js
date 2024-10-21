import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';

import {
  controlComponentsNameSpaces,
  motionComponentsNameSpaces,
} from '../constants/constant';
import { renderSideBarComponentBasedOnType as renderComponentBasedOnType } from '../helpers/index.helper';

export default function Sidebar() {
  return (
    <div className='w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200'>
      {/*  Motion sidebar component rendering */}
      <div className='font-bold'>Motion</div>
      <Droppable droppableId='sidebar-motion' type='COMPONENTS'>
        {(provided) => (
          <ul
            className='sideArea-motion my-3'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {motionComponentsNameSpaces.map((x, i) => {
              return (
                <Draggable
                  key={`${x}-sideArea`}
                  draggableId={`${x}-sideArea`}
                  index={i}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='my-2'
                    >
                      {renderComponentBasedOnType(x, i)}
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

      {/*  Control sidebar component rendering */}
      <div className='font-bold'> Control </div>
      <Droppable droppableId='sidebar-control' type='COMPONENTS'>
        {(provided) => (
          <ul
            className='sideArea-control my-3'
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {controlComponentsNameSpaces.map((x, i) => {
              return (
                <Draggable
                  key={`${x}-sideArea`}
                  draggableId={`${x}-sideArea`}
                  index={i}
                >
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className='my-2'
                    >
                      {renderComponentBasedOnType(x, i)}
                    </li>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>

    </div>
  );
}
