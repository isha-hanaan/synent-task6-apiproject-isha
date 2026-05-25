import "./App.css";
import { useState } from "react";

function App() {
    const [city, setCity] = useState("");
    const API_KEY = import.meta.env.VITE_API_KEY;

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getBackgroundClass = () => {
        if (!weather) return "default-bg";
        const condition = weather.weather[0].main.toLowerCase();

        if (condition.includes("clear")) return "clear-bg";
        if (condition.includes("cloud")) return "cloudy-bg";
        if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) return "rain-bg";
        if (condition.includes("snow")) return "snow-bg";

        return "default-bg"; // fallback for mist, haze, etc.
    };

    const fetchWeather = async () => {
        if (!city.trim()) return;
        setLoading(true);
        setError("");
        setWeather(null);

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );

            if (!response.ok) {
                throw new Error("City not found");
            }

            const data = await response.json();
            setWeather(data);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`app ${getBackgroundClass()}`}>

            <div className="weather-card">
                <h1>MoodCast</h1>

                <input
                    type="text"
                    placeholder="Search city..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                />

                <button onClick={fetchWeather}>
                    Search
                </button>

                {loading && <p className="status-msg">Loading weather...</p>}
                {error && <p className="status-msg error">{error}</p>}

                {weather && (
                    <div className="weather-info">
                        <h2>{weather.name}</h2>

                        <img
                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                            alt={weather.weather[0].description}
                            className="weather-icon"
                        />

                        <p className="temp">{Math.round(weather.main.temp)}°C</p>
                        <p className="condition">{weather.weather[0].description}</p>
                        <p className="humidity">Humidity: {weather.main.humidity}%</p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default App;