import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '@auth/interfaces/auth-response.interface';
import { User } from '@auth/interfaces/user.interface';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private _authStatus = signal('checking');

  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));

  private checkStatusCache = new Map<AuthResponse, number>();

  authStatus = computed(() => {
    if (this._authStatus() === 'checking') return 'checking';

    if (this._user()) {
      return 'authenticated';
    }

    return 'not-authenticated';
  });

  user = computed(() => this._user());
  token = computed(() => this._token());

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/login`, {
        email: email,
        password: password,
      })
      .pipe(
        map((resp) => this.loginSuccess(resp)),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  checkStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const resp = this.comprobarCache(token);

    if(resp != false){
      this.loginSuccess(resp);
      return of(true);
    }

    return this.http
      .get<AuthResponse>(`${baseUrl}/auth/check-status`)
      .pipe(
        tap(resp => this.checkStatusCache.set(resp, new Date().getTime() )),
        map((resp) => this.loginSuccess(resp)),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  private comprobarCache(token: string){
    const minutes = 15*60*1000;
    const now = new Date().getTime();

    for(let key of this.checkStatusCache.keys()) {
      if(key.token === token){
        const past = now - this.checkStatusCache.get(key)!
        if(past < minutes) {
          return key;
        }
      }
    }
    return false;
  }




  logout() {
    this._user.set(null);
    this._token.set(null);
    this._authStatus.set('not-authenticated');

    localStorage.removeItem('token');
  }

  private loginSuccess({ token, user }: AuthResponse) {
    this._authStatus.set('authenticated');
    this._user.set(user);
    this._token.set(token);

    localStorage.setItem('token', token);

    return true;
  }



  register(email: string, password: string, fullName: string): Observable<boolean> {
    return this.http
      .post<AuthResponse>(`${baseUrl}/auth/register`, {
        email: email,
        password: password,
        fullName: fullName,
      })
      .pipe(
        map((resp) => this.loginSuccess(resp)),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }
}
