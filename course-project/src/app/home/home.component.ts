import { AuthService } from './../_services/auth.service';
import { CourseService } from 'src/app/_services/course.service';
import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  content?: string;
  allCourses: any;
  title: any;
  whiteSpace = false;

  constructor(private userService: UserService, private courseService: CourseService, private authService: AuthService) { }

  ngOnInit(): void {

    this.userService.getPublicContent().subscribe(
      data => {
        this.content = data;
        this.getCourse();
      },
      err => {
        this.content = JSON.parse(err.error).message;
      }
    )
  }

  getCourse(): void {

    this.courseService.getAll()
      .subscribe(data => {
        const newArray = Object.values(data);
        this.allCourses = newArray[2];
        console.log(this.allCourses);
      })

  }

  searchCourse(): void {

    if (this.title.match(/^\s*$/)) {
      this.allCourses = null;
    }
    else{
      this.courseService.findByTitle(this.title).subscribe(
        res => {

          console.log(res);

          if (res.code == 106) {
            this.allCourses = null;
          }
          else {
            this.allCourses = res.data;
          }
        },
        err => {
          console.log(err);
        }
      )
    }
    
  }

  refreshContent() {
    window.location.reload();
  }

  removeText(){
    this.refreshContent();
  }

}
