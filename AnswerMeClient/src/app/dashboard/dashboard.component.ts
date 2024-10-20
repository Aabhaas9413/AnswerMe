import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/questions.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnswerModalComponent } from "../answer-modal/answer-modal.component";
import { QuestionModalComponent } from '../question-modal/question-modal/question-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, AnswerModalComponent, QuestionModalComponent, NgxPaginationModule]
})
export class DashboardComponent implements OnInit {
  questions: Question[] = [];
  selectedQuestion: Question = {} as Question;
  isEditMode: boolean = false;
  searchTerm: string = ''; // To bind the search input
  currentPage: number = 1; 
  constructor(private questionService: QuestionService) { }
  

  ngOnInit(): void {
   this.getQuestions()
}

getQuestions(){
  this.questionService.getQuestions().subscribe(
    (data: Question[]) => {
        this.questions = data.map(q => ({
            ...q,
            createdAt: new Date(q.createdAt),
            updatedAt: new Date(q.updatedAt)
        }));
    },
    (error) => {
        console.error('Error loading questions:', error.message);
    }
); 
}

filterQuestions() {
  const term = this.searchTerm.toLowerCase();
  if (term) {
      this.questions = this.questions.filter(q => 
          q.question.toLowerCase().includes(term) || 
          (q.answer && q.answer.toLowerCase().includes(term))
      );
  } else {
      this.getQuestions(); // Reset to original list
  }
}
  openModal(question: Question) {
    this.selectedQuestion = { ...question }; // Clone the question to prevent direct modification
    $('#editAnswerModal').modal('show'); // Open the modal
  }

  openQuestionModal(question?: Question) {
    this.isEditMode = !!question;
    this.selectedQuestion = question ? 
      { ...question } : 
      {
        _recordId: this.generateId(),
        companyName: 'Test Company', // Default company name
        _companyId: 1, // Default or generated company ID
        question: '',
        answer: '',
        createdAt: new Date(),
        createdBy: 'user@example.com', // Placeholder for the current user's email
        updatedAt: new Date(),
        updatedBy: 'user@example.com',
        assignedTo: '',
        properties: {},
        questionDescription: ''
      };
    $('#questionModal').modal('show');
  }
 
  openAnswerModal(question: Question) {
    this.selectedQuestion = { ...question };
    $('#answerModal').modal('show');
  }

  deleteQuestion(index: number) {
    const questionId = this.questions[index]._recordId;
    if (confirm('Are you sure you want to delete this question?')) {
        this.questionService.deleteQuestion(questionId.toString()).subscribe(() => {
            this.questions.splice(index, 1);
        });
    }
}

  generateId(): number {
    return Math.floor(Math.random() * 100000);
  }

}
