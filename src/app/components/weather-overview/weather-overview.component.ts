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
    this.route.queryParams.subscribe(params => {
      this.city = params['city'] || null;
      this.lat = params['lat'] ? +params['lat'] : null;
      this.lon = params['lon'] ? +params['lon'] : null;

      if (this.lat !== null && this.lon !== null) {
        this.weatherService.getWeatherByCoordinates(this.lat, this.lon).subscribe(data => {
          this.weatherData = data;
        });

        this.weatherService.getForecastByCoordinates(this.lat, this.lon).subscribe(data => {
          this.forecastData = this.getDailyForecast(data.list);
        });
      } else if (this.city) {
        this.weatherService.getWeatherByCity(this.city).subscribe(data => {
          this.weatherData = data;
        });

        this.weatherService.getForecastByCity(this.city).subscribe(data => {
          this.forecastData = this.getDailyForecast(data.list);
        });
      }
    });
  }

  // Filtra el pronóstico para obtener solo un dato por día
  getDailyForecast(forecastList: any[]): any[] {
    const dailyForecast = forecastList.reduce((acc, curr) => {
      const date = new Date(curr.dt_txt).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
      if (!acc.find((item: any) => item.date === date)) {
        acc.push({ ...curr, date });
      }
      return acc;
    }, []);
    return dailyForecast;
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
