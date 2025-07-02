function nodeSelector(cssSelector) {
    return document.querySelector(cssSelector);
}

class weatherApp {
    constructor(latitude = null, longitude = null) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    setCoordinate(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    async getCoordinate() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation is not supported by your browser"));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.latitude = latitude;
                    this.longitude = longitude;
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

    async getWeatherInfo() {
        const weatherCodeToDescription = {
            0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast", 45: "Fog", 48: "Depositing rime fog", 51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle", 56: "Light freezing drizzle", 57: "Dense freezing drizzle", 61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain", 66: "Light freezing rain", 67: "Heavy freezing rain", 71: "Slight snow fall", 73: "Moderate snow fall", 75: "Heavy snow fall", 77: "Snow grains", 80: "Slight rain showers", 81: "Moderate rain showers", 82: "Violent rain showers", 85: "Slight snow showers", 86: "Heavy snow showers", 95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail"
        };

        const weatherCodeToStatus = {
            0: "#icon-sun-2-linear", 1: "#icon-sun-2-linear", 2: "#icon-cloud-sun-2-linear", 3: "#icon-cloud-sun-2-linear", 45: "#icon-cloud-sun-2-linear", 48: "#icon-cloud-sun-2-linear", 51: "#icon-cloud-waterdrops-linear", 53: "#icon-cloud-waterdrops-linear", 55: "#icon-cloud-waterdrops-linear", 56: "#icon-cloud-waterdrops-linear", 57: "#icon-cloud-waterdrops-linear", 61: "#icon-cloud-waterdrops-linear", 63: "#icon-cloud-waterdrops-linear", 65: "#icon-cloud-waterdrops-linear", 66: "#icon-cloud-waterdrops-linear", 67: "#icon-cloud-waterdrops-linear", 71: "#icon-cloud-snowfall-minimalistic-linear", 73: "#icon-cloud-snowfall-minimalistic-linear", 75: "#icon-cloud-snowfall-minimalistic-linear", 77: "#icon-cloud-snowfall-minimalistic-linear", 80: "#icon-cloud-rain-linear", 81: "#icon-cloud-rain-linear", 82: "#icon-cloud-rain-linear", 85: "#icon-cloud-rain-linear", 86: "#icon-cloud-rain-linear", 95: "#icon-cloud-storm-linear", 96: "#icon-cloud-storm-linear", 99: "#icon-cloud-storm-linear"
        };

        if (this.latitude != null || this.longitude != null) {
            const params = new URLSearchParams({
                latitude: this.latitude,
                longitude: this.longitude,
                current: ['temperature_2m', 'wind_speed_10m', 'weathercode'].join(','),
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
                currentStatus: weatherCodeToDescription[current.weathercode],
                forecast: daily.time.slice(1, 5).map((date, idx) => {
                    const code = daily.weathercode[idx + 1];
                    return {
                        date,
                        maxTemp: daily.temperature_2m_max[idx + 1],
                        minTemp: daily.temperature_2m_min[idx + 1],
                        weatherCode: code,
                        weatherStatus: weatherCodeToStatus[code] || "Unknown",
                        status: weatherCodeToDescription[code] || "Unknown"
                    };
                })

            };
        } else {
            throw new Error(`Latitude and longitude aren't defined.\n Define it using setCoordinate(latitude, longitude)`);
        }
    }

    async getCityAndCountry() {
        if (this.latitude != null || this.longitude != null) {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${this.latitude}&lon=${this.longitude}&format=json`;
            try {
                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'SimpleReverseGeocoder/1.0 (your_email@example.com)' // required per their usage policy
                    }
                });
                const data = await response.json();

                const address = data.address;
                const city = address.city || address.town || address.village || address.hamlet;
                const country = address.country;
                this.city = city;
                this.country = country;
                return { city, country };
            } catch (error) {
                console.error('Geocoding error:', error);
                return null;
            }
        } else {
            throw new Error(`Latitude and longitude aren't defined.\n Define it using setCoordinate(latitude, longitude)`);
        }
    }

    async display() {
        const calender = {
            month: ['Jan', 'Fab', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        }

        const locationDisplay = nodeSelector("span[city-country]");
        const tempDesplay = nodeSelector("span[current-temperature]");
        const statusDisplay = nodeSelector("span[current-status]");
        const windSpeedDisplay = nodeSelector("span[current-wind-speed]");
        const currentWeatherStatus = nodeSelector("use[current-weather-status]");
        const forecastDisplay = [
            [nodeSelector("div[date-0]"), nodeSelector("span[date-0-max]"), nodeSelector("span[date-0-min]"), nodeSelector("use[day-0-weather-status]")],
            [nodeSelector("div[date-1]"), nodeSelector("span[date-1-max]"), nodeSelector("span[date-1-min]"), nodeSelector("use[day-1-weather-status]")],
            [nodeSelector("div[date-2]"), nodeSelector("span[date-2-max]"), nodeSelector("span[date-2-min]"), nodeSelector("use[day-2-weather-status]")],
            [nodeSelector("div[date-3]"), nodeSelector("span[date-3-max]"), nodeSelector("span[date-3-min]"), nodeSelector("use[day-3-weather-status]")]
        ];

        document.body.setAttribute("loading", "");
        await this.getCoordinate();
        await this.getWeatherInfo();
        await this.getCityAndCountry();
        const weatherReport = await this.getWeatherInfo();

        console.table({
            geoLatitude: this.latitude,
            geoLongitude: this.longitude,
            city: this.city,
            country: this.country,

        })

        // updaate values
        locationDisplay.innerText = `${this.city}, ${this.country}`;
        tempDesplay.innerText = parseInt(weatherReport.currentTemperature);
        statusDisplay.innerText = weatherReport.currentStatus;
        windSpeedDisplay.innerText = `${parseInt(weatherReport.currentWindSpeed)}m/s`;

        for (let i = 0; i < 4; i++) {
            const date = new Date(weatherReport.forecast[i].date);
            forecastDisplay[i][0].innerText = `${calender.day[date.getDay()]}, ${calender.month[date.getMonth()]} ${String(date.getDate()).padStart(2, "0")}`;
            forecastDisplay[i][1].innerText = parseInt(weatherReport.forecast[i].maxTemp);
            forecastDisplay[i][2].innerText = parseInt(weatherReport.forecast[i].minTemp);
            forecastDisplay[i][3].setAttribute("href", weatherReport.forecast[i].weatherStatus);
        }
        document.body.removeAttribute("loading");
    }
}

async function App() {
    try {
        a = new weatherApp();
        a.display();
    } catch {
        alert("error occured");
    }
}

App();

// var a = new weatherApp();
// await a.getCoordinate();

// console.table({
//     latitude: a.latitude,
//     longitude: a.longitude
// });

// a.getCityAndCountry();

// var b = await a.getWeatherInfo();
// console.log(b);

// // Example usage:
// getCityAndCountry(40.73061, -73.935242).then(result => {
//     console.log(result); // { city: 'New York', country: 'United States' }
// });
