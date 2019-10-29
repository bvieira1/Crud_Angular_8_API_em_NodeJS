import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product';
import { BehaviorSubject, Observable } from 'crud/node_modules/rxjs';
import { DepartmentService } from './department.service';
import { combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Department } from './department';

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

  add(prod: Product): Observable<Product> {
    const departments = (prod.departments as Department[]).map(d => d._id);
    return this.http.post<Product>(this.url, {...prod, departments})
    .pipe(
      tap((p) => {
        this.productsSubject$.getValue()
        .push({...prod, _id: p._id});
      })
    );
  }

  del(prod: Product): Observable<any> {
    return this.http.delete(`${this.url}/${prod._id}`)
    .pipe(
      tap(() => {
        let products = this.productsSubject$.getValue();
        let i = products.findIndex(p => p._id === prod._id);
        if (i >= 0)
            products.splice(i, 1);

      })
    );
  }

  update(prod: Product): Observable<Product> {
    let departments = (prod.departments as Department[]).map(d => d._id);
    return this.http.patch<Product>(`${this.url}/${prod._id}`, {...prod, departments})
    .pipe(
      tap(() => {
        let products = this.productsSubject$.getValue();
        let i = products.findIndex(p => p._id === prod._id);
        if (i >= 0)
            products[i] = prod;

      })
    );

  }
}
