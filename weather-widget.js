const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      font-family: 'Segoe UI', Tahoma, sans-serif;
      background: var(--bg-color, #ffffff);
      padding: 1.5em;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      width: 240px;
      transition: transform 0.2s ease;
    }

    :host(:hover) {
      transform: translateY(-4px);
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
    }

    ::slotted(span) {
      font-size: 1.1em;
      font-weight: 600;
      margin-bottom: 10px;
      display: block;
      color: #333;
    }

    .weather {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4em;
    }

    .icon {
      font-size: 3em;
    }

    .temp {
      font-size: 1.6em;
      font-weight: bold;
      color: #0077b6;
    }

    .status {
      font-size: 1em;
      color: #555;
    }

    .details {
      margin-top: 1em;
      font-size: 0.9em;
      color: #444;
      display: none;
    }

    .details span {
      display: block;
      margin-bottom: 4px;
    }

    button.toggle {
      margin-top: 1em;
      background: none;
      border: none;
      color: #0077b6;
      cursor: pointer;
      font-size: 0.95em;
      font-weight: 600;
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: 0.3em;
      transition: color 0.3s ease;
    }

    button.toggle:hover {
      color: #005f91;
    }

  </style>

  <slot name="title"></slot>
  <div class="weather">
    <div class="icon">☀️</div>
    <div class="temp">--</div>
    <div class="status">Cargando...</div>
  </div>
  <div class="details">
    <span class="humidity"></span>
    <span class="wind"></span>
  </div>
  <button class="toggle">Ver más ▼</button>
`;

class WeatherWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.detailsVisible = false;
  }

  static get observedAttributes() {
    return ['bg-color', 'city'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'bg-color') {
      this.style.setProperty('--bg-color', newValue);
    }

    if (name === 'city' && oldValue !== newValue) {
      this.fetchWeather(newValue);
    }
  }

  connectedCallback() {
    const bgColor = this.getAttribute('bg-color') || '#ffffff';
    this.style.setProperty('--bg-color', bgColor);

    const city = this.getAttribute('city') || 'Quito';
    this.fetchWeather(city);

    this.shadowRoot.querySelector('.toggle').addEventListener('click', () => this.toggleDetails());
  }

  toggleDetails() {
    this.detailsVisible = !this.detailsVisible;
    const details = this.shadowRoot.querySelector('.details');
    const button = this.shadowRoot.querySelector('.toggle');

    if (this.detailsVisible) {
      details.style.display = 'block';
      button.textContent = 'Ver menos ▲';
    } else {
      details.style.display = 'none';
      button.textContent = 'Ver más ▼';
    }
  }

  async fetchWeather(city) {
    const mockData = {
      Quito: {
        icon: '🌤️',
        temp: '22°C',
        status: 'Parcialmente nublado',
        humidity: '60%',
        wind: '15 km/h'
      },
      Paris: {
        icon: '🌧️',
        temp: '16°C',
        status: 'Lluvia ligera',
        humidity: '80%',
        wind: '10 km/h'
      },
      Tokyo: {
        icon: '☁️',
        temp: '20°C',
        status: 'Nublado',
        humidity: '72%',
        wind: '20 km/h'
      }
    };

    const data = mockData[city] || {
      icon: '❓',
      temp: '--',
      status: 'Ciudad no encontrada',
      humidity: '--',
      wind: '--'
    };

    this.shadowRoot.querySelector('.icon').textContent = data.icon;
    this.shadowRoot.querySelector('.temp').textContent = data.temp;
    this.shadowRoot.querySelector('.status').textContent = data.status;
    this.shadowRoot.querySelector('.humidity').textContent = `Humedad: ${data.humidity}`;
    this.shadowRoot.querySelector('.wind').textContent = `Viento: ${data.wind}`;
  }
}

customElements.define('weather-widget', WeatherWidget);
