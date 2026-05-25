# MoodCast

MoodCast is a modern API integration web application developed using React, Vite, JavaScript, and public APIs. Built as part of Task 6: API Integration Project, the application demonstrates real-time data fetching, dynamic UI rendering, loading states, and comprehensive error handling using the Fetch API.

The project integrates live weather forecasting data and dynamically transforms atmospheric conditions into an immersive digital experience through adaptive visuals, curated music playlists, mood-based recommendations, and inspirational quotes.

Rather than functioning as a traditional weather dashboard, MoodCast focuses on creating an emotionally responsive forecasting interface enhanced through atmospheric, sound, interaction, and design.

The objective of this project is to fetch and display real-time data from public APIs while building a fully functional, responsive, and interactive user interface using JavaScript Fetch API integration techniques.
---

# Core Requirements Implemented

* Real-time Weather API integration
* Public Quotes API integration
* Dynamic data rendering
* Functional UI powered by live API data
* Loading state implementation
* Error handling and fallback management
* Responsive frontend interface
* Asynchronous data fetching using Fetch API

# Features

## Real-Time Weather Forecasting

* Fetches live weather information using the OpenWeather API
* Displays:

  * Temperature
  * Humidity
  * Weather conditions
  * Weather icons
  * City information

---

## Weather-Based Music Experience

* Dynamically updates Spotify playlists based on current weather conditions
* Creates immersive mood synchronization for:

  * Rain
  * Snow
  * Cloudy weather
  * Warm sunny days
  * Calm evenings

---

## Dynamic Mood Quotes

* Fetches random quotes from a public Quotes API
* Includes weather-aware fallback quote handling
* Atmospheric quote categories:

  * Sunny
  * Rainy
  * Cloudy
  * Snowy
  * Mindfulness

---

## Dynamic Atmospheric Themes

Automatically adapts:

* Background gradients
* Ambient lighting
* Color palettes
* Overall UI mood

based on live weather conditions.

---

## Geolocation Support

* Detects the user’s current location
* Fetches weather instantly using browser geolocation

---

## Persistent Search Memory

* Stores the last searched city using localStorage
* Automatically restores previous searches on reload

---

## Loading & Error Handling

* Smooth loading states
* Animated loading spinner
* User-friendly error messages
* API failure handling
* Geolocation permission handling

---

## Responsive Modern UI

* Glassmorphism-inspired interface
* Fully responsive layout
* Mobile-friendly design
* Smooth transitions and animations

---

# Technologies Used

## Frontend

* React
* Vite
* JavaScript (Fetch API)
* CSS3

---

## APIs

* OpenWeather API
* DummyJSON Quotes API

---

## Libraries

* Lucide React Icons

---

# 📂 Project Structure

```bash
synent-task6-apiproject-isha/
│
├── node_modules/
│
├── public/
│   └── favicon.svg
│
├── src/
│   ├── App.css
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vite.config.js
│
```

---

# Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/isha-hanaan/synent-task6-apiproject-isha.git
```

---

## 2️⃣ Navigate Into the Project

```bash
cd synent-task6-apiproject-isha
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Configure Environment Variables

Create a `.env` file in the project root directory and add your OpenWeather API key:

```env
VITE_API_KEY=your_openweather_api_key
```

Generate your API key from:

https://openweathermap.org/api

Also make sure your .gitignore includes:

```gitignore
.env
```

so your real API key never gets pushed to GitHub.

---

## 5️⃣ Start Development Server

```bash
npm run dev
```

---

## Build for Production

Generate an optimized production-ready build:

```bash
npm run build
```
The compiled output will be available inside the dist/ directory.

---

# APIs Integrated

## OpenWeather API

Used to retrieve:

* Live temperature data
* Humidity levels
* Weather conditions
* Weather icons

Website:

https://openweathermap.org/

---

## DummyJSON Quotes API

Used to dynamically display:

* Random inspirational quotes

Website:

https://dummyjson.com/

---

# Key Functionalities

## Weather Search

Users can search any city globally to retrieve live atmospheric conditions.

---

## Geolocation Weather

Users can instantly fetch weather data based on their current coordinates.

---

## Mood Engine

Weather conditions dynamically influence:

* Themes
* Music playlists
* Lifestyle suggestions
* Quotes

---

## Atmospheric Experience

The application combines utility and ambience to create a calm and immersive weather exploration experience.

---

# Possible Future Improvements

* 5-day weather forecast
* Weather maps integration
* Celsius/Fahrenheit toggle
* Search history dropdown
* AI-generated weather summaries
* Progressive Web App (PWA)
* Dark/light adaptive modes
* Multi-language support

---

# Author

Created by Isha.

Developed as part of a frontend API integration project using React and Vite.

---

# License

This project is intended for educational and portfolio purposes.
