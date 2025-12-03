import React from 'react';
import { DietPlan } from '../types';
import { CheckCircle2, XCircle, Sparkles, ChefHat } from 'lucide-react';
import { RecipeCard } from './RecipeCard';

interface DietResultsProps {
  plan: DietPlan;
}

export const DietResults: React.FC<DietResultsProps> = ({ plan }) => {
  return (
    <div className="space-y-12">
      
      {/* Overview Section */}
      <section className="bg-white rounded-3xl p-8 shadow-xl border border-sage-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-sage-900 mb-2 capitalize">
            {plan.ailment}
            {plan.sanskritName && <span className="text-sage-500 font-normal italic text-xl ml-3">({plan.sanskritName})</span>}
          </h2>
          <div className="w-16 h-1 bg-sage-400 mx-auto rounded-full mb-6"></div>
          
          <div className="bg-sage-50 rounded-xl p-6 text-left">
            <h3 className="text-sage-900 font-bold mb-2 font-serif">Holistic Perspective</h3>
            <p className="text-lg text-sage-700 leading-relaxed">
              {plan.explanation}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          
          {/* Foods to Eat */}
          <div className="bg-green-50/50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-center gap-3 mb-4 text-green-800">
              <CheckCircle2 className="w-6 h-6" />
              <div>
                <h3 className="font-serif text-xl font-bold">Beneficial Foods</h3>
                <span className="text-xs font-semibold tracking-wider text-green-600 uppercase">Pathya / Constructive Diet</span>
              </div>
            </div>
            <ul className="space-y-3">
              {plan.foodsToEat.map((food, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sage-800">
                  <span className="mt-2 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                  <span>{food}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Foods to Avoid */}
          <div className="bg-red-50/50 rounded-2xl p-6 border border-red-100">
            <div className="flex items-center gap-3 mb-4 text-red-800">
              <XCircle className="w-6 h-6" />
              <div>
                <h3 className="font-serif text-xl font-bold">Foods to Avoid</h3>
                <span className="text-xs font-semibold tracking-wider text-red-600 uppercase">Apathya / Eliminative Diet</span>
              </div>
            </div>
            <ul className="space-y-3">
              {plan.foodsToAvoid.map((food, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sage-800">
                  <span className="mt-2 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                  <span>{food}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Lifestyle Tips */}
        <div className="mt-8 pt-8 border-t border-sage-100">
            <div className="flex items-center justify-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-earth-500" />
                <h3 className="text-center font-serif text-xl font-bold text-earth-700">Lifestyle & Naturopathic Care</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-6 text-center">
                {plan.lifestyleTips.map((tip, idx) => (
                    <div key={idx} className="bg-sage-50 rounded-xl p-4 text-sage-800 text-sm font-medium shadow-sm border border-sage-100">
                        {tip}
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Recipes Section */}
      <section>
        <div className="flex items-center gap-3 mb-8 px-2">
            <ChefHat className="w-8 h-8 text-earth-600" />
            <h2 className="text-3xl font-serif font-bold text-sage-900">Healing Recipes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plan.recipes.map((recipe, index) => (
                <RecipeCard key={index} recipe={recipe} index={index} />
            ))}
        </div>
      </section>

    </div>
  );
};