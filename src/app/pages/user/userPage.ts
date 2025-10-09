import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user/userService';
import { ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../../services/auth/auth.service';
import { UserResponse } from '../../models/user/UserResponse';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import {DialogModule} from 'primeng/dialog';

@Component({
  selector: 'app-user-page',
    imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    MessageModule,
    DialogModule,
    RippleModule,
    CommonModule
  ],
  templateUrl: './userPage.html',
  styleUrls: ['./userPage.scss']
})
export class UserPage {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);
  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.minLength(3)]],
  });
  user : UserResponse | null = null;
  error : string | null = null;

  email: string = '';

ngOnInit(): void {
  this.userService.getMyData().subscribe({
    next: (response) => {
      this.user = response;

      if (this.user.profilePicture) {
        this.profileUrl = `assets/images/${this.user.profilePicture}.jpg`;
      } else {
        this.profileUrl = this.temp;
      }

      this.cdr.markForCheck();
    },
    error: () => {
      this.error = "Impossible de récupérer les données utilisateurs";
      this.profileUrl = this.temp; 
    }
  });
}


  showPassword = false;
  twoFactorEnabled = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  saveChanges() {
    let newEmail = this.form.value.email;
    if (!newEmail) { newEmail = this.user?.email;}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (newEmail && emailRegex.test(newEmail)) {
      this.userService.changeEmail(newEmail).subscribe({
        next: (res) => {
          this.toastr.success("Email changé avec succès !", "Succès:");
        },
        error: () => {
          this.toastr.error("Une erreur est survenue", "Erreur:");
        }
      });
    } else {
      this.toastr.warning("Veuillez entrer une adresse email valide", "Attention:");
    }
  }

  disconnect() {
      this.authService.logout();
    }

  // USER PICTURER : 
  hover = false;
  temp = './assets/images/default-avatar.jpg';
  profileUrl: String = this.temp;
  showModal = false;
  toggleModal() {
    this.showModal = !this.showModal;
  }

  avatars: string[] = [
    './assets/images/default-avatar.jpg',
    './assets/images/cat.jpg',
    './assets/images/dog.jpf',
    './assets/images/smily.jpg',
    './assets/images/vanGogh.jpg',
    './assets/images/Joconde.jpg'

  ];
  avatarNames: string[] = ['default-avatar', 'cat', 'dog', 'smily', 'vanGogh', 'Joconde'];

  selectAvatar(avatarName: string) {
    this.profileUrl = `assets/images/${avatarName}.jpg`; 
    this.toggleModal();

    this.userService.changeProfilePicture(avatarName).subscribe({
      next: () => this.toastr.success("Avatar changé avec succès !", "Succès:"),
      error: () => this.toastr.error("Une erreur est survenue", "Erreur:")
    });
  }
}
