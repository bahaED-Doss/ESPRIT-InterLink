import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  standalone: true,
  imports: [RouterOutlet,
    RouterLink,
    RouterLinkActive],
  styleUrls: ['./aside.component.css']
})
export class AsideComponent {

}
