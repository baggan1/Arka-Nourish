import React, { useState, useEffect } from 'react';
import { Recipe } from '../types';
import { Clock, Loader2, Image as ImageIcon } from 'lucide-react';
import { generateRecipeImage } from '../services/geminiService';

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, index }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      setIsLoading(true);
      try {
        const generatedImage = await generateRecipeImage(recipe.name, recipe.description);
        if (isMounted && generatedImage) {
          setImageUrl(generatedImage);
        }
      } catch (err) {
        console.error("Failed to load recipe image", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [recipe.name, recipe.description]);

  // Fallback image using seed based on recipe name length + index for consistency if generation fails
  const fallbackUrl = `https://picsum.photos/seed/${recipe.name.length + index}/400/300`;
  const displayUrl = imageUrl || fallbackUrl;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-sage-100 group">
      
      {/* Image Container */}
      <div className="relative h-48 w-full bg-sage-200 overflow-hidden">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-sage-400 animate-pulse bg-sage-100">
             <Loader2 className="w-8 h-8 animate-spin mb-2" />
             <span className="text-xs font-medium tracking-wide">Generating Visual...</span>
          </div>
        ) : (
          <img 
            src={displayUrl} 
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 animate-fadeIn"
            loading="lazy"
          />
        )}
        
        {!isLoading && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-sage-800 flex items-center gap-1 shadow-sm z-10">
            <Clock className="w-3 h-3" />
            {recipe.prepTime}
            </div>
        )}
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="font-serif text-xl font-bold text-sage-900 mb-2 group-hover:text-sage-700 transition-colors">
          {recipe.name}
        </h3>
        <p className="text-sm text-sage-600 mb-4 line-clamp-2">
            {recipe.description}
        </p>

        {/* Benefits Tag */}
        <div className="mb-6 p-3 bg-earth-50 rounded-lg text-xs text-earth-800 italic border border-earth-100">
            " {recipe.benefits} "
        </div>

        {/* Ingredients Preview */}
        <div className="mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage-400 mb-2">Ingredients</h4>
            <div className="flex flex-wrap gap-2">
                {recipe.ingredients.slice(0, 4).map((ing, i) => (
                    <span key={i} className="text-xs bg-sage-50 text-sage-700 px-2 py-1 rounded-md">
                        {ing}
                    </span>
                ))}
                {recipe.ingredients.length > 4 && (
                    <span className="text-xs text-sage-400 px-1 py-1">+{recipe.ingredients.length - 4} more</span>
                )}
            </div>
        </div>

        <div className="mt-auto pt-4 border-t border-sage-50">
           <details className="group/details">
               <summary className="cursor-pointer text-sm font-semibold text-sage-600 hover:text-sage-800 list-none flex items-center justify-between">
                   <span>View Instructions</span>
                   <span className="text-lg leading-none transition-transform group-open/details:rotate-45">+</span>
               </summary>
               <div className="mt-3 space-y-2 text-sm text-sage-700 animate-fadeIn">
                   {recipe.instructions.map((step, i) => (
                       <div key={i} className="flex gap-2">
                           <span className="font-bold text-sage-400 select-none">{i+1}.</span>
                           <p>{step}</p>
                       </div>
                   ))}
               </div>
           </details>
        </div>
      </div>
    </div>
  );
};
