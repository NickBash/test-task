import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DataLine, DataRectangle} from '../interfaces/content.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getDataElements(): Observable<DataRectangle[]> {
    return this.httpClient.get<DataRectangle[]>('assets/elements.json')
  }

  getDataLines(): Observable<DataLine[]> {
    return this.httpClient.get<DataLine[]>('assets/lines.json')
  }
}
