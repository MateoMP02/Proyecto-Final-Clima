import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { authGuard } from './auth.guard';
import { GlossaryPageComponent } from './pages/glossary-page/glossary-page.component';
import { OverviewPageComponent } from './pages/overview-page/overview-page.component';
import { ForecastPageComponent } from './pages/forecast-page/forecast-page.component';

export const routes: Routes = [
  {path: 'search', component: HomePageComponent },
  {path: 'overview', component: OverviewPageComponent },
  {path: 'register', component:RegisterPageComponent},
  {path: 'login', component:LoginPageComponent},
  {path: 'glossary', component:GlossaryPageComponent},
  {path: 'profile', component:ProfilePageComponent, canActivate:[authGuard]}, // Si no esta logeado no puede ir a /profile
  { path: 'weatherbyday/:date', component: ForecastPageComponent },
  {path: '', redirectTo: '/search', pathMatch: 'full' },
  {path: '**', redirectTo: '/search'}
];