import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-linker',
  templateUrl: './linker.component.html',
  styleUrls: ['./linker.component.css']
})
export class LINKERComponent {

    constructor(private router: Router) {}
    navigateToTasks() {
      this.router.navigate(['/task']);
    }

}
