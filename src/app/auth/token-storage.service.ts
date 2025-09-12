import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TokenStorage {
    private key = 'access_token';

    get token(): string | null { return localStorage.getItem(this.key);}
    setToken(token: string) { localStorage.setItem(this.key, token); }
    clear() { localStorage.removeItem(this.key); }
}