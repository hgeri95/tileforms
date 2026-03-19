import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn) {
    router.navigate(['/account/login'], {
      queryParams: { returnUrl: route.url.join('/') }
    });
    return false;
  }

  const requiredRoles = route.data['roles'] as string[] | undefined;
  if (requiredRoles?.length) {
    const user = authService.currentUser;
    if (!user || !requiredRoles.includes(user.role)) {
      router.navigate(['/catalog']);
      return false;
    }
  }

  return true;
};
