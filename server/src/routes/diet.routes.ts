import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get meals for a patient
router.get('/:patientId/meals', async (req, res) => {
  try {
    const { patientId } = req.params;
    const meals = await prisma.dietMeal.findMany({
      where: { patientId },
      orderBy: { createdAt: 'asc' }
    });
    
    // Parse days
    const formattedMeals = meals.map((m: any) => ({
      ...m,
      days: JSON.parse(m.days || '[]')
    }));

    res.json(formattedMeals);
  } catch (error) {
    console.error('Failed to fetch meals:', error);
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Create a meal
router.post('/:patientId/meals', async (req, res) => {
  try {
    const { patientId } = req.params;
    const { type, name, time, portion, cal, pro, carbs, fat, days } = req.body;
    
    const newMeal = await prisma.dietMeal.create({
      data: {
        patientId,
        type,
        name,
        time,
        portion,
        cal: Number(cal) || 0,
        pro: Number(pro) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        days: JSON.stringify(days || [])
      }
    });

    res.json({ ...newMeal, days: JSON.parse(newMeal.days) });
  } catch (error) {
    console.error('Failed to create meal:', error);
    res.status(500).json({ error: 'Failed to create meal' });
  }
});

// Update a meal
router.put('/:patientId/meals/:mealId', async (req, res) => {
  try {
    const { mealId } = req.params;
    const { type, name, time, portion, cal, pro, carbs, fat, days } = req.body;
    
    const updatedMeal = await prisma.dietMeal.update({
      where: { id: mealId },
      data: {
        type,
        name,
        time,
        portion,
        cal: Number(cal) || 0,
        pro: Number(pro) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
        days: JSON.stringify(days || [])
      }
    });

    res.json({ ...updatedMeal, days: JSON.parse(updatedMeal.days) });
  } catch (error) {
    console.error('Failed to update meal:', error);
    res.status(500).json({ error: 'Failed to update meal' });
  }
});

// Delete a meal
router.delete('/:patientId/meals/:mealId', async (req, res) => {
  try {
    const { mealId } = req.params;
    await prisma.dietMeal.delete({
      where: { id: mealId }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete meal:', error);
    res.status(500).json({ error: 'Failed to delete meal' });
  }
});

export default router;
