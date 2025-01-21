import { Router } from '@angular/router';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: any = {
    username: null,
    email: null,
    password: null
  }

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = ''

  emailMessage = '';
  userMessage = '';

  emailError = false;
  usernameError = false;

  constructor(private authService: AuthService, private router : Router) { }

  ngOnInit(): void {
    this.usernameError = false;

    if (!this.form.username) {
      this.usernameError = false;
    }


  }

  onSubmit(): void {
    console.log(this.form);

    const { username, email, password } = this.form;
    
    this.authService.register(username, email, password)
      .subscribe(data => {
        console.log(data);

        if (data.code == 401) {
          this.emailError = false;
          this.usernameError = true;
          this.userMessage = data.message;
        }
        else if (data.code == 402) {
          this.usernameError = false;
          this.emailError = true;
          this.emailMessage = data.message;
        }
        else if (data.code == 207) {
          this.emailError = true;
          this.usernameError = false;
          this.emailMessage = data.message;
        }
        else {
          this.usernameError = false;
          this.emailError = false;
          this.emailMessage = '';

          this.isSignUpFailed = false;

          if (data.code == 106) {
            alert('User was registered successfully');
            this.router.navigate(['/login']);
          }
        }
      }, err => {
        this.errorMessage = err.message;
        this.isSignUpFailed = true;
      })
  }


  
}
