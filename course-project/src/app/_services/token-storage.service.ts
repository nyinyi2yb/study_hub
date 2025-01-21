import { Injectable } from '@angular/core';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'user-user';
// const RETOKEN_KEY = 'auth-retoken';
@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  constructor() { }

  signOut(): void {
    window.localStorage.clear();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  // public saveRefreshToken(retoken: string): void {
  //   window.localStorage.removeItem(RETOKEN_KEY);
  //   window.localStorage.setItem(RETOKEN_KEY, retoken);
  // }

  // public getRefreshToken(): string | null {
  //   return window.localStorage.getItem(RETOKEN_KEY);
  // }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

}
