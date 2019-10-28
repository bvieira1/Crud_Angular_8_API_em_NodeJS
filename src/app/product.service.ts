import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { BehaviorSubject, Observable } from 'crud/node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

readonly url = 'http://127.0.0.1:3000/products';
private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
private loaded: boolean = false;
  constructor(private http: HttpClient) { }

  get(): Observable<Product[]> {
    if (!this.loaded) {
      this.http.get<Product[]>(this.url)
      .subscribe(this.productsSubject$);
      this.loaded = true;
    }
    return this.productsSubject$.asObservable();
  }
}
