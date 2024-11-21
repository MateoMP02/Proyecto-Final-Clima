import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:3000/users';


  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.url}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          return users[0]; // User found
        } else {
          return null; // User not found
        }
      }),
      catchError(error => {
        console.error('Login failed', error);
        return throwError(() => new Error('Login failed'));
      })
    );
  }
  

  register(user: User): Observable<User> {
    return this.http.get<User[]>(`${this.url}?email=${user.email}`).pipe( //Un get para verificar que el mail no existe
      switchMap(users => {
        if (users.length > 0) {
          // Si el mail ya existe, lanza un error
          return throwError(() => new Error('This email is already registered.'));
        }
        // Si no existe, hace un post del usuario
        return this.http.post<User>(this.url, user, {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        });
      }),
      catchError((error) => {
        console.error('Registration failed', error);
        return throwError(() => new Error(error.message || 'Registration failed'));
      })
    );
  }

  // Método para obtener el usuario actualmente autenticado
  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.url}/${user.id}`;
    localStorage.setItem('currentUser', JSON.stringify(user)); // Actualiza en localStorage
    return this.http.put<User>(url, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
  deleteUser(user: User): Observable<void> {
    const url = `${this.url}/${user.id}`; // Construye la URL específica para el usuario
    return this.http.delete<void>(url).pipe(
      map(() => {
        // Si el usuario eliminado es el actualmente autenticado, limpia el localStorage
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === user.id) {
          this.logout();
        }
      }),
      catchError(error => {
        console.error('Error deleting user', error);
        return throwError(() => new Error('Error deleting user'));
      })
    );
  }
  logout(): void {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }
}
