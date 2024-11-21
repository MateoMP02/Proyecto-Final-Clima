import { Component, inject, OnInit } from '@angular/core';
import { LocationSearchComponent } from "../../components/location-search/location-search.component";
import { ResidenceMapComponent } from "../../components/maps/residence-map/residence-map.component";
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [LocationSearchComponent, ResidenceMapComponent,CommonModule],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit{

  currentUser: User | null = null; // Usuario actual

  private authService = inject(AuthService); // Servicio de autenticación

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }
}
