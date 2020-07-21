import { Component, OnInit } from '@angular/core';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-profile-detail',
  templateUrl: 'profile-detail.html',
})
export class ProfileDetailPage implements OnInit {
  profile: Profile = {};

  constructor(
    private navController: NavController,
    private profileService: ProfileService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response) => {
      this.profile = response.data;
    });
  }

  open(item: Profile) {
    this.navController.navigateForward('/tabs/entities/profile/' + item.id + '/edit');
  }

  async deleteModal(item: Profile) {
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
            this.profileService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/profile');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
