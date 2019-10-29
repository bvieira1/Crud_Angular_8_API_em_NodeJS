import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { BehaviorSubject, Observable } from 'crud/node_modules/rxjs';
import { DepartmentService } from './department.service';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

readonly url = 'http://127.0.0.1:3000/products';
private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
private loaded: boolean = false;
  constructor(
    private http: HttpClient,
    private departentService: DepartmentService) {}

  get(): Observable<Product[]> {
    if (!this.loaded) {
      combineLatest(
        this.http.get<Product[]>(this.url),
        this.departentService.get())
        .pipe(
          tap(([products,departments]) => console.log(products, departments)),
            map(([products, departiments]) => {
              for(let p of products) {
                let ids = (p.departments as string[]);
                p.departments = ids.map((id) => departiments.find(dep => dep._id == id));
              }
              return products;
            }),
            tap((products) => console.log(products))
        )
      .subscribe(this.productsSubject$);

      this.loaded = true;
    }
    return this.productsSubject$.asObservable();
  }
}
