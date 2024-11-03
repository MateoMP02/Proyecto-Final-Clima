import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-weather-overview',
  standalone: true,
  imports: [],
  templateUrl: './weather-overview.component.html',
  styleUrl: './weather-overview.component.css'
})
export class WeatherOverviewComponent implements OnInit {
  city: string | null = null;
  lat: number | null = null;
  lon: number | null = null;

  route = inject(ActivatedRoute);

  ngOnInit() {
    this.route.queryParams.subscribe(params => { //tuve que hacerlo con queryparams porque me tiraba un error en +params
      this.city = params['city'] || null;
      this.lat = params['lat'] ? +params['lat'] : null;
      this.lon = params['lon'] ? +params['lon'] : null;
      
      // Aca llamar al servicio de clima segun city o lat/lon
    });
  }


}