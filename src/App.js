import "./App.css";
import Navbar from "./components/Navbar.tsx";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home.tsx";
import MovieList from "./Pages/MovieList.tsx";
import MovieDetails from "./Pages/MovieDetails.tsx";
import Toprated from "./Pages/Toprated.jsx";
import Actordetails from "./Pages/Actordetails.tsx";
import ProfilePage from "./Pages/ProfilePage.tsx";
import ActorProfilePage from "./Pages/ActorProfilePage.tsx";
import ConditionalRoute from './components/ConditionalRoute.tsx';
import Tvdetails from './Pages/Tvdetails.tsx'
import FavActors from './Pages/FavActors.tsx'

const AppRoutes = () => {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/actors" element={<ActorProfilePage />} />
        <Route path="/" element={<ConditionalRoute />} />
        <Route path="/movies" element={<MovieList />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/actor/:id" element={<Actordetails />} />
        <Route path="tv/:id" element={<Tvdetails />} />
        <Route path="/top-rated" element={<Toprated />} />
        <Route path="/fav-actors" element={<FavActors />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
