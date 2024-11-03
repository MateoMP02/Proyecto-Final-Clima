import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private urlWeather = "https://api.openweathermap.org/data/2.5/weather?"
  private urlForecast = "https://api.openweathermap.org/data/2.5/forecast?"
  private apiKey = 'feab7053b10786492fa46dc5dc225099';

  constructor(private http: HttpClient) {}

  getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
    const url = `${this.urlWeather}lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getWeatherByCity(city:string): Observable<any> {
    const url = `${this.urlWeather}q=${city}&appid=${this.apiKey}`;
    return this.http.get(url);
  }


  getForecastByCoordinates(lat: number, lon: number): Observable<any> {
    const url = `${this.urlForecast}lat=${lat}&lon=${lon}&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  getForecastByCity(city:string): Observable<any> {
    const url = `${this.urlForecast}q=${city}&appid=${this.apiKey}`;
    return this.http.get(url);
  }
}
