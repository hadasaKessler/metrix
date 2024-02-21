import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USER_KEY = 'app_user';


  constructor(private cookieService: CookieService) {}

  // Save data to cookies
  saveUserToCookie(user: any[]) {
    const userString = JSON.stringify(user);
    this.cookieService.set('user', userString, 4, '/'); 
  }

  // Method to retrieve user data from a cookie
  getUserFromCookie(): any[] {
    const userString = this.cookieService.get('user');
    return userString ? JSON.parse(userString) : [];
  }
  
}
