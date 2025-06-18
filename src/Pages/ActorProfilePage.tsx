import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Actor {
  id: number;
  name: string;
  profile_path: string;
}

const ActorProfiles = () => {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [movies, setMovies] = useState<{ [key: number]: string[] }>({});

  useEffect(() => {
    const fetchPopularActors = async () => {
      try {
        const response = await axios.get('https://api.themoviedb.org/3/person/popular?api_key=621fe1fbfc8a8166a4336d9410f36ac6');
        setActors(response.data.results.slice(0, 100));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching popular actors:', error);
        setLoading(false);
      }
    };

    fetchPopularActors();
  }, []);

  useEffect(() => {
    const fetchMoviesForActors = async () => {
      const actorMovies = {};
      for (const actor of actors) {
        try {
          const response = await axios.get(`https://api.themoviedb.org/3/person/${actor.id}/movie_credits?api_key=621fe1fbfc8a8166a4336d9410f36ac6`);
          actorMovies[actor.id] = response.data.cast.map(movie => movie.title);
        } catch (error) {
          console.error(`Error fetching movies for actor ${actor.id}:`, error);
        }
      }
      setMovies(actorMovies);
    };

    if (actors.length > 0) {
      fetchMoviesForActors();
    }
  }, [actors]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Popular Actors</h1>
      <div className="actor-profiles grid grid-cols-2 md:grid-cols-4 gap-4">
        {actors.map((actor) => (
          <Link key={actor.id} to={`/actor/${actor.id}`} className="actor-profile text-white bg-gray-800 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 no-underline">
            <img src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`} alt={actor.name} className="w-full h-48 object-cover rounded-lg" />
            <h2 className="actor-name text-lg font-bold mt-2">{actor.name}</h2>
            <h3 className="text-sm">Movies:</h3>
            <ul className="movie-list">
              {movies[actor.id] && movies[actor.id].length > 0 ? (
                movies[actor.id].slice(0, 3).map((movie, index) => (
                  <li key={index} className="movie-item text-sm">{movie}</li>
                ))
              ) : (
                <li className="movie-item text-sm">No movies found</li>
              )}
            </ul>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ActorProfiles;
