import {Inject, inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_BASE_URL} from '../../core/config/api-base-url.token';
import {API_ROUTES} from '../../shared/api/api-routes';
import {Router} from '@angular/router';
import {AuthService} from '../../auth/auth.service';
import {UserService} from '../../Services/userService';

@Injectable({providedIn: 'root'})
export class DemoService {
  private readonly http = inject(HttpClient);
  private readonly base = inject(API_BASE_URL);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  startDemo() {
    this.auth.login('demo', 'demoPassword').subscribe(
      {
        next: () => {
          this.userService.getMyData().subscribe({
            next : (user) => {
              localStorage.setItem('username',user.username);
              this.http.get(`${this.base}${API_ROUTES.demo.root}`, { responseType: 'text' })
                .subscribe({
                  next: (token: string) => {
                    localStorage.setItem('auth_token', token?.trim() ?? '');
                    this.router.navigate(['/dashboard']);
                  },
                  error: (err) => {
                    console.error('Demo start failed', err);
                    this.router.navigate(['/dashboard']);
                  }
                });
            }
          });
        }
      }
    )
  }
}
