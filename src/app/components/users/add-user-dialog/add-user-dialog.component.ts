import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AsyncPipe} from '@angular/common';
import {map, startWith, switchMap} from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import { MatOptionModule,   } from '@angular/material/core';
import { CountryService } from '../../../services/country.service';
import { HttpClientModule } from '@angular/common/http'; 
import {MatInputModule} from '@angular/material/input';
import { CommonModule } from '@angular/common'; 
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [  MatSelectModule,MatInputModule, 
         ReactiveFormsModule,FormsModule, MatOptionModule,HttpClientModule,
     MatFormFieldModule, MatAutocompleteModule, AsyncPipe, MatButtonModule, CommonModule
  ],
  providers:[CountryService],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.css'
})
 

export class AddUserDialogComponent {
  userForm: FormGroup;
  countries$: Observable<any[]> = new Observable<any[]>() ; 
  filteredCountries$: Observable<string[]> = new Observable<string[]>(); 

  constructor(
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private fb: FormBuilder,
    private countryService: CountryService,
    private userService: UserService,
  ) {

    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      age: ['', [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      city: ['', Validators.required],
      gender: ['', Validators.required],
      country: ['', Validators.required],
    });
      this.countries$ = this.countryService.getCountries().pipe(
        map((countries) => countries.sort((a, b) => a.name.common.localeCompare(b.name.common)))
      );

      this.filteredCountries$ = this.userForm.get('country')!.valueChanges.pipe(
        startWith(''),
        switchMap((value: string | any) => value ? this._filterCountries(value) : this.countries$),
        map(countries => countries.map(country => country.name.common)) 
      );
}



// takes a string value (user input) and returns an observable of filtered countries.
private _filterCountries(value: string | any): Observable<any[]> {
  let filterValue = '';
  
  if (typeof value === 'string') {
    filterValue = value.toLowerCase();
  }

  return this.countries$.pipe(
    map(countries =>
      countries.filter(country =>
        country.name.common.toLowerCase().startsWith(filterValue)
      )
    )
  );
}

  onSave(): void {
    if (this.userForm.valid) {
      const user = this.userForm.value;
      this.userService.saveUserToCookie(user);
      this.dialogRef.close(this.userForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
