import React, { useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, Box, Autocomplete, Fab
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const EditGoalForm = ({ goal, open, handleClose, editGoal, deleteGoal, categories, goals}) => {
//   const [goalDetails, setGoalDetails] = useState({
//     label: '',
//     category: '', // User can type or select this value
//     dueDate: '',
//   });

//   const handleChange = (field, value) => {
//     setGoalDetails(prev => ({ ...prev, [field]: value }));
//   };

  //const [open, setOpen] = useState(false);

//   const handleSubmit = () => {
//     console.log('Form submitted with:', goalDetails);
//     if (goalDetails.label && goalDetails.dueDate && goalDetails.category) {
//       const goalToAdd = {
//         ...goalDetails,
//         parentId: null,
//         status: 'incomplete'
//       };
//       console.log('Calling addGoal with:', goalToAdd);
//       addGoal(goalToAdd);
//       setOpen(false);
//       setGoalDetails({ label: '', category: '', dueDate: '' }); // Reset form
//     } else {
//       console.log('Form validation failed - missing fields');
//     }
//   };

//   const handleClose = () => setOpen(false);

  return (
    <>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Goal</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} style={{padding:"5px"}}>
            {/* Goal Name */}
            <TextField
              label="Goal Name"
              value={goal.label}
              //onChange={(e) => handleChange('label', e.target.value)}
              fullWidth
            />

            {/* Editable Category Field
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
            /> */}

            {/* Due Date */}
            {/* <TextField
              label="Due Date"
              type="date"
              value={goalDetails.dueDate}
              onChange={(e) => handleChange('dueDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            /> */}
          </Box>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions> */}
      </Dialog>
    </>
  );
};

export default EditGoalForm;
