import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { InternshipService } from '../../../services/internship.service';
import { ApplicationService } from '../../../services/application.service';
import { Internship } from 'src/app/models/Internship.model';
import { Application, ApplicationStatus } from 'src/app/models/Application.model';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RatingService } from 'src/app/services/rating.service';
import { ChatbotService } from 'src/app/services/chatbot.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as QRCode from 'qrcode';


@Component({
  selector: 'app-internships',
  templateUrl: './internships.component.html',
  styleUrls: ['./internships.component.css'],
})
export class InternshipsComponent implements OnInit {

// Add these properties
availableSkills: string[] = [
  'JavaScript', 'TypeScript', 'Angular', 'React', 'Vue.js',
  'Node.js', 'Python', 'Java', 'C#', 'PHP',
  'HTML', 'CSS', 'SQL', 'Git', 'Docker'
];
selectedSkills: string[] = [];
customSkillInput: string = '';

// Add these methods
isSkillSelected(skill: string): boolean {
  return this.selectedSkills.includes(skill);
}

toggleSkill(skill: string): void {
  if (this.isSkillSelected(skill)) {
    this.selectedSkills = this.selectedSkills.filter(s => s !== skill);
  } else {
    this.selectedSkills.push(skill);
  }
}

addCustomSkill(event: Event): void {
  const input = event.target as HTMLInputElement;
  const skill = input.value.trim();
  if (skill && !this.availableSkills.includes(skill)) {
    this.availableSkills.push(skill);
    this.selectedSkills.push(skill);
    input.value = '';
  }
}

addCustomSkillFromInput(): void {
  const skillInput = document.querySelector('.skill-input') as HTMLInputElement;
  if (skillInput) {
    const skill = skillInput.value.trim();
    if (skill && !this.availableSkills.includes(skill)) {
      this.availableSkills.push(skill);
      this.selectedSkills.push(skill);
      skillInput.value = '';
    }
  }
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
  chatbot = {
    isOpen: false, // Fermé par défaut
    userMessage: '',
    messages: [
      { sender: 'bot', text: 'Bonjour ! Je suis votre assistant pour les stages. Comment puis-je vous aider ?' }
    ],
    isLoading: false,
    suggestions: [
      "Comment rédiger un bon CV ?",
      "Quels documents faut-il pour postuler ?",
      "Comment se préparer pour un entretien ?"
    ]
  };
  

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
    private ChatbotService: ChatbotService
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
      skills: this.fb.array([]), // This should be initialized as empty array
      languages: this.fb.array([this.createLanguageEntry()])
    });
   
  }
  createSkillEntry(): FormGroup {
    return this.fb.group({
      name: ['']
    });
  }

toggleChatbot(): void {
  this.chatbot.isOpen = !this.chatbot.isOpen;
  if (this.chatbot.isOpen && this.chatbot.messages.length === 0) {
    this.chatbot.messages.push({ 
      sender: 'bot', 
      text: 'Bonjour ! Je suis votre assistant pour les stages. Comment puis-je vous aider ?' 
    });
  }
}
sendChatbotMessage(): void {
  const message = this.chatbot.userMessage.trim();
  if (!message) return;

  // Ajouter le message de l'utilisateur
  this.chatbot.messages.push({ sender: 'user', text: message });
  this.chatbot.userMessage = '';
  this.chatbot.isLoading = true;

  // Envoyer la question au service
  this.ChatbotService.askQuestion(message).subscribe({
    next: (response: string) => {
      this.chatbot.messages.push({ sender: 'bot', text: response });
      this.chatbot.isLoading = false;
    },
    error: (error) => {
      this.chatbot.messages.push({ 
        sender: 'bot', 
        text: 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.' 
      });
      this.chatbot.isLoading = false;
      console.error('Chatbot error:', error);
    }
  });
}

selectSuggestion(suggestion: string): void {
  this.chatbot.userMessage = suggestion;
  this.sendChatbotMessage();
}
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
  alert('Brouillon enregistré avec succès!');
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
    <div class="cv-header" style="background: linear-gradient(135deg, #802020 0%, #802020 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; color: white;font-size: 32px; font-weight: 700;">${cvData.personalInfo.fullName}</h1>
      <p style="margin: 5px 0; font-size: 16px; opacity: 0.9;">
        ${cvData.personalInfo.email} | ${cvData.personalInfo.phone || ''}
      </p>
      ${cvData.personalInfo.address ? `<p style="margin: 0; font-size: 14px;">📍 ${cvData.personalInfo.address}</p>` : ''}
    </div>

    <div class="cv-body" style="padding: 20px; background: white; border-radius: 0 0 8px 8px;">
      <!-- Profil -->
      ${cvData.personalInfo.profile ? `
      <div class="section" style="margin-bottom: 20px;">
        <h2 style="color: #802020; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-size: 20px;">PROFIL</h2>
        <p style="line-height: 1.6;">${cvData.personalInfo.profile}</p>
      </div>` : ''}

      <!-- Compétences -->
      <div class="section" style="margin-bottom: 20px;">
        <h2 style="color: #802020; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-size: 20px;">COMPÉTENCES</h2>
        <div class="skills" style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${this.selectedSkills.map(skill => `
            <span style="background: #e0d6f0; color: #802020; padding: 5px 10px; border-radius: 15px; font-size: 14px;">
              ${skill}
            </span>
          `).join('')}
        </div>
      </div>

      <!-- Expérience -->
      ${cvData.experiences.length > 0 ? `
      <div class="section" style="margin-bottom: 20px;">
        <h2 style="color: #802020; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-size: 20px;">EXPÉRIENCE</h2>
        ${cvData.experiences.map((exp: { title: any; company: any; period: any; description: any; }) => `
          <div style="margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 18px; color: #333;">${exp.title} • ${exp.company}</h3>
            <p style="margin: 5px 0; color: #666; font-style: italic;">${exp.period || ''}</p>
            <p style="margin: 0; line-height: 1.5;">${exp.description || ''}</p>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Formation -->
      <div class="section" style="margin-bottom: 20px;">
        <h2 style="color: #802020; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-size: 20px;">FORMATION</h2>
        ${cvData.education.map((edu: { degree: any; institution: any; year: any; }) => `
          <div style="margin-bottom: 15px;">
            <h3 style="margin: 0; font-size: 18px; color: #333;">${edu.degree}</h3>
            <p style="margin: 5px 0; color: #666;">${edu.institution || ''} ${edu.year ? `(${edu.year})` : ''}</p>
          </div>
        `).join('')}
      </div>

      <!-- Langues -->
      ${cvData.languages.length > 0 ? `
      <div class="section" style="margin-bottom: 20px;">
        <h2 style="color: #802020; border-bottom: 2px solid #f0f0f0; padding-bottom: 5px; font-size: 20px;">LANGUES</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 10px;">
          ${cvData.languages.map((lang: { name: any; level: any; }) => `
            <div style="background: #f5f5f5; padding: 8px 12px; border-radius: 5px;">
              <span style="font-weight: bold;">${lang.name}</span>: ${lang.level}
            </div>
          `).join('')}
        </div>
      </div>` : ''}

      <!-- QR Code (optionnel) -->
      <div class="qr-code-container">
      <!-- QR Code sera ajouté dynamiquement -->
    </div>
  `;

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

  // Options pour une meilleure qualité
  const options = {
    scale: 3, // Résolution élevée
    logging: false,
    useCORS: true,
    allowTaint: true,
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: previewElement.scrollWidth,
    windowHeight: previewElement.scrollHeight
  };

  try {
    const canvas = await html2canvas(previewElement, options);
    const imgData = canvas.toDataURL('image/png', 1.0); // Qualité maximale
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgRatio = canvas.width / canvas.height;
    const pdfRatio = pageWidth / pageHeight;

    let imgWidth, imgHeight;
    if (imgRatio > pdfRatio) {
      imgWidth = pageWidth;
      imgHeight = pageWidth / imgRatio;
    } else {
      imgHeight = pageHeight;
      imgWidth = pageHeight * imgRatio;
    }

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`CV_${this.cvForm.value.personalInfo.fullName}.pdf`);
  } catch (error) {
    console.error('Erreur PDF:', error);
    alert('Erreur lors de la génération du PDF');
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