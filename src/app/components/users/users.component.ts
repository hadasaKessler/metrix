import { Component , OnInit} from '@angular/core';
import { UserService } from '../../services/user.service'; // Import the user service
import { User } from '../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AddUserDialogComponent } from './add-user-dialog/add-user-dialog.component';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import { HttpClientModule } from '@angular/common/http'; 
import { CountryService } from '../../services/country.service';





@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule,HttpClientModule ],
  providers:[ CountryService, UserService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{
  users: any[];


  constructor(
    private dialog: MatDialog,
    private userService: UserService ,
  ) {
    this.users = [
      { firstName: 'Amit', lastName: 'Malca', gender: 'Female', age: 30, country: 'Israel', city: 'Tel Aviv' },
      { firstName: 'Israel', lastName: 'Israeli', gender: 'Male', age: 45, country: 'USA', city: 'New York' },
      { firstName: 'Hadasa', lastName: 'Kessler', gender: 'Female', age: 25, country: 'Israel', city: 'Israel' },

    ];
  }

  ngOnInit(){
    this.loadUserFromCookie();

}
openAddUserDialog(): void {
  const dialogRef = this.dialog.open(AddUserDialogComponent, {
    width: '600px',
    height: '400px',
    data: {} 
  });
  dialogRef.afterClosed().subscribe((newUser) => {
    if (newUser) {
      console.log('Before push, users is:', this.users);  
      this.users.push(newUser);
      this.userService.saveUserToCookie(this.users); 
    }
  });

}
openEditUserDialog(user: any): void {
  const dialogRef = this.dialog.open(EditUserDialogComponent, {
    width: '600px',
    height: '400px',
    data: { user } 
  });
  dialogRef.afterClosed().subscribe((editedUser) => {
    if (editedUser) {
      const index = this.users.findIndex(user => user.id === editedUser.id);  
      if (index !== -1) {
        this.users[index] = editedUser;
        this.userService.saveUserToCookie(this.users);  
      }
    }
  });
}

removeUser(userToRemove: any): void {
  const index = this.users.findIndex(user => user.id === userToRemove.id);
  if (index !== -1) {
    this.users.splice(index, 1);
    this.userService.saveUserToCookie(this.users);  
  }
}
loadUserFromCookie() {
  const usersFromCookie = this.userService.getUserFromCookie();
  this.users = Array.isArray(usersFromCookie) ? usersFromCookie : [];
}


}
