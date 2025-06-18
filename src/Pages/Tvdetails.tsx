import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, Calendar} from 'lucide-react';


interface Tvdetails {
  id: number;
  name: string;
  overview: string;
  language: string;
  creators: { id: number; name: string }[];
  first_air_date: string;
  genres: { id: number; name: string }[];
  seasons: { season_number: number; episode_count: number }[];
  vote_average: number;
  poster_path: string;
  cast: { id: number; name: string; profile_path: string }[] | null;
  reviews: { id: string; author: string; content: string }[];
  trailers: any;
  images: { backdrops: { file_path: string }[] };
}

const Tvdetails = () => {
  const { id } = useParams<{ id: string }>();
  const showId = id;

  const [Tvdetails, setTvdetails] = useState<Tvdetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = '621fe1fbfc8a8166a4336d9410f36ac6';
  const API_URL = `https://api.themoviedb.org/3/tv/${showId}?api_key=${API_KEY}&append_to_response=credits,reviews,videos,images`;

  useEffect(() => {
    const fetchTvdetails = async () => {
      try {
        const response = await axios.get(API_URL);
        const showData = response.data;
        const creators = showData.created_by?.map((creator: any) => ({
          id: creator.id,
          name: creator.name,
        })) || [];

        setTvdetails({
          id: showData.id,
          name: showData.name,
          language: showData.original_language,
          creators: creators,
          overview: showData.overview,
          first_air_date: showData.first_air_date,
          genres: showData.genres,
          seasons: showData.seasons.map((season: any) => ({
            season_number: season.season_number,
            episode_count: season.episode_count,
          })),
          vote_average: showData.vote_average,
          poster_path: showData.poster_path,
          cast: showData.credits?.cast?.slice(0, 4).map((member: any) => ({
            id: member.id,
            name: member.name,
            profile_path: member.profile_path,
          })) || null,
          reviews: showData.reviews?.results
            .filter((review: any) => review.content.length < 300)
            .map((review: any) => ({
              id: review.id,
              author: review.author,
              content: review.content,
            })) || [],
          trailers: showData.videos?.results || [],
          images: showData.images?.backdrops || [],
        });
      } catch (err) {
        setError('Failed to fetch TV show details');
      } finally {
        setLoading(false);
      }
    };

    fetchTvdetails();
  }, [API_URL]);

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="bg-black text-white p-4">
      <div className="relative h-[60vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${Tvdetails?.poster_path})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end">
            <div className="hidden md:block">
              <img
                src={`https://image.tmdb.org/t/p/w500/${Tvdetails?.poster_path}`}
                alt={Tvdetails?.name}
                className="w-48 h-72 object-cover rounded-lg overflow-hidden shadow-xl transition-transform transform hover:scale-105"
              />
            </div>

            <div className="md:col-span-2">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{Tvdetails?.name}</h1>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">{Tvdetails?.vote_average} Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-300">{Tvdetails?.first_air_date}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {Tvdetails?.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-gray-800/80 backdrop-blur-sm rounded-full text-sm"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              <div className="mb-6">
                <p>{Tvdetails?.overview}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Seasons</h2>
        <div className="grid grid-cols-2 gap-6">
          {Tvdetails?.seasons.map((season) => (
            <div key={season.season_number} className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg">
              <h3 className="font-semibold">Season {season.season_number}</h3>
              <p>{season.episode_count} Episodes</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Cast</h2>
        <div className="grid grid-cols-2 gap-6">
          {Tvdetails?.cast?.map((actor) => (
            <Link
              key={actor.id}
              to={`/actor/${actor.id}`}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 flex gap-4 hover:bg-gray-700/50 transition-colors"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                alt={actor.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg mb-1">{actor.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Short Reviews</h2>
        <div className="space-y-6">
          {Tvdetails?.reviews.map((review) => (
            <div key={review.id} className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg">
              <h3 className="font-semibold text-lg">{review.author}</h3>
              <p className="text-gray-300 mt-2">{review.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tvdetails;
