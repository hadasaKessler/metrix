import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {AsyncPipe, CommonModule} from '@angular/common';
import {map, startWith, switchMap} from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import { Observable } from 'rxjs';
import {MatButtonModule} from '@angular/material/button';
import { MatOptionModule,   } from '@angular/material/core';
import { CountryService } from '../../../services/country.service';
import { HttpClientModule } from '@angular/common/http'; 
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [ MatInputModule, MatSelectModule, CommonModule,
    ReactiveFormsModule,FormsModule, MatOptionModule,HttpClientModule,
MatFormFieldModule, MatAutocompleteModule, AsyncPipe, MatButtonModule
],
providers:[CountryService],

  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.css'
})
export class EditUserDialogComponent {
  userForm: FormGroup;
  countries$: Observable<any[]> = new Observable<any[]>() ; 
  filteredCountries$: Observable<string[]> = new Observable<string[]>(); 


  constructor(
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    private fb: FormBuilder,
    private countryService: CountryService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userForm = this.fb.group({
      firstName: [data.user.firstName, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      lastName: [data.user.lastName, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      age: [data.user.age, [Validators.required, Validators.min(0), Validators.pattern(/^\d+$/)]],
      city: [data.user.city, Validators.required],
      gender: [data.user.gender, Validators.required],
      country: [data.user.country, Validators.required],
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

  private _filterCountries(value: string | any): Observable<any[]>{
    let filterValue = '';
    if(typeof value === 'string'){
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
