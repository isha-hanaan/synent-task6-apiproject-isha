import "./App.css";
import { useState, useEffect } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

const MOOD_VIBES = {
    rain: {
        gear: "Layer up with a raincoat, waterproof boots, and a trusty umbrella.",
        lifestyle: "Perfect weather for soft music, warm drinks, and a cozy indoor reset."
    },

    snow: {
        gear: "Bundle into thermal layers, gloves, scarves, and a winter-ready coat.",
        lifestyle: "Slow down, enjoy the snowfall, and embrace a peaceful winter evening."
    },

    hot: {
        gear: "Stay cool with airy fabrics, sunglasses, and lightweight essentials.",
        lifestyle: "Hydrate, chase sunsets, and enjoy the warmth with chilled summer vibes."
    },

    cold: {
        gear: "A thick sweater, warm coat, and boots will keep the chill away.",
        lifestyle: "Ideal weather for café conversations, long walks, and comfort food."
    },

    mild: {
        gear: "Light layers and comfortable sneakers are all you need today.",
        lifestyle: "A balanced atmosphere for exploring, relaxing, or simply slowing down."
    }
};

const MOOD_QUOTES = {
    sunnyday: {
        text: "Keep your face always toward the sunshine, and shadows will fall behind you.",
        author: "Walt Whitman"
    },

    rainytag: {
        text: "The sound of rain needs no translation.",
        author: "Alan Watts"
    },

    cloudmood: {
        text: "Even the darkest clouds eventually let the light through.",
        author: "Unknown"
    },

    frostyvibes: {
        text: "Snow quietly reminds us how beautiful it is to slow down.",
        author: "Unknown"
    },

    wisdom: {
        text: "Nature does not rush, yet everything unfolds perfectly.",
        author: "Lao Tzu"
    }
};

const WEATHER_THEME_ENGINE = {
    hotClear: {
        bgCore: "#a8583b",
        bgDeep: "#1c1012",
        ray: "rgba(252, 163, 17, 0.25)",
        musicUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX1BzZ87S69t2"
    }, // Golden Hour Acoustic

    hotClouds: {
        bgCore: "#b37b56",
        bgDeep: "#1a1412",
        ray: "rgba(253, 210, 150, 0.18)",
        musicUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX2Nc3XU0IdCh"
    }, // Warm Evening Drift

    coolClear: {
        bgCore: "#31548a",
        bgDeep: "#0d1629",
        ray: "rgba(59, 130, 246, 0.22)",
        musicUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO"
    }, // Calm Skies Piano

    cloudy: {
        bgCore: "#344259",
        bgDeep: "#101621",
        ray: "rgba(148, 163, 184, 0.15)",
        musicUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX3qCx7YPH7bZ"
    }, // Midnight Lofi Atmosphere

    rain: {
        bgCore: "#192b44",
        bgDeep: "#080c16",
        ray: "rgba(56, 189, 248, 0.1)",
        musicUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1CX76Z77v167Gc"
    }, // Rainy Window Sessions

    snow: {
        bgCore: "#3c4d66",
        bgDeep: "#121926",
        ray: "rgba(255, 255, 255, 0.2)",
        musicUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DX4H660oO9g7A"
    }, // Winter Night Chill

    default: {
        bgCore: "#25406b",
        bgDeep: "#0c1424",
        ray: "rgba(59, 130, 246, 0.2)",
        musicUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn"
    } // Everyday Lofi Escape
};

function App() {
    const API_KEY = import.meta.env.VITE_API_KEY;

    const [city, setCity] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("moodcast_last_city") || "";
        }
        return "";
    });

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [quote, setQuote] = useState({
        text: "Discover weather, ambience, and music synced to your atmosphere.",
        author: "MoodCast",
        tag: "wisdom"
    });

    const [quoteCategory, setQuoteCategory] = useState("wisdom");
    const [fade, setFade] = useState(true);

    useEffect(() => {
        if (!API_KEY) {
            setError("Missing OpenWeather API key config setup (.env)");
        } else {
            // Auto-trigger load if a cached city exists on initialization
            const cachedCity = localStorage.getItem("moodcast_last_city");
            if (cachedCity) {
                fetchWeatherByName(cachedCity);
            }
        }
    }, [API_KEY]);

    const getVibeCategory = (weatherData) => {
        if (!weatherData?.weather?.[0] || !weatherData?.main) return "mild";
        const condition = weatherData.weather[0].main.toLowerCase();
        const temp = weatherData.main.temp;

        if (condition.includes("rain") || condition.includes("drizzle") || condition.includes("thunderstorm")) return "rain";
        if (condition.includes("snow")) return "snow";
        if (temp >= 28) return "hot";
        if (temp < 12) return "cold";
        return "mild";
    };

    const getQuoteTagByWeather = (weatherCondition = "") => {
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

            setQuote({ text: data.quote, author: data.author, tag });
            requestAnimationFrame(() => setFade(true));
        } catch (err) {
            setTimeout(() => {
                const selectedQuote = MOOD_QUOTES[tag] || MOOD_QUOTES.wisdom;
                setQuote({ text: selectedQuote.text, author: selectedQuote.author, tag });
                setFade(true);
            }, 300);
        }
    };

    const applyWeatherData = (data) => {
        setWeather(data);
        setCity(data.name);

        localStorage.setItem("moodcast_last_city", data.name);
        const assignedTag = getQuoteTagByWeather(data.weather?.[0]?.main || "");
        fetchRandomQuote(assignedTag);
    };

    const fetchWeatherByName = async (targetCity = city) => {
        if (!targetCity.trim() || !API_KEY) return;
        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(targetCity.trim())}&appid=${API_KEY}&units=metric`
            );
            if (!response.ok) throw new Error("City not found. Try checking the spelling!");
            const data = await response.json();
            applyWeatherData(data);
        } catch (err) {
            setError(err.message || "Something went wrong");
            setWeather(null);
        } finally {
            setLoading(false);
        }
    };

    const handleGeolocationSearch = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser software.");
            return;
        }

        setLoading(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                    );
                    if (!response.ok) throw new Error("Could not evaluate weather for your location coordinates.");
                    const data = await response.json();
                    applyWeatherData(data);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            },
            (err) => {
                setLoading(false);
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Location permission denied. Please allow location access.");
                        break;
                    default:
                        setError("Unable to retrieve position coordinates.");
                }
            },
            { timeout: 8000 }
        );
    };

    const handleBrandReset = () => {
        setWeather(null);
        setCity("");
        localStorage.removeItem("moodcast_last_city");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
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

    const currentCategory = getVibeCategory(weather);

    const currentVibe = weather
        ? (MOOD_VIBES[currentCategory] || MOOD_VIBES.mild)
        : {
            gear: "Comfortable layers and your favorite everyday essentials.",
            lifestyle: "Search any city to discover its atmosphere, mood, and soundtrack."
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


            <header className="glass-header">
                <div className="header-inner">

                    <div className="header-left">
                        <h1
                            className="brand-logo"
                            onClick={handleBrandReset}
                            onKeyDown={(e) => e.key === "Enter" && handleBrandReset()}
                            role="button"
                            tabIndex={0}
                        >
                            ✦ MoodCast
                        </h1>
                    </div>

                    <div className="header-right">
                        <div className="search-box wide-search">

                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Search city..."
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && fetchWeatherByName()}
                                />

                                <span className="search-icon">
                                    <Search size={18} />
                                </span>

                                <button
                                    className="geo-location-btn"
                                    onClick={handleGeolocationSearch}
                                    title="Use Current Location"
                                    type="button"
                                >
                                    <MapPin size={18} />
                                </button>
                            </div>

                            <button
                                className="search-btn"
                                onClick={() => fetchWeatherByName()}
                            >
                                Search
                            </button>

                        </div>
                    </div>

                </div>
            </header>




            <div className="container">
                {loading && (
                    <div className="status-msg loading-spinner-box">
                        <Loader2 className="spinner-animate" size={24} />
                        Pulling real-time weather data...
                    </div>
                )}
                {error && <p className="status-msg error">{error}</p>}

                {!loading && (
                    <div className="vertical-layout-stack">
                        <div className="glass-card wide-layout-card">
                            {weather ? (
                                <div className="weather-meta-row">
                                    <div className="metrics-container-hero">
                                        <h2 className="location-title-huge">{weather.name}</h2>
                                        <p className="temp-display-huge">{Math.round(weather.main.temp)}°C</p>
                                        <p className="humidity-display-highlight">Humidity: {weather.main.humidity}%</p>
                                        <p className="condition-text-highlight">{weather.weather[0].description}</p>
                                    </div>
                                    <div className="icon-container-hero">
                                        <img
                                            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                                            alt={weather.weather[0].description}
                                            className="weather-icon-huge"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="weather-meta-row alternative-hero-pad">
                                    <div className="metrics-container-hero">
                                        <h2 className="location-title-huge" style={{ fontSize: "2.2rem" }}>Ready for a Vibe Check?</h2>
                                        <p className="condition-text-highlight" style={{ marginTop: "10px" }}>
                                            Search for any city or use your current location to view real-time weather conditions and atmosphere insights.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="vibe-check-section small-vibe-box">
                                <h4 className="section-subtitle-mini">Weather Essentials & Lifestyle</h4>
                                <div className="vibe-body-box">
                                    <p className="vibe-text"><strong>Wear:</strong> {currentVibe.gear}</p>
                                    <p className="vibe-text"><strong>Activity:</strong> {currentVibe.lifestyle}</p>
                                </div>
                            </div>
                        </div>

                        <div className="split-grid-row">
                            <div className="glass-card quote-card-standalone">
                                <div className="quote-header-box">
                                    <span className="mood-badge">#{quoteCategory}</span>
                                    <div className={`quote-output-box ${fade ? "visible" : "hidden"}`}>
                                        <p className="main-quote-text">"{quote.text}"</p>
                                        <p className="quote-author-text">— {quote.author}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="glass-card music-card-standalone">
                                <h4 className="section-subtitle">Weather-Based Music Experience</h4>

                                <iframe
                                    src={currentTheme.musicUrl}
                                    frameBorder="0"
                                    scrolling="no"
                                    allowFullScreen
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                    loading="lazy"
                                    className="spotify-iframe"
                                    title="Weather Soundtrack Engine"
                                ></iframe>

                            </div>
                        </div>
                    </div>
                )}
            </div>

            <footer className="glass-footer">
                <p>© 2026 MoodCast. Interactive weather forecasting enhanced through atmosphere, sound, and design.</p>
            </footer>
        </div>
    );
}

export default App;