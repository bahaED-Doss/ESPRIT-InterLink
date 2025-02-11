import { Component } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";

import { SettingsComponent } from "../settings/settings.component";
import { FooterBackComponent } from "../footer-back/footer-back.component";
import { NavBackComponent } from '../nav-back/nav-back.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [AsideComponent, NavBackComponent, SettingsComponent, FooterBackComponent],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent {

}
