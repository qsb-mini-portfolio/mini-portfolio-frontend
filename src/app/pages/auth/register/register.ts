
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

declare var grecaptcha: any;
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    MessageModule,
    RippleModule
  ],
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

  this.loading.set(true);

  grecaptcha.ready(() => {
    grecaptcha.execute('6LeiSuUrAAAAAEEwMwM4XEVMyPZAQcVfZp6KZZca', { action: 'register' }).then((token: string) => {
      const { username, password } = this.form.getRawValue();

      this.authService.register({
        username: username!,
        password: password!,
        recaptcha: token
      }).subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          this.loading.set(false);
          this.toastr.error('Register error');
          console.error(err);
        }
      });
    });
  });
}

}
