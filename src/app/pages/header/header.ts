import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AvatarService } from '../../services/global/avatar.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ButtonModule, CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppHeader {
  private router = inject(Router);
  private auth = inject(AuthService);
  avatarService = inject(AvatarService);

  isAuth = this.auth.isAuthenticated;

  userNameLabel: string | null = localStorage.getItem("username")?.replace(/^"|"$/g, '') ?? null;

  hover = false;

  go(url: string) {
    this.router.navigateByUrl(url);
  }

  logout() {
    this.auth.logout();
  }

  redirect() {
    this.router.navigate(['/userPage']);
  }
}
