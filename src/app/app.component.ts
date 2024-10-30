import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './services/weather.service';
import { NavbarComponent } from "./shared/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})




export class AppComponent {
  title = 'Proyecto-Final-Clima';

  fb = inject(FormBuilder)

  weatherData: any;

  form = this.fb.nonNullable.group({
    lat:[[Validators.required]],
    lon:[[Validators.required]]
  })

  weatherService = inject(WeatherService)


  onSubmitCoordinates(): void {
    if (this.form.invalid) return;

    const lat = this.form.get('lat')?.value;
    const lon = this.form.get('lon')?.value; 

    if (Number(lat) < -90 || Number(lat) > 90 || Number(lon) < -180 || Number(lon) > 180) {
      console.error('Coordinates are out of range.');
      alert('Please enter valid coordinates: Latitude must be between -90 and 90, Longitude between -180 and 180.');
      return;
    }

    
    if (lat !== null && lon !== null) {
      console.log('Form submitted with coordinates:', lat, lon);
      this.getWeatherByCoordinates(Number(lat),Number(lon));
    }
  }

  getWeatherByCoordinates(lat: number, lon: number): void {
    this.weatherService.getWeatherByCoordinates(lat, lon).subscribe(
      data => {
        this.weatherData = {
          ...data,
          sunrise: this.convertUnixTime(data.sys.sunrise, data.timezone), //Lo convierto directamente
          sunset: this.convertUnixTime(data.sys.sunset, data.timezone)
        };
        console.log('Weather data:', this.weatherData);
      },
      error => {
        console.error('Error fetching weather data', error);
      }
    );
  }

  convertUnixTime(unixTime: number, timezoneOffset: number): string { //Calculo para transformar el sunrise y sunset en información legible
    const date = new Date((unixTime + timezoneOffset) * 1000); 
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }
}

