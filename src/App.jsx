import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, AlertTriangle, Loader2, ExternalLink } from "lucide-react";

const NewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=d7f729f53c5040f7a1a2adbf86a857a8`
      );
      // Filter out articles with removed or invalid content
      const validArticles = response.data.articles.filter(article => 
        article.title && article.title !== '[Removed]' &&
        article.description && article.description !== '[Removed]'
      );
      setArticles(validArticles);
    } catch (err) {
      setError("Failed to fetch news. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery) {
      const timerId = setTimeout(fetchData, 500);
      return () => clearTimeout(timerId);
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 flex justify-center">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Discover the latest news..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 transition duration-300 shadow-md"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center my-8">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <span className="ml-3 text-gray-600">Loading news...</span>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center my-8 text-red-500">
            <AlertTriangle className="mr-3" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map((article, index) => (
              <div 
                key={article.url || index} 
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                {article.urlToImage && (
                  <img 
                    src={article.urlToImage} 
                    alt={article.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Read More
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No articles found. Try different keywords.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsApp;