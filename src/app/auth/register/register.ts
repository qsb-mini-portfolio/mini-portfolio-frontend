import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CardModule, InputTextModule, PasswordModule, ButtonModule, MessageModule, RippleModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  loading = signal(false);
  error = signal<string | null>(null);

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
          // res = { ok: true, message: 'User registered successfully' }
          if (res?.ok) {
            // Optionnel: afficher le message puis rediriger
            this.router.navigateByUrl('/login');
          } else {
            this.error.set('Registration failed');
          }
        },
        error: (err) => {
          this.loading.set(false);
          const msg = err?.error?.message || err?.message || 'Registration failed';
          this.error.set(msg);
        },
      });
  }
}
