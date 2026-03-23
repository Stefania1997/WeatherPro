# ◈ WeatherPro

Aplicación web de clima en tiempo real para cualquier ciudad del mundo. Diseño oscuro tipo glassmorphism con datos detallados y pronóstico de 7 días.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![API](https://img.shields.io/badge/Open--Meteo-API-4f9eff?style=flat)

---

## 🌤️ Características

- 🔍 **Búsqueda por ciudad** con geocodificación automática
- 🌡️ **Temperatura actual** y sensación térmica
- 💧 **Humedad**, 💨 **Viento** con dirección, 🌡️ **Presión atmosférica**
- ☀️ **Índice UV** con nivel de riesgo
- 👁️ **Visibilidad** en kilómetros
- 🌧️ **Probabilidad de lluvia** del día
- 🌅 **Amanecer y atardecer**
- 📅 **Pronóstico de 7 días** con temperaturas máx/mín
- 🎨 **Fondo animado** que cambia según las condiciones del clima

---

## 🚀 Cómo usar

No requiere instalación ni dependencias. Solo abre el archivo en tu navegador:

```bash
# Clona el repositorio
git clone https://github.com/Stefania1997/WeatherPro

# Entra a la carpeta
cd weatherpro

# Abre index.html en tu navegador
open index.html
```

O simplemente descarga los archivos y abre `index.html` directamente.

---

## 📁 Estructura del proyecto

```
weatherpro/
├── index.html     # Estructura HTML
├── style.css      # Estilos y diseño glassmorphism
├── app.js         # Lógica y llamadas a la API
└── README.md      # Este archivo
```

---

## 🌐 APIs utilizadas

| API | Uso |
|-----|-----|
| [Open-Meteo Geocoding](https://geocoding-api.open-meteo.com) | Convertir nombre de ciudad a coordenadas |
| [Open-Meteo Weather](https://open-meteo.com) | Datos del clima actual y pronóstico |

Ambas APIs son **gratuitas y no requieren API key**.

---

## 🛠️ Tecnologías

- **HTML5** — Estructura semántica
- **CSS3** — Variables CSS, animaciones, backdrop-filter (glassmorphism)
- **JavaScript (Vanilla)** — Fetch API, manipulación del DOM
- **Google Fonts** — DM Sans + Space Mono




