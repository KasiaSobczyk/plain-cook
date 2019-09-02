import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, ResponsePayload } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  loginMode = true;
  isLoading = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<ResponsePayload>;

    this.isLoading = true;
    if (this.loginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }
    form.reset();

    authObs.subscribe(res => {
      this.isLoading = false;
      this.router.navigate(['/recipes']);
    }, err => {
      this.error = err;
      this.isLoading = false;
    });
  }

  onCloseAlert() {
    this.error = null;
  }
}
