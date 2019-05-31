import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
    

    constructor( 
        private router: Router,
        private authService: AuthService  ) { }

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean | Observable<boolean> | Promise<boolean> {
        return this.checkLoggedIn();
    }

    private checkLoggedIn(): boolean {
        if ( this.authService.isLoggedIn() ) return true;
        
        this.router.navigate(['/login']);
        return false;
    }

}