import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {Course} from '../models/course.model';

const API_URL = 'http://localhost:8080/api/courses';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http : HttpClient) { }

  getAll(): Observable<Course[]> {    //find all courses
    return this.http.get<Course[]>(API_URL);
  }

  get(id: any): Observable<Course> {
    return this.http.get(`${API_URL}/${id}`);
  }

  create(data: any): Observable<any> {     //Create new course
    return this.http.post(API_URL, data);
  }

  update(id: any, data: any): Observable<any> {
    return this.http.put(`${API_URL}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${API_URL}/${id}`);
  }

  findByTitle(title : any):Observable<any>{    //find course with title
    return this.http.get(`${API_URL}?title=${title}`);
  }

}
