import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const MovieListCard = ({ movie, viewType }) => {
  return (
    <div className={viewType === "list" ? "flex items-center mb-4" : "bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"}>
      {viewType === "list" ? (
        <>
          <img src={movie.image} alt={movie.title} className="w-24 h-36 object-cover mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-white">{movie.title}</h2>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500 font-medium">{movie.rating}</span>
            </div>
            <span className="text-gray-400 text-sm">{movie.year}</span>
          </div>
        </>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
          <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
          <div className="p-4">
            <h2 className="text-xl font-semibold text-white">{movie.title}</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">{movie.year}</span>
              <div className="flex gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-yellow-500 font-medium">{movie.rating}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieListCard;
