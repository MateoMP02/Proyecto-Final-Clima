import { Component } from '@angular/core';
import { WeatherOverviewComponent } from "../../components/weather-overview/weather-overview.component";

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [WeatherOverviewComponent],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.css'
})
export class OverviewPageComponent {

}
