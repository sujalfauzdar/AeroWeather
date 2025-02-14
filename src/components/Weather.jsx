import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const Weather = () => {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState(false);

    const defaultLocation = {
        lat: 26.6966,
        lon: 77.8908,
        name: "Dholpur"
    };

    const fetchWeather = async (location) => {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&hourly=relative_humidity_2m`
            );
            const data = await response.json();

            if (data.current_weather) {
                setWeather({
                    temp: data.current_weather.temperature,
                    humidity: data.hourly.relative_humidity_2m ? data.hourly.relative_humidity_2m[0] : "N/A",
                    windSpeed: data.current_weather.windspeed,
                    cityName: location.name
                });
                setError(false);
            } else {
                throw new Error("Invalid data");
            }
        } catch {
            setError(true);
            fetchWeather(defaultLocation); // Default to Dholpur if there's an error
        }
    };

    const handleSearch = async () => {
        if (!city) return;

        try {
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
            const geoData = await geoResponse.json();

            if (geoData.results && geoData.results.length > 0) {
                const location = {
                    lat: geoData.results[0].latitude,
                    lon: geoData.results[0].longitude,
                    name: geoData.results[0].name
                };
                fetchWeather(location);
            } else {
                fetchWeather(defaultLocation); // Use default location if city is invalid
            }
        } catch {
            fetchWeather(defaultLocation);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col justify-center items-center bg-gradient-to-b from-teal-200 to-orange-100 
                w-[90%] max-w-4xl min-h-[60vh] mx-auto rounded-lg shadow-lg px-6 py-10 sm:px-12 sm:py-14 md:px-12 md:py-20 lg:px-20 lg:py-28">

                {/* Search Bar */}
                <motion.div className="flex items-center w-full max-w-2xl p-2 bg-white rounded-full shadow-md border border-gray-300 
                    focus-within:border-blue-500 hover:bg-gray-100"
                    initial={{ y: 100, opacity: 0 }} // Start from below the screen
                    animate={{ y: 0, opacity: 1 }} // Move to normal position and fade in
                    transition={{ duration: 0.6, ease: "easeOut" }}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500 ml-3"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search city..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full p-3 text-gray-700 bg-transparent outline-none placeholder-gray-400 text-base sm:text-sm md:text-lg"
                    />
                    <button
                        className="ml-3 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
                        onClick={handleSearch}  // Call handleSearch instead of fetchWeather(city)
                    >
                        Search
                    </button>
                </motion.div>

                {/* Weather Information */}
                {weather && (
                    <div className="flex flex-col items-center gap-2 text-center mt-6">
                        {/* Weather Icon */}
                        <img src={assets.clear} alt="Weather Icon" className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40" />

                        {/* Temperature */}
                        <p className="text-4xl font-bold text-gray-800 sm:text-5xl md:text-6xl">
                            {weather.temp}
                            <span className="align-super text-2xl">°</span> C
                        </p>

                        {/* Location */}
                        <p className="text-lg font-medium text-gray-600 sm:text-xl md:text-2xl">
                            {weather.cityName}
                        </p>

                        {/* Humidity and Wind Speed */}
                        <div className="flex flex-row justify-center items-center gap-6 sm:gap-14 md:gap-24 lg:gap-36 mt-6">
                            {/* Humidity */}
                            <div className="flex items-center gap-3 bg-teal-50 p-4 rounded-lg shadow-md">
                                <img src={assets.humidity} alt="Humidity Icon" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                                <div className="flex flex-col">
                                    <p className="text-base sm:text-lg md:text-xl font-medium text-gray-800">{weather.humidity}%</p>
                                    <span className="text-black sm:text-lg md:text-xl">Humidity</span>
                                </div>
                            </div>

                            {/* Wind Speed */}
                            <div className="flex items-center gap-3 bg-teal-50 p-4 rounded-lg shadow-md">
                                <img src={assets.wind} alt="Wind Icon" className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                                <div className="flex flex-col">
                                    <p className="text-base sm:text-lg md:text-xl font-medium text-gray-800">{weather.windSpeed} Kmph</p>
                                    <span className="text-black sm:text-lg md:text-xl">Wind Speed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 mt-4">Error fetching weather data.</p>}
            </div>
        </div>
    );
};

export default Weather;
