import { Component} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})




export class AppComponent {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Verificar si la geolocalización está disponible en el navegador
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Obtener las coordenadas del usuario
          const coords = position.coords;
          const lat = coords.latitude;
          const lon = coords.longitude;
          
          
          // Navegar hacia la página de weather-overview con los parámetros de latitud y longitud
          this.router.navigate(['/overview'], {
            queryParams: { lat: lat, lon: lon }
          });
        },
        (error) => {
          // Manejar posibles errores de geolocalización
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.log('El usuario ha denegado el acceso a la ubicación.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.log('La ubicación no está disponible.');
              break;
            case error.TIMEOUT:
              console.log('La solicitud de geolocalización ha superado el tiempo de espera.');
              break;
          }
        }
      );
    } else {
      alert('Tu navegador no soporta la geolocalización.');
    }
  }
}


