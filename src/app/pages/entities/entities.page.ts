import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'File', component: 'FilePage', route: 'file' },
    { name: 'Profile', component: 'ProfilePage', route: 'profile' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
