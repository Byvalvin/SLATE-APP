
// Placeholder for exercise data structure (you'll fetch this from your API)
export interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number;
    image_url?: string;
    category?: string;
    isCustom: boolean, // mark as custom if user added it manually
    notes: string,
  }
