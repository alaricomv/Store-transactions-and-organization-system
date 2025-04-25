import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../shared/models/user';
import { IUserLogin } from '../shared/interfaces/IUserLogin';
import { HttpClient } from '@angular/common/http';
import { USER_LOGIN_URL } from '../shared/constants/urls';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  constructor(private http:HttpClient, private toastrService:ToastrService) {
    this.userObservable = this.userSubject.asObservable();
   }

   login(userLogin:IUserLogin):Observable<User>{
    console.log('Logging in user:', userLogin); // Log the user login details
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success('Login successful', 'Success');
      },
      error: (errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Login Failed');
      }
      })
    );
   }

   logout(){
    this.userSubject.next(new User());
    localStorage.removeItem('User');
    window.location.reload();
    this.toastrService.success('Logout successful', 'Success');
   }

   private setUserToLocalStorage(user:User){
    localStorage.setItem('User', JSON.stringify(user));
   }

   private getUserFromLocalStorage(){
    const userJson = localStorage.getItem('User');
    if(userJson){
      return JSON.parse(userJson) as User;
    }
    return new User();
   }
}
