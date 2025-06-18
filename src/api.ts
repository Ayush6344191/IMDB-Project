import axios from 'axios';

const API_KEY = '621fe1fbfc8a8166a4336d9410f36ac6';
const API_URL = 'https://api.themoviedb.org/3';

const fetchRandomMovieImages = async () => {
  try {
    const response = await axios.get(`${API_URL}/movie/popular?api_key=${API_KEY}&page=${Math.floor(Math.random() * 10)}`);
    const movies = response.data.results;
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    return `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`;
  } catch (error) {
    console.error('Error fetching random movie image:', error);
    return null;
  }
};

export default fetchRandomMovieImages;
