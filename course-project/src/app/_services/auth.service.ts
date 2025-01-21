import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signin', {
      email,
      password
    },
      httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'signup', {
      username,
      email,
      password
    },
      httpOptions);
  }

  refreshAccessToken(refreshToken: string): Observable<any> {
    return this.http.post(AUTH_API + 'refreshtoken', { refreshToken }, httpOptions);
  }

  changeRole(id: any): Observable<any> {
    return this.http.get(`${AUTH_API}${id}`, httpOptions);
  }

  getUsername(username: string): Observable<any> {
    return this.http.get(`${AUTH_API}?username=${username}`, httpOptions);
  }
  updateUser(id: any, data: any): Observable<any> {
    return this.http.put(`${AUTH_API}${id}`, data, httpOptions);
  }




}
