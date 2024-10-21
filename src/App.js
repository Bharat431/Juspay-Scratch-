import { Button, Toolbar, Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import MidArea from './components/MidArea';
import PreviewArea from './components/PreviewArea';
import Sidebar from './components/Sidebar';
import { updateBlockList } from './redux/sprites.slice';

export default function App() {
  const state = useSelector((state) => state.spriteUseCase);
  const dispatch = useDispatch();

  console.log(state);

  // Handle drag and drop events
  const onDragEnd = (result) => {
    let element = result.draggableId.split('-')[0];

    let oldBlocksList = [...state.midAreaBlocks];
    // Get source index in present blocks list
    let idx = oldBlocksList.findIndex(
      (x) => x.id === result.source.droppableId
    );

    // If found remove the block from that list
    if (idx > -1) {
      let updatedList = oldBlocksList[idx].elements;
      const newSourceBlockList = [...updatedList];
      newSourceBlockList.splice(result.source.index, 1);
      oldBlocksList[idx] = {
        ...oldBlocksList[idx],
        elements: newSourceBlockList,
      };

      // Update list in redux
      dispatch(
        updateBlockList({
          list: newSourceBlockList,
          id: oldBlocksList[idx].id,
        })
      );
    }

    // Get destination index in present blocks list
    let destIndex = oldBlocksList.findIndex(
      (x) => x.id === result.destination.droppableId
    );

    // If found update the block list
    if (destIndex > -1) {
      let destElementList = oldBlocksList[destIndex].elements;
      const newDestElementList = [...destElementList];
      newDestElementList.splice(result.destination.index, 0, element);
      oldBlocksList[destIndex] = {
        ...oldBlocksList[destIndex],
        elements: newDestElementList,
      };

      // Update list in redux
      dispatch(
        updateBlockList({
          list: newDestElementList,
          id: oldBlocksList[destIndex].id,
        })
      );
    }
  };



  return (
    <div className='bg-blue-100 font-sans'>
      <AppBar position='sticky' top='0'>
        <Toolbar>
          <img src='/Scratch.png' alt='Scratch' style={{ height: '50px', position: 'absolute', left: '10px', top: '10px' }} />
          <Typography
            variant='h5'
            style={{
              fontWeight: 'bold',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          >
            Scratch
          </Typography>
        </Toolbar>
      </AppBar>
      <div className='h-screen overflow-hidden flex flex-row'>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2 z-20'>
            <Sidebar /> <MidArea />
          </div>
          <div className='w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2'>
            <PreviewArea />
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
