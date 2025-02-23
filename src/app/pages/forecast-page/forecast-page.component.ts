import { Component } from '@angular/core';
import { WeatherbydayComponent } from '../../components/weatherbyday/weatherbyday.component';

@Component({
  selector: 'app-forecast-page',
  standalone: true,
  imports: [WeatherbydayComponent],
  templateUrl: './forecast-page.component.html',
  styleUrl: './forecast-page.component.css'
})
export class ForecastPageComponent {

}
