import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  private url = 'http://localhost:3000/users';

  register(username: string, password: string, email:string,residenceCity:string): Observable<User> {
    const user: User = {
      username,
      password,
      email,
      residenceCity, //Los inicializo vacios
      searchHistory: []  //Los inicializo vacios
    };

    return this.http.post<User>(`${this.url}`, user);
  }

  
}
