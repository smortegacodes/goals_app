import React, {useState} from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  Box, 
  FormControl, 
  FormGroup, 
  FormControlLabel, 
  Checkbox, 
  Typography, 
  Divider
} from '@mui/material';
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SettingsIcon from '@mui/icons-material/Settings';


const FilterSettingsMenu = ({ filters, setFilters }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const status_options = Object.keys(filters.status);
  const category_options = Object.keys(filters.category);

  // Update filters for status
  const handleStatusChange = (event) => {
    const { name, checked } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      status: {
        ...prevFilters.status,
        [name]: checked,
      },
    }));
  };

  const handleCategoryChange = (event) => {
    const { name, checked } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      category: {
        ...prevFilters.category,
        [name]: checked,
      },
    }));
  };

  const handleDateChange = (newDate) => {
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    const newDateStr = `${year}-${month}-${day}`
    setFilters(prevFilters => ({
      ...prevFilters,
      dueBy: newDateStr,
    }));
  };

  return (
    <Box>
      <IconButton
        onClick={handleOpen}
        aria-label="filter settings"
        sx={{ color: 'white' }}
      >
        <SettingsIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem disableRipple>
          <Typography variant="subtitle2">Status</Typography>
        </MenuItem>
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: "0px" }}>
            <FormControl component="fieldset">
              <FormGroup>
                {status_options.map(option => 
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.status[option]}
                        onChange={handleStatusChange}
                        name={option}
                        sx={{
                          color: "#8B648D", // color when **unchecked**
                          '&.Mui-checked': {
                            color: "#8B648D", // color when **checked**
                          },
                          '&:hover': {
                            backgroundColor: "#ecdded" // subtle green hover effect
                          }
                        }}
                      />
                    }
                    label={option}
                  />
                )}
              </FormGroup>
            </FormControl>
          </Box>
        </MenuItem> 
        <Divider />
        <MenuItem disableRipple>
          <Typography variant="subtitle2">Category</Typography>
        </MenuItem>
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', flexDirection: 'column', padding: "0px" }}>
            <FormControl component="fieldset">
              <FormGroup>
                {category_options.map(option => 
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={filters.category[option]}
                        onChange={handleCategoryChange}
                        name={option}
                        sx={{
                          color: "#8B648D", // color when **unchecked**
                          '&.Mui-checked': {
                            color: "#8B648D", // color when **checked**
                          },
                          '&:hover': {
                            backgroundColor: "#ecdded" // subtle green hover effect
                          }
                        }}
                      />
                    }
                    label={option}
                  />
                )}
              </FormGroup>
            </FormControl>
          </Box>
        </MenuItem> 
        <Divider />
        <MenuItem disableRipple>
          <Typography variant="subtitle2">Due By</Typography>
        </MenuItem>
        <MenuItem disableRipple>
          <LocalizationProvider dateAdapter={AdapterDateFns} sx={{border:"none"}}>
            <DatePicker
              value={(filters.dueBy) ? new Date(filters.dueBy) : new Date()}
              onChange={(newDate) => {handleDateChange(newDate)}}
            />
          </LocalizationProvider>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default FilterSettingsMenu;
