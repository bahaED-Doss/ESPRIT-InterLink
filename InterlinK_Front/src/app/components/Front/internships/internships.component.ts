import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { ApplicationService } from '../../../services/application.service';
import { Internship } from 'src/app/models/Internship.model';
import { Application, ApplicationStatus } from 'src/app/models/Application.model';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RatingService } from 'src/app/services/rating.service';
//import { ChatGPTService } from 'src/app/services/chatbot.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as QRCode from 'qrcode';


/*interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
*/
@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.css'],
})
export class InternshipsComponent implements OnInit {
sendToAI(arg0: any) {
throw new Error('Method not implemented.');
}
showCVForm = false;
previewMode = false;
cvForm: FormGroup;
internships: Internship[] = [];
  applications: Application[] = [];
  addApplicationForm: FormGroup;
  ApplicationStatus = ApplicationStatus;
  filteredInternships: Internship[] = [];
  selectedInternship: Internship | null = null;
  selectedRating = 0;
  ratingComment = '';
  selectedInternshipForRating: Internship | null = null;
  //ChatMessage:ChatMessage[] = [];
  //isWaitingForAI = false;
//userMessage = '';

  // Filters
  locationFilter: string = '';
  durationFilter: string = '';
  typeFilter: string = '';

  @ViewChild('addApplicationModal', { read: TemplateRef }) addApplicationModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    public modalService: NgbModal,
    private internshipService: InternshipService,
    private applicationService: ApplicationService,
    private ratingService: RatingService,
   // private chatGPTService: ChatGPTService
  ) {
    this.addApplicationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      cv: [null, Validators.required],
      status: [ApplicationStatus.PENDING, Validators.required]
    });
    this.cvForm = this.fb.group({
      personalInfo: this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: [''],
        address: [''],
        profile: ['']
      }),
      education: this.fb.array([this.createEducationEntry()]),
      experiences: this.fb.array([this.createExperienceEntry()]),
      skills: this.fb.array([this.fb.control('')]),
      languages: this.fb.array([this.createLanguageEntry()])
    });
    /*this.chatGPTService.getConversation().subscribe(messages => {
      this.ChatMessage = messages.filter(m => m.role !== 'system');
    });*/
  }
/*
  sendMessage(): void {
    if (!this.userMessage.trim()) return;
    
    this.isWaitingForAI = true;
    this.chatGPTService.sendMessage(this.userMessage).finally(() => {
      this.isWaitingForAI = false;
      this.userMessage = '';
    });
  }*/
  

  ngOnInit(): void {
    this.getInternships();
    this.loadDraft();
  }
 // Méthodes pour Education
 createEducationEntry(): FormGroup {
  return this.fb.group({
    degree: [''],
    institution: [''],
    year: ['']
  });
}

addEducation(): void {
  (this.cvForm.get('education') as FormArray).push(this.createEducationEntry());
}

removeEducation(index: number): void {
  const educationArray = this.cvForm.get('education') as FormArray;
  if (educationArray.length > 1) {
    educationArray.removeAt(index);
  }
}

// Méthodes pour Experience
createExperienceEntry(): FormGroup {
  return this.fb.group({
    title: [''],
    company: [''],
    period: [''],
    description: ['']
  });
}
getEducationControls() {
  return (this.cvForm.get('education') as FormArray).controls;
}

getExperienceControls() {
  return (this.cvForm.get('experiences') as FormArray).controls;
}

getSkillControls() {
  return (this.cvForm.get('skills') as FormArray).controls;
}

getLanguageControls() {
  return (this.cvForm.get('languages') as FormArray).controls;
}
addExperience(): void {
  (this.cvForm.get('experiences') as FormArray).push(this.createExperienceEntry());
}

removeExperience(index: number): void {
  const expArray = this.cvForm.get('experiences') as FormArray;
  if (expArray.length > 1) {
    expArray.removeAt(index);
  }
}

// Méthodes pour Skills
addSkill(): void {
  (this.cvForm.get('skills') as FormArray).push(this.fb.control(''));
}

removeSkill(index: number): void {
  const skillsArray = this.cvForm.get('skills') as FormArray;
  if (skillsArray.length > 1) {
    skillsArray.removeAt(index);
  }
}

// Méthodes pour Languages
createLanguageEntry(): FormGroup {
  return this.fb.group({
    name: [''],
    level: ['Intermédiaire']
  });
}

addLanguage(): void {
  (this.cvForm.get('languages') as FormArray).push(this.createLanguageEntry());
}

removeLanguage(index: number): void {
  const langArray = this.cvForm.get('languages') as FormArray;
  if (langArray.length > 1) {
    langArray.removeAt(index);
  }
}

// Sauvegarde automatique
saveDraft(): void {
  localStorage.setItem('cvDraft', JSON.stringify(this.cvForm.value));
  alert('Brouillon enregistré!');
}

loadDraft(): void {
  const draft = localStorage.getItem('cvDraft');
  if (draft) {
    const draftData = JSON.parse(draft);
    
    // Clear existing form arrays
    while ((this.cvForm.get('education') as FormArray).length !== 0) {
      (this.cvForm.get('education') as FormArray).removeAt(0);
    }
    // ... faire de même pour les autres FormArrays
    
    // Patch the form with draft data
    this.cvForm.patchValue(draftData);
    
    // Rebuild form arrays
    draftData.education.forEach((edu: any) => {
      (this.cvForm.get('education') as FormArray).push(this.fb.group(edu));
    });
    // ... faire de même pour les autres FormArrays
  }
}

// Aperçu du CV
previewCV(): void {
  if (this.cvForm.valid) {
    this.previewMode = true;
    setTimeout(() => this.renderPreview(), 100);
  } else {
    alert('Veuillez remplir tous les champs requis');
  }
}

renderPreview(): void {
  const previewElement = document.getElementById('cv-preview');
  if (!previewElement) return;

  const cvData = this.cvForm.value;
  
  previewElement.innerHTML = `
    <div class="cv-header">
      <h1>${cvData.personalInfo.fullName}</h1>
      <p>${cvData.personalInfo.email} | ${cvData.personalInfo.phone}</p>
      ${cvData.personalInfo.address ? `<p>${cvData.personalInfo.address}</p>` : ''}
    </div>
    
    ${cvData.personalInfo.profile ? `
    <div class="cv-section">
      <h2>Profil Professionnel</h2>
      <p>${cvData.personalInfo.profile}</p>
    </div>` : ''}
    
    <div class="cv-section">
      <h2>Formation</h2>
      ${cvData.education.map((edu: any) => `
        <div class="education-item">
          <h3>${edu.degree}</h3>
          <p>${edu.institution} ${edu.year ? `(${edu.year})` : ''}</p>
        </div>
      `).join('')}
    </div>
    
    ${cvData.experiences.length > 0 ? `
    <div class="cv-section">
      <h2>Expérience Professionnelle</h2>
      ${cvData.experiences.map((exp: any) => `
        <div class="experience-item">
          <h3>${exp.title} - ${exp.company}</h3>
          ${exp.period ? `<p class="period">${exp.period}</p>` : ''}
          ${exp.description ? `<p>${exp.description}</p>` : ''}
        </div>
      `).join('')}
    </div>` : ''}
    
    ${cvData.skills.filter((s: string) => s).length > 0 ? `
    <div class="cv-section">
      <h2>Compétences</h2>
      <ul>
        ${cvData.skills.filter((s: string) => s).map((skill: string) => `
          <li>${skill}</li>
        `).join('')}
      </ul>
    </div>` : ''}
    
    ${cvData.languages.length > 0 ? `
    <div class="cv-section">
      <h2>Langues</h2>
      <ul>
        ${cvData.languages.map((lang: any) => `
          <li>${lang.name} - ${lang.level}</li>
        `).join('')}
      </ul>
    </div>` : ''}
    
    <div class="qr-code-container">
      <!-- QR Code sera ajouté dynamiquement -->
    </div>
  `;

  // Générer le QR Code
  this.generateQRCode(previewElement);
}

async generateQRCode(previewElement: HTMLElement): Promise<void> {
  const qrContainer = previewElement.querySelector('.qr-code-container');
  if (!qrContainer) return;

  const cvData = {
    ...this.cvForm.value,
    generatedOn: new Date().toISOString()
  };

  try {
    const qrData = JSON.stringify(cvData);
    const qrCode = await QRCode.toDataURL(qrData);
    
    const img = document.createElement('img');
    img.src = qrCode;
    img.alt = 'QR Code du CV';
    img.style.width = '100px';
    img.style.height = '100px';
    
    qrContainer.appendChild(img);
  } catch (error) {
    console.error('Erreur lors de la génération du QR Code:', error);
  }
}

// Générer le PDF
async generatePDF(): Promise<void> {
  if (!this.previewMode) {
    this.previewCV();
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  const previewElement = document.getElementById('cv-preview');
  if (!previewElement) return;

  try {
    const canvas = await html2canvas(previewElement, {
      scale: 2,
      logging: false,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `CV_${this.cvForm.value.personalInfo.fullName.replace(/\s+/g, '_')}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    alert('Une erreur est survenue lors de la génération du PDF');
  }
}
  // Rating methods
  openRatingModal(internship: Internship): void {
    this.selectedInternshipForRating = internship;
  }

  submitRating(): void {
    if (this.selectedRating === 0 || !this.selectedInternshipForRating) return;

    this.ratingService.addRating(
      this.selectedInternshipForRating.internshipId,
      this.selectedRating,
      this.ratingComment
    ).subscribe(() => {
      this.selectedInternshipForRating = null;
      this.selectedRating = 0;
      this.ratingComment = '';
    });
  }

  getRating(internshipId: number): number {
    return this.ratingService.getAverageRating(internshipId);
  }

  getRatingCount(internshipId: number): number {
    return this.ratingService.getRatings(internshipId).length;
  }

  hasRated(internshipId: number): boolean {
    // Implement logic to check if current user has rated
    return false;
  }

  // Rest of your existing methods...
  getInternships(): void {
    this.internshipService.getInternships().subscribe({
      next: (data: Internship[]) => {
        this.internships = data;
        this.filteredInternships = data;
      },
      error: (error: any) => {
        alert('Error fetching internships. Please try again.');
      },
    });
  }

  applyFilters(): void {
    this.filteredInternships = this.internships.filter((internship) => {
      const matchesLocation = internship.localisation
        .toLowerCase()
        .includes(this.locationFilter.toLowerCase());
      const matchesDuration = this.durationFilter
        ? internship.duration === this.durationFilter
        : true;
      const matchesType = this.typeFilter
        ? internship.type === this.typeFilter
        : true;
      return matchesLocation && matchesDuration && matchesType;
    });
  }

 
  
  application: Application = {
    applicationId: 0,
    status: ApplicationStatus.PENDING, // Remplace par la valeur par défaut appropriée
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    cv: '',
    internshipId: 0,
    internship: null
  };
  // Method to format enum values
formatEnumValue(value: string): string {
  return value
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

 // Method to get enum values
 getEnumValues(enumObject: any): string[] {
  return Object.values(enumObject);
}
  // Postuler pour un stage
  applyForInternship(internship: Internship): void {
    /*this.application.internshipId = internship.internshipId;
    this.application.internship = internship; // Assign the internship object*/
    const hasCV = localStorage.getItem('cvDraft');
  
  if (!hasCV) {
    // Proposer de créer un CV
    if (confirm('Voulez-vous créer un CV automatique avant de postuler?')) {
      this.selectedInternship = internship;
      this.showCVForm = true;
      return;
    }
  }
  this.selectedInternship = internship;
  }
  // Gérer la sélection de fichier (CV)
onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      console.log("Fichier encodé :", reader.result); // Vérification
      this.addApplicationForm.patchValue({ cv: reader.result  });
    };
    reader.readAsDataURL(file);
  }
}

  
  openAddApplicationModal(internship: Internship): void {
    this.modalService.open(this.addApplicationModal);
  }
  
 

  // Soumettre une candidature
 
onSubmitAddApplication():void{
  if (this.addApplicationForm.invalid)return;
  if (this.addApplicationForm.invalid || !this.selectedInternship) {
    alert("Veuillez sélectionner un stage avant de postuler !");
    return;
  }
 const applicationData = {
    ...this.addApplicationForm.value,
    internshipId: this.selectedInternship?.internshipId // Ajouter l'ID du stage
  };
  applicationData.status = this.addApplicationForm.value.status; // Assigner le statut

    this.applicationService.addApplication(applicationData).subscribe(()=>{
    this.modalService.dismissAll();
    this.addApplicationForm.reset();
    this.getApplications();
  })
}
  getApplications() {
    this.applicationService.getApplications().subscribe((data: Application[]) => {
      this.applications = data;
    });
  }

  

  // Modifier une candidature
  editApplication(application: Application): void {
    this.selectedInternship = application.internship || null; // Ensure it's null if undefined
    this.application = { ...application }; // Copy the application data
  }

  // Mettre à jour une candidature
  updateApplication(): void {
    if (this.application.applicationId) {
      this.applicationService
        .updateApplication(this.application.applicationId, this.application)
        .subscribe({
          next: (response: Application) => {
            alert('Application updated successfully!');
            this.cancelApplication();
          },
          error: (error: any) => {
            alert('Error updating application. Please try again.');
          },
        });
    }
  }

  // Supprimer une candidature
  deleteApplication(applicationId: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationService.deleteApplication(applicationId).subscribe({
        next: () => {
          alert('Application deleted successfully!');
          this.getInternships(); // Recharger la liste des stages
        },
        error: (error: any) => {
          alert('Error deleting application. Please try again.');
        },
      });
    }
  }

  // Annuler la candidature
  cancelApplication(): void {
    this.selectedInternship = null;
    this.application = {
      applicationId: 0,
      status: ApplicationStatus.PENDING,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      cv: '', // Réinitialiser à une chaîne vide
      internshipId: 0,
      internship: null,
    };
  }
  

}