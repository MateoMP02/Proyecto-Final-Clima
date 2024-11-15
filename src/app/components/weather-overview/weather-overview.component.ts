import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  weatherData: any;
  forecastData: any;
  city: string | null = null;
  lat: number | null = null;
  lon: number | null = null;

  isNotFound: boolean = false;
  dailyForecast: any[] = [];
  unidadSeleccionada: string = 'K';
  unidadSeleccionadaViento: string = 'm/s';
  route = inject(ActivatedRoute);
  weatherService = inject(WeatherService);


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.city = params['city'] || null;
      this.lat = params['lat'] ? +params['lat'] : null;
      this.lon = params['lon'] ? +params['lon'] : null;
      this.isNotFound = false;

      if (this.lat !== null && this.lon !== null) {
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
    const dailyForecast = forecastList.reduce((acc, curr) => {
      const date = new Date(curr.dt_txt).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
      if (!acc.find((item: any) => item.date === date)) {
        acc.push({ ...curr, date });
      }
      return acc;
    }, []);
    return dailyForecast;
  }



  convertUnixTime(unixTime: number, timezoneOffset: number): string { //Calculo para transformar el sunrise y sunset en información legible
    const date = new Date((unixTime + timezoneOffset) * 1000);
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }


  formatForecastDate(dt_txt: string): string {
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



  //Funciones del mapa

  private marker: L.Marker | undefined;
  private map: L.Map | null = null;

  private initMap(lat: number, lon: number) {
    if (!document.getElementById('map')) {
      // Si el contenedor de mapa aún no está listo, intenta nuevamente después de un breve tiempo
      setTimeout(() => this.initMap(lat, lon), 100);
      return;
    }

    if (this.map) {
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
      // Crear el mapa si no existe
      this.map = L.map('map').setView([lat, lon], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.map.invalidateSize();
      this.marker = L.marker([lat, lon]).addTo(this.map)
        .bindPopup('Ubicación seleccionada')
        .openPopup();
    }

    const weatherInfo = `
      <h4>Weather in ${this.weatherData.name}</h4>
      <p><strong>Temperature:</strong> ${this.getTempConvert(this.weatherData.main.temp)}</p>
      <p><strong>Weather:</strong> ${this.weatherData.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${this.weatherData.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${this.getSpeedConvert(this.weatherData.wind.speed)}</p>
    `;

    // Asignar el contenido al popup del marcador
    if (this.marker) {
      this.marker.setPopupContent(weatherInfo);
    }
  }

  getTempConvert(temp: number) {
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
    switch (this.unidadSeleccionadaViento) {
      case 'm/s':
        return speed.toFixed(2) + 'm/s';
      case 'K/h':
        return (speed * 3.6).toFixed(2) + 'K/h';
      default:
        return speed.toFixed(2) + 'm/s';
    }
  }

  //Traduce la timezone a un valor entendible
  translateTimezone(offsetInSeconds: number): string {
    const offsetInHours = offsetInSeconds / 3600;

    const sign = offsetInHours >= 0 ? '+' : '-';

    const absoluteOffset = Math.abs(offsetInHours);

    return `UTC${sign}${absoluteOffset}`;
  }
}
