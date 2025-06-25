// XP and Points system for task completion
export const taskRewards = {
  'Study session': { xp: 10, points: 5 },
  'Homework': { xp: 15, points: 8 },
  'Essay': { xp: 25, points: 15 },
  'Lab report': { xp: 20, points: 12 },
  'Assignment': { xp: 18, points: 10 },
  'Thesis': { xp: 50, points: 30 },
  'Exam prep': { xp: 30, points: 20 }
}

export const calculateRewards = (taskType) => {
  return taskRewards[taskType] || taskRewards['Homework']
}

export const awardXP = (currentXP, taskType) => {
  const rewards = calculateRewards(taskType)
  return currentXP + rewards.xp
}

export const awardPoints = (currentPoints, taskType) => {
  const rewards = calculateRewards(taskType)
  return (currentPoints || 0) + rewards.points
} 