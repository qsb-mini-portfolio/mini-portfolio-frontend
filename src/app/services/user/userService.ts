import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ROUTES } from '../../utils/api-routes';
import { API_BASE_URL } from '../../core/config/api-base-url.token';
import { FavoriteStockResponse } from '../../models/stock/favoriteStockResponse';
import { UserResponse } from '../../models/user/UserResponse';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private apiBase = inject(API_BASE_URL);

    getMyData(): Observable<UserResponse>{
        return this.http.get<UserResponse>(
            `${this.apiBase}${API_ROUTES.user.getMe}`,
        )
    }

    changeEmail(newEmail : string): Observable<UserResponse>{
        return this.http.put<UserResponse>(
            `${this.apiBase}${API_ROUTES.user.changeEmail}`,
            { email : newEmail}
        );
    }

    getFavoriteStock(): Observable<FavoriteStockResponse>{
        return this.http.get<FavoriteStockResponse>(
            `${this.apiBase}${API_ROUTES.user.favoriteStock}`,
        )
    }

    addFavoriteStock(symbol : string): Observable<FavoriteStockResponse>{
        return this.http.post<FavoriteStockResponse>(
            `${this.apiBase}${API_ROUTES.user.favoriteStock}` ,
            {stockSymbol : symbol},
        )
    }

    deleteFavoriteStock(symbol : string): Observable<FavoriteStockResponse>{
        return this.http.delete<FavoriteStockResponse>(
            `${this.apiBase}${API_ROUTES.user.favoriteStock}`,
              {body : {stockSymbol : symbol}}
        )
    }
}