import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { Profile } from './profile.model';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private resourceUrl = ApiService.API_URL + '/profiles';

  constructor(protected http: HttpClient) {}

  create(profile: Profile): Observable<HttpResponse<Profile>> {
    return this.http.post<Profile>(this.resourceUrl, profile, { observe: 'response' });
  }

  update(profile: Profile): Observable<HttpResponse<Profile>> {
    return this.http.put(this.resourceUrl, profile, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<Profile>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<Profile[]>> {
    const options = createRequestOption(req);
    return this.http.get<Profile[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
