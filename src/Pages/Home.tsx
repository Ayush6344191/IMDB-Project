import React, { useState, useEffect } from "react";
import axios from "axios";
import Hero from "../components/Hero.tsx";
import { Award, Clock, Star, TrendingUp, Bookmark, User } from "lucide-react";
import { Link } from "react-router-dom";
import MovieCarousel from "../components/MovieCarousel.tsx";
import MovieCard from "../components/MovieCard.tsx";

const Home = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState("grid"); 

  const API_KEY = '621fe1fbfc8a8166a4336d9410f36ac6';
  const TRENDING_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`;
  const UPCOMING_URL = `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`;

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const trendingResponse = await axios.get(TRENDING_URL);
        const upcomingResponse = await axios.get(UPCOMING_URL);
        setTrendingMovies(trendingResponse.data.results);
        setUpcomingMovies(upcomingResponse.data.results);
      } catch (err) {
        setError('Failed to fetch movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleViewToggle = () => {
    setView(view === "grid" ? "list" : "grid");
  };

  return (
    <div>
      <Hero />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            {
              icon: TrendingUp,
              label: "Trending",
              path: "/movies?sort=trending",
              color: "bg-yellow-500",
            },
            {
              icon: Star,
              label: "Top Rated",
              path: "/top-rated",
              color: "bg-purple-500",
            },
            {
              icon: Clock,
              label: "Coming Soon",
              path: "/coming-soon",
              color: "bg-blue-500",
            },
            {
              icon: Award,
              label: "Awards",
              path: "/awards",
              color: "bg-red-500",
            },
          ].map((category, index) => (
            <Link
              key={index}
              to={category.path}
              className={`${category.color} p-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-70 transition-opacity`}
            >
              <category.icon className="w-5 h-5" />
              <span className="font-medium text-black">{category.label}</span>
            </Link>
          ))}
        </div>
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-black">
              <TrendingUp className="w-6 h-6 text-black" />
              Trending Now
            </h2>
            <Link to="/movies?sort=trending" className="text-yellow-500 hover:text-yellow-400 no-underline">
              View All
            </Link>
          </div>
          <MovieCarousel movies={trendingMovies} />
        </section>
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-black">
              <Clock className="w-6 h-6 text-black" />
              Coming Soon
            </h2>
            <Link to="/coming-soon" className="text-yellow-500 hover:text-yellow-400 no-underline">
              View All
            </Link>
          </div>
          <MovieCarousel movies={upcomingMovies} />
        </section>
      </main>
    </div>
  );
};

export default Home;
