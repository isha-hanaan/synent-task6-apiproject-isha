import "./App.css";
import { useState, useEffect } from "react";

const WEATHER_THEME_ENGINE = {
    hotClear: {
        bgCore: "#a8583b",
        bgDeep: "#1c1012",
        ray: "rgba(252, 163, 17, 0.25)"
    },
    hotClouds: {
        bgCore: "#b37b56",
        bgDeep: "#1a1412",
        ray: "rgba(253, 210, 150, 0.18)"
    },
    coolClear: {
        bgCore: "#31548a",
        bgDeep: "#0d1629",
        ray: "rgba(59, 130, 246, 0.22)"
    },
    cloudy: {
        bgCore: "#344259",
        bgDeep: "#101621",
        ray: "rgba(148, 163, 184, 0.15)"
    },
    rain: {
        bgCore: "#192b44",
        bgDeep: "#080c16",
        ray: "rgba(56, 189, 248, 0.1)"
    },
    snow: {
        bgCore: "#3c4d66",
        bgDeep: "#121926",
        ray: "rgba(255, 255, 255, 0.2)"
    },
    default: {
        bgCore: "#25406b",
        bgDeep: "#0c1424",
        ray: "rgba(59, 130, 246, 0.2)"
    }
};

function App() {
    const [city, setCity] = useState("");
    const API_KEY = import.meta.env.VITE_API_KEY;

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [quote, setQuote] = useState(null);
    const [quoteCategory, setQuoteCategory] = useState("rainytag");
    const [fade, setFade] = useState(true);

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("moodcast_favorites");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("moodcast_favorites", JSON.stringify(favorites));
    }, [favorites]);

    const getQuoteTagByWeather = (weatherCondition) => {
        const condition = weatherCondition.toLowerCase();
        if (condition.includes("clear")) return "sunnyday";
        if (condition.includes("cloud")) return "cloudmood";
        if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) return "rainytag";
        if (condition.includes("snow")) return "frostyvibes";
        return "wisdom";
    };

    const fetchRandomQuote = async (tag = "rainytag") => {
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

    const getLiveThemeStyle = () => {
        if (!weather) return WEATHER_THEME_ENGINE.default;

        const condition = weather.weather[0].main.toLowerCase();
        const temp = weather.main.temp;

        if (temp >= 28) {
            if (condition.includes("clear")) return WEATHER_THEME_ENGINE.hotClear;
            return WEATHER_THEME_ENGINE.hotClouds;
        }

        if (condition.includes("clear")) return WEATHER_THEME_ENGINE.coolClear;
        if (condition.includes("cloud")) return WEATHER_THEME_ENGINE.cloudy;
        if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) return WEATHER_THEME_ENGINE.rain;
        if (condition.includes("snow")) return WEATHER_THEME_ENGINE.snow;

        return WEATHER_THEME_ENGINE.default;
    };

    const currentTheme = getLiveThemeStyle();

    return (
        <div
            className="app"
            style={{
                "--bg-core": currentTheme.bgCore,
                "--bg-deep": currentTheme.bgDeep,
                "--ray-color": currentTheme.ray
            }}
        >
            <div className="ambient-glow"></div>

            <div className="container">
                <h1 className="brand-logo">MoodCast</h1>

                <div className="search-box">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            placeholder="Search city..."
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                    <button className="search-btn" onClick={fetchWeather}>Search</button>
                </div>

                {loading && <p className="status-msg">Fetching mood data...</p>}
                {error && <p className="status-msg error">{error}</p>}

                {weather && (
                    <div className="glass-card">
                        <div className="weather-meta-row">
                            <div className="icon-container">
                                <img
                                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                                    alt={weather.weather[0].description}
                                    className="weather-icon"
                                />
                            </div>
                            <div className="metrics-container">
                                <h2 className="location-title">{weather.name}</h2>
                                <p className="temp-display">{Math.round(weather.main.temp)}°C</p>
                                <p className="humidity-display">Humidity: {weather.main.humidity}%</p>
                            </div>
                        </div>

                        <div className="quote-controls-row">
                            <span className="mood-badge">#{quoteCategory}</span>
                            <button
                                className={`favorite-trigger ${quote && favorites.some(fav => fav.id === quote.id) ? "active" : ""}`}
                                onClick={toggleFavorite}
                                disabled={!quote}
                            >
                                ★
                            </button>
                        </div>

                        <div className={`quote-output-box ${fade ? "visible" : "hidden"}`}>
                            {quote ? (
                                <p className="main-quote-text">"{quote.text}"</p>
                            ) : (
                                <p className="main-quote-text static-placeholder">
                                    When it rains, look for rainbows. When it's dark, look for stars.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {favorites.length > 0 && (
                    <div className="favorites-shelf">
                        <h3 className="shelf-heading">Favorites</h3>
                        <div className="shelf-flex">
                            {favorites.map((fav) => (
                                <div key={fav.id} className="mini-glass-item">
                                    <span className="mini-tag">#{fav.tag}</span>
                                    <p className="mini-quote">"{fav.text}"</p>
                                    <button
                                        className="clear-item-btn"
                                        onClick={() => setFavorites(favorites.filter(f => f.id !== fav.id))}
                                    >
                                        ×
                                    </button>
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