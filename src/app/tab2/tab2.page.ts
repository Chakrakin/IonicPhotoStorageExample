import {Component, OnInit} from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage';

interface Photo {
  name: string;
  data: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  baseString: string = 'data:image/jpeg;base64,';
  tempImage: string = '';
  fileName: string = '';
  photos: Array<Photo> = [];

  // Note: u can switch to  "" destinationType: this.camera.DestinationType.FILE_URI, "" if wanted
  cameraOptions: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
  };

  constructor(private camera: Camera, private storage: Storage) {}

  ngOnInit() {
    this.loadSaved();
  }

  async makePicture() {
    try {
      this.tempImage = await this.camera.getPicture(this.cameraOptions);
    } catch (error) {
      console.log(error);
    }
  }

  /*
    or handle promise result by yourself
   */
  // makePicture() {
  //   this.camera.getPicture(this.cameraOptions).then((imageData) => {
  //     // if DATA_URL is set as DestinationType in cameraOptions then append a base64 prefix
  //     this.tempImage = 'data:image/jpeg;base64,' + imageData;
  //   }, (err) => {
  //     // Handle error
  //   });
  // }

  async saveToStore() {
    // use this if working with FILE plugin
    // const nameToSave = this.getName()
    // const tempFilePath = this.tempImage.substr(0, this.tempImage.lastIndexOf('/') + 1);
    // const newFilePath = this.file.dataDirectory;
    // await this.file.copyFile(tempFilePath, nameToSave, newFilePath, nameToSave);

    // or this if working with storage plugin
    this.photos.unshift({name: this.getName(), data: this.image()});
    await this.storageDelete();
    this.reset();
  }

  async deletePhoto(photoName: string) {
    this.photos = this.photos.filter((photo: Photo) => photo.name !== photoName);
    await this.storageDelete();
  }

  reset() {
    this.tempImage = '';
    this.fileName = '';
  }

  image() {
    // use next line to return a coverted fileLocation if using FILE_URI in cameraOption.DestinationType
    // return  (<any>window).Ionic.WebView.convertFileSrc(this.tempImage);
    // use next line to return a concatinated string (with base64 prefix) if using DATA_URL in cameraOption.DestinationType
    return this.baseString + this.tempImage;
  }

  private async storageDelete() {
    await this.storage.set('photos', this.photos);
  }

  private loadSaved() {
    // use this if working with storage plugin
    this.storage.get('photos').then((photos: Array<Photo>) => {
      this.photos = photos || [];
    });
  }

  private extractName(file: string) {
    return file.substr(file.lastIndexOf('/') + 1);
  }

  private getName() {
    return (this.fileName || 'NO_NAME') + new Date().getTime().toString();
  }
}
