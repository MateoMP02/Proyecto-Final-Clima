import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './services/weather.service';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { LocationSearchComponent } from "./components/location-search/location-search.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, NavbarComponent, LocationSearchComponent],
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

