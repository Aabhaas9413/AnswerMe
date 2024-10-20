import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/questions.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnswerModalComponent } from "../answer-modal/answer-modal/answer-modal.component";
import { QuestionModalComponent } from '../question-modal/question-modal/question-modal.component';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, AnswerModalComponent, QuestionModalComponent]
})
export class DashboardComponent implements OnInit {
  questions: Question[] = [];
  selectedQuestion: Question = {} as Question;
  isEditMode: boolean = false;
  constructor(private questionService: QuestionService) { }
  

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe(
      (data: Question[]) => {
        this.questions = data.map(q => ({
          ...q,
          createdAt: new Date(q.createdAt), // Convert to Date object
          updatedAt: new Date(q.updatedAt)  // Convert to Date object
        }));
        console.log(this.questions);
      },
      (error) => {
        console.error('Error loading questions:', error.message);
      }
    );
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
    if (confirm('Are you sure you want to delete this question?')) {
      this.questions.splice(index, 1);
    }
  }

  generateId(): number {
    return Math.floor(Math.random() * 100000);
  }

}
