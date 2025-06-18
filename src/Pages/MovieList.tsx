import { SlidersHorizontal, Star } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";

type Actor = {
  id: number;
  name: string;
};

const Movies = [
  {
    "id": 746036,
    "title": "The Fall Guy",
    "rating": 7.0,
    "image": "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/e7olqFmzcIX5c23kX4zSmLPJi8c.jpg",
    "year": 2024,
    "genre": ["Action", "Comedy", "Adventure"],
    "videoUrl": "https://www.youtube.com/embed/j7jPnwVGdZ8"
  },
  {
    "id": 811941,
    "title": "Devara: Part 1",
    "rating": 7.8,
    "image": "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/A9ENz6d4lC3UYOX8Z1gJwDEo1sM.jpg",
    "year": 2024,
    "genre": ["Action", "Thriller", "Drama"],
    "videoUrl": "https://www.youtube.com/embed/J1g-8hBwj3I"
  },
  {
    "id": 1160018,
    "title": "Kill",
    "rating": 7.2,
    "image": "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/m2zXTuNPkywdYLyWlVyJZW2QOJH.jpg",
    "year": 2024,
    "genre": ["Action", "Thriller", "Drama"],
    "videoUrl": "https://www.youtube.com/embed/cVyNeDYu9Kk"
  },
  {
    "id": 984500,
    "title": "UI",
    "rating": 6.3,
    "image": "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/tWoeysV4ro6wn4TE0QgqMuo6Val.jpg",
    "year": 2024,
    "genre": ["Thriller", "Fantasy"],
    "videoUrl": "https://www.youtube.com/embed/3T3roo-MXmc"
  },
      {
        id: 1147058,
        title: "Max",
        rating: 7.5,
        image: "https://image.tmdb.org/t/p/w500//gCAMuciUv7Xxb6YAoQhNUR6Z1xB.jpg",
        year: 2024,
        genre: ["Action", "Adventure", "Drama"],
        videoUrl: "https://www.youtube.com/embed/aQr3-svRGUI"
      },
      {
        id: 1239511,
        title: "Lucky Bhaskar",
        rating: 7.8,
        image: "https://image.tmdb.org/t/p/w500//a47JQFl9L7VDa79tEvnTOJe0rPa.jpg",
        year: 2024,
        genre: ["Crime", "Thriller"],
        videoUrl: "https://www.youtube.com/embed/Kv5RKsqVe-Y"
      },
      {
        id: 1118224,
        title: "Maharaja",
        rating: 7.9,
        image: "https://image.tmdb.org/t/p/w500//3WgxA2nSzAgMR4DYDty0O9wx68x.jpg",
        year: 2024,
        genre: ["Action", "Thriller"],
        videoUrl: "https://www.youtube.com/embed/Otcr-vRuaQs"
      },
      {
        id: 1069945,
        title: "Manjummel Boys",
        rating: 7.8,
        image: "https://image.tmdb.org/t/p/w500//bswrtewwthpsh6nABiqKevU4UBI.jpg",
        year: 2024,
        genre: ["Adventure", "Thriller"],
        videoUrl: "https://www.youtube.com/embed/-Kq2MxoJVKo"
      },
  {
        id: 762509,
        title: "Mufasa: The Lion King",
        rating: 8.5,
        image: "https://image.tmdb.org/t/p/w500//iBqXjFkAozQ1z2sfAiWwBimbiJX.jpg",
        year: 2024,
        cast: [
          { name: "Donald Glover" },
          { name: "Beyoncé" },
          { name: "James Earl Jones" },
        ],
        genre: ["Animation", "Adventure", "Drama"],
        videoUrl: "https://www.youtube.com/embed/y_iHpB0BDJA"
      },
      {
        id: 533535,
        title: "Deadpool & Wolverine",
        rating: 7.7,
        image: "https://image.tmdb.org/t/p/w500//8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
        year: 2024,
        genre: ["Action", "Sci-Fi", "Comedy"],
        videoUrl: "https://www.youtube.com/embed/LYaJVfiwv0w"
      },
      {
        id: 693134,
        title: "Dune: Part Two",
        rating: 8.8,
        image:
          "https://image.tmdb.org/t/p/w500//6izwz7rsy95ARzTR3poZ8H6c5pp.jpg",
        year: 2024,
        genre: ["Action", "Adventure", "Sci-Fi"],
        videoUrl: "https://www.youtube.com/embed/_YUzQa_1RCE"
      },
      {
        id: 414906,
        title: "The Batman",
        rating: 8.5,
        image:
          "https://m.media-amazon.com/images/S/pv-target-images/81ef275effa427553a847bc220bebe1dc314b2e79d00333f94a6bcadd7cce851.jpg",
        year: 2024,
        genre: ["Action", "Crime", "Drama"],
        videoUrl: "https://www.youtube.com/embed/mqqft2x_Aa4"
      },
      {
        id: 603692,
        title: "John Wick: Chapter 4",
        rating: 8.2,
        image:
          "https://image.tmdb.org/t/p/w500//gh2bmprLtUQ8oXCSluzfqaicyrm.jpg",
        year: 2023,
        genre: ["Action", "Crime", "Thriller"],
        videoUrl: "https://www.youtube.com/embed/qEVUtrk8_B4"
      },
      {
        id: 872585,
        title: "Oppenheimer",
        rating: 8.9,
        image:
          "https://www.themoviedb.org/t/p/w600_and_h900_bestv2/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
        year: 2023,
        genre: ["Biography", "Drama", "History"],
        videoUrl: "https://www.youtube.com/embed/uYPbbksJxIg"
      },
      {
        id: 912649,
        title: "Venom: The Last Dance",
        rating: 7.0,
        image: "https://image.tmdb.org/t/p/w500//aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
        year: 2023,
        genre: ["Action", "Sci-Fi", "Thriller"],
        videoUrl: "https://www.youtube.com/embed/tVqo-hIE4qA"
      },
      {
        id: 933260,
        title: "The Substance",
        rating: 7.5,
        image: "https://image.tmdb.org/t/p/w500//lqoMzCcZYEFK729d6qzt349fB4o.jpg",
        year: 2023,
        genre: ["Horror", "Thriller"],
        videoUrl: "https://www.youtube.com/embed/qVN3Zk-qb1Q"
      },
      {
        id: 1118031,
        title: "Apocalypse Z: The Beginning of the End",
        rating: 7.8,
        image: "https://image.tmdb.org/t/p/w500//wIGJnIFQlESkC2rLpfA8EDHqk4g.jpg",
        year: 2023,
        genre: ["Action", "Horror", "Sci-Fi"],
        videoUrl: "https://www.youtube.com/embed/zeQXjn3JJ-A"
      },
      {
        id: 466420,
        title: "Killers of the Flower Moon",
        rating: 8.7,
        image:
          "https://i.ytimg.com/vi/7cx9nCHsemc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCOr64ZRE0h5NykaW__1LRQjVOQyg",
        year: 2023,
        genre: ["Crime", "Drama", "History"],
        videoUrl: "https://www.youtube.com/embed/EP34Yoxs3FQ"
      },
      {
        id: 157336,
        title: "Interstellar",
        rating: 8.6,
        image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        year: 2014,
        genre: ["Adventure", "Drama", "Sci-Fi"],
        videoUrl: "https://www.youtube.com/embed/zSWdZVtXT7E"
      },
      {
        id: 496243,
        title: "Parasite",
        rating: 8.6,
        image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
        year: 2019,
        genre: ["Comedy", "Drama", "Thriller"],
        videoUrl: "https://www.youtube.com/embed/5xH0HfJHsaY"
      },
      {
        id: 1124,
        title: "The Prestige",
        rating: 8.5,
        image: "https://image.tmdb.org/t/p/w500//bdN3gXuIZYaJP7ftKK2sU0nPtEA.jpg",
        year: 2006,
        genre: ["Drama", "Mystery", "Sci-Fi"],
        videoUrl: "https://www.youtube.com/embed/o4gHCmTQDVI"
      },
      {
        id: 27205,
        title: "Inception",
        rating: 8.8,
        image: "https://image.tmdb.org/t/p/w500//oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
        year: 2010,
        genre: ["Action", "Adventure", "Sci-Fi"],
        videoUrl: "https://www.youtube.com/embed/YoHD9XEInc0"
      },
      {
        id: 603,
        title: "The Matrix",
        rating: 8.7,
        image: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
        year: 1999,
        genre: ["Action", "Sci-Fi"],
        videoUrl: "https://www.youtube.com/embed/vKQi3bBA1y8"
      },
      {
        id: 550,
        title: "Fight Club",
        rating: 8.8,
        image: "https://image.tmdb.org/t/p/w500/bptfVGEQuv6vDTIMVCHjJ9Dz8PX.jpg",
        year: 1999,
        genre: ["Drama"],
        videoUrl: "https://www.youtube.com/embed/qtRKdVHc-cE"
      },
];

const MovieList = () => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [ratingRange] = useState<number>(10);
  const [minRating, setMinRating] = useState<number>(0);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedActor, setSelectedActor] = useState<string>("All");
  const [actors, setActors] = useState<Actor[]>([]);
  
  const [viewMode, setViewMode] = useState<string>("grid");

  const fetchActors = async () => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/person/popular?api_key=621fe1fbfc8a8166a4336d9410f36ac6');
      const data = response.data;
      setActors(data.results);
    } catch (error) {
      console.error('Error fetching actors:', error);
    }
  };

  useEffect(() => {
    fetchActors();
  }, []);

  const handleMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const filteredMovies = Movies.filter(movie => {
    const actorMatch = selectedActor === "All" || movie.cast?.some(actor => actor.name === selectedActor);
    const genreMatch = selectedGenre === "All" || movie.genre.includes(selectedGenre);
    const yearMatch = selectedYear === "All" || movie.year.toString() === selectedYear;
    const ratingMatch = movie.rating <= ratingRange && movie.rating >= minRating;

    return actorMatch && genreMatch && yearMatch && ratingMatch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 md:mb-0">
          {search ? `Search Results for "${search}"` : "Popular Movies"}
        </h1>
        <div className="flex w-full md:w-auto justify-between">
        <button
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal /> Filters
        </button>
        {/* Toggle Button for View Mode */}
        <button
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          {viewMode === "grid" ? "Switch to List View" : "Switch to Grid View"}
        </button>
        </div>
      </div>

      {showFilters && ( 
        <div className="mb-4">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg mr-2 mb-2 md:mb-0"
          >
            <option value="All">All Genres</option>
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Romance">Romance</option>
            <option value="Crime">Crime</option>
            <option value="Biography">Biography</option>
            <option value="History">History</option>
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg mr-2 mb-2 md:mb-0"
          >
            <option value="All">All Years</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2014">2014</option>
            <option value="2010">2010</option>
            <option value="2008">2008</option>
            <option value="2006">2006</option>
            <option value="1999">1999</option>
          </select>
          <select
            value={selectedActor}
            onChange={(e) => setSelectedActor(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg mr-2 mb-2 md:mb-0"
          >
            <option value="All">All Actors</option>
            {actors.map((actor) => (
              <option key={actor.id} value={actor.name}>
                {actor.name}
              </option>
            ))}
          </select>
          <div className="mt-4">
            <label className="text-white">Rating Range (Minimum): {minRating}</label>
            <input
              type="range"
              min="0"
              max="10"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}

      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8" : "flex flex-col gap-4"}>
        {filteredMovies.map((movie, index) => (
          <Link key={movie.id} to={`/movie/${movie.id}`}>
            {viewMode === "grid" ? (
              <div
                className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="relative aspect-video group">
                  <img
                    src={movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:opacity-80 transition-opacity duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-500 font-medium">{movie.rating}</span>
                  </div>
                  <iframe
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-300 ${hoveredIndex === index ? "opacity-100" : "opacity-0"
                      }`}
                    src={hoveredIndex === index ? `${movie.videoUrl}?autoplay=1` : movie.videoUrl}
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                    title={movie.title}
                  ></iframe>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-white mb-2">{movie.title}</h2>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">{movie.year}</span>
                    <div className="flex gap-2">
                      {movie.genre.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="text-xs px-2 py-1 bg-zinc-800 rounded-full text-zinc-300"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-xl p-4 flex flex-col">
                <h2 className="text-xl font-semibold text-white mb-2">{movie.title}</h2>
                <span className="text-gray-400 text-sm mb-2">{movie.year}</span>
                <span className="text-yellow-500 font-medium mb-2">Rating: {movie.rating}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieList;
