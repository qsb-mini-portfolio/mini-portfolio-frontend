import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserService } from '../Services/userService';
import  userResponse  from '../Interfaces/userInterface'
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './userPage.html',
  styleUrls: ['./userPage.scss']
})
export class UserPage {
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  user : userResponse | null = null;
  error : string | null = null;

  ngOnInit(): void {
    this.userService.getMyData().subscribe({
      next: (response) => {
        this.user = response;
        this.cdr.markForCheck(); 
      },
      error: () => this.error = "Impossible de récupérer les données utilisateurs"
    });
  }

  showPassword = false;
  twoFactorEnabled = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  saveChanges() {
    console.log('User saved:', this.user);
    alert('Changes saved!');
  }

  disconnect() {
    this.authService.logout();
  }



}
