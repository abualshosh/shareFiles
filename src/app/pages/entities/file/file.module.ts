import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { FilePage } from './file';
import { FileUpdatePage } from './file-update';
import { File, FileService, FileDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class FileResolve implements Resolve<File> {
  constructor(private service: FileService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<File> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<File>) => response.ok),
        map((file: HttpResponse<File>) => file.body)
      );
    }
    return of(new File());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FilePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FileUpdatePage,
    resolve: {
      data: FileResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FileDetailPage,
    resolve: {
      data: FileResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FileUpdatePage,
    resolve: {
      data: FileResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FilePage, FileUpdatePage, FileDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FilePageModule {}
