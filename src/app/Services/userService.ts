import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ROUTES } from '../shared/api/api-routes';
import { API_BASE_URL } from '../core/config/api-base-url.token';
import  userResponse  from '../Interfaces/userInterface'


@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private apiBase = inject(API_BASE_URL);

    getMyData(): Observable<userResponse>{
        return this.http.get<userResponse>(
            `${this.apiBase}${API_ROUTES.user.getMe}`,
        )
    }
}