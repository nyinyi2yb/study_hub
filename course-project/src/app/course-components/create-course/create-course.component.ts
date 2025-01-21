import { FileUploadService } from './../../_services/file-upload.service';
import { TokenStorageService } from './../../_services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from 'src/app/models/course.model';
import { CourseService } from 'src/app/_services/course.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})
export class CreateCourseComponent implements OnInit {

  tokenId: any;

  course: Course = {
    courseTitle: '',
    courseDescription: '',
    images: '',
    userId: ''
  }

  isSubmitted = false;
  selectedFile: any;
  imageUrl: any;
  imageName: any;

  isUploaded = false;
  clickUploadBtn = false;

  isDisabled = false
  constructor(private courseService: CourseService,
    private router: Router, private tokenStorage: TokenStorageService,
    private uploadService: FileUploadService,) { }

  ngOnInit(): void {
    this.tokenId = this.tokenStorage.getUser().id;
  }

  clickCancel(): void { //click ok btn 

    this.course.courseTitle = '';
    this.course.courseDescription = '';
    this.isSubmitted = false;
    this.isUploaded = false;
    this.isDisabled = false;
    this.router.navigate(['/courses-list']);
    if (this.imageUrl) {
      this.removeUploadedImage();
      this.selectedFile = '';
    }
    this.selectedFile = '';

  }

  createCourse(): void {

    this.course.userId = this.tokenId;

    const data = {
      courseTitle: this.course.courseTitle,
      courseDescription: this.course.courseDescription,
      images: this.imageUrl ? this.imageUrl : null,
      userId: this.tokenId
    }

    console.log(data);

    this.courseService.create(data).subscribe(res => {
      console.log(res);
      if (res.code == 100) {
        this.router.navigate(['/courses-list']);
        window.location.reload();
      }
    },
      err => {
        this.isSubmitted = false;
        console.log(err);
      })
  }

  files: File[] = [];

  onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
    this.selectedFile = event.addedFiles[0];
    console.log(this.selectedFile);
  }

  onRemove(event: any) {
    console.log(event);
    this.selectedFile = '';
  }

  uploadFile() {

    this.clickUploadBtn = true;
    this.isUploaded = false;
    
    if (this.selectedFile) {

      setTimeout(() => {
        this.clickUploadBtn = false;
        this.uploadService.upload(this.selectedFile).subscribe(
          data => {
            console.log(data);
            this.getSelectedFile();
          },
          err => {
            console.log(err);
          }
        )

      }, (1000));


    }
  }

  getSelectedFile() {
    this.isUploaded = false;
    this.uploadService.getSelectedFile(this.selectedFile.name).subscribe(res => {
      this.imageUrl = res.img[0].url;
      console.log(res.filterImage[0]);
      this.imageName = res.filterImage[0];

      console.log(res);
      console.log(res.code);

      if (res.code == 202) {
        this.isUploaded = true;
        this.isDisabled = true;
      }

    },
      err => {
        console.log(err);
      });
  }

  removeUploadedImage() {
      if (this.imageUrl) {
        this.uploadService.removeFile(this.selectedFile.name).subscribe(res => {
          console.log(res);
        },
          err => {
            console.log(err);
          })
      }
  }
  closeForm() {
    this.clickCancel();
  }

}


