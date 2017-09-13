import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

import { Subscription } from 'rxjs/Subscription';

import { User } from './user';
import { UserService } from './user.service';

@Component({
    templateUrl: './user-detail-edit.component.html'
})
export class UserDetailEdit implements OnInit, OnDestroy {
    userForm: FormGroup;
    user: User = new User();
    errorMessage: string;
    emailMessage: string;
    private sub: Subscription;

    private validationMessages = {
        required: 'Please enter your email address.',
        pattern: 'Please enter a valid email address.'
    };

    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService
    ) { }

    ngOnInit(): void {
      this.userForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]]
      });

      // Read the user Id from the route parameter
      this.sub = this.route.params.subscribe(
          params => {
              let id = +params['id'];
              this.getUser(id);
          }
      );

     const emailControl = this.userForm.get('email');
      emailControl.valueChanges.debounceTime(1000).subscribe(value =>
          this.setMessage(emailControl));
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    setMessage(c: AbstractControl): void {
        this.emailMessage = '';
        if ((c.touched || c.dirty) && c.errors) {
            this.emailMessage = Object.keys(c.errors).map(key =>
                this.validationMessages[key]).join(' ');
        }
    }

    getUser(id: number): void {
      this.userService.getUser(id)
        .subscribe(
            (user: User) => this.onUserRetrieved(user),
            (error: any) => this.errorMessage = <any>error
        );
    }

    onUserRetrieved(user: User): void {
        if (this.userForm) {
            this.userForm.reset();
        }
        this.user = user;

        if (this.user.id === 0) {
          console.log('Please check, something wrong');
        }

        // Update the data on the form
        this.userForm.patchValue({
            name: this.user.name,
            email: this.user.email
        });
    }

    save():void {
      if (this.userForm.dirty && this.userForm.valid) {
            // Copy the form values over the user object values
            let p = Object.assign({}, this.user, this.userForm.value);

            this.userService.saveUser(p)
                .subscribe(
                    () => this.onSaveComplete(),
                    (error: any) => this.errorMessage = <any>error
                );
        } else if (!this.userForm.dirty) {
            this.onSaveComplete();
        }
    }

    onSaveComplete(): void {
        // Reset the form to clear the flags
        this.userForm.reset();
        this.router.navigate(['/users']);
    }
}
