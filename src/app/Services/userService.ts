import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ROUTES } from '../shared/api/api-routes';
import { API_BASE_URL } from '../core/config/api-base-url.token';

interface UserResponse {
    username : string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private apiBase = inject(API_BASE_URL);

    getMyData(): Observable<UserResponse>{

        return this.http.get<UserResponse>(
            `${this.apiBase}${API_ROUTES.user.getMe}`,
        )
    }
}