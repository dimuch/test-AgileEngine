import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IUser } from './user';
import { UserService } from './user.service';

@Component({
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  pageTitle: string = 'User Detail';
  errorMessage: string;
  user: IUser;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService) {
  }

  ngOnInit() {
    const id = +this._route.snapshot.paramMap.get('id');
    this.getUser(id);
  }

  getUser(id: number) {
    this._userService.getUser(id).subscribe(
      user => this.user = user,
      error => this.errorMessage = <any>error);
  }

  onBack(): void {
    this._router.navigate(['/users']);
  }

}
