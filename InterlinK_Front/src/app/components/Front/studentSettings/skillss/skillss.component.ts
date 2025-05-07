import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/UserS/auth.service';
import { SkillService } from 'src/app/services/UserS/skill.service';

@Component({
  selector: 'app-skillss',
  templateUrl: './skillss.component.html',
  styleUrls: ['./skillss.component.css']
})
export class SkillssComponent implements OnInit {
  userId!: number;
  softSkills: any[] = [];
  hardSkills: any[] = [];
  newSkill = { name: '', type: 'SOFT' };
  user: any; 

  // Reference to the Add Skill Modal Template
  @ViewChild('addSkillModal') addSkillModal!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private skillService: SkillService,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.authService.getUserById(this.userId).subscribe((userData) => {
      this.user = userData;
    });
    this.getSkills();
  }

  getSkills() {
    this.skillService.getSkillsByUserId(this.userId).subscribe((skills) => {
      this.softSkills = skills.filter(skill => skill.type === 'SOFT');
      this.hardSkills = skills.filter(skill => skill.type === 'HARD');
    });
  }

  addSkill() {
    if (!this.newSkill.name) {
      alert('Skill name is required!');
      return;
    }
    this.skillService.addSkill(this.userId, this.newSkill).subscribe((addedSkill) => {
      this.getSkills(); // Refresh skills list
      this.newSkill.name = '';  // Reset the input field
    });
  }

  // Method to open the Add Skill Modal using ng-bootstrap
  openAddSkillModal(): void {
    this.modalService.open(this.addSkillModal, { size: 'lg' });
  }
}
