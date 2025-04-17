import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Interview } from 'src/app/models/Interview';
import { InterviewType } from 'src/app/models/InterviewType';
import { InterviewService } from 'src/app/services/interview.service';
import { TestService } from 'src/app/services/test.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-interview',
  templateUrl: './add-interview.component.html',
  styleUrls: ['./add-interview.component.css'],
})
export class AddInterviewComponent {
  inteviews: Interview[] = [];
  tests: any[] = [];
  students: any[] = [];
  managers: any[] = [];
  applications: any[] = [];
  form: FormGroup;
  inteview!: Interview;
  inteviewId!: number;
  inteviewTypeEnum = InterviewType;
  interviewType: { key: string; value: string }[];

  private subscription: Subscription = new Subscription();
  editinginteview: Interview | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private inteviewservice: InterviewService,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService
  ) {
    // Initialisation de creditForm dans le constructeur
    this.form = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      note: [
        { value: 0, disabled: true },
        [Validators.required, Validators.min(0)],
      ],
      interviewType: ['', Validators.required],
      interviewDate: ['', Validators.required],
      lienReunion: ['', Validators.pattern(/^(http|https):\/\/[^ "]+$/)],
      student: ['', Validators.required],
      managerId: ['', Validators.required],
      testId: ['', Validators.required],
    });
    this.interviewType = Object.entries(this.inteviewTypeEnum).map(
      ([key, value]) => ({
        key,
        value,
      })
    );
  }

  ngOnInit() {
    this.fetchAllApplication();
    this.fetchAllManager();
    this.fetchAllStudent();
    this.fetchAllTest();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.inteviewId = +idParam;
      this.inteviewservice
        .getInterviewsById(this.inteviewId)
        .subscribe((interview) => {
          this.inteview = interview;
          this.editinginteview = interview;
          this.form.patchValue({
            titre: interview.titre,
            note: interview.note,
            interviewType: interview.interviewType,
            interviewDate: interview.interviewDate
              ? new Date(interview.interviewDate).toISOString().split('T')[0]
              : '',
            lienReunion: interview.lienReunion,
            student: interview.student,
            managerId: interview.managerId,
            testId: interview.testId,
          });
        });
    } else {
      console.error("ID de inteview non fourni dans l'URL.");
    }
  }
  addinteview(): void {
    const newinteview: Interview = this.form.value as Interview;
    this.inteviewservice.addInterview(newinteview).subscribe(() => {
      this.form.reset();
      Swal.fire({
        title: 'Success!',
        text: 'The inteview has been added successfully.',
        icon: 'success', // Icône pour succès : success, error, warning, info, inteview
        confirmButtonText: 'OK',
      });
      this.router.navigate(['/back/interviews']);
    });
  }

  cancelEdit(): void {
    this.editinginteview = null;
    this.form.reset();
  }

  updateinteview(): void {
    if (this.editinginteview && this.form.valid) {
      const updateinteview = {
        ...this.editinginteview,
        ...this.form.value,
      } as Interview;
      this.inteviewservice.addInterview(updateinteview).subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'The Categorie has been deleted successfully.',
          icon: 'success', // Icône pour succès : success, error, warning, info, inteview
          confirmButtonText: 'OK',
        }).then(() => {
          this.form.reset();
          this.router.navigate(['/inteview']);
        });
      });
    }
  }
  editCat(interview: Interview): void {
    this.editinginteview = interview;
    this.form.patchValue({
      titre: interview.titre,
      note: interview.note,
      interviewType: interview.interviewType,
      interviewDate: interview.interviewDate
        ? new Date(interview.interviewDate).toISOString().split('T')[0]
        : '',
      lienReunion: interview.lienReunion,
      student: interview.student,
      managerId: interview.managerId,
      testId: interview.testId,
    });
  }

  fetchAllTest() {
    this.subscription.add(
      this.testService.getAll().subscribe({
        next: (res: any) => {
          this.tests = res;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des tests:', err);
        },
      })
    );
  }

  fetchAllStudent() {
    this.subscription.add(
      this.inteviewservice.getUser().subscribe({
        next: (res: any) => {
          this.students = res;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des tests:', err);
        },
      })
    );
  }

  fetchAllManager() {
    this.subscription.add(
      this.inteviewservice.getProjectManger().subscribe({
        next: (res: any) => {
          this.managers = res;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des tests:', err);
        },
      })
    );
  }

  fetchAllApplication() {
    this.subscription.add(
      this.inteviewservice.getApplication().subscribe({
        next: (res: any) => {
          this.applications = res;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des tests:', err);
        },
      })
    );
  }
}
