import { ProfileComponent } from './profile/profile.component';
import { AdminBoardComponent } from './admin-board/admin-board.component';
import { CourseDetailsComponent } from './course-components/course-details/course-details.component';
import { CreateCourseComponent } from './course-components/create-course/create-course.component';
import { CoursesListComponent } from './course-components/courses-list/courses-list.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'courses-list', component:CoursesListComponent },
  { path: 'create-course', component: CreateCourseComponent },
  { path: 'course-details/:id', component: CourseDetailsComponent },
  { path: 'admin', component: AdminBoardComponent },
  { path: 'profile', component:ProfileComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
