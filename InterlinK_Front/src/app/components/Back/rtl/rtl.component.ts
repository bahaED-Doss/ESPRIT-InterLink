import { Component } from '@angular/core';
import { FooterBackComponent } from "../footer-back/footer-back.component";
import { SettingsComponent } from "../settings/settings.component";
import { NavBackComponent } from "../nav-back/nav-back.component";
import { AsideComponent } from "../aside/aside.component";

@Component({
  selector: 'app-rtl',
  standalone: true,
  imports: [FooterBackComponent, SettingsComponent, NavBackComponent, AsideComponent],
  templateUrl: './rtl.component.html',
  styleUrls: ['./rtl.component.css']
})
export class RtlComponent {

}
