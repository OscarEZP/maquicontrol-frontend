import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = false;

  login(email: string, password: string): boolean {
    if (email === 'oskr@gmail.com' && password === '1234') {
      this.loggedIn = true;
      return true;
    }
    this.loggedIn = false;
    return false;
  }

  logout(): void {
    this.loggedIn = false;
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
