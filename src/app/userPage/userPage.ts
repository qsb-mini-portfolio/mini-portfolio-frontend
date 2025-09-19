import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { UserService } from '../Services/userService';
import  userResponse  from '../Interfaces/userInterface'
import { ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';


@Component({
  selector: 'app-user-page',
    imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    RippleModule,
  ],
  templateUrl: './userPage.html',
  styleUrls: ['./userPage.scss']
})
export class UserPage {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.minLength(3)]],
  });
  user : userResponse | null = null;
  error : string | null = null;

  email: string = '';

  ngOnInit(): void {
    this.userService.getMyData().subscribe({
      next: (response) => {
        this.user = response;
        console.log(response);
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
    const newEmail = this.form.value.email;
    if (newEmail && newEmail != ""){
      console.log(newEmail)
      this.userService.changeEmail(newEmail).subscribe({
        next: (res) => {
          alert("Email changé avec succès !");
        }});
      }
   
  }

  disconnect() {
    this.authService.logout();
  }



}
