import { Component, OnInit } from '@angular/core';
import { Department } from '../department';
import { DepartmentService } from '../department.service';
import { MatSnackBar } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {

  depName = '';
  departments: Department[] = [];
  private unsubscribe$: Subject<any> = new Subject();
  depEdit: Department = null;

  constructor(
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.departmentService.get()
    .pipe( takeUntil(this.unsubscribe$))
    .subscribe((deps) => this.departments = deps);
  }

  save() {
    if ( this.depEdit) {
      this.departmentService.update(
        {name: this.depName, _id: this.depEdit._id})
        .subscribe(
          (dep) => {
            this.notify('Updated!');
          },
          (err) => {
            this.notify('Error');
            console.error(err);
          }
        );
    } else {
      this.departmentService.add({name: this.depName})
      .subscribe(
        (dep) => {
          console.log(dep);

          this.notify('Inserted!');
        },
        (err) => console.error(err));
    }
    this.clearFields();
  }

  clearFields() {
    this.depName = '';
    this.depEdit = null;
  }

  cancel() {
    this.clearFields();
  }

  edit(dep: Department) {
    this.depName = dep.name;
    this.depEdit = dep;
  }

  delete(dep: Department) {
    this.departmentService.del(dep)
    .subscribe(
      () => this.notify('Removed!'),
      (err) => console.log(err)
    );
  }

  notify(msg: string) {
    this.snackBar.open(msg, 'OK', {duration: 3000});
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

}
