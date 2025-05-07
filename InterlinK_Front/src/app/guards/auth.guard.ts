import { inject, Injectable } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean => {
  
  // Inject the router
  const router = inject(Router);
  
  // Check if user is authenticated (you can change this to check the user's token or userId stored in localStorage, sessionStorage, or via a service)
  const userId = localStorage.getItem('userId');
  
  // If user is authenticated, allow route activation
  if (userId) {
    return true; 
  }
  
  // If user is not authenticated, redirect to the login page
  router.navigate(['/login']);
  return false;
};