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
import { AvatarService } from '../../services/global/avatar.service';

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
  avatarService = inject(AvatarService)
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
  this.avatarNames = this.avatarService.getAvatars();
  this.userService.getMyData().subscribe({
    next: (response) => {
      this.user = response;
      this.profileUrl = `assets/images/${this.user.profilePicture}.jpg`;
      this.cdr.markForCheck();
    },
    error: () => {
      this.error = "Impossible de récupérer les données utilisateurs";
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

  // USER PROFILE : 
  hover = false;
  profileUrl: String = "" ;
  showModal = false;
  toggleModal() {
    this.showModal = !this.showModal;
  }

  avatarNames: string[] = [];
  selectAvatar(avatarName: string) {
    this.toggleModal();
    this.userService.changeProfilePicture(avatarName).subscribe({
      next: () => {
        this.toastr.success("Avatar changé avec succès !", "Succès:"),
        this.avatarService.setAvatar(avatarName);
      },
      error: () => this.toastr.error("Une erreur est survenue", "Erreur:")
    });
  }
}
