import { Component } from '@angular/core';

@Component({
  selector: 'app-user-page',
  templateUrl: './userPage.html',
  styleUrls: ['./userPage.scss']
})
export class UserPage {
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: '********'
  };

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
    alert('You have been disconnected.');
  }

  toggle2FA() {
    alert(`Two-Factor Authentication is now ${this.twoFactorEnabled ? 'enabled' : 'disabled'}`);
  }

  deactivateAccount() {
    if (confirm('Are you sure you want to deactivate your account?')) {
      alert('Account deactivated.');
    }
  }
}
