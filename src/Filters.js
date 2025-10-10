import React, {useState} from 'react';
import { Chip, Stack, Box, TextField } from "@mui/material";
import FilterSettingsMenu from './FilterSettingsMenu';

function Filters({ filters, setFilters }) {
  const [searchTerm, setSearchTerm] = useState('');

  const removeStatusFilter = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      status: {
        ...prevFilters.status,
        [filterName]: false,
      },
    }));
  };

  const removeCategoryFilter = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      category: {
        ...prevFilters.category,
        [filterName]: false,
      },
    }));
  };

  const removeSearchFilter = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      search: null
    }));
  };

  const removeDueByFilter = (filterName) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      dueBy: null
    }));
  };

  const removeFilter = (filterKey, filterName) => {
    if(filterKey === "status") removeStatusFilter(filterName);
    if(filterKey === "category") removeCategoryFilter(filterName);
    if(filterKey === "search") removeSearchFilter(filterName);
    if(filterKey === "dueBy") removeDueByFilter(filterName);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      //addSearchFilter();
      setFilters(prevFilters => ({
        ...prevFilters,
        search: searchTerm,
      }));
      setSearchTerm('');
      event.preventDefault(); // Prevent form submission or other default behavior
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#584459",
        padding: "5px 10px",
        borderRadius: "4px",
      }}
    >
      <Stack direction="row" spacing={1}>
        {Object.keys(filters).map(filter => (
          (typeof filters[filter] === "object" && filters[filter] !== null ) ?
            (Object.keys(filters[filter]).filter(filter_val => filters[filter][filter_val]).map(filter_val => (
              <Chip
                sx={{
                  backgroundColor: "#b46ab8",
                  color: "white",
                  "& .MuiChip-deleteIcon": {
                    color: "white",
                    "&:hover": { color: "#e4cce6" },
                  },
                }}
                label={filter_val}
                key={filter_val}
                onDelete={() => removeFilter(filter, filter_val)}
              />
            )
          ))
          : (filters[filter] && <Chip
            sx={{
              backgroundColor: "#b46ab8",
              color: "white",
              "& .MuiChip-deleteIcon": {
                color: "white",
                "&:hover": { color: "#e4cce6" },
              },
            }}
            label={`${filter}: ${filters[filter]}`}
            onDelete={() => removeFilter(filter, filters[filter])}
          />)
        ))}
      </Stack>
      <TextField
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress}
        label="Search Goals"
        placeholder="Type a keyword and press Enter"
        variant="outlined"
        fullWidth
       
        
        sx={{
          marginLeft: "10px",
          width: "1000px",
          input: { color: "white" }, // Text color for input value
          '& .MuiInputLabel-root': {
            color: "white", // Default label color
            transform: "translate(14px, 10px) scale(1)", // Moved up slightly for better centering
            '&.Mui-focused': {
              transform: "translate(14px, -9px) scale(0.75)", // Proper focused positioning
              color: "#b46ab8", // Custom color when focused
            },
            '&.MuiInputLabel-shrink': {
              transform: "translate(14px, -9px) scale(0.75)", // Proper shrink positioning
            }
          },
          '& .MuiInputBase-input': {
            padding: "8px 14px", // Reduced padding for more compact input
            color: "white"
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: "white", // Default border color
            },
            '&:hover fieldset': {
              borderColor: "#b46ab8", // Border color on hover
            },
            '&.Mui-focused fieldset': {
              borderColor: "#b46ab8", // Border color when focused
            },
          },
        }}
      />
      <FilterSettingsMenu filters={filters} setFilters={setFilters} />
    </Box>
  );
}

export default Filters;
