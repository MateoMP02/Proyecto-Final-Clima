import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './location-search.component.html',
  styleUrl: './location-search.component.css'
})
export class LocationSearchComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

  searchCityBar = this.fb.nonNullable.group({
    city: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)
    ]]
  });

  searchLatLonBar = this.fb.nonNullable.group({
    lat: ['', [Validators.required]],
    lon: ['', [Validators.required]]
  });

  inputsVisible: boolean = false;

  toggleInputs() {
    this.inputsVisible = !this.inputsVisible;
  }

  onSubmit() {
    const currentUser = this.authService.getCurrentUser(); // Obtener el usuario actual
    
    if (this.searchCityBar.valid) {
      this.handleCitySearch(currentUser);
    } else if (this.searchLatLonBar.valid) {
      this.handleLatLonSearch(currentUser);
    }
  }
  
  handleCitySearch(currentUser: any) {
    const city = this.searchCityBar.get('city')?.value || ''; // Me aseguro que es un string
  
    if (currentUser) {
      this.updateSearchHistory(currentUser, city);
    } else {
      console.log('Search performed without logged-in user. History not saved.');
    }
  
    // Realizar la navegación a la página de resultados
    this.router.navigate(['/overview'], { queryParams: { city } });
  }
  
  handleLatLonSearch(currentUser: any) {
    const lat = this.searchLatLonBar.get('lat')?.value || '';
    const lon = this.searchLatLonBar.get('lon')?.value || '';
  
    if (this.areCoordinatesValid(lat, lon)) {
      if (currentUser) {
        const location = `Lat: ${lat}, Lon: ${lon}`;
        this.updateSearchHistory(currentUser, location);
      } else {
        console.log('Search performed without logged-in user. History not saved.');
      }
  
      // Realizar la navegación a la página de resultados
      this.router.navigate(['/overview'], { queryParams: { lat, lon } });
    } else {
      console.error('Coordinates are out of range.');
      alert('Please enter valid coordinates: Latitude must be between -90 and 90, Longitude between -180 and 180.');
    }
  }
  
  areCoordinatesValid(lat: string, lon: string): boolean {
    return !(Number(lat) < -90 || Number(lat) > 90 || Number(lon) < -180 || Number(lon) > 180);
  }
  
  updateSearchHistory(currentUser: any, searchItem: string) {
    currentUser.searchHistory = currentUser.searchHistory || [];
    currentUser.searchHistory.push(searchItem);
  
    this.authService.updateUser(currentUser).subscribe({
      next: () => {
        console.log('Search history updated for authenticated user.');
      },
      error: (err) => {
        console.error('Error updating user history:', err);
      }
    });
  }
  
}
