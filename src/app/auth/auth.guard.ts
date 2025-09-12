import { inject } from "@angular/core"
import { TokenStorage } from "./token-storage.service";
import { CanMatchFn, Router } from "@angular/router";


export const authGuard: CanMatchFn = () => {
    const token = inject(TokenStorage).token;
    const router = inject(Router);
    return token ? true : router.parseUrl('/login');
};