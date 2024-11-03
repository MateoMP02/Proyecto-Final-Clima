import { Routes } from '@angular/router';
import { LocationSearchComponent } from './components/location-search/location-search.component';
import { WeatherOverviewComponent } from './components/weather-overview/weather-overview.component';
import { WeatherDetailComponent } from './components/weather-detail/weather-detail.component';
import { RegisterComponent } from './components/account/register/register.component';
import { LoginComponent } from './components/account/login/login.component';

export const routes: Routes = [
  { path: 'search', component: LocationSearchComponent },
  { path: 'overview', component: WeatherOverviewComponent },
  { path: 'detail/:date', component: WeatherDetailComponent }, // Revisar luego
  {path: 'register', component:RegisterComponent},
  {path: 'login', component:LoginComponent},
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  {path: '**', redirectTo: '/search'}
];