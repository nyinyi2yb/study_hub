import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API = 'http://localhost:8080/api/test/';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  checkToken():Observable<any>{
    return this.http.get(API + 'token');
  }

  getPublicContent(): Observable<any> {
    return this.http.get(API + 'all', { responseType: 'text' });
  }

  getAdminBoard(): Observable<any> {
    return this.http.get(API + 'admin');
  }

  getUserBoard(): Observable<any> {
    return this.http.get(API + 'user');
  }
  
  getMyCourses(): Observable<any> {
    return this.http.get(API + 'courses');
  }

  findByTitle(title: any): Observable<any> {    //find course with title
    return this.http.get(`${API}findcourses?title=${title}`);
  }

}
