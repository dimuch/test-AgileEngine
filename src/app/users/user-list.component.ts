import { Component, OnInit } from '@angular/core';

import { IUser } from './user';
import { UserService } from './user.service';

@Component({
    templateUrl: './user-list.component.html',
    styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  pageTitle: string = 'User List';
    errorMessage: string;

    _listFilter: string;
    get listFilter(): string {
        return this._listFilter;
    }
    set listFilter(value: string) {
        this._listFilter = value;
        this.filteredUsers = this.listFilter ? this.performFilter(this.listFilter) : this.users;
    }

    filteredUsers: IUser[];
    users: IUser[] = [];

    constructor(private _userService: UserService) {

    }

    performFilter(filterBy: string): IUser[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.users.filter((user: IUser) =>
              user.name.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    ngOnInit(): void {
        this._userService.getUsers()
                .subscribe(users => {
                    this.users = users;
                    this.filteredUsers = this.users;
                },
                    error => this.errorMessage = <any>error);
    }
}
