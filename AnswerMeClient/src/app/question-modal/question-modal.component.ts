import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Question } from '../../models/questions.model';
import { QuestionService } from '../../services/question.service';
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


constructor(private questionService: QuestionService) {

}
addQuestion() {
  this.selectedQuestion.createdAt = new Date(); // Keep as Date object
  this.selectedQuestion.updatedAt = new Date(); // Keep as Date object

  this.questionService.addQuestion(this.selectedQuestion).subscribe(
      (newQuestion) => {
          this.questions.unshift(newQuestion);
          $('#questionModal').modal('hide');
      },
      (error) => {
          console.error('Error adding question:', error);
      }
  );
}
closeModal(){
  $('#questionModal').modal('hide');
}

editQuestion() {
  this.questionService.updateQuestion(this.selectedQuestion._recordId.toString(), this.selectedQuestion).subscribe((data) => { 
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
