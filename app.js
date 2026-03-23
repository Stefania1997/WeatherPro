async function getWeather() {
  const cityInput = document.getElementById("cityInput");
  const results = document.getElementById("results");
  const city = cityInput.value.trim();

  if (!city) return;

  // Mostrar estado de carga
  results.innerHTML = `
    <div class="glass-panel" style="text-align:center; padding: 48px; color: rgba(240,244,255,0.5);">
      <div style="font-size: 2.5rem; margin-bottom: 12px; animation: spin 1.2s linear infinite; display:inline-block;">◈</div>
      <p style="font-family: 'Space Mono', monospace; font-size:0.9rem;">Buscando clima...</p>
    </div>
  `;

  try {
    // 1. Coordenadas
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=es`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      results.innerHTML = `
        <div class="glass-panel" style="text-align:center; padding: 48px; color: rgba(240,244,255,0.5);">
          <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
          <p>Ciudad "<strong style="color:#f0f4ff">${city}</strong>" no encontrada.</p>
          <p style="font-size:0.85rem; margin-top: 8px;">Intenta con otro nombre o verifica la ortografía.</p>
        </div>
      `;
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // 2. Clima actual + pronóstico
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index,visibility` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset` +
      `&timezone=auto`
    );
    const data = await weatherRes.json();
    const c = data.current;
    const daily = data.daily;

    // Actualizar orbs de fondo según el clima
    updateBackground(c.weather_code);

    // 3. Pronóstico HTML
    const today = new Date().toISOString().split('T')[0];
    let forecastHTML = '';
    daily.time.forEach((date, i) => {
      const dayName = date === today ? 'Hoy' :
        new Date(date + 'T00:00').toLocaleDateString('es-ES', { weekday: 'short' });
      const isToday = date === today;
      forecastHTML += `
        <div class="forecast-day${isToday ? ' today' : ''}">
          <span class="forecast-date">${dayName}</span>
          <span class="forecast-icon">${getWeatherIcon(daily.weather_code[i])}</span>
          <div class="forecast-temps">
            <span class="max-temp">${Math.round(daily.temperature_2m_max[i])}°</span>
            <span class="min-temp">${Math.round(daily.temperature_2m_min[i])}°</span>
          </div>
        </div>
      `;
    });

    // Dirección del viento
    const windDir = getWindDirection(c.wind_direction_10m);

    // 4. Renderizar
    results.innerHTML = `
      <div class="weather-card">

        <!-- Panel principal -->
        <div class="glass-panel">
          <div class="card-header">
            <div>
              <div class="city-name">📍 ${name}, ${country}</div>
              <div class="city-date">${new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            </div>
            <div class="weather-badge">${getWeatherDescription(c.weather_code)}</div>
          </div>

          <div class="main-temp-section">
            <div class="temp-display">
              <div class="big-icon">${getWeatherIcon(c.weather_code)}</div>
              <div class="big-temp">${Math.round(c.temperature_2m)}<span class="unit">°C</span></div>
            </div>
            <div class="description-block">
              <div class="weather-desc">${getWeatherDescription(c.weather_code)}</div>
              <div class="feels-like">Sensación: ${Math.round(c.apparent_temperature)}°C</div>
              <div class="feels-like" style="margin-top:8px">
                🌅 ${formatTime(daily.sunrise[0])} &nbsp;|&nbsp; 🌇 ${formatTime(daily.sunset[0])}
              </div>
            </div>
          </div>
        </div>

        <!-- Grid de stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-icon">💧</span>
            <div>
              <div class="stat-label">Humedad</div>
              <div class="stat-value">${c.relative_humidity_2m}%</div>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">💨</span>
            <div>
              <div class="stat-label">Viento</div>
              <div class="stat-value">${Math.round(c.wind_speed_10m)} <span style="font-size:0.8rem;font-weight:400">km/h ${windDir}</span></div>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🌡️</span>
            <div>
              <div class="stat-label">Presión</div>
              <div class="stat-value">${Math.round(c.surface_pressure)} <span style="font-size:0.8rem;font-weight:400">hPa</span></div>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">☀️</span>
            <div>
              <div class="stat-label">Índice UV</div>
              <div class="stat-value">${c.uv_index ?? '—'} <span style="font-size:0.8rem;font-weight:400;color:${getUVColor(c.uv_index)}">${getUVLabel(c.uv_index)}</span></div>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">👁️</span>
            <div>
              <div class="stat-label">Visibilidad</div>
              <div class="stat-value">${c.visibility != null ? (c.visibility / 1000).toFixed(1) : '—'} <span style="font-size:0.8rem;font-weight:400">km</span></div>
            </div>
          </div>
          <div class="stat-card">
            <span class="stat-icon">🌧️</span>
            <div>
              <div class="stat-label">Prob. lluvia hoy</div>
              <div class="stat-value">${daily.precipitation_probability_max[0] ?? '—'}%</div>
            </div>
          </div>
        </div>

        <!-- Pronóstico 7 días -->
        <div class="glass-panel">
          <div class="forecast-title">Pronóstico 7 días</div>
          <div class="forecast-container">
            ${forecastHTML}
          </div>
        </div>

      </div>
    `;

    document.getElementById("searchSection").style.marginTop = "20px";

  } catch (error) {
    console.error("Error:", error);
    results.innerHTML = `
      <div class="glass-panel" style="text-align:center; padding: 48px; color: rgba(240,244,255,0.5);">
        <div style="font-size: 3rem; margin-bottom: 12px;">⚡</div>
        <p>Error al obtener el clima. Verifica tu conexión.</p>
      </div>
    `;
  }
}

/* ─── Funciones de apoyo ─────────────────────────────── */

function getWeatherDescription(code) {
  if (code === 0) return "Soleado";
  if (code === 1) return "Despejado";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code <= 48) return "Niebla";
  if (code <= 55) return "Llovizna";
  if (code <= 67) return "Lluvia";
  if (code <= 77) return "Nieve";
  if (code <= 82) return "Chubascos";
  if (code <= 99) return "Tormenta";
  return "Despejado";
}

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code <= 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌨️";
  if (code <= 99) return "⛈️";
  return "🌤️";
}

function getWindDirection(deg) {
  if (deg == null) return '';
  const dirs = ['N','NE','E','SE','S','SO','O','NO'];
  return dirs[Math.round(deg / 45) % 8];
}

function getUVLabel(uv) {
  if (uv == null) return '';
  if (uv <= 2) return 'Bajo';
  if (uv <= 5) return 'Moderado';
  if (uv <= 7) return 'Alto';
  if (uv <= 10) return 'Muy alto';
  return 'Extremo';
}

function getUVColor(uv) {
  if (uv == null) return 'inherit';
  if (uv <= 2) return '#4ade80';
  if (uv <= 5) return '#facc15';
  if (uv <= 7) return '#fb923c';
  if (uv <= 10) return '#f87171';
  return '#c084fc';
}

function formatTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function updateBackground(code) {
  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  // Lluvia → azul oscuro, tormenta → morado, nieve → azul cielo, soleado → naranja cálido
  if (code >= 95) {
    orb1.style.background = '#2d1a4e';
    orb2.style.background = '#1a0e33';
  } else if (code >= 71) {
    orb1.style.background = '#1a3a5e';
    orb2.style.background = '#0e2a40';
  } else if (code >= 51) {
    orb1.style.background = '#1a2e5e';
    orb2.style.background = '#0e1e40';
  } else if (code <= 1) {
    orb1.style.background = '#3a2a0e';
    orb2.style.background = '#1e1a06';
  } else {
    orb1.style.background = '#1a3a6e';
    orb2.style.background = '#0e2040';
  }
}
