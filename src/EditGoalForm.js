import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, Box, Autocomplete, IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const EditGoalForm = ({ goal, open, handleClose, editGoal, deleteGoal, categories, goals}) => {
  const [goalDetails, setGoalDetails] = useState({
    ...goal
  });

  const handleChange = (field, value) => {
    setGoalDetails(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Goal</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} style={{padding:"5px"}}>
            {/* Goal Name */}
            <TextField
              label="Goal Name"
              value={goalDetails.label}
              onChange={(e) => handleChange('label', e.target.value)}
              fullWidth
            />

            {/* Editable Category Field */}
            <Autocomplete
              options={categories} // Existing categories
              freeSolo // Allows custom input
              value={goalDetails.category}
              onChange={(event, newValue) => handleChange('category', newValue)}
              onInputChange={(event, newInputValue) => handleChange('category', newInputValue)} // Captures typing
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Category"
                  placeholder="Type or select a category"
                  fullWidth
                />
              )}
            />

            {/* Due Date */}
            <TextField
              label="Due Date"
              type="date"
              value={goalDetails.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
            <IconButton
                onClick={() => deleteGoal(goalDetails.id)}
                aria-label="filter settings"
                sx={{ color: 'white' }}
            >
                <DeleteIcon />
            </IconButton>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={() => editGoal(goalDetails.id, { label: goalDetails.label, category: goalDetails.category, dueDate: goalDetails.dueDate })} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditGoalForm;
