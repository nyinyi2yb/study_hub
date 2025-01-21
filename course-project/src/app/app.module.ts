import { RouterModule } from '@angular/router';
import { AuthInterceptorProvider } from './_helpers/auth.interceptor';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule} from '@angular/common/http';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CourseDetailsComponent } from './course-components/course-details/course-details.component';
import { CoursesListComponent } from './course-components/courses-list/courses-list.component';
import { CreateCourseComponent } from './course-components/create-course/create-course.component';
import { AdminBoardComponent } from './admin-board/admin-board.component';
import { ProfileComponent } from './profile/profile.component';

import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CourseDetailsComponent,
    CoursesListComponent,
    CreateCourseComponent,
    AdminBoardComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxDropzoneModule
  ],
  providers: [AuthInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
