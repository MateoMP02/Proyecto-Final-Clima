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
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

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


  ngOnInit() {
    // Obtiene el usuario actual y, si existe, establece el valor de la ciudad de residencia en el formulario
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.residenceCityForm.patchValue({
        residenceCity: this.currentUser.residenceCity
      });
    }
  }

  clearSearchHistory() {
    // Elimina el historial de búsqueda del usuario actual
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
    // Solicita confirmación para eliminar la cuenta del usuario
    const confirmed = window.confirm("Are you sure you want to delete your account? This action is permanent and cannot be undone.");
    if (confirmed) {
      if (this.currentUser) {
        this.authService.deleteUser(this.currentUser).subscribe({
          next: () => {
            alert('User deleted successfully.');
            this.authService.logout(); // Cierra sesión después de eliminar al usuario
            this.currentUser = null; // Resetea los datos del usuario
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
    // Activa o desactiva el modo de edición de la ciudad
    this.isEditingCity = !this.isEditingCity;
    if (!this.isEditingCity && this.currentUser) {
      // Si se cancela la edición, restablece el valor de la ciudad al valor original
      this.residenceCityForm.patchValue({
        residenceCity: this.currentUser.residenceCity
      });
    }
  }

  validateCity(city: string | undefined): Promise<boolean> {
    // Valida si la ciudad ingresada existe
    return new Promise((resolve) => {
      const validCity = city ?? '';
      if (validCity.trim() === '') {
        console.error('City cannot be empty.');
        resolve(false);
        return;
      }

      // Verifica la existencia de la ciudad consultando a un servicio de clima
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
    // Cambia la ciudad de residencia del usuario, después de validarla
    if (this.residenceCityForm.valid && this.currentUser) {
      const newResidenceCity = this.residenceCityForm.get('residenceCity')?.value;

      // Valida la nueva ciudad ingresada
      const isValidCity = await this.validateCity(newResidenceCity);

      if (isValidCity) {
        this.currentUser.residenceCity = newResidenceCity;

        this.authService.updateUser(this.currentUser).subscribe({
          next: () => {
            console.log('Residence city changed successfully');
            alert('Residence city updated!');
            this.toggleEditCity(); // Desactiva el modo de edición después de actualizar
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

}
