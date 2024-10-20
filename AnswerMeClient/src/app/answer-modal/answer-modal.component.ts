import { Component, Input } from '@angular/core';
import { Question } from '../models/questions.model';
import { FormsModule } from '@angular/forms';
declare const $: any;

@Component({
  selector: 'app-answer-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './answer-modal.component.html',
  styleUrl: './answer-modal.component.css'
})
export class AnswerModalComponent {
@Input() selectedQuestion: Question = {} as Question; 
@Input() questions: Question[] = [];

  saveAnswer() {
    const index = this.questions.findIndex(q => q._recordId === this.selectedQuestion._recordId);
    if (index !== -1) {
      this.questions[index].answer = this.selectedQuestion.answer; 
      this.questions[index].updatedAt = new Date();
    }
    $('#answerModal').modal('hide'); // Close the modal
  }

  closeModal(){
    $('#answerModal').modal('hide');
  }
}
