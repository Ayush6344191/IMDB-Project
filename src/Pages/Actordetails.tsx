import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart } from "lucide-react";

interface Actor {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  movie_credits: {
    cast: {
      id: number;
      title: string;
      character: string;
      poster_path: string | null;
    }[];
  };
}

const TMDB_API_KEY = "621fe1fbfc8a8166a4336d9410f36ac6";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const Actordetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [actor, setActor] = useState<Actor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBiography, setShowBiography] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        setLoading(true);

        const actorResponse = await fetch(
          `${TMDB_BASE_URL}/person/${id}?api_key=${TMDB_API_KEY}`
        );
        if (!actorResponse.ok) throw new Error("Failed to fetch actor details.");

        const actorData = await actorResponse.json();

        const creditsResponse = await fetch(
          `${TMDB_BASE_URL}/person/${id}/movie_credits?api_key=${TMDB_API_KEY}`
        );
        if (!creditsResponse.ok)
          throw new Error("Failed to fetch actor's movie credits.");

        const creditsData = await creditsResponse.json();

        const actorDetails: Actor = {
          ...actorData,
          movie_credits: {
            cast: creditsData.cast.slice(0, 10),
          },
        };

        setActor(actorDetails);

        const favoriteActors = JSON.parse(localStorage.getItem("favoriteActors") || "[]");
        setIsFavorite(favoriteActors.some((favActor: Actor) => favActor.id === actorDetails.id));
      } catch (err: any) {
        setError(err.message || "Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchActorDetails();
    }
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!actor) return;

    const storedFavorites = JSON.parse(localStorage.getItem("favoriteActors") || "[]");
    if (isFavorite) {
      const updatedFavorites = storedFavorites.filter(
        (fav: Actor) => fav.id !== actor.id
      );
      localStorage.setItem("favoriteActors", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
      alert(`${actor.name} has been removed from your favorites.`);
    } else {
      const updatedFavorites = [
        ...storedFavorites,
        { id: actor.id, name: actor.name, profile_path: actor.profile_path },
      ];
      localStorage.setItem("favoriteActors", JSON.stringify(updatedFavorites));
      setIsFavorite(true);
      alert(`${actor.name} has been added to your favorites.`);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-4 border-yellow-500 border-t-transparent rounded-full"></div>
        <span className="ml-4 text-lg text-black dark:text-white">
          Loading Actor Details...
        </span>
      </div>
    );
  if (error)
    return (
      <div className="text-red-700 dark:text-red-400 text-center">{error}</div>
    );
  if (!actor)
    return (
      <div className="text-black dark:text-white text-center">
        No actor details found.
      </div>
    );

  return (
    <div className="container mx-auto mt-8 px-4">
      <div
        className="p-6 rounded-lg shadow-lg text-white"
        style={{ backgroundColor: "#1e2a47" }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-full md:w-72">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                  : "/placeholder-profile.jpg"
              }
              alt={actor.name}
              className="rounded-lg shadow-lg hover:scale-105 transform transition-transform duration-300"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold">{actor.name}</h1>
            <p className="mt-2">
              <strong>Known For:</strong> {actor.known_for_department}
            </p>
            <p className="mt-2">
              <strong>Birthday:</strong>{" "}
              {actor.birthday ? actor.birthday : "Unknown"}
            </p>
            {actor.deathday && (
              <p className="mt-2">
                <strong>Deathday:</strong> {actor.deathday}
              </p>
            )}
            <p className="mt-2">
              <strong>Place of Birth:</strong>{" "}
              {actor.place_of_birth ? actor.place_of_birth : "Unknown"}
            </p>

            <div className="flex items-center gap-4 mt-4">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 focus:outline-none"
                onClick={() => setShowBiography((prev) => !prev)}
              >
                {showBiography ? "Hide Biography" : "Show Biography"}
              </button>
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-lg shadow ${isFavorite
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                  }`}
              >
                <Heart
                  className={`w-6 h-6 text-white ${isFavorite ? "fill-current" : ""
                    }`}
                />
              </button>
            </div>

            {showBiography && <p className="mt-4">{actor.biography}</p>}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">
          Movies
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {actor.movie_credits.cast.map((movie) => (
            <Link key={movie.id} to={`/movie/${movie.id}`}>
              <div
                className="flex flex-col items-center bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                      : "/placeholder-movie.jpg"
                  }
                  alt={movie.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="mt-4 text-sm font-semibold text-black dark:text-white">
                  {movie.title}
                </h3>
                <p className="text-sm text-black dark:text-gray-300">
                  {movie.character}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Actordetails;