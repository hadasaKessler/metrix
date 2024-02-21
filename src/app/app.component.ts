import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user.service'; 
import { UsersComponent } from './components/users/users.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UsersComponent, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private userService: UserService) {} // Inject the user service
  title = 'Your App Title'; // Make sure you have this property declared


  ngOnInit() {
    this.loadUser();
  }

  loadUser() {
    const user = this.userService.getUserFromCookie();
    if (user) {
      // Use the loaded user data as needed
      console.log('Retrieved user from cookie:', user);
      // For example, you can store this user data in a component property
      // or make some UI adjustments based on the user data.
    } else {
      console.log('No user data found in cookie.');
    }
  }

}
