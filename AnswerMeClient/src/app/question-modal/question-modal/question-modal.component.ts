import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Question } from '../../models/questions.model';
declare const $: any;

@Component({
  selector: 'app-question-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './question-modal.component.html',
  styleUrl: './question-modal.component.css'
})
export class QuestionModalComponent {
  @Input() selectedQuestion: Question = {} as Question; 
  @Input() isEditMode: boolean = false;
  @Input() questions: Question[] = [];


  addQuestion() {
    this.selectedQuestion.createdAt = new Date();
    this.selectedQuestion.updatedAt = new Date();
    this.questions.push({ ...this.selectedQuestion });
    $('#questionModal').modal('hide');
  }

  /**
   * Updates the existing question in the list.
   */
  editQuestion() {
    const index = this.questions.findIndex(q => q._recordId === this.selectedQuestion._recordId);
    if (index !== -1) {
      this.questions[index] = { ...this.selectedQuestion, updatedAt: new Date() };
    }
    $('#questionModal').modal('hide');
  }

  saveQuestion() {
    if (this.isEditMode) {
      this.editQuestion();
    } else {
      this.addQuestion();
    }
  }
}
