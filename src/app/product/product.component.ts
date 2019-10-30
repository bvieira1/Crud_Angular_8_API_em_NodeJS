import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../product';
import { DepartmentService } from '../department.service';
import { Department } from '../department';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

   productForm: FormGroup = this.fb.group({
     _id: [null],
     name: ['', [ Validators.required]],
     stock: [0, [ Validators.required, Validators.min(0)]],
     price: [0, [ Validators.required, Validators.min(0)]],
     departments: [[], Validators.required]
   });

   products: Product[] = [];
   departments: Department[] = [];

   private unsubscribe$: Subject<any> = new Subject<any>();

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.productService.get()
    .pipe(takeUntil(this.unsubscribe$))
        .subscribe((prods) => this.products = prods);
    this.departmentService.get()
    .pipe(takeUntil(this.unsubscribe$))
        .subscribe((deps) => this.departments = deps);
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  save() {
    let data = this.productForm.value;
    if (data._id != null) {
      this.productService.update(data)
      .subscribe()
    } else {
      this.productService.add(data)
      .subscribe();
    }
  }

  delete(p: Product) {
    this.productService.del(p)
    .subscribe(
      () => this.notify('Deleted!'),
      (err) => console.log(err)
    );
  }

  edit(p: Product) {
    this.productForm.setValue(p);
  }

  notify(msg: string) {
    this.snackBar.open(msg, 'OK', {duration: 3000});
  }

}
