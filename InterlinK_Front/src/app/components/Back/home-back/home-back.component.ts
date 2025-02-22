import { Component, AfterViewInit } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";
import { NavBackComponent } from "../nav-back/nav-back.component";
import { FooterBackComponent } from "../footer-back/footer-back.component";
import { SettingsComponent } from "../settings/settings.component";

@Component({
  selector: 'app-home-back',
  standalone: true,
  imports: [AsideComponent, NavBackComponent, FooterBackComponent, SettingsComponent],
  templateUrl: './home-back.component.html',
  styleUrls: ['./home-back.component.css']
})
export class HomeBackComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const fixedPlugin = document.querySelector('.fixed-plugin');
    const fixedPluginButton = document.querySelector('.fixed-plugin-button');
    const fixedPluginButtonNav = document.querySelector('.fixed-plugin-button-nav');
    const fixedPluginCard = document.querySelector('.fixed-plugin .card');
    const fixedPluginCloseButtons = document.querySelectorAll('.fixed-plugin-close-button');
    const navbar = document.getElementById('navbarBlur');
    const buttonNavbarFixed = document.getElementById('navbarFixed') as HTMLInputElement;

    if (fixedPluginButton) {
      fixedPluginButton.addEventListener('click', () => {
        fixedPlugin?.classList.toggle('show');
      });
    }

    if (fixedPluginButtonNav) {
      fixedPluginButtonNav.addEventListener('click', () => {
        fixedPlugin?.classList.toggle('show');
      });
    }

    fixedPluginCloseButtons.forEach((el) => {
      el.addEventListener('click', () => {
        fixedPlugin?.classList.remove('show');
      });
    });

    document.body.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (
        target !== fixedPluginButton &&
        target !== fixedPluginButtonNav &&
        !target.closest('.fixed-plugin .card')
      ) {
        fixedPlugin?.classList.remove('show');
      }
    });

    if (navbar && buttonNavbarFixed) {
      if (navbar.getAttribute('navbar-scroll') === 'true') {
        buttonNavbarFixed.checked = true;
      }
    }
  }
}