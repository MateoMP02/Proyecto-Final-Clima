import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../types/user';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  currentUser: User | null = null;
  isEditingCity = false;  // flag
  

  authService = inject(AuthService);
  fb = inject(FormBuilder);

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.residenceCityForm.patchValue({
        residenceCity: this.currentUser.residenceCity
      });
    }
  }

  residenceCityForm = this.fb.nonNullable.group({
    residenceCity: ['', Validators.required]
  });

  toggleEditCity() {
    this.isEditingCity = !this.isEditingCity;
    if (!this.isEditingCity && this.currentUser) {
      this.residenceCityForm.patchValue({
        residenceCity: this.currentUser.residenceCity
      });
    }
  }

  clearSearchHistory() {
    if (this.currentUser) {
      this.currentUser.searchHistory = []; // Vaciar el historial
      this.authService.updateUser(this.currentUser).subscribe({
        next: () => {
          alert('Search history cleared.');
        },
        error: (err) => {
          console.error('Error clearing search history:', err);
          alert('Failed to clear search history.');
        }
      });
    }
  }

  changeResidenceCity() {
    if (this.residenceCityForm.valid && this.currentUser) {
      const newResidenceCity = this.residenceCityForm.get('residenceCity')?.value;
      this.currentUser.residenceCity = newResidenceCity;

      this.authService.updateUser(this.currentUser).subscribe({
        next: () => {
          console.log('Residence city changed successfully');
          alert('Residence city updated!');
          this.toggleEditCity();
        },
        error: (err) => {
          console.error('Error changing residence city:', err);
          alert('Failed to change residence city.');
        }
      });
    }
  }
}
