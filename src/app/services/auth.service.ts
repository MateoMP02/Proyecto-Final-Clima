import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, switchMap, throwError } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // URL base para las solicitudes de usuarios
  private url = 'http://localhost:3000/users';

  // Método para iniciar sesión con email y contraseña
  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.url}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length > 0) {
          return users[0]; // Si se encuentra un usuario, se devuelve el primer usuario encontrado
        } else {
          return null; // Si no se encuentra el usuario, se retorna null
        }
      }),
      catchError(error => {
        console.error('Login failed', error); 
        return throwError(() => new Error('Login failed')); 
      })
    );
  }

  // Método para registrar un nuevo usuario
  register(user: User): Observable<User> {
    return this.http.get<User[]>(`${this.url}?email=${user.email}`).pipe( // Verifica si el email ya está registrado
      switchMap(users => {
        if (users.length > 0) {
          // Si el email ya existe, lanza un error
          return throwError(() => new Error('This email is already registered.'));
        }
        // Si no existe, crea un nuevo usuario con el método POST
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

  // Método para obtener el usuario actualmente autenticado desde el localStorage
  getCurrentUser(): User | null {
    const user = localStorage.getItem('currentUser'); // Obtiene el usuario del localStorage
    return user ? JSON.parse(user) : null; 
  }

  // Método para actualizar los datos de un usuario
  updateUser(user: User): Observable<User> {
    const url = `${this.url}/${user.id}`; // Construye la URL con el id del usuario para la actualización
    localStorage.setItem('currentUser', JSON.stringify(user)); // Actualiza los datos del usuario en el localStorage
    return this.http.put<User>(url, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  // Método para eliminar un usuario
  deleteUser(user: User): Observable<void> {
    const url = `${this.url}/${user.id}`; // Construye la URL para la eliminación del usuario
    return this.http.delete<void>(url).pipe(
      map(() => {
        // Si el usuario eliminado es el actualmente autenticado, limpia el localStorage
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === user.id) {
          this.logout(); // Cierra sesión si el usuario eliminado es el actual
        }
      }),
      catchError(error => {
        console.error('Error deleting user', error);
        return throwError(() => new Error('Error deleting user')); 
      })
    );
  }

  // Método para cerrar sesión (eliminar al usuario del localStorage)
  logout(): void {
    localStorage.removeItem('currentUser'); // Elimina el usuario del localStorage
  }

  // Método para verificar si hay un usuario actualmente autenticado
  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null; // Verifica si el usuario está almacenado en localStorage
  }
}
