import { Injectable } from '@angular/core';
import { User } from './user.model';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loginForm: User;

  constructor(
    private apollo: Apollo,
    private router: Router
  ) { }

  login(userName: string, password: string): Observable<any> {
    const login = gql`
    mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        id
        username
        token
      }
    }
  `;
    return this.apollo.mutate({
      mutation: login,
      variables: {
        username: userName,
        password
      }
    });
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  logout() {
    localStorage.removeItem('token');
    this.apollo.getClient().resetStore();
    this.router.navigate(['login']);
  }


}
