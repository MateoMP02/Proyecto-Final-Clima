import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weather-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather-overview.component.html',
  styleUrl: './weather-overview.component.css'
})
export class WeatherOverviewComponent implements OnInit {

  // Datos relacionados con el clima
  weatherData: any;  // Almacena los datos del clima actual
  forecastData: any;  // Almacena los datos del pronóstico
  city: string | null = null;
  lat: number | null = null;
  lon: number | null = null;

  // Estado para mostrar si no se encuentra la ciudad
  isNotFound: boolean = false;

  // Almacena el pronóstico diario
  dailyForecast: any[] = [];

  // Unidad seleccionada para la temperatura (K=Kelvin por defecto)
  unidadSeleccionada: string = 'K';

  // Unidad seleccionada para la velocidad del viento (m/s por defecto)
  unidadSeleccionadaViento: string = 'm/s';

  // Servicios
  private weatherService = inject(WeatherService);
  private route = inject(ActivatedRoute);



  ngOnInit() {
    // Obtiene los parámetros de la ruta y consulta el clima para la ciudad o coordenadas
    this.route.queryParams.subscribe(params => {
      this.city = params['city'] || null;
      this.lat = params['lat'] ? +params['lat'] : null;
      this.lon = params['lon'] ? +params['lon'] : null;
      this.isNotFound = false;

      if (this.lat !== null && this.lon !== null) {
        // Si se proporciona latitud y longitud, consulta el clima por coordenadas
        this.weatherService.getWeatherByCoordinates(this.lat, this.lon).subscribe(
          data => {
            this.weatherData = data;
          },
          error => {
            if (error.status === 404) {
              this.isNotFound = true;
            }
          }
        );

        this.weatherService.getForecastByCoordinates(this.lat, this.lon).subscribe(
          data => {
            this.forecastData = this.getDailyForecast(data.list);
            this.initMap(this.lat!, this.lon!);
          },
          error => {
            if (error.status === 404) {
              this.isNotFound = true;
            }
          }
        );
      } else if (this.city) {
        // Si se proporciona una ciudad, consulta el clima por ciudad
        this.weatherService.getWeatherByCity(this.city).subscribe(
          data => {
            this.weatherData = data;
            this.lat = data.coord.lat;
            this.lon = data.coord.lon;
            this.initMap(this.lat!, this.lon!);
          },
          error => {
            if (error.status === 404) {
              this.isNotFound = true;
            }
          }
        );

        this.weatherService.getForecastByCity(this.city).subscribe(
          data => {
            this.forecastData = this.getDailyForecast(data.list);
          },
          error => {
            if (error.status === 404) {
              this.isNotFound = true;
            }
          }
        );
      }
    });
  }

  getDailyForecast(forecastList: any[]): any[] {
    // Extrae las previsiones diarias a partir de la lista de pronósticos por hora
    const dailyForecast = forecastList.reduce((acc, curr) => {
      const date = new Date(curr.dt_txt).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
      if (!acc.find((item: any) => item.date === date)) {
        acc.push({ ...curr, date });
      }
      return acc;
    }, []);
    return dailyForecast;
  }

  convertUnixTime(unixTime: number, timezoneOffset: number): string {
    // Convierte un tiempo en formato Unix a una cadena legible ajustada a la zona horaria
    const date = new Date((unixTime + timezoneOffset) * 1000);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  formatForecastDate(dt_txt: string): string {
    // Formatea las fechas de las previsiones a un formato legible
    const date = new Date(dt_txt);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  // --- Funciones del mapa ---
  private marker: L.Marker | undefined;
  private map: L.Map | null = null;

  private initMap(lat: number, lon: number) {
    // Inicializa o actualiza el mapa con la ubicación dada
    if (!document.getElementById('map')) {
      // Si el contenedor del mapa no está listo, espera y vuelve a intentar
      setTimeout(() => this.initMap(lat, lon), 100);
      return;
    }

    if (this.map) {
      // Si el mapa ya existe, actualiza la vista y la ubicación del marcador
      this.map.setView([lat, lon], 10);
      this.map.invalidateSize();
      if (this.marker) {
        this.marker.setLatLng([lat, lon]);
      } else {
        this.marker = L.marker([lat, lon]).addTo(this.map)
          .bindPopup('Ubicación seleccionada')
          .openPopup();
      }
    } else {
      // Si el mapa no existe, lo crea y agrega un marcador
      this.map = L.map('map').setView([lat, lon], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.map.invalidateSize();
      this.marker = L.marker([lat, lon]).addTo(this.map)
        .bindPopup('Ubicación seleccionada')
        .openPopup();
    }

    // Muestra la información del clima en el popup del marcador
    const weatherInfo = `
    <h4>Weather in ${this.weatherData.name}</h4>
    <p><strong>Temperature:</strong> ${this.getTempConvert(this.weatherData.main.temp)}</p>
    <p><strong>Weather:</strong> ${this.weatherData.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${this.weatherData.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${this.getSpeedConvert(this.weatherData.wind.speed)}</p>
  `;

    if (this.marker) {
      this.marker.setPopupContent(weatherInfo);
    }
  }

  getTempConvert(temp: number) {
    // Convierte la temperatura según la unidad seleccionada
    switch (this.unidadSeleccionada) {
      case 'C':
        return (temp - 273.15).toFixed(2) + ' °C';
      case 'F':
        return ((temp - 273.15) * 9 / 5 + 32).toFixed(2) + ' °F';
      default:
        return temp.toFixed(2) + ' °K';
    }
  }

  getSpeedConvert(speed: number) {
    // Convierte la velocidad del viento según la unidad seleccionada
    switch (this.unidadSeleccionadaViento) {
      case 'm/s':
        return speed.toFixed(2) + 'm/s';
      case 'km/h':
        return (speed * 3.6).toFixed(2) + ' km/h';
      default:
        return speed.toFixed(2) + 'm/s';
    }
  }

  translateTimezone(offsetInSeconds: number): string {
    // Convierte el offset de zona horaria en segundos a un formato legible
    const offsetInHours = offsetInSeconds / 3600;

    const sign = offsetInHours >= 0 ? '+' : '-';

    const absoluteOffset = Math.abs(offsetInHours);

    return `UTC${sign}${absoluteOffset}`;
  }

}
