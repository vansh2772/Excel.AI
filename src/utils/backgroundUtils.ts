export const getWeatherBackground = (condition: string, timeOfDay: 'day' | 'night' = 'day') => {
  const conditionLower = condition.toLowerCase();
  
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    return timeOfDay === 'day' 
      ? 'bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600'
      : 'bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900';
  }
  
  if (conditionLower.includes('cloud')) {
    return timeOfDay === 'day'
      ? 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600'
      : 'bg-gradient-to-br from-gray-800 via-gray-900 to-black';
  }
  
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800';
  }
  
  if (conditionLower.includes('snow')) {
    return 'bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400';
  }
  
  if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    return 'bg-gradient-to-br from-gray-800 via-gray-900 to-black';
  }
  
  // Default gradient
  return 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500';
};

export const getTimeOfDay = (): 'day' | 'night' => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
};