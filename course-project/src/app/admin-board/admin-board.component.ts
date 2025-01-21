import { TokenStorageService } from './../_services/token-storage.service';
import { UserService } from './../_services/user.service';
import { AuthService } from './../_services/auth.service';
import { Component, OnInit } from '@angular/core';

import jwtDecode from 'jwt-decode';


@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.css']
})
export class AdminBoardComponent implements OnInit {

  userData: any;

  username: any;

  requestToken: any;

  tokenId: any;
  rolesData: any;
  userId: any;
  role: any;

  uname:any;

  constructor(private authService: AuthService, private userService: UserService, private tokenStorage: TokenStorageService) { }

  url = "./assets/smiling-asian-girl-waching-webinar-having-work-video-call-from-home-working-freelance-remotely-looki.jpg";

  ngOnInit(): void {

    this.requestToken = this.tokenStorage.getToken();

    this.tokenId = jwtDecode(this.requestToken);
    this.userId = this.tokenStorage.getUser().id;
    this.role = this.tokenStorage.getUser().roles;

    const username = this.tokenStorage.getUser().username;
    this.uname = username.charAt(0).toUpperCase();

    if (this.tokenId.id == this.userId) {

      if (this.role.includes('ROLE_ADMIN')) {
        this.getData();
      }
    }
  }

  getData() {
    this.userService.getAdminBoard().subscribe(res => {
      this.rolesData = res.data;
      this.getUserRoles();
    },
      err => {
        console.log(err);
      })
  }

  getRoles(role: any) {
    this.userData = this.rolesData.filter((data: any) => {
      return data.roles[0].name == role;
    })
    return this.userData;
  }

  getUserRoles() {
    this.getRoles('user');
    document.querySelector('.user-btn')?.classList.add('active-btn');
    document.querySelector('.admin-btn')?.classList.remove('active-btn');
  }

  getAdminRoles() {
    this.getRoles('admin');
    document.querySelector('.user-btn')?.classList.remove('active-btn');
    document.querySelector('.admin-btn')?.classList.add('active-btn');
  }

  changeRole(user: any) {
    this.authService.changeRole(user.id).subscribe(res => {
      this.getData();
    },
      err => {
        console.log(err);
      })
  }

  searchUserData() {

    if (this.tokenId.id == this.userId) {

      if (this.role.includes('ROLE_ADMIN')) {

        this.authService.getUsername(this.username).subscribe(res => {
          console.log(res);

          if (res.code == 207 || res.code == 208) {
            this.userData = null;
          }
          else {
            this.userData = res.data;
          }
        },
          err => {
            console.log('ERROR ', err);
          })
      }

    }

  }
  closeSearchBtn() {
    this.getRoles('user');
    this.username = '';
  }

}
