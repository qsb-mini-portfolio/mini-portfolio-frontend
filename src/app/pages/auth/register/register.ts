import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth/auth.service';
import { Utils } from '../../../utils/utils';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, InputTextModule, PasswordModule, ButtonModule, MessageModule, RippleModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toastr = inject(ToastrService);

  loading = signal(false);
  error = signal<string | null>(null);
  checkPassword = signal<string | null>(null);

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  submit() {
    if (this.form.invalid || this.loading()) return;
    this.error.set(null);
    this.loading.set(true);

    const { username, password } = this.form.getRawValue();
    this.authService
      .register({ username: username!, password: password! })
      .subscribe({
        next: (res) => {
          this.loading.set(false);
          if (res?.ok) {
            this.router.navigateByUrl('/login');
          } else {
            this.error.set('Registration failed');
          }
        },
      error: (e) => {
        this.loading.set(false);
        if (e.status === 400 && e.error?.errors) {
          const errors = e.error.errors;
        if (errors.password) {
          this.checkPassword.set(errors.password);
        }
        } else {
          this.error.set('Registration failed');
        }
      }
    });
  }
}
