import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Star, Calendar, Clock, Play, Heart, Globe, DollarSign, Bookmark, ThumbsDown, ThumbsUp } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { useAuth } from '../context/AuthContext.tsx';
import { db } from '../firebase.ts';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, onSnapshot, query, orderBy, setDoc, doc } from 'firebase/firestore';

interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  language: string;
  director: string;
  boxOffice: string;
  release_date: string;
  genres: { id: number; name: string }[];
  runtime: number;
  vote_average: number;
  poster_path: string;
  cast: { id: number; name: string; profile_path: string }[] | null;
  reviews: { id: string; author: string; content: string; likes?: number; dislikes?: number }[];
  trailers: any;
  images: { backdrops: { file_path: string }[] };
  streamingLinks: any;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = id;
  const { user } = useAuth();
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState<number | null>(null);
  const [movieReviews, setMovieReviews] = useState<{ author: string; content: string; likes?: number; dislikes?: number }[]>([]);
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('mostHelpful');
  const [sortedReviews, setSortedReviews] = useState(movieDetails?.reviews);

  const API_KEY = '621fe1fbfc8a8166a4336d9410f36ac6';
  const API_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,reviews,videos,images,watch/providers`;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(API_URL);
        const movieData = response.data;
        const director = movieData.credits?.crew?.find((member: any) => member.job === 'Director')?.name || 'Unknown Director';
        const streamingLinks = movieData['watch/providers']?.results?.US?.flatrate || [];

        setMovieDetails({
          id: movieData.id,
          title: movieData.title,
          language: movieData.original_language,
          director: director,
          boxOffice: movieData.revenue,
          overview: movieData.overview,
          release_date: movieData.release_date,
          genres: movieData.genres,
          runtime: movieData.runtime,
          poster_path: movieData.poster_path,
          vote_average: movieData.vote_average,
          cast: movieData.credits?.cast?.slice(0, 4).map((member: any) => ({
            id: member.id,
            name: member.name,
            profile_path: member.profile_path,
          })) || null,
          reviews: movieData.reviews?.results.map((review: any) => ({
            id: review.id,
            author: review.author,
            content: review.content,
          })) || [],
          trailers: movieData.videos?.results || [],
          images: movieData.images?.backdrops || [],
          streamingLinks: streamingLinks,
        });
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [API_URL, movieId]);

  const handleUpvote = (index: number) => {
    setMovieDetails((prev) =>
      prev
        ? {
          ...prev,
          reviews: prev.reviews.map((review, idx) =>
            idx === index ? { ...review, likes: (review.likes || 0) + 1 } : review
          ),
        }
        : null
    );
  };

  const handleDownvote = (index: number) => {
    setMovieDetails((prev) =>
      prev
        ? {
          ...prev,
          reviews: prev.reviews.map((review, idx) =>
            idx === index ? { ...review, dislikes: (review.dislikes || 0) + 1 } : review
          ),
        }
        : null
    );
  };

  const handleAddToWatchlist = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;

      try {
        const watchlistCollectionRef = collection(db, 'users', userId, 'watchlist');
        await addDoc(watchlistCollectionRef, {
          movieId: movieDetails?.id,
          title: movieDetails?.title,
          releaseDate: movieDetails?.release_date,
          genres: movieDetails?.genres.map((genre) => genre.name),
          posterPath: movieDetails?.poster_path,
        });
        alert('Movie added to watchlist!');
      } catch (error) {
        console.error('Error adding to watchlist: ', error);
      }
    } else {
      console.log('No user is logged in');
    }
  };

  const handleRatingSubmit = async () => {
    if (!user) {
      alert('Please log in to rate this movie');
      return;
    }
    if (userRating === null || userRating < 0 || userRating > 10) {
      alert('Rating must be between 0 and 10');
      return;
    }

    try {
      const userId = user.uid;
      if (!movieId) {
        throw new Error('Movie ID is undefined');
      }
      const ratingDocRef = doc(db, `users/${userId}/ratings`, movieId);
      await setDoc(ratingDocRef, {
        movieId: movieDetails?.id,
        title: movieDetails?.title,
        rating: userRating,
        timestamp: new Date(),
      });
      alert('Rating submitted!');
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleReviewSubmit = async () => {
    if (!user) {
      alert('Please log in to submit a review');
      return;
    }

    if (!userReview.trim()) {
      alert('Review cannot be empty');
      return;
    }

    try {
      const userId = user.uid;
      const reviewsRef = collection(db, 'users', userId, 'reviews');
      await addDoc(reviewsRef, {
        author: user.displayName || 'Anonymous',
        content: userReview,
        title: movieDetails?.title,
        timestamp: new Date(),
      });

      setUserReview('');
      alert('Review submitted!');
    } catch (error) {
      console.error('Error submitting review: ', error);
    }
  };

  if (loading) return <p className="text-center text-xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  const watchOnlineLink = movieDetails?.streamingLinks?.[0]?.url || '';

  if (loading) {
    return (
      <div className="text-center">
        <div className="loader"></div>
        <p className="text-xl">Loading movie details...</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black p-4">

      <div className="relative h-[60vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original/${movieDetails?.poster_path})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-200 via-gray-200/80" />
        </div>

        <div className="relative container mx-auto px-4 h-full flex items-end pb-12">
          <div className="grid md:grid-cols-3 gap-8 items-end">
            <div className="hidden md:block">
              <img
                src={`https://image.tmdb.org/t/p/w500/${movieDetails?.poster_path}`}
                alt={movieDetails?.title}
                className="w-48 h-72 object-cover rounded-lg overflow-hidden shadow-xl transition-transform transform hover:scale-105"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-yellow-500 font-semibold">{movieDetails?.vote_average} Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Clock className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">{movieDetails?.runtime} minutes</span>
                </div>
                <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">{movieDetails?.release_date}</span>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold mb-4">{movieDetails?.title}</h1>

              <div className="flex flex-wrap gap-2 mb-6">
                {movieDetails?.genres.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 bg-gray-200/80 backdrop-blur-sm rounded-full text-sm"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <a
                  href={`https://www.youtube.com/watch?v=${movieDetails?.trailers[0].key}`}
                  className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 transition-all duration-200 text-black px-6 py-3 rounded-lg font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Play className="w-5 h-5" />
                  <span>Watch Trailer</span>
                </a>
                <button onClick={handleAddToWatchlist} className="bg-gray-200/80 backdrop-blur-sm text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="my-12 px-4">
        <h2 className="text-2xl font-semibold mb-6">Overview</h2>
        <p className="text-lg text-gray-600 leading-relaxed">{movieDetails?.overview}</p>
      </section>

      <section className="mb-12">
        <Swiper
          spaceBetween={5}
          slidesPerView={3}
          centeredSlides={false}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="swiper-container"
          style={{ width: '80%', margin: '0 auto' }}
        >
          {movieDetails?.trailers?.[0] && (
            <SwiperSlide>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${movieDetails.trailers[0].key}`}
                  title="Movie Trailer"
                  frameBorder="0"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </SwiperSlide>
          )}

          {movieDetails?.images?.backdrops?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${image.file_path}`}
                  alt={`Movie Image ${index}`}
                  className="absolute inset-0 w-full h-full object-cover rounded-lg"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      <div>
        <div className="sticky top-24 space-y-6">
          <div className="bg-gray-200/50 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-semibold mb-4">Movie Info</h3>
            <dl className="space-y-4">
              <div>
                <dt className="text-gray-600">Language</dt>
                <dd className="flex items-center gap-1">
                  <Globe className="w-4 h-4 text-blue-500" />
                  {movieDetails?.language}
                </dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="text-gray-600">Box Office</dt>
                <dd className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  {movieDetails?.boxOffice}
                </dd>
              </div>
              <div>
                <dt className="text-gray-600">Director</dt>
                <dd className="flex items-center gap-1 text-gray-800">{movieDetails?.director}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Cast</h2>
        <div className="grid grid-cols-2 gap-6">
          {movieDetails?.cast?.map((actor) => (
            <Link
              key={actor.id}
              to={`/actor/${actor.id}`}
              className="bg-gray-200/50 backdrop-blur-sm rounded-lg p-4 flex gap-4 hover:bg-gray-300/50 transition-colors"
            >
              <img
                src={`https://image.tmdb.org/t/p/w200/${actor.profile_path}`}
                alt={actor.name}
                className="w-16 h-24 object-cover rounded-md"
              />
              <div>
                <p className="font-semibold text-gray-800">{actor.name}</p>
                <p className="text-sm text-gray-600">See Profile</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section className="my-12">
        <h2 className="text-3xl font-bold text-black mb-8 border-b-2 border-gray-300 ">
          Your Rating
        </h2>
        {user ? (
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star, index) => (
                <button
                  key={index}
                  className={`text-3xl text-${(userRating ?? 0) >= star ? 'black' : 'yellow-500'} hover:text-yellow-500`}
                  onClick={() => setUserRating(star)}
                >
                  &#9733;
                </button>
              ))}
            </div>
            <button
              onClick={handleRatingSubmit}
              className="bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-all transform hover:scale-105"
            >
              Submit Rating
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg mt-6">
            Log in to rate this movie.
          </p>
        )}
      </section>


      <section className="my-12">
        <h2 className="text-3xl font-bold text-black mb-8 border-b-2 border-gray-300 ">
          Your Review
        </h2>
        <div>
          {movieReviews.map((review, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{review.author}</p>
              <p>{review.content}</p>
            </div>
          ))}
        </div>

        {user && (
          <div className="mt-6">
            <textarea
              className="w-full bg-gray-200 text-black p-4 rounded-md"
              rows={4}
              placeholder="Write your review here..."
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
            />
            <button
              onClick={handleReviewSubmit}
              className="bg-yellow-500 text-black px-4 py-2 rounded-md mt-4"
            >
              Submit Review
            </button>
          </div>
        )}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">User Reviews</h2>
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg text-gray-600">Sort by:</p>
          <div className="flex items-center gap-4">
            <button
              className={`text-black hover:text-gray-600 py-2 px-4 rounded-lg ${sortOption === 'mostHelpful' ? 'bg-yellow-500' : 'bg-transparent'}`}
              onClick={() => setSortOption('mostHelpful')}
            >
              Most Helpful
            </button>
            <button
              className={`text-black hover:text-gray-600 py-2 px-4 rounded-lg ${sortOption === 'mostRecent' ? 'bg-yellow-500' : 'bg-transparent'}`}
              onClick={() => setSortOption('mostRecent')}
            >
              Most Recent
            </button>
          </div>
        </div>
        {movieDetails?.reviews?.map((review, index) => (
          <div key={review.id} className="bg-gray-200/50 backdrop-blur-sm rounded-lg p-6 mb-4">
            <h3 className="font-semibold">{review.author}</h3>
            <p className="text-lg text-gray-800">{review.content}</p>
            <div className="flex items-center mt-2 space-x-4">
              <button
                onClick={() => handleUpvote(index)}
                className="text-green-600 flex items-center space-x-2"
              >
                <ThumbsUp className="w-5 h-5" />
                <span>Upvote ({review.likes})</span>
              </button>
              <button
                onClick={() => handleDownvote(index)}
                className="text-red-500 flex items-center space-x-2"
              >
                <ThumbsDown className="w-5 h-5" />
                <span>Downvote ({review.dislikes})</span>
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MovieDetails;
