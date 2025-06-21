import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _loading$ = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading$.asObservable();
  private requests = 0;

  show(): void {
    this.requests++;
    if (this.requests === 1) {
      this._loading$.next(true);
    }
  }

  hide(): void {
    if (this.requests > 0) {
      this.requests--;
    }
    if (this.requests === 0) {
      this._loading$.next(false);
    }
  }
}
