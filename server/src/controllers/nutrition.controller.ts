import { Request, Response } from 'express';

let fatSecretToken = '';
let tokenExpiry = 0;

async function getFatSecretToken(): Promise<{ token: string | null; error: string | null }> {
  // Read dynamically to ensure dotenv is fully loaded
  const FATSECRET_CLIENT_ID = process.env.FATSECRET_CLIENT_ID || '';
  const FATSECRET_CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET || '';

  console.log('[Nutrition API] Diagnostics:', {
    hasClientId: !!FATSECRET_CLIENT_ID,
    hasClientSecret: !!FATSECRET_CLIENT_SECRET,
  });

  if (!FATSECRET_CLIENT_ID || !FATSECRET_CLIENT_SECRET) {
    const missing = [];
    if (!FATSECRET_CLIENT_ID) missing.push('FATSECRET_CLIENT_ID');
    if (!FATSECRET_CLIENT_SECRET) missing.push('FATSECRET_CLIENT_SECRET');
    return { token: null, error: `Missing environment variable(s): ${missing.join(', ')}` };
  }

  if (fatSecretToken && Date.now() < tokenExpiry) {
    return { token: fatSecretToken, error: null };
  }

  const credentials = Buffer.from(`${FATSECRET_CLIENT_ID}:${FATSECRET_CLIENT_SECRET}`).toString('base64');
  
  try {
    const res = await fetch('https://oauth.fatsecret.com/connect/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&scope=basic'
    });
    
    console.log('[Nutrition API] OAuth HTTP Status:', res.status);

    if (res.ok) {
      const data = await res.json();
      fatSecretToken = data.access_token;
      tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
      return { token: fatSecretToken, error: null };
    } else {
      const errorText = await res.text();
      let sanitizedError = errorText;
      try {
        const parsed = JSON.parse(errorText);
        sanitizedError = parsed.error_description || parsed.error || errorText;
      } catch (e) {}
      console.log('[Nutrition API] OAuth Error:', sanitizedError);
      return { token: null, error: `FatSecret Auth Failed: ${sanitizedError}` };
    }
  } catch (error: any) {
    console.error('[Nutrition API] Failed to get FatSecret token (Network/Internal):', error.message);
    return { token: null, error: `OAuth Network Error: ${error.message}` };
  }
}

export const searchFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ success: false, message: 'Query is required' });
      return;
    }

    const { token, error } = await getFatSecretToken();
    
    if (!token) {
      // Keep existing 503 behavior for missing credentials/auth failure
      res.status(503).json({ success: false, message: error || 'Nutrition service is currently unavailable. Please try again later.' });
      return;
    }

    // Real API Call
    const apiRes = await fetch(`https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(query)}&format=json`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('[Nutrition API] Search HTTP Status:', apiRes.status);

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.log('[Nutrition API] Search Error:', errText);
      res.status(502).json({ success: false, message: `Nutrition service error: ${apiRes.statusText}` });
      return;
    }
    
    const data = await apiRes.json();
    
    let results: any[] = [];
    if (data.foods && data.foods.food) {
      const foods = Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food];
      results = foods.slice(0, 10).map((f: any) => ({
        id: f.food_id,
        name: f.food_name,
        description: f.food_description
      }));
    }
    res.status(200).json({ success: true, source: 'FatSecret API', results });
    
  } catch (error) {
    console.error('Nutrition API search error', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getFoodDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { foodId } = req.body;
    if (!foodId) {
      res.status(400).json({ success: false, message: 'Food ID is required' });
      return;
    }

    const { token, error } = await getFatSecretToken();

    if (!token) {
      res.status(503).json({ success: false, message: error || 'Nutrition service is currently unavailable. Please try again later.' });
      return;
    }

    const apiRes = await fetch(`https://platform.fatsecret.com/rest/server.api?method=food.get.v2&food_id=${foodId}&format=json`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('[Nutrition API] Details HTTP Status:', apiRes.status);

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.log('[Nutrition API] Details Error:', errText);
      res.status(502).json({ success: false, message: `Nutrition service error: ${apiRes.statusText}` });
      return;
    }
    
    const data = await apiRes.json();
    
    if (data.food && data.food.servings && data.food.servings.serving) {
      const apiServings = Array.isArray(data.food.servings.serving) ? data.food.servings.serving : [data.food.servings.serving];
      
      const parsedServings = apiServings.map((s: any) => ({
        serving_id: s.serving_id,
        unit: s.measurement_description || s.serving_description,
        calories: Number(s.calories || 0),
        protein: Number(s.protein || 0),
        carbohydrates: Number(s.carbohydrate || 0),
        fat: Number(s.fat || 0),
        fiber: Number(s.fiber || 0)
      }));
      
      res.status(200).json({
        success: true,
        source: 'FatSecret API',
        servings: parsedServings
      });
      return;
    }

    res.status(404).json({ success: false, message: 'Nutrition details not found for this food' });
    
  } catch (error) {
    console.error('Nutrition API details error', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
