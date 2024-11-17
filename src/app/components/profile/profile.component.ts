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
  currentUser: User | null = null;
  isEditingCity = false;  // flag
  weatherService = inject(WeatherService);
  city: string | null = null;
  lat: number | null = null;
  lon: number | null = null;
  weatherData: any;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  isNotFound: boolean = false;
  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.residenceCityForm.patchValue({
        residenceCity: this.currentUser.residenceCity
      });
      
    }
    this.mapForProfail();
  }

  residenceCityForm = this.fb.nonNullable.group({
    residenceCity: ['', Validators.required]
  });

  toggleEditCity() {
    this.isEditingCity = !this.isEditingCity;
    if (!this.isEditingCity && this.currentUser) {
      this.residenceCityForm.patchValue({
        residenceCity: this.currentUser.residenceCity
      });
    }
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
  validateCity(city: string | undefined): void {
    const validCity = city ?? ''; // Asegurarse de que sea un string
    if (validCity.trim() === '') {
      this.isNotFound = true;
      console.error('City cannot be empty.');
      return;
    }
  
    this.weatherService.getWeatherByCity(validCity).subscribe(
      (data) => {
        // Ciudad válida
        this.isNotFound = false;
        console.log('City is valid:', data);
      },
      (error) => {
        if (error.status === 404) {
          // Ciudad no encontrada
          this.isNotFound = true;
          console.error('City not found:', error);
        }
      }
    );
  }
  changeResidenceCity() {
    if (this.residenceCityForm.valid && this.currentUser) {
      const newResidenceCity = this.residenceCityForm.get('residenceCity')?.value;
  
      // Validar la ciudad ingresada
      this.validateCity(newResidenceCity);
  
      if (!this.isNotFound) {
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
  mapForProfail(){
    if(this.currentUser?.residenceCity){
      this.weatherService.getWeatherByCity(this.currentUser?.residenceCity).subscribe(
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
    }
    
  }
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
  }
}
