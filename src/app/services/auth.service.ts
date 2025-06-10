import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios/login`, {
      username: email,
      password
    }).pipe(
      tap((response: any) => {
        // Guarda el token o el usuario en localStorage
        localStorage.setItem('user', JSON.stringify(response));
        this.router.navigate(['/dashboard']);
      }),
      catchError(err => {
        console.error('Error de login', err);
        return of(null);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

}
