import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('User');
  if (user) {
    return true;
  } else {
    // Redirect to login if not authenticated
    window.location.href = '/login';
    return false;
  }
};

export const guestGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('User');
  if (!user) {
    return true; // Allow access if not logged in
  } else {
    window.location.href = '/'; // Redirect to home or another page if logged in
    return false;
  }
};
