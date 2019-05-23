import { Injectable } from '@angular/core';

@Injectable()
export class TokenHelperService {

    private readonly tokenName: string = 'tokenData';

    constructor() { }

    public setToken(token: any): void {
        localStorage.setItem(this.tokenName, JSON.stringify(token));
    }

    public getToken(): string {
        return localStorage.getItem(this.tokenName);
    }

    public removeToken(): void {
        localStorage.removeItem(this.tokenName);
    }

    public isTokenExpired(): boolean {
        const token = this.getToken();
        // TODO: extract expiration Date from token and compare it to Date.now() to return the corrent boolean value
        return !!token;
    }



}
