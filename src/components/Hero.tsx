import React, { useEffect, useState } from "react";
import { Play, Star, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Movie {
  backdrop_path: string | null;
  vote_average: number | null;
  release_date: string | null;
  title: string;
  overview: string | null;
  id: number;
  trailers: { key: string }[];
}

const Hero = () => {
  const [currentMovie, setCurrentMovie] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const API_KEY = '621fe1fbfc8a8166a4336d9410f36ac6';
  const MOVIE_VIDEOS_URL = `https://api.themoviedb.org/3/movie/{movieId}/videos?api_key=${API_KEY}`;
  const TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await axios.get(TRENDING_URL);
        const movies = response.data.results;

        const moviesWithTrailers = await Promise.all(movies.map(async (movie: Movie) => {
          const trailerResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}`);
          return { ...movie, trailers: trailerResponse.data.results };
        }));

        setTrendingMovies(moviesWithTrailers);
      } catch (error) {
        console.error("Failed to fetch trending movies", error);
      }
    };

    fetchTrendingMovies();
    const timer = setInterval(() => {
      setCurrentMovie((prev) => (prev + 1) % trendingMovies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [trendingMovies.length]);

  const movie: Movie | undefined = trendingMovies[currentMovie];

  return (
    <div className="relative h-[90vh] bg-gradient-to-b from-transparent to-black">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 gradient-mask"
        style={{
          backgroundImage: `url('${movie?.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : ''}')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-yellow-500 font-semibold">
                {movie?.vote_average} Rating
              </span>
            </div>
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
              <Calendar className="w-5 h-5 text-zinc-400" />
              <span className="text-zinc-300">{movie?.release_date}</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 text-glow">
            {movie?.title}
          </h1>
          <p className="text-zinc-300 text-lg mb-8 line-clamp-3 max-w-xl">
            {movie?.overview}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="#"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${movie?.trailers[0].key}`, '_blank')}
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-yellow-400 transition-all hover:scale-105 duration-300 no-underline"
            >
              <Play className="w-5 h-5" />
              Watch Trailer
            </Link>
            <Link
              to={`/movie/${movie?.id}`}
              className="bg-zinc-900/80 backdrop-blur-md text-white px-8 py-3 rounded-xl font-semibold hover:bg-zinc-800 transition-all hover:scale-105 duration-300 no-underline"
            >
              More Info
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 right-4 flex gap-2">
          {trendingMovies.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentMovie(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentMovie === index
                  ? "bg-yellow-500 w-8"
                  : "bg-zinc-600 w-4 hover:bg-zinc-500"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
