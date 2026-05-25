import "./App.css";
import { useState } from "react";

function App() {
    const [city, setCity] = useState("");

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

                <button>Search</button>

            </div>
        </div>
    );
}

export default App;