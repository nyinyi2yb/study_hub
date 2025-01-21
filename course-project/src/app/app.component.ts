import { UserService } from './_services/user.service';
import { TokenStorageService } from './_services/token-storage.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = '';

  private roles: string[] = [];

  isLoggedIn = false;
  showAdminBoard = false;
  username?: string;
  email?: string;

  showUserBoard = false;
  profileImage :any;
  uname :any;

  constructor(private tokenStorage: TokenStorageService, private userService: UserService) { }

  ngOnInit(): void {

    this.userService.checkToken().subscribe(res =>{
      console.log(res);

      if(res.code == 400){
        console.log('400');
        this.LogOut();
      }
    },
    err =>{
      console.log(err);
    })

    this.isLoggedIn = !!this.tokenStorage.getToken();

    if (this.isLoggedIn) {
      
      const user = this.tokenStorage.getUser();
      const name = user.username;
      this.uname = name.charAt(0).toUpperCase();

      this.username =name;
      this.email = this.tokenStorage.getUser().email;
      this.roles = user.roles;

      this.profileImage = this.tokenStorage.getUser().profileImage;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showUserBoard = this.roles.includes('ROLE_USER');
    }
    else {
      console.log('No token!');
    }
  }

  LogOut(): void {
    this.tokenStorage.signOut();
    window.location.reload();
  }
}
