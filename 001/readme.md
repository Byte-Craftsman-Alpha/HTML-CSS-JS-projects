```javascript
function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,  // optional, for better precision
        timeout: 10000,            // optional, max wait time in ms
        maximumAge: 0              // optional, no cache
      }
    );
  });
}

// Usage example:
getCurrentPosition()
  .then(({ latitude, longitude }) => {
    console.log("Latitude:", latitude);
    console.log("Longitude:", longitude);
  })
  .catch((error) => {
    console.error("Error getting location:", error.message);
  });

```

```javascript
const weatherCodeToDescription = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
};


async function getWeather(lat, lon) {
    const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: ['temperature_2m', 'wind_speed_10m'].join(','),
        daily: ['temperature_2m_max', 'temperature_2m_min', 'weathercode'].join(','),
        forecast_days: '5',   // today + next 4 days
        timezone: 'auto'
    });

    const url = `https://api.open-meteo.com/v1/forecast?${params}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const current = data.current;
    const daily = data.daily;

    return {
        currentTemperature: current.temperature_2m,
        currentWindSpeed: current.wind_speed_10m,
        forecast: daily.time.slice(1, 5).map((date, idx) => {
            const code = daily.weathercode[idx + 1];
            return {
                date,
                maxTemp: daily.temperature_2m_max[idx + 1],
                minTemp: daily.temperature_2m_min[idx + 1],
                weatherCode: code,
                status: weatherCodeToDescription[code] || "Unknown"
            };
        })

    };
}

// Example usage:
getWeather(52.52, 13.41).then(console.log).catch(console.error);
```
```javascript
{
  currentTemperature: 25.2,
  currentWindSpeed: 7.1,
  forecast: [
    {
      date: '2025-07-02',
      maxTemp: 37.4,
      minTemp: 20.1,
      weatherCode: 1,
      status: 'Mainly clear'
    },
    {
      date: '2025-07-03',
      maxTemp: 29.5,
      minTemp: 18.7,
      weatherCode: 80,
      status: 'Slight rain showers'
    },
    {
      date: '2025-07-04',
      maxTemp: 25.2,
      minTemp: 15,
      weatherCode: 3,
      status: 'Overcast'
    },
    {
      date: '2025-07-05',
      maxTemp: 31,
      minTemp: 15.2,
      weatherCode: 3,
      status: 'Overcast'
    }
  ]
}
PS C:\Users\Aditya Chaudhari\Desktop\Duo Project\011>
      weatherCode: 3,
      status: 'Overcast'
    }
  ]
}
      weatherCode: 3,
      status: 'Overcast'
    }
      weatherCode: 3,
      weatherCode: 3,
      status: 'Overcast'
    }
  ]
}
```