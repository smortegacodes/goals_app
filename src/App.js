import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import GoalList from './GoalList';
import NewGoalForm from './NewGoalForm';
import Filters from './Filters';
import Upcoming from './Upcoming';
import goalsData from './data/goals.json';
//  npm run electron-dev

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#bb86fc',
    },
    secondary: {
      main: '#e38888',
    },
    background: {
      default: '#6d4970',
      paper: '#3d2a3f',
    },
  },
});

function App() {
  const [goals, setGoals] = useState([]);
  const [filters, setFilters] = useState({
    status: { complete: true, incomplete: true },
    category: {
      wedding: true,
      car: true,
      finance: true,
      travel: true,
      dog: true,
      health: true,
      other: true,
      projects: true,
      work: true
    },
    search: '',
    dueBy: null
  });

  // Load goals from data file on component mount
  useEffect(() => {
    setGoals(goalsData);
  }, []);

  // Save goals to file when goals change
  useEffect(() => {
    if (goals.length > 0) {
      // In Electron, we'll use IPC to save to file
      if (window.electronAPI) {
        window.electronAPI.saveGoals(goals);
      }
    }
  }, [goals]);

  // Auto-save every 5 minutes
  useEffect(() => {
    if (goals.length > 0) {
      const interval = setInterval(() => {
        console.log('Auto-saving goals...');
        if (window.electronAPI) {
          window.electronAPI.saveGoals(goals);
        }
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [goals]);

  const addGoal = useCallback((newGoal) => {
    console.log('Adding new goal:', newGoal);
    console.log('Current goals count:', goals.length);
    
    // Generate a new ID - find the highest existing ID and add 1
    const maxId = goals.length > 0 ? Math.max(...goals.map(g => g.id)) : -1;
    const newId = maxId + 1;
    
    const goalWithId = {
      ...newGoal,
      id: newId,
      status: 'incomplete' // Ensure status is set
    };
    
    console.log('Goal with ID:', goalWithId);
    setGoals(prevGoals => {
      const newGoals = [...prevGoals, goalWithId];
      console.log('Updated goals count:', newGoals.length);
      return newGoals;
    });
  }, [goals]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
          {/* Upcoming Goals Section */}
            <Upcoming goals={goals} setGoals={setGoals} addGoal={addGoal} categories={Object.keys(filters.category)} />
          {/* All Goals Section */}
          <Box sx={{ mb: 4 }}>
            <Filters filters={filters} setFilters={setFilters} />
            {console.log('App rendering GoalList with setGoals:', typeof setGoals)}
            <GoalList 
              goals={goals} 
              filters={filters} 
              setGoals={setGoals} 
              addGoal={addGoal}
            />
          </Box>

          <NewGoalForm addGoal={addGoal} categories={Object.keys(filters.category)} />
      </Box>
    </ThemeProvider>
  );
}

export default App;