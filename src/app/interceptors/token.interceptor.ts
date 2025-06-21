import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req;
    if (!req.url.includes('public-details')) {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          const token = user?.token || user?.accessToken || user?.access_token;
          if (token) {
            request = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
        } catch (e) {
          // Parsing failed, continue without token
        }
      }
    }

    this.loadingService.show();
    return next.handle(request).pipe(finalize(() => this.loadingService.hide()));
  }
}
