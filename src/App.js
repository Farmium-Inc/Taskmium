import React, { useState, useEffect } from 'react';
import './App.css';
import LogoImage from './assets/Logo.png';
import chevron from './assets/leftarrow.png';

function App() {
  // Initial tasks
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Water the dog', emoji: '💦' },
    { id: 2, text: 'Buy groceries', emoji: '🛒' },
    { id: 3, text: 'Finish project', emoji: '💻' },
  ]);
  const [newTask, setNewTask] = useState('');

  // List of possible emojis for new tasks
  const emojiList = ['📝', '💡', '🚀', '✅', '🔔', '🎉', '🔥', '🌟', '💦', '🛒', '💻'];
  const getRandomEmoji = () => emojiList[Math.floor(Math.random() * emojiList.length)];
  const [selectedEmoji, setSelectedEmoji] = useState(getRandomEmoji());

  // Add a new task with the selected emoji
  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask.trim(),
          emoji: selectedEmoji,
        },
      ]);
      setNewTask('');
      setSelectedEmoji(getRandomEmoji());
    }
  };

  // Remove a task by its id
  const handleRemoveTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Weather API states and helper function
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWeatherCondition = (code) => {
    const conditions = {
      0: { description: 'Clear sky', icon: '☀️' },
      1: { description: 'Mainly clear', icon: '🌤️' },
      2: { description: 'Partly cloudy', icon: '⛅☁️' },
      3: { description: 'Overcast', icon: '☁️⛅' },
      45: { description: 'Fog', icon: '🌫️' },
      48: { description: 'Depositing rime fog', icon: '🌫️' },
      51: { description: 'Light drizzle', icon: '🌦️' },
      53: { description: 'Moderate drizzle', icon: '🌦️' },
      55: { description: 'Dense drizzle', icon: '🌧️' },
      56: { description: 'Light freezing drizzle', icon: '🌧️' },
      57: { description: 'Dense freezing drizzle', icon: '🌧️' },
      61: { description: 'Slight rain', icon: '🌧️' },
      63: { description: 'Moderate rain', icon: '🌧️' },
      65: { description: 'Heavy rain', icon: '🌧️' },
      66: { description: 'Light freezing rain', icon: '🌧️' },
      67: { description: 'Heavy freezing rain', icon: '🌧️' },
      71: { description: 'Slight snow fall', icon: '🌨️' },
      73: { description: 'Moderate snow fall', icon: '🌨️' },
      75: { description: 'Heavy snow fall', icon: '🌨️' },
      77: { description: 'Snow grains', icon: '🌨️' },
      80: { description: 'Slight rain showers', icon: '🌦️' },
      81: { description: 'Moderate rain showers', icon: '🌧️' },
      82: { description: 'Violent rain showers', icon: '🌧️' },
      85: { description: 'Slight snow showers', icon: '🌨️' },
      86: { description: 'Heavy snow showers', icon: '🌨️' },
      95: { description: 'Thunderstorm', icon: '⛈️' },
      96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
      99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
    };
    return conditions[code] || { description: 'Unknown', icon: '❓' };
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
        const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

        try {
          const [weatherResponse, geocodeResponse] = await Promise.all([
            fetch(weatherUrl),
            fetch(geocodeUrl),
          ]);

          if (!weatherResponse.ok || !geocodeResponse.ok) {
            throw new Error('Failed to fetch weather data.');
          }

          const weatherData = await weatherResponse.json();
          const geocodeData = await geocodeResponse.json();

          const city =
            (geocodeData.address && geocodeData.address.city) ||
            (geocodeData.address && geocodeData.address.town) ||
            (geocodeData.address && geocodeData.address.village) ||
            'Unknown';
          const temperature = weatherData.current_weather.temperature;
          const weatherCode = weatherData.current_weather.weathercode;
          const condition = getWeatherCondition(weatherCode);

          setWeather({ city, temperature, condition });
        } catch (err) {
          setError('Failed to fetch weather data.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="container">
      {/* ---------- Left Column ---------- */}
      <div className="left-column">
        <div className="Top-header">
          <div className="box" style={{ backgroundColor: '#6E6E6E' }}>📥</div>
          <div className="box"><span></span>☀️</div>
        </div>

        <div className="inbox-today">
          <div className="main-buttons">📥 Inbox</div>
          <div className="main-buttons">🎈 Today</div>
        </div>
      </div>

      {/* ---------- Middle Column ---------- */}
      <div className="middle-column">
        <h1 style={{ fontSize: 40, fontWeight: 600, textAlign: 'left', width: '100%' }}>Inbox</h1>

        {/* Tasks List */}
        <div className="task-container">
          {tasks.map((task) => (
            <div className="task" key={task.id}>
              <span className="emoji-task">{task.emoji}</span>
              <span className="task-text">{task.text}</span>
              <button className="delete-task-button" onClick={() => handleRemoveTask(task.id)}>
                X
              </button>
            </div>
          ))}
        </div>

        {/* Add Task Input (Emoji Preview + Input + Plus Button) */}
        <div className="add-task-container">
          <div className="add-task-input-wrapper">
            {/* Click the emoji to get a new random emoji */}
            <span className="task-emoji" onClick={() => setSelectedEmoji(getRandomEmoji())}>
              {selectedEmoji}
            </span>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              placeholder="Add a new task..."
              className="task-input-field"
            />
            <button className="add-task-button" onClick={handleAddTask}>
              +
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Right Column ---------- */}
      <div className="right-column">
        <div className="weather-widget">
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {weather && (
            <div className="weather-content">
              <div className="weather-left">
                <h2>{weather.city}</h2>
                <div className="weather-info">
                  <span>{weather.temperature}°Cmeow</span>
                  <span>{weather.condition.description}</span>
                </div>
              </div>
              <div className="weather-right">
                <span className="weather-icon emoji">{weather.condition.icon}</span>
              </div>
            </div>
          )}
        </div>

        <div className="day-events">
          <h1>Your day</h1>
          <div className="events-box"><span style={{border: "1px solid red", height: 5,}}></span>Meow</div>
          <div className="events-box">Meow</div>

        </div>

        <div className="timer">
          <div className="time-box">
            <span className="time">11.11</span>
          </div>
          <div className="chevron-timer"></div>
        </div>
      </div>
    </div>
  );
}

export default App;
