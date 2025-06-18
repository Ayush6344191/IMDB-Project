import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Movie {
  title: string;
  release_date: string;
}

interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  movies: Movie[];
}

const FavoriteActorPage: React.FC = () => {
  const [favoriteActors, setFavoriteActors] = useState<Actor[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favoriteActors") || "[]");
    setFavoriteActors(storedFavorites);
  }, []);

  if (!favoriteActors.length) {
    return (
      <div className="text-center mt-8">
        <h1 className="text-2xl font-bold">No Favorite Actors Found</h1>
        <p>Add your favorite actors to see them here.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 px-4">
      <h1 className="text-3xl font-bold mb-6" style={{ color: "black" }}>
        Favorite Actors
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {favoriteActors.map((actor) => (
          <div
            key={actor.id}
            className="p-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-white"
            style={{ backgroundColor: "#1e2a47" }}
          >
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                  : "/placeholder-profile.jpg"
              }
              alt={actor.name}
              className="w-full h-48 object-cover rounded-lg"
            />
            <h2 className="mt-2 text-lg font-bold">{actor.name}</h2>
            <p
              className="text-sm font-semibold"
              style={{ color: "#b0c4de" }}
            >
              {actor.known_for_department}
            </p>
            <Link
              to={`/actor/${actor.id}`}
              className="mt-4 inline-block text-yellow-500 hover:text-indigo-600"
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoriteActorPage;
