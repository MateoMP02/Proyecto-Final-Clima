import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // URL base para las solicitudes de clima y pronóstico
private urlWeather = "https://api.openweathermap.org/data/2.5/weather?";  // URL para obtener el clima actual
private urlForecast = "https://api.openweathermap.org/data/2.5/forecast?";  // URL para obtener el pronóstico
private apiKey = 'feab7053b10786492fa46dc5dc225099';  // Clave de la API para autenticar las solicitudes

// Constructor para inyectar el servicio HttpClient
constructor(private http: HttpClient) { }

// Obtiene los datos del clima actual usando las coordenadas (latitud y longitud)
getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
  const url = `${this.urlWeather}lat=${lat}&lon=${lon}&appid=${this.apiKey}`;  
  return this.http.get(url);  
}

// Obtiene los datos del clima actual usando el nombre de la ciudad
getWeatherByCity(city: string): Observable<any> {
  const url = `${this.urlWeather}q=${city}&appid=${this.apiKey}`;  
  return this.http.get(url);  
}

// Obtiene el pronóstico usando las coordenadas (latitud y longitud)
getForecastByCoordinates(lat: number, lon: number): Observable<any> {
  const url = `${this.urlForecast}lat=${lat}&lon=${lon}&appid=${this.apiKey}`;  
  return this.http.get(url);  
}

// Obtiene el pronóstico usando el nombre de la ciudad
getForecastByCity(city: string): Observable<any> {
  const url = `${this.urlForecast}q=${city}&appid=${this.apiKey}`;  
  return this.http.get(url);  
}

}
