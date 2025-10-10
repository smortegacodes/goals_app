import React, {useMemo} from 'react';
import FormGroup from '@mui/material/FormGroup';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GoalItem from './GoalItem';

function Upcoming({ goals, setGoals, categories, addGoal }) {
  const today = new Date();
  const twoWeeksFromToday = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

  // Organize goals into a hierarchical structure
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

    rootGoals.sort((a, b) => (new Date(a.dueDate)) - (new Date(b.dueDate)));

    return rootGoals;
  };

  const upcomingGoals = useMemo(() => {
    // First, get all goals that are upcoming
    const directUpcomingGoals = goals.filter(goal => {
      const goalDate = new Date(goal.dueDate);
      return !isNaN(goalDate) && goalDate <= twoWeeksFromToday && goal.status === 'incomplete';
    });

    // Then, also include any parents of upcoming goals that aren't already included
    const upcomingGoalIds = new Set(directUpcomingGoals.map(g => g.id));
    const additionalParentGoals = [];

    directUpcomingGoals.forEach(goal => {
      let currentParentId = goal.parentId;
      while (currentParentId !== null) {
        const parent = goals.find(g => g.id === currentParentId);
        if (parent && !upcomingGoalIds.has(parent.id)) {
          upcomingGoalIds.add(parent.id);
          additionalParentGoals.push(parent);
          currentParentId = parent.parentId;
        } else {
          break;
        }
      }
    });

    return [...directUpcomingGoals, ...additionalParentGoals];
  }, [goals, twoWeeksFromToday]);

  const editGoal = (id, updatedGoal) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id ? { ...goal, ...updatedGoal } : goal
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
  const RenderGoalWithChildren = ({ goal, level = 0 }) => {
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
            categories={categories}
            addGoal={addGoal}
            goals={goals}
          />
        </Box>
        {goal.children && goal.children.map(childGoal => (
          <RenderGoalWithChildren
            key={childGoal.id}
            goal={childGoal}
            level={level + 1}
          />
        ))}
      </Box>
    );
  };

  const organizedGoals = organizeGoals(upcomingGoals);

  return (
    <Box sx={{ width: '100%', margin: "20px 50px" }}>
      <Typography variant="h4" gutterBottom>Upcoming</Typography>
      <FormGroup>
        {organizedGoals.length === 0 ? (
          <Typography variant="body1" sx={{ color: "white", textAlign: "center" }}>
            No upcoming goals found!
          </Typography>
        ) : (
          organizedGoals.map(goal => (
            <RenderGoalWithChildren key={goal.id} goal={goal} />
          ))
        )}
      </FormGroup>
    </Box>
  );
}

export default Upcoming;
