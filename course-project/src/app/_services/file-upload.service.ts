import { Observable } from 'rxjs';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

 private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData;

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploadresizefile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles():Observable<any>{
    return this.http.get(`${this.baseUrl}/files`);
  }

  getSelectedFile(file :any):Observable<any>{
    return this.http.get(`${this.baseUrl}/uploadedFiles/${file}`);
  }

  removeFile(file:any):Observable<any>{
    return this.http.delete(`${this.baseUrl}/removefile/${file}`);
  }


}
