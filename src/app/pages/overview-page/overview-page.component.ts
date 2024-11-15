import { Component } from '@angular/core';
import { WeatherOverviewComponent } from "../../components/weather-overview/weather-overview.component";
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [WeatherOverviewComponent,FooterComponent],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.css'
})
export class OverviewPageComponent {

}
