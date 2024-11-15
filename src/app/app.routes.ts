import { Routes } from '@angular/router';
import { WeatherOverviewComponent } from './components/weather-overview/weather-overview.component';
import { WeatherDetailComponent } from './components/weather-detail/weather-detail.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {path: 'search', component: HomePageComponent },
  {path: 'overview', component: WeatherOverviewComponent },
  {path: 'detail/:date', component: WeatherDetailComponent }, // Revisar luego
  {path: 'register', component:RegisterPageComponent},
  {path: 'login', component:LoginPageComponent},
  {path: 'profile', component:ProfilePageComponent, canActivate:[authGuard]}, // Si no esta logeado no puede ir a /profile
  {path: '', redirectTo: '/search', pathMatch: 'full' },
  {path: '**', redirectTo: '/search'}
];