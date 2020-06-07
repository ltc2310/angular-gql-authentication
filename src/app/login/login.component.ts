import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { NgForm } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public service: UserService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.service.loginForm = {
      userName: '',
      password: ''
    };
  }

  onSubmit(form: NgForm) {
    const user = { ...form.value }
    if (form.value.userName && form.value.password) {
      this.login(user.userName, user.password);
    }
  }

  login(userName: string, password: string) {
    this.spinner.show();
    this.service.login(userName, password).subscribe(result => {
      if (result.data) {
        const token = result.data.login.token;
        localStorage.setItem('token', token);
        this.spinner.hide();
        this.router.navigate(['/courses']);
      }
    }, (error) => {
      this.alertService.danger(`Fail to add course ${error.message}`);
      this.spinner.show();
    });
  }


}
