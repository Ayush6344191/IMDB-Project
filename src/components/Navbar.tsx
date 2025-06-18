import React, { useState, useEffect } from 'react';
import { Film, Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  release_date?: string;
  media_type: string;
}

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchSearchResults = async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=859afbb4b98e3b467da9c99ac390e950&query=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      if (data.results) {
        setSearchResults(data.results);
      } else {
        setError('No results found.');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to fetch results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleResultClick = (id: number, mediaType: string) => {
    if (mediaType === 'person') {
      navigate(`/actor/${id}`);
    } else if (mediaType === 'tv') {
      navigate(`/tv/${id}`);
    }
    else {
      navigate(`/movie/${id}`)
    }
    setSearchQuery('');
    setSearchResults([]);
  };

  const navItems = [
    { label: 'Movies', path: '/movies' },
    { label: 'Top Rated', path: '/top-rated' },
    { label: 'Fav Actors', path: '/fav-actors' },
    { label: 'Actors', path: '/actors' },
  ];

  const movies = searchResults.filter(result => result.media_type === 'movie');
  const tvShows = searchResults.filter(result => result.media_type === 'tv');
  const actors = searchResults.filter(result => result.media_type === 'person');

  return (
    <nav className="bg-black/70 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/home" className="flex items-center gap-2">
            <Film className="w-8 h-8 text-yellow-500" />
            <span className="text-xl font-bold text-black">MovieDB</span>
          </Link>
          <div className="hidden md:block">
            <form onSubmit={handleSearch} className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, TV shows, actors..."
                className="bg-black/80 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
              />
              {loading && <div className="absolute top-full left-0 w-full bg-black text-white p-2 rounded-b-lg">Loading...</div>}
              {error && <div className="absolute top-full left-0 w-full bg-red-600 text-white p-2 rounded-b-lg">{error}</div>}
              {searchResults.length > 0 && (
                <ul className="absolute bg-gray-800 text-white w-full rounded-lg shadow-xl max-h-60 overflow-y-auto mt-2">
                  {movies.length > 0 && (
                    <li>
                      <h3 className="bg-gray-700 p-3 text-black font-semibold">Movies</h3>
                      {movies.map((result) => (
                        <li
                          key={result.id}
                          onClick={() => handleResultClick(result.id, result.media_type)}
                          className="p-3 hover:bg-gray-700 cursor-pointer transition duration-200"
                        >
                          <div className="flex items-center">
                            {result.poster_path && (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${result.poster_path}`}
                                alt={result.title || result.name}
                                className="inline-block mr-3 w-16 h-24 rounded-lg"
                              />
                            )}
                            <span className="text-sm font-semibold">{result.title || result.name}</span>
                            {result.media_type === 'movie' && result.release_date && (
                              <span className="text-xs text-gray-400 ml-2">({new Date(result.release_date).getFullYear()})</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </li>
                  )}
                  {tvShows.length > 0 && (
                    <li>
                      <h3 className="bg-gray-700 p-3 text-black font-semibold">TV Shows</h3>
                      {tvShows.map((result) => (
                        <li
                          key={result.id}
                          onClick={() => handleResultClick(result.id, result.media_type)}
                          className="p-3 hover:bg-gray-700 cursor-pointer transition duration-200"
                        >
                          <div>{result.title || result.name}</div>
                        </li>
                      ))}
                    </li>
                  )}
                  {actors.length > 0 && (
                    <li>
                      <h3 className="bg-gray-700 p-3 text-black font-semibold">Actors</h3>
                      {actors.map((result) => (
                        <li
                          key={result.id}
                          onClick={() => handleResultClick(result.id, result.media_type)}
                          className="p-3 hover:bg-gray-700 cursor-pointer transition duration-200"
                        >
                          <div>{result.name}</div>
                        </li>
                      ))}
                    </li>
                  )}
                </ul>
              )}
            </form>
          </div>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="w-7 h-7 text-white" />
          </button>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <div className="flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className="text-gray-300 hover:text-yellow-500 transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-black text-white p-6">
          <form onSubmit={handleSearch} className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies, TV shows, actors..."
              className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full"
            />
          </form>

          <Link
            to="/profile"
            className="block text-gray-300 hover:text-yellow-500 py-3"
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>

          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="block text-gray-300 hover:text-yellow-500 py-3"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
export default Navbar;
