import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../types/user';
import { AuthService } from '../../../services/auth.service';
import { WeatherService } from '../../../services/weather.service';
import L from 'leaflet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-residence-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './residence-map.component.html',
  styleUrl: './residence-map.component.css'
})
export class ResidenceMapComponent implements OnInit {

  private marker: L.Marker | undefined; // Marcador en el mapa
  private map: L.Map | null = null; // Instancia del mapa Leaflet

  // --- Servicios inyectados ---
  private authService = inject(AuthService);
  private weatherService = inject(WeatherService);

  // --- Variables relacionadas con el usuario y el formulario ---
  currentUser: User | null = null; // Usuario actual


  // --- Variables relacionadas con el clima y el mapa ---
  city: string | null = null; // Nombre de la ciudad
  lat: number | null = null;
  lon: number | null = null;
  weatherData: any = {};
  isNotFound: boolean = false; // Indicador para ciudad no encontrada

  ngOnInit(): void {
    // Obtiene el usuario actual y carga los datos del clima para su ciudad
    this.currentUser = this.authService.getCurrentUser();
    this.mapForProfail();
  }

  // Método para obtener los datos del clima y manejar el mapa
  mapForProfail() {
    if (this.currentUser?.residenceCity) {
      // Busca datos del clima para la ciudad del usuario actual
      this.weatherService.getWeatherByCity(this.currentUser?.residenceCity).subscribe(
        data => {
          this.weatherData = data;
          this.lat = data.coord.lat;
          this.lon = data.coord.lon;
          // Inicializa o actualiza el mapa con las coordenadas obtenidas
          this.initMap(this.lat!, this.lon!);
        },
        error => {
          if (error.status === 404) {
            // Si no se encuentran datos del clima, marca como no encontrado
            this.isNotFound = true;
          }
        }
      );
    }
  }

  // Método para inicializar o actualizar el mapa con las coordenadas proporcionadas
  private initMap(lat: number, lon: number) {
    // Verifica si el contenedor del mapa existe
    if (!document.getElementById('map')) {
      // Si el mapa aún no está listo, intenta inicializarlo nuevamente después de un corto tiempo
      setTimeout(() => this.initMap(lat, lon), 100);
      return;
    }

    if (this.map) {
      // Si el mapa ya está inicializado, ajusta la vista y la posición del marcador
      this.map.setView([lat, lon], 10);
      this.map.invalidateSize();
      if (this.marker) {
        // Si ya existe un marcador, actualiza su posición
        this.marker.setLatLng([lat, lon]);
      } else {
        // Si no existe un marcador, crea uno nuevo
        this.marker = L.marker([lat, lon]).addTo(this.map)
          .bindPopup('Ubicación seleccionada')
          .openPopup();
      }
    } else {
      // Si el mapa no ha sido creado, lo inicializa
      this.map = L.map('map').setView([lat, lon], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      this.map.invalidateSize();
      this.marker = L.marker([lat, lon]).addTo(this.map)
        .bindPopup('Ubicación seleccionada')
        .openPopup();
    }

    // Información adicional del clima que se mostrará en el popup del marcador
    const weatherInfo = `
      <h4>Weather in ${this.weatherData.name}</h4>
      <p><strong>Temperature:</strong> ${this.weatherData.main.temp}°K</p>
      <p><strong>Weather:</strong> ${this.weatherData.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${this.weatherData.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${this.weatherData.wind.speed}m/s</p>
    `;

    // Asigna el contenido del clima al popup del marcador
    if (this.marker) {
      this.marker.setPopupContent(weatherInfo);
    }
  }


}
