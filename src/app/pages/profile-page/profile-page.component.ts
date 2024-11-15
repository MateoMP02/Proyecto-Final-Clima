import { Component } from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {

}
