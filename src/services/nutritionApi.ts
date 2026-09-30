export const searchNutritionFood = async (query: string) => {
  try {
    const res = await fetch(`/api/nutrition/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (data.success) {
      return { success: true, results: data.results };
    }
    return { success: false, message: data.message || 'Unknown error' };
  } catch (error) {
    console.error('Error searching food:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const getFoodNutrition = async (foodId: string) => {
  try {
    const res = await fetch('/api/nutrition/details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foodId })
    });
    const data = await res.json();
    if (data.success) {
      return { success: true, servings: data.servings };
    }
    return { success: false, message: data.message || 'Unknown error' };
  } catch (error) {
    console.error('Error getting food details:', error);
    return { success: false, message: 'Network error occurred' };
  }
};
