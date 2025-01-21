import { UserService } from './../../_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/_services/course.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';


import jwt_decode from 'jwt-decode';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {

  courses: any;

  tokenExist = false;
  email: any;

  uname: any;

  username: any;

  courseList?: Course[];

  currentCourse?: Course = {};

  title: any;

  role: any;

  userId: any;
  isSubmitted = false;
  loggedInRole = false;
  message = ''
  userData: any;

  decodedId: any;
  token: any;

  profileImage: any;
  activeItem = false;

  defaultCoursePage = false;

  constructor(
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.userService.checkToken().subscribe(res => {
      console.log(res);

      if (res.code == 400) {
        console.log('400');
        alert('Access token was expired!');
        this.logOut();
        this.router.navigate(['/home']);
      }
      else{

      }
    },
      err => {
        console.log(err);
      })


    this.tokenExist = !!this.tokenStorage.getToken();

    if (this.tokenExist) { //if token exist true

      this.token = this.tokenStorage.getToken();
      this.decodedId = jwt_decode(this.token);
   
      this.role = this.tokenStorage.getUser().roles;
      this.userId = this.tokenStorage.getUser().id;

      this.profileImage = this.tokenStorage.getUser().profileImage;
      this.username = this.tokenStorage.getUser().username;
      this.uname = this.username.charAt(0).toUpperCase();

      if (this.decodedId.id == this.userId) {
        this.getCourses();
      }
    }

    else {
      console.log('token does not exist!');
      this.router.navigate(['/home']);
    }
  }

  logOut() {
    this.tokenStorage.signOut();
    window.location.reload();
  }

  getCourses(): void {
    this.userService.getMyCourses().subscribe(res => {

      // if (res.code == 400) {
      //   alert('Token was expired!');
      //   this.logOut();
      //   this.router.navigate(['/home']);
      // }

      if (res.userData) {
        this.courses = res.userData;
        this.defaultCoursePage = false;

      }
      else {
        this.courses = res.data;
        this.loggedInRole = true;
        this.defaultCoursePage = false;

      }

      if(this.courses.length == 0){
        console.log('length 0 ');
        this.defaultCoursePage = true;
      }

    },
      err => {
        console.log(err);
      }
    );
  }


  searchCourse(): void {  //Search course

    this.token = this.tokenStorage.getToken();
    this.decodedId = jwt_decode(this.token);

    if (this.decodedId.id == this.userId) {

      this.userService.findByTitle(this.title).subscribe(res => {

        if (res.code == 202 || res.code == 203) {
          this.courses = null;
        }
        else if (res.userData) {
          this.courses = res.userData;
        }
        else {
          this.courses = res.data;
        }

      },
        err => {
          console.log(err);
        })

    }

  }

  closeSearchCourse() {
    window.location.reload();
  }

  getCoursePage() {
    
    this.activeItem = true;

    document.querySelector('.show-course')?.classList.add('active-item');
    document.querySelector('.show-user')?.classList.remove('active-item');
    document.querySelector('.show-profile')?.classList.remove('active-item');

    document.querySelector('.course-list')?.classList.remove('d-none');
    document.querySelector('.user-list')?.classList.add('d-none');
    document.querySelector('.profile-page')?.classList.add('d-none');

  }

  getUserPage() {
    document.querySelector('.show-course')?.classList.remove('active-item');
    document.querySelector('.show-user')?.classList.add('active-item');
    document.querySelector('.show-profile')?.classList.remove('active-item');

    document.querySelector('.course-list')?.classList.add('d-none');
    document.querySelector('.user-list')?.classList.remove('d-none');
    document.querySelector('.profile-page')?.classList.add('d-none');

  }

  getProfilePage() {
    document.querySelector('.show-course')?.classList.remove('active-item');
    document.querySelector('.show-user')?.classList.remove('active-item');
    document.querySelector('.show-profile')?.classList.add('active-item');

    document.querySelector('.course-list')?.classList.add('d-none');
    document.querySelector('.user-list')?.classList.add('d-none');
    document.querySelector('.profile-page')?.classList.remove('d-none');

  }

  updateProfile() {
    console.log(this.userData);
  }


  refreshContent(){
    window.location.reload();
  }
}


