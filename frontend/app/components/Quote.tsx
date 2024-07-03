'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface Quote {
  text: string;
  author: string;
}

const Quote: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [newQuote, setNewQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingQuote, setIsAddingQuote] = useState(false); // Track adding state

  const fetchQuote = async (endpoint: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Quote>(`http://localhost:5000/api/quotes/${endpoint}`);
      setQuote(response.data);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setError("Failed to fetch quote. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuote('random');
  }, []);

  const addQuote = async (newQuote: Quote) => {
    setIsAddingQuote(true); // Indicate adding in progress
    setError(null);
    try {
      const response = await axios.post('http://localhost:5000/api/quotes/', newQuote);
      console.log('Quote added successfully:', response.data); // Handle success (optional)
    } catch (error) {
      console.error('Error adding quote:', error);
      setError("Failed to add quote. Please try again.");
    } finally {
      setIsAddingQuote(false); // Reset adding state
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4 p-4">
      {error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : isLoading ? (
        <p className="text-center text-gray-600">Generating quote...</p>
      ) : quote ? (
        <div className="p-8">
          <p className="text-xl font-semibold text-gray-900 mb-2">{quote.text}</p>
          <p className="text-md text-gray-600">- {quote.author}</p>
        </div>
      ) : null}
      <div className="flex justify-around mt-4">
        <button 
          type='button'
          onClick={() => fetchQuote('random')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
        >
          Random Quote
        </button>
        <button 
          type='button'
          onClick={() => fetchQuote('generate')}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Generate New Quote
        </button>
      </div>
    </div>
  );
};

export default Quote;