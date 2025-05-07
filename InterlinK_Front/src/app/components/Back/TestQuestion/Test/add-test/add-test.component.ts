import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Test } from 'src/app/models/test';
import { TestType } from 'src/app/models/TypeTest';
import { TestService } from 'src/app/services/test.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-test',
  templateUrl: './add-test.component.html',
  styleUrls: ['./add-test.component.css'],
})
export class AddTestComponent {
  tests: Test[] = [];
  form: FormGroup;
  test!: Test;
  testId!: number;

  testTypeEnum = TestType;
  testTypes: { key: string; value: string }[];

  editingTest: Test | null = null;
  constructor(
    private formBuilder: FormBuilder,
    private testService: TestService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // Initialisation de creditForm dans le constructeur
    this.form = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(3)]],
      note: [{ value: '0', disabled: true }],
      typeTest: ['', Validators.required],
    });
    this.testTypes = Object.entries(this.testTypeEnum).map(([key, value]) => ({
      key,
      value,
    }));
  }

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      this.testId = +idParam;
      this.testService.getById(this.testId).subscribe((c) => {
        this.test = c;
        this.editingTest = c;
        this.form.patchValue({
          typeTest: c.typeTest,
          note: c.note,
          titre: c.titre,
        });
      });
    } else {
      console.error("ID de Test non fourni dans l'URL.");
    }
  }
  addTest(): void {
    const newTest: Test = this.form.value as Test;
    this.testService.add(newTest).subscribe(() => {
      this.form.reset();
      Swal.fire({
        title: 'Success!',
        text: 'The Test has been added successfully.',
        icon: 'success', // Icône pour succès : success, error, warning, info, question
        confirmButtonText: 'OK',
      });
      this.router.navigate(['/back/categorieCours']);
    });
  }

  cancelEdit(): void {
    this.editingTest = null;
    this.form.reset();
  }

  updateTest(): void {
    if (this.editingTest && this.form.valid) {
      const updateTest = {
        ...this.editingTest,
        ...this.form.value,
      } as Test;
      this.testService.add(updateTest).subscribe(() => {
        Swal.fire({
          title: 'Success!',
          text: 'The Categorie has been deleted successfully.',
          icon: 'success', // Icône pour succès : success, error, warning, info, question
          confirmButtonText: 'OK',
        }).then(() => {
          this.form.reset();
          this.router.navigate(['/test']);
        });
      });
    }
  }
  editCat(c: Test): void {
    this.editingTest = c;
    this.form.patchValue({
      typeTest: c.typeTest,
      note: c.note,
      titre: c.titre,
    });
  }
}