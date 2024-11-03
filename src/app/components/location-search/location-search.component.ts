import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-search',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './location-search.component.html',
  styleUrl: './location-search.component.css'
})
export class LocationSearchComponent {
  fb = inject(FormBuilder);

  router = inject(Router)

  searchCityBar = this.fb.nonNullable.group({
    city: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(30)
    ]]
  });

  searchLatLonBar = this.fb.nonNullable.group({
    lat:['',[Validators.required]],
    lon:['',[Validators.required]]
  })

  
  //Para cuando se toque el boton aparezcan los inputs
  inputsVisible: boolean = false;

  toggleInputs() {
    this.inputsVisible = !this.inputsVisible;
  }
  

  onSubmit() {
    if (this.searchCityBar.valid) {
      const city = this.searchCityBar.get('city')?.value;
   
      this.router.navigate(['/overview'], { queryParams: { city } });
      
    } else if (this.searchLatLonBar.valid) {
      const lat = this.searchLatLonBar.get('lat')?.value;
      const lon = this.searchLatLonBar.get('lon')?.value;

      if (Number(lat) < -90 || Number(lat) > 90 || Number(lon) < -180 || Number(lon) > 180) {
        console.error('Coordinates are out of range.');
        alert('Please enter valid coordinates: Latitude must be between -90 and 90, Longitude between -180 and 180.');
        return;
      }
     
      this.router.navigate(['/overview'], { queryParams: { lat, lon } });
    }
  }
}
