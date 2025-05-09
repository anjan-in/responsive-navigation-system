import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-user-filter',
  templateUrl: './user-filter.component.html',
  styleUrls: ['./user-filter.component.scss']
})
export class UserFilterComponent implements OnInit {
  @Input() roles: string[] = ['Admin', 'Editor', 'Viewer'];
  @Input() statuses: string[] = ['active', 'inactive', 'pending'];

  @Output() filtersChanged = new EventEmitter<any>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      search: [''],
      role: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    // Emit filters after debounce when form values change
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(filters => {
        this.filtersChanged.emit(filters);
      });
  }

}
