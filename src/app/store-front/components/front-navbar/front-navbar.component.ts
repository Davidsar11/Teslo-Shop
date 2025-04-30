import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'front-navbar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './front-navbar.component.html',
})
export class FrontNavbarComponent {

  authService = inject(AuthService);

  checkStatusResource = rxResource({
    loader: () => this.authService.checkStatus()
  })

}
