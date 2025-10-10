import React, { useState, useEffect, useRef } from 'react';
import { Box, FormControlLabel, Checkbox, IconButton, TextField, Typography, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import EditGoalForm from './EditGoalForm';

function GoalItem({ goal, updateStatus, updateLabel, editGoal, deleteGoal, categories, addGoal, goals, index, onMakeChild }) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedLabel, setEditedLabel] = useState(goal.label);
  const [showAddChildHint, setShowAddChildHint] = useState(false);
  const [inputWidth, setInputWidth] = useState(300);

  const inputRef = useRef(null);
  const spanRef = useRef(null);

  const formatDate = (dateString) => {
    // Create a date object by explicitly specifying the timezone as UTC
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      timeZone: 'UTC' // Ensure the date is displayed in UTC
    });
  };

  const isOverdue = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const dueDate = new Date(Date.UTC(year, month - 1, day));
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
    return dueDate < todayUTC;
  };

  const handleLabelChange = (event) => {
    const newLabel = event.target.value;
    setEditedLabel(newLabel);
    // Move updateLabel call to onBlur to prevent re-renders during typing
  };

  const handleLabelBlur = () => {
    updateLabel(goal.id, editedLabel);
    setShowAddChildHint(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const goalDetails = {
        label: '',
        parentId: goal.id,
        dueDate: goal.dueDate,
        category: goal.category,
        status: 'incomplete'
      };
      addGoal(goalDetails);
      updateLabel(goal.id, editedLabel);
      event.preventDefault();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Tab') {
      if (event.shiftKey) {
        // Find the current parent
        if (goal.parentId !== null) {
          event.preventDefault();
          // Move up one level by setting parentId to null (root) or keeping the current parent's parentId
          const currentParent = goals.find(g => g.id === goal.parentId);
          if (currentParent) {
            onMakeChild(goal.id, currentParent.parentId);
            // Update the label to ensure it's saved
            updateLabel(goal.id, editedLabel);
          }
        }
      } else {
        // Only attempt to make it a child if it's not the first goal and not already a child of the goal above
        if (index > 0) {
          const potentialParent = goals[index - 1];
          if (goal.parentId !== potentialParent.id) {
            event.preventDefault();
            onMakeChild(goal.id, potentialParent.id);
            // Update the label to ensure it's saved
            updateLabel(goal.id, editedLabel);
          }
        }
      }
    }
  };

  // Dynamically adjust input width based on label length
  useEffect(() => {
    if (spanRef.current) {
      // Add some padding to the measured width
      const measuredWidth = spanRef.current.offsetWidth + 24; // 24px for padding/cursor
      setInputWidth(Math.max(300, Math.min(measuredWidth, 800))); // min 300, max 800
    }
  }, [editedLabel]);

  useEffect(() => {
    if(goal.label !== editedLabel) setEditedLabel(goal.label);
  }, [goal.label]);

  // Prevent FormControlLabel from forwarding clicks on the label to the checkbox
  // by using labelPlacement="end" and passing a custom label component that stops propagation
  const labelComponent = (
    <Box display="flex" alignItems="center" position="relative" onClick={e => e.stopPropagation()}>
      {/* Hidden span for measuring text width */}
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          height: 0,
          overflow: 'scroll',
          whiteSpace: 'pre',
          fontSize: '1rem',
          fontFamily: 'inherit',
          fontWeight: 400,
          letterSpacing: 'inherit',
          padding: 0,
          margin: 0,
          border: 0,
        }}
      >
        {editedLabel || ' '}
      </span>
      <TextField
        inputRef={inputRef}
        value={editedLabel}
        onChange={handleLabelChange}
        onKeyPress={handleKeyPress}
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowAddChildHint(true)}
        onBlur={handleLabelBlur}
        variant="standard"
        multiline={false}
        InputProps={{
          style: {
            width: inputWidth,
            minWidth: 300,
            maxWidth: 800,
            color: isOverdue(goal.dueDate) ? "#e38888" : "white",
          }
        }}
        sx={{
          '& .MuiInputBase-root': {
            width: inputWidth,
            minWidth: '300px',
            maxWidth: '800px'
          },
          input: { 
            color: isOverdue(goal.dueDate) ? "#e38888" : "white",
          },
          '& .MuiInput-underline:before': { borderBottomColor: "white" },
          '& .MuiInput-underline:hover:before': { borderBottomColor: "white !important" },
          '& .MuiInput-underline:after': { borderBottomColor: "white" },
          '& .MuiInput-root:hover': {
            backgroundColor: 'rgba(154, 117, 156, 0.1)'
          }
        }}
      />
      <Typography variant="body2" style={{ color: isOverdue(goal.dueDate) ? "#e38888" : "" }}>
        {`(${goal.category}, ${formatDate(goal.dueDate)})`}
      </Typography>
      {showAddChildHint && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            display: 'flex',
            alignItems: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.75rem',
            marginTop: '4px'
          }}
        >
          <SubdirectoryArrowRightIcon sx={{ fontSize: 16, marginRight: 0.5 }} />
          Press Enter to add a sub-goal, Tab to make this a sub-goal, or Shift+Tab to move up a level
        </Box>
      )}
    </Box>
  );

  return (
    <Box display="flex" flexDirection="column" marginBottom="10px">
      {/* Top Row: Checkbox and Label Editing */}
      <Box display="flex" alignItems="center">

        {/* Completion Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              checked={goal.status === "complete"}
              onChange={(event) => updateStatus(goal.id, event.target.checked)}
              sx={{
                color: "white",
                '&.Mui-checked': { color: "white" },
                '&:hover': { backgroundColor: "#9a759c" },
              }}
            />
          }
          label={labelComponent}
          sx={{ marginRight: "5px" }}
        />

        {/* Edit Button */}
        <IconButton
          onClick={() => setEditDialogOpen(true)}
          sx={{
            color: "white",
            '&:hover': { backgroundColor: "#9a759c" },
            padding: 0.5,
            width: 20,
            height: 20,
          }}
        >
          <EditIcon sx={{ fontSize: 12 }} />
        </IconButton>
      </Box>

      {/* Edit Goal Dialog */}
      {editDialogOpen && (
        <EditGoalForm
          goal={goal}
          open={editDialogOpen}
          handleClose={() => setEditDialogOpen(false)}
          editGoal={editGoal}
          deleteGoal={deleteGoal}
          categories={categories}
          goals={goals}
        />
      )}
    </Box>
  );
}

export default GoalItem;
