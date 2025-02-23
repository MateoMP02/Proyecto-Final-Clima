import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { CommonModule } from '@angular/common';
import { ForecastItem } from '../../types/forecast.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weatherbyday',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './weatherbyday.component.html',
  styleUrl: './weatherbyday.component.css'
})
export class WeatherbydayComponent implements OnInit {

  date: string = '';
  city: string | null = null;
  lat: number | null = null;
  lon: number | null = null;
  detailedForecasts: ForecastItem[] = []; // Ahora está tipado correctamente

   // Unidad seleccionada para la temperatura (K=Kelvin por defecto)
   unidadSeleccionada: string = 'K';

   // Unidad seleccionada para la velocidad del viento (m/s por defecto)
   unidadSeleccionadaViento: string = 'm/s';
 

  constructor(private route: ActivatedRoute, private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.date = params.get('date') || '';
      this.route.queryParams.subscribe(queryParams => {
        this.city = queryParams['city'] || null;
        this.lat = queryParams['lat'] ? +queryParams['lat'] : null;
        this.lon = queryParams['lon'] ? +queryParams['lon'] : null;
        this.loadForecastForDay();
      });
    });
  }

  loadForecastForDay(): void {
    if (this.city) {
      this.weatherService.getForecastByCity(this.city).subscribe(data => {
        this.detailedForecasts = (data.list as ForecastItem[]).filter((f: ForecastItem) =>
          f.dt_txt.startsWith(this.date)
        );
      });
    } else if (this.lat !== null && this.lon !== null) {
      this.weatherService.getForecastByCoordinates(this.lat, this.lon).subscribe(data => {
        this.detailedForecasts = (data.list as ForecastItem[]).filter((f: ForecastItem) =>
          f.dt_txt.startsWith(this.date)
        );
      });
    }
  }

  getTempConvert(temp: number) {
    // Convierte la temperatura según la unidad seleccionada
    switch (this.unidadSeleccionada) {
      case 'C':
        return (temp - 273.15).toFixed(2) + ' °C';
      case 'F':
        return ((temp - 273.15) * 9 / 5 + 32).toFixed(2) + ' °F';
      default:
        return temp.toFixed(2) + ' °K';
    }
  }

  getSpeedConvert(speed: number) {
    // Convierte la velocidad del viento según la unidad seleccionada
    switch (this.unidadSeleccionadaViento) {
      case 'm/s':
        return speed.toFixed(2) + 'm/s';
      case 'km/h':
        return (speed * 3.6).toFixed(2) + ' km/h';
      default:
        return speed.toFixed(2) + 'm/s';
    }
  }
}
