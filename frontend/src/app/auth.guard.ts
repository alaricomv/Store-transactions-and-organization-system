import { CanActivateFn, Router } from '@angular/router';

import {jwtDecode} from 'jwt-decode';



function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export const authGuard: CanActivateFn = (route, state) => {
  const user = localStorage.getItem('User');
  if (user) {
    const token = JSON.parse(user).token;
    if (!isTokenExpired(token)) {
      return true;
    }
  }
  // Redirect to login if not authenticated or token is expired
  window.location.href = '/login';
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const user = JSON.parse(localStorage.getItem('User') || '{}');
  const token = user?.token;
  if (!token || isTokenExpired(token)) {
    return true; // Allow access if not logged in or token expired
  } else {
    window.location.href = '/';
    return false;
  }
};
