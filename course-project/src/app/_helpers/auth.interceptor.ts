import { TokenStorageService } from './../_services/token-storage.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'x-access-token';

@Injectable()


export class AuthInterceptor implements HttpInterceptor {

    constructor(private tokenStorage: TokenStorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let authReq = req;
        const token = this.tokenStorage.getToken();
        if (token != null) {
            authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
        }
        return next.handle(authReq);
    }
    
}

export const AuthInterceptorProvider =[
    {provide : HTTP_INTERCEPTORS , useClass : AuthInterceptor , multi : true}
];