import { Component } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";
import { NavBackComponent } from "../nav-back/nav-back.component";
import { FooterBackComponent } from "../footer-back/footer-back.component";
import { SettingsComponent } from "../settings/settings.component";

@Component({
  selector: 'app-billing',
   standalone: true,
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css'],
  imports: [AsideComponent, NavBackComponent, FooterBackComponent, SettingsComponent]
})
export class BillingComponent {

}
