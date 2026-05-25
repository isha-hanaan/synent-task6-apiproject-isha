import "./App.css";
import { useState } from "react";

function App() {
    const [city, setCity] = useState("");
    const API_KEY = import.meta.env.VITE_API_KEY;

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        <div className="app">

            <div className="weather-card">
                <h1>MoodCast</h1>

                <input
                    type="text"
                    placeholder="Search city..."
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />

                <button onClick={fetchWeather}>
                    Search
                </button>

                {loading && <p>Loading weather...</p>}
                {error && <p>{error}</p>}

                {weather && (
                    <div>
                        <h2>{weather.name}</h2>
                        <p>{weather.main.temp}°C</p>
                        <p>Humidity: {weather.main.humidity}%</p>
                    </div>
                )}

            </div>
        </div>
    );
}

export default App;