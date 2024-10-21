import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Question } from '../models/questions.model';
import { QuestionService } from '../services/question.service';
import { CommonModule } from '@angular/common';
declare const $: any;

@Component({
  selector: 'app-question-modal',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './question-modal.component.html',
  styleUrl: './question-modal.component.css'
})
export class QuestionModalComponent implements OnInit {
  @Input() selectedQuestion: Question = {} as Question; 
  @Input() isEditMode: boolean = false;
  @Input() questions: Question[] = [];
  assignedEmails: string[] = [];

constructor(private questionService: QuestionService) {

}

ngOnInit() {
  if (!this.isEditMode && this.selectedQuestion.assignedTo) {
    this.assignedEmails = this.selectedQuestion.assignedTo.split(',').map(email => email.trim());
  }
}

addEmail() {
  if(this.validateEmail())
  this.assignedEmails.push('');  
}

removeEmail(index: number) {
  this.assignedEmails.splice(index, 1);
}

validateEmail(): boolean {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  for (let i = 0; i < this.assignedEmails.length; i++) {
    const assignedEmail = this.assignedEmails[i];
    if (assignedEmail && !emailPattern.test(assignedEmail)) {
      alert('Please enter a valid email address.');
      return false;
    }
  }
  return true;
}

trackByFn(index: number, item: any): number {
  return index; // or item.id if it's an object with a unique ID
}

addQuestion() {
  // Convert `assignedEmails` array to a comma-separated string
  if (this.validateEmail()) {
    this.selectedQuestion.assignedTo = this.assignedEmails.filter(email => email).join(', ');

    this.selectedQuestion.createdAt = new Date();
    this.selectedQuestion.updatedAt = new Date();

    this.questionService.addQuestion(this.selectedQuestion).subscribe(
      (newQuestions:any) => {
        // Add all created questions to the front of the array
        this.questions.unshift(...newQuestions); 
        $('#questionModal').modal('hide');
      },
      (error) => {
        console.error('Error adding question:', error);
      }
    );
  }
}


closeModal(){
  $('#questionModal').modal('hide');
}

editQuestion() {
  this.questionService.updateQuestion(this.selectedQuestion._recordId.toString(), this.selectedQuestion).subscribe(() => {
    const index = this.questions.findIndex(q => q._recordId === this.selectedQuestion._recordId);
    if (index !== -1) {
      this.questions[index] = { ...this.selectedQuestion, updatedAt: new Date() };
    }
    $('#questionModal').modal('hide');
  });
}


  saveQuestion() {
    if (this.isEditMode) {
      this.editQuestion();
    } else {
      this.addQuestion();
    }
  }
}
