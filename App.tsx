import React, { useState } from 'react';
import { generateDietPlan } from './services/geminiService';
import { DietPlan } from './types';
import { Search, Loader2, Leaf, AlertCircle } from 'lucide-react';
import { DietResults } from './components/DietResults';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<DietPlan | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const result = await generateDietPlan(query);
      setPlan(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-sage-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-sage-200" />
            <span className="font-serif text-xl font-bold tracking-wide">Arka Nourish</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-start p-4 sm:p-8 max-w-7xl mx-auto w-full">
        
        {/* Hero / Search Section */}
        <div className={`transition-all duration-500 w-full max-w-2xl flex flex-col items-center ${plan ? 'mt-0 mb-8' : 'mt-20 sm:mt-32'}`}>
          {!plan && !loading && (
            <div className="text-center mb-10 space-y-4">
              <h1 className="font-serif text-4xl sm:text-5xl font-bold text-sage-900">
                Heal with Nature
              </h1>
              <p className="text-lg text-sage-700 max-w-lg mx-auto">
                Discover holistic remedies combining <strong>Ayurveda</strong> and <strong>Naturopathy</strong> tailored to your health needs. Enter your ailment below to begin.
              </p>
            </div>
          )}

          <form onSubmit={handleSearch} className="w-full relative shadow-lg rounded-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="E.g., Insomnia, Acid Reflux, Common Cold..."
              className="w-full pl-6 pr-14 py-4 rounded-full border-2 border-sage-200 focus:border-sage-500 focus:ring-4 focus:ring-sage-100 outline-none text-lg text-sage-900 placeholder:text-sage-400 transition-all bg-white"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="absolute right-2 top-2 p-2 bg-sage-600 hover:bg-sage-700 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Search className="h-6 w-6" />
              )}
            </button>
          </form>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start gap-3 max-w-lg w-full">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {plan && !loading && (
          <div className="w-full animate-fadeIn">
            <DietResults plan={plan} />
          </div>
        )}
        
        {/* Loading State Skeleton/Message */}
        {loading && !plan && (
           <div className="mt-12 text-center text-sage-600 animate-pulse flex flex-col items-center">
             <div className="h-2 w-24 bg-sage-200 rounded mb-4"></div>
             <p className="font-serif italic text-lg">Consulting ancient wisdom & modern nature cure...</p>
           </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full bg-sage-100 py-6 mt-12 border-t border-sage-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-sage-600 text-sm">
          <p>© {new Date().getFullYear()} Arka Nourish. Advice based on Ayurvedic and Naturopathic principles. Not a substitute for professional medical advice.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;