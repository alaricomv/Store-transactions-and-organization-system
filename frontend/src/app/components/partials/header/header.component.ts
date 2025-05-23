import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/user';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [RouterLink, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  user!:User;

  constructor(private router: Router, private userService: UserService) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Navigated to:', event.urlAfterRedirects);
      }
    });

    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnInit() {
    this.userService.userObservable.subscribe(user => {
      this.user = user;
    });
    this.userService.checkTokenValidity(); // Check on load
  }

  logout() {
    this.userService.logout();
  }
}
