import { Routes } from '@angular/router';
import { CurrentWeatherByCoordinatesComponent } from './components/current-weather/by-coordinates/current-weather-by-coordinates/current-weather-by-coordinates.component';
import { CurrentWeatherByCityComponent } from './components/current-weather/by-city/current-weather-by-city/current-weather-by-city.component';
import { ForecastByCoordinatesComponent } from './components/weather-forecast/by-coordinates/forecast-by-coordinates/forecast-by-coordinates.component';
import { ForecastByCityComponent } from './components/weather-forecast/by-city/forecast-by-city/forecast-by-city.component';

export const routes: Routes = [
    { path: 'current/coordinates', component: CurrentWeatherByCoordinatesComponent },
    { path: 'current/city', component: CurrentWeatherByCityComponent },
    { path: 'forecast/coordinates', component: ForecastByCoordinatesComponent },
    { path: 'forecast/city', component: ForecastByCityComponent },
    { path: '', redirectTo: '/current/coordinates', pathMatch: 'full' }, 
  ];