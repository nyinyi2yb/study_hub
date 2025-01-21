import { Router } from '@angular/router';
import { AuthService } from './../_services/auth.service';
import { TokenStorageService } from './../_services/token-storage.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: any = {
    email: null,
    password: null
  }

  isLoggedIn = false;
  isLoginFailed = false;
  emailMessage = '';
  passwordMessage = ''
  errorMessage = '';

  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router : Router) { }

  ngOnInit(): void {
    const token = this.tokenStorage.getToken();
    if (token) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigate(['/courses-list']);
    }
  }

  onSubmit(): void {

    const { email, password } = this.form;
    
    this.authService.login(email, password)
      .subscribe(data => {
        
        if (data.code == 404 || data.code == 405) {
          this.errorMessage = 'Invalid email or password!'
        }
        else {
          this.errorMessage = ''

          this.tokenStorage.saveToken(data.accessToken);

          // this.tokenStorage.saveRefreshToken(data.refreshToken);

          this.tokenStorage.saveUser(data);

          this.roles = this.tokenStorage.getUser().roles;

          this.isLoggedIn = true;
          this.isLoginFailed = false;
          this.reloadPage();
          
        }
      },
        err => {
          this.errorMessage = err.error.message;
          this.isLoginFailed = true;
        }
      );
  }

  reloadPage(): void {
    window.location.reload();

  }

}
