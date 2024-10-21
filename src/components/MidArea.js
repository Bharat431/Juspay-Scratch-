import { Button, Paper, Snackbar, SnackbarContent, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Checkbox, IconButton, Select, MenuItem , Tooltip, ColorLens, Chip } from '@material-ui/core';
import { AddCircleOutline, PlayArrowOutlined, Close, DragIndicator, Delete, TextFields, CheckBox, Label } from '@material-ui/icons';
import React, { useState, useEffect } from 'react';
import {DragDropContext,Draggable, Droppable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { renderSideBarComponentBasedOnType } from '../helpers/index.helper';
import { addANewBlock, updateBlockList } from '../redux/sprites.slice';
import { CollisionHandler } from '../helpers/collision-handler';
import { ChromePicker } from 'react-color';

export default function MidArea() {
  const dispatch = useDispatch();

  const blocksList = useSelector((state) => state.spriteUseCase.midAreaBlocks);
  const waitList = useSelector((state) => state.spriteUseCase.wait);
  const repeatList = useSelector((state) => state.spriteUseCase.repeat);

  const [running, setRunning] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newBlockName, setNewBlockName] = useState('');
  const [runWithoutRefresh, setRunWithoutRefresh] = useState(false);
  const [errorSnackbar, setErrorSnackbar] = useState(false);
  const [inputType, setInputType] = useState('');
  const [inputLabel, setInputLabel] = useState('');
  const [customBlockInputs, setCustomBlockInputs] = useState([]);

  // Existing functions (keep these as they are)
  const fireEvent = (element, eventType) => {
    if (element && element.fireEvent) {
      element.fireEvent('on' + eventType);
    } else if (element) {
      var evObj = document.createEvent('Events');
      evObj.initEvent(eventType, true, false);
      element.dispatchEvent(evObj);
    }
  };

  const handleBlockRun = (arr, id) => {
    if (arr.length === 0) return;
    let i = 0;

    let repeat = 1;

    let str1 = `element${arr[i]}-${id}-${i}`;

    // if first inde is WAIT
    if (arr[i] === 'WAIT') {
      let str2 = `element${arr[i]}-${id}-${i}`;
      let last_time = new Date().getTime();
      let curr_time = new Date().getTime();

      while ((curr_time - last_time) / 1000 < waitList[str2] - 2) {
        curr_time = new Date().getTime();
      }
    }
    // if first index is repeat
    else if (arr[i] === 'REPEAT') {
      repeat = repeatList[str1] + 1;
    } else {
      fireEvent(document.getElementById(str1), 'click');
    }

    i++;

    /* Each function execution takes 2 seconds */
    var cnt = setInterval(() => {
      if (i === arr.length) {
        clearInterval(cnt);
      }

      // Handle Wait
      if (arr[i] === 'WAIT') {
        let str2 = `element${arr[i]}-${id}-${i}`;
        let last_time = new Date().getTime();
        let curr_time = new Date().getTime();

        while ((curr_time - last_time) / 1000 < waitList[str2] - 2) {
          curr_time = new Date().getTime();
        }
        i++;
      }
      // Handle Repeat element at current index
      else if (arr[i] === 'REPEAT') {
        let str2 = `element${arr[i]}-${id}-${i}`;
        repeat = repeat * (repeatList[str2] + 1);
        i++;
      }
      // If Repeat element is at previous index
      else if (arr[i - 1] === 'REPEAT' && repeat > 2) {
        let str2 = `element${arr[i]}-${id}-${i}`;
        fireEvent(document.getElementById(str2), 'click');
        repeat--;
      } else {
        let str2 = `element${arr[i]}-${id}-${i}`;
        fireEvent(document.getElementById(str2), 'click');
        i++;
      }
    }, 2000);
    // }
  };

  const handleCollisionChecker = (spriteId) => {
    setRunning(prev => [...prev, spriteId]);
    setInterval(()=>{
      const removeFromPrev = running.filter(sprite=> sprite.spriteId != spriteId);
      setRunning(removeFromPrev);
    }, 2000)
  };

  const handleMoveClick = (spriteId, steps) => {
    const el = document.getElementById(`${spriteId}-div`);
    // const el = document.getElementById(componentId);
    const facingDirection = el.style.transform === 'scaleX(-1)' ? -1 : 1;
    var left = el.offsetLeft;
    el.style.position = 'relative';
    el.style.left = left + facingDirection * steps + 'px';
  };

  const simulateCollision = () => {
    // const el1 = document.getElementById(`sprite0-div`);
    // const el2 = document.getElementById(`sprite1-div`);
    handleMoveClick("sprite0",100);
    handleMoveClick("sprite1",100);
  
    setTimeout(()=>{
      
      handleMoveClick("sprite0",100);
      handleMoveClick("sprite1",100);
    }, 3000)
  };

  // Dialog functions
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setNewBlockName('');
    setRunWithoutRefresh(false);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleNewBlockNameChange = (e) => {
    setNewBlockName(e.target.value);
  };

  const handleAddInput = (type) => {
    setCustomBlockInputs([...customBlockInputs, { type, value: '' }]);
  };

  const handleInputChange = (index, value) => {
    const newInputs = [...customBlockInputs];
    newInputs[index].value = value;
    setCustomBlockInputs(newInputs);
  };

  const handleAddLabel = () => {
    if (inputLabel.trim()) {
      dispatch(addANewBlock({
        spriteName: newBlockName,
        spriteId: `sprite${blocksList.length}`,
        runWithoutRefresh,
        isCustomBlock: true,
        inputType: 'label',
        inputLabel: inputLabel
      }));
      setInputLabel('');
    }
  };

  const handleInputLabelChange = (e) => {
    setInputLabel(e.target.value);
  };

  const handleAddNewBlock = () => {
    if (!newBlockName.trim()) {
      setErrorSnackbar(true);
      return;
    }
    dispatch(addANewBlock({
      spriteName: newBlockName,
      spriteId: `sprite${blocksList.length}`,
      runWithoutRefresh,
      isCustomBlock: true,
      inputs: customBlockInputs
    }));
    handleCloseDialog();
    setCustomBlockInputs([]);
  };

  const handleCloseErrorSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorSnackbar(false);
  };

  useEffect(() => {
    // Load custom blocks from localStorage
    const customBlocks = JSON.parse(localStorage.getItem('customBlocks') || '[]');
    customBlocks.forEach(block => dispatch(addANewBlock(block)));
  }, [dispatch]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(customBlockInputs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCustomBlockInputs(items);
  };

  const removeInput = (index) => {
    const newInputs = customBlockInputs.filter((_, i) => i !== index);
    setCustomBlockInputs(newInputs);
  };

  return (
    <div className='flex-1 h-full overflow-auto p-5'>
      <CollisionHandler running={running} setRunning={setRunning}/>
      <div className='flex justify-between'>
        <div className='font-bold text-center'>Mid Area</div>
        <div>
          <Button
            variant='outlined'
            color='primary'
            onClick={simulateCollision}
            className='mr-2'
          >
            COLLIDE
          </Button>
          <Button
            variant='outlined'
            color='secondary'
            startIcon={<AddCircleOutline />}
            onClick={handleOpenDialog}
          >
            MAKE A BLOCK
          </Button>
        </div>
      </div>

      {/* Mid area blocks */}
      <div className='flex flex-wrap gap-2.5'>
        {blocksList?.map((block, index) => (
          <div className='w-60' key={block.id}>
            <Paper elevation={3} className='p-4'>
              <div className='w-52 border border-2 border-gray-300 p-2'>
                <h2 className='text-center'>{block.isCustomBlock ? block.spriteName : `Sprite ${index}`}</h2>
                <Droppable droppableId={block.id} type='COMPONENTS'>
                  {(provided) => (
                    <ul
                      className={`${block.id} w-48 h-full`}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <div className='text-center mx-auto my-2 mb-4'>
                        <Button
                          variant='contained'
                          startIcon={<PlayArrowOutlined />}
                          onClick={() => {
                            handleBlockRun(block.elements, block.id);
                            handleCollisionChecker(block.spriteId);
                          }}
                        >
                          Run
                        </Button>
                      </div>

                      {block.elements &&
                        block.elements.map((x, i) => {
                          let str = `${x}`;
                          let componentId = `element${str}-${block.id}-${i}`;

                          return (
                            <Draggable
                              key={`${str}-${block.id}-${i}`}
                              draggableId={`${str}-${block.id}-${i}`}
                              index={i}
                            >
                              {(provided) => (
                                <li
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  {renderSideBarComponentBasedOnType(
                                    str,
                                    componentId,
                                    block.spriteId
                                  )}
                                  {provided.placeholder}
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
            </Paper>
          </div>
        ))}
      </div>

      {/* Make A Block Dialog */}
      <React.Fragment>
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle style={{ backgroundColor: '#ff9800', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Make a Block
            <IconButton edge="end" color="inherit" onClick={handleCloseDialog} aria-label="close">
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ backgroundColor: '#f5f5f5', paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <Paper style={{ padding: '5px 15px', flex: 1, marginRight: '10px' }}>
                <TextField
                  fullWidth
                  value={newBlockName}
                  onChange={handleNewBlockNameChange}
                  placeholder="Enter block name"
                  variant="outlined"
                />
              </Paper>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              <Tooltip title="Add number or text input">
                <Button 
                  variant="contained" 
                  style={{ backgroundColor: '#2196f3', color: 'white' }}
                  onClick={() => handleAddInput('number/text')}
                  startIcon={<TextFields />}
                >
                  Add Input
                </Button>
              </Tooltip>
              <Tooltip title="Add boolean input">
                <Button 
                  variant="contained" 
                  style={{ backgroundColor: '#4caf50', color: 'white' }}
                  onClick={() => handleAddInput('boolean')}
                  startIcon={<CheckBox />}
                >
                  Add Boolean
                </Button>
              </Tooltip>
              <Tooltip title="Add label">
                <Button 
                  variant="contained" 
                  style={{ backgroundColor: '#ff9800', color: 'white' }}
                  onClick={() => handleAddInput('label')}
                  startIcon={<Label />}
                >
                  Add Label
                </Button>
              </Tooltip>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="inputs">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {customBlockInputs.map((input, index) => (
                      <Draggable key={index} draggableId={`input-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Chip
                              label={input.value || input.type}
                              onDelete={() => removeInput(index)}
                              style={{ marginRight: 8, marginBottom: 8 }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <FormControlLabel
              control={
                <Checkbox
                  checked={runWithoutRefresh}
                  onChange={(e) => setRunWithoutRefresh(e.target.checked)}
                  color="primary"
                />
              }
              label="Run without screen refresh"
            />
          </DialogContent>
          <DialogActions style={{ backgroundColor: '#f5f5f5', justifyContent: 'flex-end', padding: '16px' }}>
            <Button onClick={handleCloseDialog} style={{ color: '#9e9e9e' }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddNewBlock} 
              style={{ backgroundColor: '#ff4081', color: 'white' }}  // Use a default color or remove the backgroundColor property
              disabled={!newBlockName.trim() || customBlockInputs.length === 0}
            >
              Create Block
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>

      {/* Error Snackbar */}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={errorSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseErrorSnackbar}
      >
        <SnackbarContent
          style={{
            backgroundColor: '#d32f2f',
          }}
          message="Please enter a name for the block."
        />
      </Snackbar>
    </div>
  );
}

function renderInputField(input, index) {
  switch (input.type) {
    case 'label':
      return (
        <TextField
          fullWidth
          value={input.value}
          onChange={(e) => handleInputChange(index, e.target.value)}
          placeholder="Enter label text"
          variant="outlined"
        />
      );
    case 'boolean':
      return (
        <Select
          fullWidth
          value={input.value}
          onChange={(e) => handleInputChange(index, e.target.value)}
          variant="outlined"
        >
          <MenuItem value="true">True</MenuItem>
          <MenuItem value="false">False</MenuItem>
        </Select>
      );
    default:
      return (
        <TextField
          fullWidth
          type="text"
          value={input.value}
          onChange={(e) => handleInputChange(index, e.target.value)}
          placeholder="Enter number or text"
          variant="outlined"
        />
      );
  }
}
