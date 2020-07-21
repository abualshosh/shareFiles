import { Component, OnInit } from '@angular/core';
import { JhiDataUtils } from 'ng-jhipster';
import { File } from './file.model';
import { FileService } from './file.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-file-detail',
  templateUrl: 'file-detail.html',
})
export class FileDetailPage implements OnInit {
  file: File = {};

  constructor(
    private dataUtils: JhiDataUtils,
    private navController: NavController,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.file = response.data;
    });
  }

  open(item: File) {
    this.navController.navigateForward('/tabs/entities/file/' + item.id + '/edit');
  }

  async deleteModal(item: File) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.fileService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/file');
            });
          },
        },
      ],
    });
    await alert.present();
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }
}
