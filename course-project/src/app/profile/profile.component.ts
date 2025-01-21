import { FileUploadService } from './../_services/file-upload.service';
import { Router } from '@angular/router';
import { AuthService } from './../_services/auth.service';
import { TokenStorageService } from './../_services/token-storage.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private tokenStorage: TokenStorageService,
    private authService: AuthService,
    private router: Router,
    private uploadService: FileUploadService) { }

  userData: any;

  uname: any;

  tokenExist = false;
  isEdit = false;
  selectedFile: any;
  imageUrl: any
  username: any;
  email: any;

  profileImage: any;
  isChangePasswrod = false;
  password: any;
  isUploaded = false;

  isLoading = false;

  ngOnInit(): void {

    this.isEdit = false;

    this.tokenExist = !!this.tokenStorage.getToken();

    if (this.tokenExist) {
      this.userData = this.tokenStorage.getUser();
      const username = this.tokenStorage.getUser().username;
      this.uname = username.charAt(0).toUpperCase();
      this.profileImage = this.tokenStorage.getUser().profileImage;
      console.log('pi ----------', this.profileImage);

      console.log(this.userData);
    }
  }

  updateProfile(): void {
    console.log(this.userData);
    console.log(this.imageUrl);

    if (this.imageUrl == undefined) {
      console.log('undefined');
      console.log(this.userData)
    }
    else {
      this.userData.profileImage = this.imageUrl;
    }

    this.authService.updateUser(this.userData.id, this.userData)
      .subscribe(res => {
        console.log('updated user ', res);

        this.tokenStorage.saveUser(this.userData);
        this.isEdit = false;
        window.location.reload();
      },
        err => {
          console.log(err);
        })

  }

  editProfile() {
    this.isEdit = true
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
    this.files.splice(this.files.indexOf(event), 1);
  }

  uploadFile() {
    if (this.selectedFile) {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading =false;
        this.uploadService.upload(this.selectedFile).subscribe(
          data => {
            console.log(data);
            this.getSelectedFile();
            this.isUploaded = true;
          },
          err => {
            console.log(err);
          }
        )
      }, 1000);
    }
  }

  getSelectedFile() {
    this.uploadService.getSelectedFile(this.selectedFile.name).subscribe(res => {
      this.imageUrl = res.img[0].url;
      console.log(this.imageUrl);
    },
      err => {
        console.log(err);
      });
  }

  cancelEdit() {
    this.isEdit = false;
    this.removeUploadedImage();
    this.selectedFile = ''
  }
  changePassword() {
    this.isChangePasswrod = true;
  }
  updatePassword() {

  }
  cancelEditPassword() {
    this.isEdit = true;
    this.isChangePasswrod = false;
  }

  removeUploadedImage(){
    if (this.imageUrl) {
      this.uploadService.removeFile(this.selectedFile.name).subscribe(res => {
        console.log(res);
      },
        err => {
          console.log(err);
        })
    }
  }
}
