export interface Recipe {
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  benefits: string;
}

export interface DietPlan {
  ailment: string;
  sanskritName?: string;
  explanation: string;
  foodsToEat: string[];
  foodsToAvoid: string[];
  lifestyleTips: string[];
  recipes: Recipe[];
}