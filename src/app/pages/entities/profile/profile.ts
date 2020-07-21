import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Profile } from './profile.model';
import { ProfileService } from './profile.service';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  profiles: Profile[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private profileService: ProfileService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.profiles = [];
  }

  ionViewWillEnter() {
    this.loadAll();
  }

  async loadAll(refresher?) {
    this.profileService
      .query()
      .pipe(
        filter((res: HttpResponse<Profile[]>) => res.ok),
        map((res: HttpResponse<Profile[]>) => res.body)
      )
      .subscribe(
        (response: Profile[]) => {
          this.profiles = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async (error) => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          toast.present();
        }
      );
  }

  trackId(index: number, item: Profile) {
    return item.id;
  }

  new() {
    this.navController.navigateForward('/tabs/entities/profile/new');
  }

  edit(item: IonItemSliding, profile: Profile) {
    this.navController.navigateForward('/tabs/entities/profile/' + profile.id + '/edit');
    item.close();
  }

  async delete(profile) {
    this.profileService.delete(profile.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Profile deleted successfully.', duration: 3000, position: 'middle' });
        toast.present();
        this.loadAll();
      },
      (error) => console.error(error)
    );
  }

  view(profile: Profile) {
    this.navController.navigateForward('/tabs/entities/profile/' + profile.id + '/view');
  }
}
