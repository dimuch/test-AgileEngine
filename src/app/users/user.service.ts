import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { IUser } from './user';

@Injectable()
export class UserService {
    private baseUrl = 'http://jsonplaceholder.typicode.com/';
    constructor(private http: Http) { }

    getUsers(): Observable<IUser[]> {
        return this.http.get(this.baseUrl + 'users')
            .map(this.extractData)
            .do(data => console.log('getUsers: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    getUser(id: number): Observable<IUser> {
        return this.getUsers()
            .map((users: IUser[]) => users.find(p => p.id === id));
    }

    saveUser(user: IUser): Observable<IUser> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        if (user.id === 0) {
          console.log("wrong ID");
          return;
        }
        return this.updateUser(user, options);
    }

    private updateUser(user: IUser, options: RequestOptions): Observable<IUser> {
        const url = `${this.baseUrl}users/${user.id}`;
        return this.http.put(url, user, options)
            .map(() => user)
            .do(data => {
              console.log('update User: ' + JSON.stringify(data));
            })
            .catch(this.handleError);
    }

    private handleError(error: Response): Observable<any> {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }


    private extractData(response: Response) {
      return response.json() || {};
    }

}
