import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './location-search.component.html',
  styleUrl: './location-search.component.css'
})
export class LocationSearchComponent {
  // Servicios
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  // Variable que determina si los inputs del formulario son visibles o no
  inputsVisible: boolean = false;

  /// Formulario para la busqueda de ciudad
  searchCityBar = this.fb.nonNullable.group({
    city: ['', [Validators.required]]
  });

  // Formulario para la busqueda de latitud y longitud
  searchLatLonBar = this.fb.nonNullable.group({
    lat: ['', [Validators.required]],
    lon: ['', [Validators.required]]
  });


  // Función para alternar la visibilidad de los inputs de latitud y longitud
  toggleInputs() {
    this.inputsVisible = !this.inputsVisible;
  }

  // Función que se ejecuta al enviar el formulario (ya sea para ciudad o latitud/longitud)
  onSubmit() {
    const currentUser = this.authService.getCurrentUser();

    if (this.searchCityBar.valid) {
      this.handleCitySearch(currentUser);
    }

    else if (this.searchLatLonBar.valid) {
      this.handleLatLonSearch(currentUser);
    }
  }

  // Función que maneja la búsqueda por ciudad
  handleCitySearch(currentUser: any) {
    const city = this.searchCityBar.get('city')?.value || '';

    // Si el usuario esta autenticado, guarda el historial de busqueda
    if (currentUser) {
      this.updateSearchHistory(currentUser, city);
    } else {
      console.log('Search performed without logged-in user. History not saved.');
    }

    // Navega a la pagina de resultados con el nombre de la ciudad
    this.router.navigate(['/overview'], { queryParams: { city } });
  }

  // Función que maneja la búsqueda por latitud y longitud
  handleLatLonSearch(currentUser: any) {
    const lat = this.searchLatLonBar.get('lat')?.value || '';
    const lon = this.searchLatLonBar.get('lon')?.value || '';

    // Si las coordenadas son válidas, guarda el historial y navega a la página de resultados
    if (this.areCoordinatesValid(lat, lon)) {
      if (currentUser) {
        const location = `Lat: ${lat}, Lon: ${lon}`;
        this.updateSearchHistory(currentUser, location);
      } else {
        console.log('Search performed without logged-in user. History not saved.');
      }

      // Navega a la página de resultados con las coordenadas
      this.router.navigate(['/overview'], { queryParams: { lat, lon } });
    } else {
      console.error('Coordinates are out of range.');
      alert('Please enter valid coordinates: Latitude must be between -90 and 90, Longitude between -180 and 180.');
    }
  }

  // Función para validar que las coordenadas estén dentro del rango válido
  areCoordinatesValid(lat: string, lon: string): boolean {
    return !(Number(lat) < -90 || Number(lat) > 90 || Number(lon) < -180 || Number(lon) > 180);  // Verifica si las coordenadas están en el rango válido
  }

  // Función que actualiza el historial de búsqueda del usuario en el sistema
  updateSearchHistory(currentUser: any, searchItem: string) {
    currentUser.searchHistory = currentUser.searchHistory || [];
    currentUser.searchHistory.push(searchItem);

    // Actualiza el historial del usuario en el servicio de autenticación
    this.authService.updateUser(currentUser).subscribe({
      next: () => {
        console.log('Search history updated for authenticated user.');
      },
      error: (err) => {
        console.error('Error updating user history:', err);
      }
    });
  }

  // Función que maneja la búsqueda por latitud y longitud (llamada desde un formulario específico)
  onSubmitLatLon() {
    const currentUser = this.authService.getCurrentUser();
    const lat = this.searchLatLonBar.get('lat')?.value || '';
    const lon = this.searchLatLonBar.get('lon')?.value || '';

    // Si las coordenadas son válidas, guarda el historial y navega a la página de resultados
    if (this.areCoordinatesValid(lat, lon)) {
      if (currentUser) {
        const location = `Lat: ${lat}, Lon: ${lon}`;
        this.updateSearchHistory(currentUser, location);
      } else {
        console.log('Search performed without logged-in user. History not saved.');
      }

      // Navega a la página de resultados con las coordenadas
      this.router.navigate(['/overview'], { queryParams: { lat, lon } });
    } else {
      console.error('Coordinates are out of range.');
      alert('Please enter valid coordinates: Latitude must be between -90 and 90, Longitude between -180 and 180.');
    }
  }


}
