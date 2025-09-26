import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_ROUTES } from '../../shared/api/api-routes';
import { API_BASE_URL } from '../../core/config/api-base-url.token';
import  userResponse  from '../../Interfaces/userInterface';
import {stockResponse, favoriteStockResponse} from '../../Interfaces/stockInterface';

@Injectable({ providedIn: 'root' })
export class UserService {
    private http = inject(HttpClient);
    private apiBase = inject(API_BASE_URL);

    getMyData(): Observable<userResponse>{
        return this.http.get<userResponse>(
            `${this.apiBase}${API_ROUTES.user.getMe}`,
        )
    }

    changeEmail(newEmail : string): Observable<userResponse>{
        return this.http.put<userResponse>(
            `${this.apiBase}${API_ROUTES.user.changeEmail}`,
            { email : newEmail}
        );
    }

    getFavoriteStock(): Observable<favoriteStockResponse>{
        return this.http.get<favoriteStockResponse>(
            `${this.apiBase}${API_ROUTES.user.favoriteStock}`,
        )
    }

    addFavoriteStock(symbol : string): Observable<favoriteStockResponse>{
        return this.http.post<favoriteStockResponse>(
            `${this.apiBase}${API_ROUTES.user.favoriteStock}` ,
            {stockSymbol : symbol},
        )
    }

    deleteFavoriteStock(symbol : string): Observable<favoriteStockResponse>{
        return this.http.delete<favoriteStockResponse>(
            `${this.apiBase}${API_ROUTES.user.favoriteStock}`,
              {body : {stockSymbol : symbol}}
        )
    }
}