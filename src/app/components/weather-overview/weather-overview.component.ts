import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weather-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './weather-overview.component.html',
  styleUrl: './weather-overview.component.css'
})
export class WeatherOverviewComponent implements OnInit {
  weatherData: any;
  forecastData: any;
  city: string | null = null;
  lat: number | null = null;
  lon: number | null = null;


  dailyForecast: any[] = [];


  route = inject(ActivatedRoute);
  weatherService = inject(WeatherService);

  ngOnInit() {
    this.route.queryParams.subscribe(params => { //tuve que hacerlo con queryparams porque me tiraba un error en +params
      this.city = params['city'] || null;
      this.lat = params['lat'] ? +params['lat'] : null;
      this.lon = params['lon'] ? +params['lon'] : null;
      
      if (this.lat !== null && this.lon !== null) {
        this.weatherService.getWeatherByCoordinates(this.lat, this.lon).subscribe(data => {
          this.weatherData = data;
        });

        this.weatherService.getForecastByCoordinates(this.lat, this.lon).subscribe(data => {
          this.forecastData = data;
        });
      } else if (this.city) {
        this.weatherService.getWeatherByCity(this.city).subscribe(data => {
          this.weatherData = data;
        });

        this.weatherService.getForecastByCity(this.city).subscribe(data => {
          this.forecastData = data;  
          console.log(this.forecastData);
           
        });
      }
      
    });
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

 
}