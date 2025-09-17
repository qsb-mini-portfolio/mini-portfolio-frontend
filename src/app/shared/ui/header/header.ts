
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../auth/auth.service';
import {ChangeDetectionStrategy, Component, inject} from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private router = inject(Router);
  private auth = inject(AuthService);

  isAuth = this.auth.isAuthenticated;

  go(url: string) {
    this.router.navigateByUrl(url);
  }

  logout() {
    this.auth.logout();
  }
}
