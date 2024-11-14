import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-weather-overview',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './weather-overview.component.html',
  styleUrl: './weather-overview.component.css'
})
export class WeatherOverviewComponent implements OnInit {
  weatherData: any;
  forecastData: any;
  city: string | null = null;
  lat: number | null = null;
  lon: number | null = null;
  private map: L.Map | null = null;
  isNotFound: boolean = false;
  dailyForecast: any[] = [];
  unidadSeleccionada: string = 'K';
  unidadSeleccionadaViento: string = 'm/s';
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
          this.initMap(this.lat!, this.lon!);
        });
      } else if (this.city) {
        this.weatherService.getWeatherByCity(this.city).subscribe(data => {
          this.weatherData = data;
          this.lat = data.coord.lat;
          this.lon = data.coord.lon;
          this.initMap(this.lat!, this.lon!);
        });

        this.weatherService.getForecastByCity(this.city).subscribe(data => {
          this.forecastData = data;  
          console.log(this.forecastData);
           
        });
      }
      
    });
  }
  private initMap(lat: number, lon: number) {
    if (this.map) {
      this.map.setView([lat, lon], 10); // Actualiza la vista si el mapa ya está creado
    } else {
      ///capa del mapa 
      this.map = L.map('map').setView([lat, lon], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
      
      L.marker([lat, lon]).addTo(this.map)
        .bindPopup('Ubicación seleccionada')
        .openPopup();
    }
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
  getTempConvert(temp:number){
    switch(this.unidadSeleccionada){
      case 'C':
        return (temp - 273.15).toFixed(2) + ' °C';
      case 'F':
        return ((temp - 273.15) * 9/5 + 32).toFixed(2) + ' °F';
      default:
        return temp.toFixed(2) + ' °K';
    }
  }
  getSpeedConvert(speed:number){
    switch(this.unidadSeleccionadaViento){
      case 'm/s':
        return (speed - 273.15).toFixed(2) + 'm/s';
      case 'K/h':
        return (speed * 3.6).toFixed(2) + 'K/h';
        default:
          return speed.toFixed(2) + 'm/s';
    }
  }
 
}