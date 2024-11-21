import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user';
import { WeatherService } from '../../services/weather.service';
import * as L from 'leaflet';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  // --- Servicios inyectados ---
  private authService = inject(AuthService); // Servicio de autenticación
  private weatherService = inject(WeatherService); // Servicio de clima
  private fb = inject(FormBuilder); // Constructor de formularios

  // --- Variables relacionadas con el usuario y el formulario ---
  currentUser: User | null = null; // Usuario actual
  isEditingCity = false; // Indicador para saber si se está editando la ciudad
  residenceCityForm = this.fb.nonNullable.group({
    residenceCity: ['', Validators.required] // Formulario para editar la ciudad de residencia
  });

  // --- Variables relacionadas con el clima y el mapa ---
  city: string | null = null; // Nombre de la ciudad
  lat: number | null = null; 
  lon: number | null = null; 
  weatherData: any; // Datos del clima de la ciudad
  isNotFound: boolean = false; // Indicador para ciudad no encontrada
  private marker: L.Marker | undefined; // Marcador en el mapa
  private map: L.Map | null = null; // Instancia del mapa Leaflet


  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.residenceCityForm.patchValue({
        residenceCity: this.currentUser.residenceCity
      });
      
    }
    this.mapForProfail();
  }
 

  clearSearchHistory() {
    if (this.currentUser) {
      this.currentUser.searchHistory = []; // Vaciar el historial
      this.authService.updateUser(this.currentUser).subscribe({
        next: () => {
          alert('Search history cleared.');
        },
        error: (err) => {
          console.error('Error clearing search history:', err);
          alert('Failed to clear search history.');
        }
      });
    }
  }

  deleteUser() {
    const confirmed = window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.");
    if(confirmed){
      if (this.currentUser) {
      this.authService.deleteUser(this.currentUser).subscribe({
        next: () => {
          alert('User deleted successfully.');
          this.authService.logout(); 
          this.currentUser = null;   
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user.');
        }
      });
    }
    }
  }

  // --- Métodos relacionados con la edición de la ciudad ---
  toggleEditCity() {
    this.isEditingCity = !this.isEditingCity;
    if (!this.isEditingCity && this.currentUser) {
      this.residenceCityForm.patchValue({
        residenceCity: this.currentUser.residenceCity
      });
    }
  }

  validateCity(city: string | undefined): Promise<boolean> {
    return new Promise((resolve) => {
      const validCity = city ?? '';
      if (validCity.trim() === '') {
        console.error('City cannot be empty.');
        resolve(false);
        return;
      }
  
      this.weatherService.getWeatherByCity(validCity).subscribe(
        (data) => {
          console.log('City is valid:', data);
          resolve(true); // Ciudad válida
        },
        (error) => {
          if (error.status === 404) {
            console.error('City not found:', error);
            resolve(false); // Ciudad no encontrada
          }
        }
      );
    });
  }
  
  async changeResidenceCity() {
    if (this.residenceCityForm.valid && this.currentUser) {
      const newResidenceCity = this.residenceCityForm.get('residenceCity')?.value;
  
      // Validar la ciudad ingresada
      const isValidCity = await this.validateCity(newResidenceCity);
  
      if (isValidCity) {
        this.currentUser.residenceCity = newResidenceCity;
  
        this.authService.updateUser(this.currentUser).subscribe({
          next: () => {
            console.log('Residence city changed successfully');
            alert('Residence city updated!');
            this.toggleEditCity();
            this.mapForProfail(); // Actualizar el mapa
          },
          error: (err) => {
            console.error('Error changing residence city:', err);
            alert('Failed to change residence city.');
          }
        });
      } else {
        alert('City is not valid. Please enter a valid city.');
      }
    }
  }

// --- Métodos relacionados con el clima y el mapa ---
  mapForProfail(){
    if(this.currentUser?.residenceCity){
      // Buscar datos del clima para la ciudad actual
      this.weatherService.getWeatherByCity(this.currentUser?.residenceCity).subscribe(
      data => {
        this.weatherData = data;
        this.lat = data.coord.lat;
        this.lon = data.coord.lon;
        // Inicializar o actualizar el mapa
        this.initMap(this.lat!, this.lon!);
        
      },
      error => {
        if (error.status === 404) {
          this.isNotFound = true;
        }
      }
    );
    }
    
  }


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
      <p><strong>Temperature:</strong> ${this.weatherData.main.temp}°K</p>
      <p><strong>Weather:</strong> ${this.weatherData.weather[0].description}</p>
      <p><strong>Humidity:</strong> ${this.weatherData.main.humidity}%</p>
      <p><strong>Wind Speed:</strong> ${this.weatherData.wind.speed}m/s</p>
    `;

    // Asignar el contenido al popup del marcador
    if (this.marker) {
      this.marker.setPopupContent(weatherInfo);
    }
  }


}
