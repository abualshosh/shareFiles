import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { createRequestOption } from 'src/app/shared';
import { File } from './file.model';

@Injectable({ providedIn: 'root' })
export class FileService {
  private resourceUrl = ApiService.API_URL + '/files';

  constructor(protected http: HttpClient) {}

  create(file: File): Observable<HttpResponse<File>> {
    return this.http.post<File>(this.resourceUrl, file, { observe: 'response' });
  }

  update(file: File): Observable<HttpResponse<File>> {
    return this.http.put(this.resourceUrl, file, { observe: 'response' });
  }

  find(id: number): Observable<HttpResponse<File>> {
    return this.http.get(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<HttpResponse<File[]>> {
    const options = createRequestOption(req);
    return this.http.get<File[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<any>> {
    return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
