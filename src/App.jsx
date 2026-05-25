import "./App.css";
import { useState, useEffect } from "react";

function App() {
    const [city, setCity] = useState("");
    const API_KEY = import.meta.env.VITE_API_KEY;

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [quote, setQuote] = useState(null);
    const [quoteCategory, setQuoteCategory] = useState("life");
    const [fade, setFade] = useState(true);

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("moodcast_favorites");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("moodcast_favorites", JSON.stringify(favorites));
    }, [favorites]);

    const getBackgroundClass = () => {
        if (!weather) return "default-bg";
        const condition = weather.weather[0].main.toLowerCase();

        if (condition.includes("clear")) return "clear-bg";
        if (condition.includes("cloud")) return "cloudy-bg";
        if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) return "rain-bg";
        if (condition.includes("snow")) return "snow-bg";

        return "default-bg"; // fallback for mist, haze, etc.
    };

    const getQuoteTagByWeather = (weatherCondition) => {
        const condition = weatherCondition.toLowerCase();
        if (condition.includes("clear")) return "inspirational"; // Bright day, upbeat quotes
        if (condition.includes("cloud")) return "life";          // Gray day, reflective quotes
        if (condition.includes("rain")) return "wisdom";         // Rainy day, deep/thoughtful quotes
        if (condition.includes("snow")) return "motivational";   // Cold day, high-energy quotes
        return "famous";
    };

    const fetchRandomQuote = async (tag = "life") => {
        setFade(false);
        setQuoteCategory(tag);

        try {
            const response = await fetch(`https://dummyjson.com/quotes/random`);
            if (!response.ok) throw new Error();
            const data = await response.json();

            setTimeout(() => {
                setQuote({
                    id: data.id,
                    text: data.quote,
                    author: data.author,
                    tag: tag
                });
                setFade(true);
            }, 300);
        } catch (err) {
            console.error("Failed to fetch quote");
        }
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

            const assignedTag = getQuoteTagByWeather(data.weather[0].main);
            fetchRandomQuote(assignedTag);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = () => {
        if (!quote) return;
        const isAlreadyFav = favorites.some(fav => fav.id === quote.id);

        if (isAlreadyFav) {
            setFavorites(favorites.filter(fav => fav.id !== quote.id));
        } else {
            setFavorites([...favorites, quote]);
        }
    };

    return (
        <div className={`app ${getBackgroundClass()}`}>

            <div className="weather-card">
                <h1>MoodCast</h1>

                <div className="search-box">
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
                </div>

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

                {/* --- Quote Section --- */}
                <hr className="divider" />

                <div className="quote-section">
                    <div className="quote-header">
                        <span className="quote-tag"># {quoteCategory}</span>
                        <button
                            className={`fav-btn ${quote && favorites.some(fav => fav.id === quote.id) ? "active" : ""}`}
                            onClick={toggleFavorite}
                            disabled={!quote}
                        >
                            ★
                        </button>
                    </div>

                    <div className={`quote-container ${fade ? "fade-in" : "fade-out"}`}>
                        {quote ? (
                            <>
                                <p className="quote-text">"{quote.text}"</p>
                                <p className="quote-author">- {quote.author}</p>
                            </>
                        ) : (
                            <p className="quote-text placeholder">Search a city to see its mood quote, or generate a random one below!</p>
                        )}
                    </div>

                    <button className="quote-refresh-btn" onClick={() => fetchRandomQuote(quoteCategory)}>
                        🔄 New Quote
                    </button>
                </div>

                {/* --- Favorites List Preview --- */}
                {favorites.length > 0 && (
                    <div className="favorites-section">
                        <h3>Saved Moods ({favorites.length})</h3>
                        <div className="fav-list">
                            {favorites.map((fav) => (
                                <div key={fav.id} className="fav-item">
                                    <p>"{fav.text}" <span>({fav.tag})</span></p>
                                    <button onClick={() => setFavorites(favorites.filter(f => f.id !== fav.id))}>×</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default App;