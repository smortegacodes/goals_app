import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import Box from '@mui/material/Box';
import GoalItem from './GoalItem';

function GoalList({ goals, filters, setGoals, addGoal }) {
  console.log('GoalList props:', { goals: goals?.length, filters, setGoals: typeof setGoals, addGoal: typeof addGoal });
  // Helper to sort goals by due date (earliest first, null/undefined last)
  const sortByDueDate = (a, b) => {
    const dateA = a.dueDate ? new Date(a.dueDate) : null;
    const dateB = b.dueDate ? new Date(b.dueDate) : null;
    if (dateA && dateB) {
      return dateA - dateB;
    } else if (dateA && !dateB) {
      return -1;
    } else if (!dateA && dateB) {
      return 1;
    } else {
      return 0;
    }
  };

  // Organize goals into a hierarchical structure and sort by due date at each level
  const organizeGoals = (goals) => {
    const goalMap = new Map();
    const rootGoals = [];

    // First, create a map of all goals
    goals.forEach(goal => {
      goalMap.set(goal.id, { ...goal, children: [] });
    });

    // Then, organize them into a tree structure
    goals.forEach(goal => {
      const goalWithChildren = goalMap.get(goal.id);
      if (goal.parentId === null) {
        rootGoals.push(goalWithChildren);
      } else {
        const parent = goalMap.get(goal.parentId);
        if (parent) {
          parent.children.push(goalWithChildren);
        }
      }
    });

    // Recursively sort children by due date
    const sortTree = (nodes) => {
      nodes.sort(sortByDueDate);
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          sortTree(node.children);
        }
      });
    };

    sortTree(rootGoals);

    return rootGoals;
  };

  const filteredGoals = goals.filter(goal => {
    const { complete, incomplete } = filters.status;
    const categories = Object.keys(filters.category).filter(category => filters.category[category]);
  
    if(filters.dueBy){
      const goalDate = new Date(goal.dueDate);
      const dueByDate = new Date(filters.dueBy)
      if( goalDate > dueByDate) return false;
    }
    if (filters.search && !goal.label.includes(filters.search)) return false;
    if (!categories.includes(goal.category)) return false;
    if (complete && incomplete) return true;
    if (complete && goal.status === 'complete') return true;
    if (incomplete && goal.status === 'incomplete') return true;
    return false;
  });

  const editGoal = (id, updatedGoal) => {
    console.log('editGoal called with:', id, updatedGoal);
    console.log('setGoals type:', typeof setGoals);
    console.log('setGoals value:', setGoals);
    
    if (typeof setGoals !== 'function') {
      console.error('setGoals is not a function!', setGoals);
      console.error('Available props:', { goals: goals?.length, filters, setGoals, addGoal });
      return;
    }
    
    try {
      setGoals(prevGoals =>
        prevGoals.map(goal =>
          goal.id === id ? { ...goal, ...updatedGoal } : goal
        )
      );
      console.log('setGoals called successfully');
    } catch (error) {
      console.error('Error calling setGoals:', error);
    }
  };

  const makeChild = (goalId, newParentId) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId ? { ...goal, parentId: newParentId } : goal
      )
    );
  };

  const deleteGoal = (id) => {
    // First, get all child goals recursively
    const getAllChildIds = (goalId) => {
      const childIds = [goalId];
      goals.forEach(goal => {
        if (goal.parentId === goalId) {
          childIds.push(...getAllChildIds(goal.id));
        }
      });
      return childIds;
    };

    const idsToDelete = getAllChildIds(id);
    setGoals(prevGoals =>
      prevGoals.filter(goal => !idsToDelete.includes(goal.id))
    );
  };

  const updateLabel = (id, newLabel) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id ? { ...goal, label: newLabel } : goal
      )
    );
  };  

  // Recursive component to render a goal and its children
  const RenderGoalWithChildren = ({ goal, level = 0, flatIndex }) => {
    let currentIndex = flatIndex;
    
    return (
      <Box key={goal.id}>
        <Box sx={{ marginLeft: `${level * 32}px` }}>
          <GoalItem
            key={goal.id}
            goal={goal}
            updateStatus={(id, toggle) => editGoal(id, { status: toggle ? 'complete' : 'incomplete' })}
            updateLabel={updateLabel}
            editGoal={editGoal}
            deleteGoal={deleteGoal}
            categories={Object.keys(filters.category)}
            addGoal={addGoal}
            goals={goals}
            index={currentIndex}
            onMakeChild={makeChild}
          />
        </Box>
        {goal.children && goal.children.map(childGoal => {
          currentIndex++;
          return (
            <RenderGoalWithChildren
              key={childGoal.id}
              goal={childGoal}
              level={level + 1}
              flatIndex={currentIndex}
            />
          );
        })}
      </Box>
    );
  };

  const organizedGoals = organizeGoals(filteredGoals);

  return (
    <Box sx={{ width: '90%', margin: "50px" }}>
      <FormGroup>
        {organizedGoals.map((goal, index) => (
          <RenderGoalWithChildren 
            key={goal.id} 
            goal={goal} 
            flatIndex={index} 
          />
        ))}
      </FormGroup>
    </Box>
  );
}

export default GoalList;
