export const getWeatherBackground = (condition: string, timeOfDay: 'day' | 'night' = 'day') => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return timeOfDay === 'day' 
      ? 'bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300'
      : 'bg-gradient-to-br from-black via-neutral-900 to-neutral-800';
  }
  
  if (conditionLower.includes('cloud')) {
    return timeOfDay === 'day'
      ? 'bg-gradient-to-br from-neutral-300 via-neutral-400 to-neutral-500'
      : 'bg-gradient-to-br from-neutral-800 via-neutral-900 to-black';
  }
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return 'bg-gradient-to-br from-neutral-600 via-neutral-700 to-neutral-800';
  }
  
  if (conditionLower.includes('snow')) {
    return 'bg-gradient-to-br from-white via-neutral-100 to-neutral-200';
  }
  
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return 'bg-gradient-to-br from-neutral-900 via-black to-neutral-900';
  }
  
  // Default gradient
  return 'bg-gradient-to-br from-black via-neutral-900 to-neutral-800';
};

export const getTimeOfDay = (): 'day' | 'night' => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
};