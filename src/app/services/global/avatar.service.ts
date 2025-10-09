import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AvatarService {
  private readonly avatarBasePath = 'assets/images';
  private readonly defaultAvatar = 'default-avatar';

  avatar = signal<string | null>("");

  profileUrl = computed(() => {
    const name = this.avatar() || this.defaultAvatar;
    return `${this.avatarBasePath}/${name}.jpg`;
  });

  avatars: string[] = ['default-avatar', 'cat', 'dog', 'smily', 'vanGogh', 'qsb'];

  getAvatars() {
    return this.avatars;
  }

  setAvatar(avatar: string) {
    this.avatar.set(avatar); 
  }

  resetAvatar() {
    this.setAvatar(this.defaultAvatar);
  }
}
