// src/app/interceptors/auth.interceptor.ts or src/app/services/auth.interceptor.ts

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service'; // Adjust path if necessary

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken(); // Retrieve the token from AuthService

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`) // Add token to the request headers
      });
      return next.handle(cloned);
    }

    return next.handle(req); // If no token, proceed without modification
  }
}
