import { Observable } from 'rxjs';
import { FileUploadService } from './../../_services/file-upload.service';

import { HttpClient } from '@angular/common/http';
import { CourseService } from './../../_services/course.service';
import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/models/course.model';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent implements OnInit {

  currentCourse: Course = {
    courseTitle: '',
    courseDescription: '',
    images: ''
  }

  isSubmitted = false;
  message = '';
  isUpdated = false;
  isUploaded = false;
  isLoading = false;

  showDeleteMessage = false;

  constructor(private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private uploadService: FileUploadService) { }

  ngOnInit(): void {
    this.getCourse(this.route.snapshot.params.id);
  }

  getCourse(id: string): void {    //get course ----------

    this.courseService.get(id)
      .subscribe(data => {
        const course = Object.values(data);
        this.currentCourse = course[2];
      },
        err => {
          console.log(err);
        }
      );
  }

  clickCancel() {
    this.removeUploadedImage();
    this.router.navigate(['/courses-list']);
  }

  removeUploadedImage() {
    if (this.updatedImageUrl) {
      this.uploadService.removeFile(this.selectedFile.name).subscribe(res => {
        console.log(res);
      },
        err => {
          console.log(err);
        })
    }
  }

  files: File[] = [];
  selectedFile: any;
  updatedImageUrl?: any;

  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    this.selectedFile = event.addedFiles[0];
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  updateImage() {
    if (this.selectedFile) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.uploadService.upload(this.selectedFile).subscribe(res => {
          this.getUploadedFile();
          this.isUploaded = true;
        },
          err => {
            console.log(err);
          })
      }, 1000);

    }
  }

  getUploadedFile() {
    this.uploadService.getSelectedFile(this.selectedFile.name).subscribe(res => {
      this.updatedImageUrl = res.img[0].url;

    },
      err => {
        console.log(err);
      })
  }

  updateCourse(): void {

    if (this.updatedImageUrl) {
      this.deleteImage(this.useImageName(this.currentCourse.images));

      this.currentCourse.images = this.updatedImageUrl;

    }

    console.log(this.currentCourse);

    this.courseService.update(this.currentCourse.id, this.currentCourse)
      .subscribe(res => {
        this.isSubmitted = true;
        this.message = res.message;

        if (res.code == 103) {
          this.router.navigate(['/courses-list']);
        }
      }
        , err => {
          this.isSubmitted = false;
          this.message = err.message;
        });
  }

  toDelete() {
    this.showDeleteMessage = true;
  }

  deleteCourse() {

    // this.deleteImage();
    var urlString = `${this.currentCourse.images}`;

    var index = urlString?.lastIndexOf("/") + 1;
    console.log(index);
    var fileName = urlString.substring(index);
    console.log(fileName);

    this.courseService.delete(this.currentCourse.id).subscribe(res => {
      console.log(res);
      this.deleteImage(fileName);
      this.router.navigate(['/courses-list']);
    },
      err => {
        console.log(err);
      })
  }


  useImageName(urlString :any){

    var index = urlString?.lastIndexOf("/") + 1;
    console.log(index);
    var fileName = urlString.substring(index);
    console.log(fileName);

    return fileName;
  }

  deleteImage(fileName: any) {
    this.uploadService.removeFile(fileName).subscribe(res => {
      console.log(res);
    },
      err => {
        console.log(err);
      })
  }

  cancelDelete() {
    this.showDeleteMessage = false;
  }
}




