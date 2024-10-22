import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Question } from '../models/questions.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnswerModalComponent } from "../answer-modal/answer-modal.component";
import { QuestionModalComponent } from '../question-modal/question-modal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import Fuse from 'fuse.js';
declare const $: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [CommonModule, FormsModule, AnswerModalComponent,QuestionModalComponent, NgxPaginationModule]
})
export class DashboardComponent implements OnInit {
  questions: Question[] = [];
  selectedQuestion: any = {} as Question;
  isEditMode: boolean = false;
  searchTerm: string = ''; // To bind the search input
  currentPage: number = 1; 
  fuse: Fuse<Question> = new Fuse([]); 
  allQuestions: Question[] = []; 
  uniqueAssignedUsers: string[] = []; 
  selectedAssignedTo: string = '';
  constructor(private questionService: QuestionService) { }
  

  ngOnInit(): void {
   this.getQuestions()
}
initializeFuse() {
  const options = {
    keys: ['question', 'answer'], 
    includeScore: true,           
    threshold: 0.2,               
  };

  this.fuse = new Fuse(this.questions, options);
}
getQuestions(){
  this.questionService.getQuestions().subscribe(
    (data: Question[]) => {
        this.questions = data.map(q => ({
            ...q,
            answer: q.answer ? q.answer.replace(/\s+/g, '') : q.answer,
            createdAt: new Date(q.createdAt),
            updatedAt: new Date(q.updatedAt)
        }));
        this.allQuestions = [...this.questions]; 
        this.extractUniqueAssignedUsers();
        this.initializeFuse();
    },
    (error) => {
        console.error('Error loading questions:', error.message);
    }
); 
}

extractUniqueAssignedUsers() {
  const usersSet = new Set<string>();
  this.allQuestions.forEach(question => {
    if (question.assignedTo) {
      const assignedUsers = question.assignedTo.split(',').map(user => user.trim());
      assignedUsers.forEach(user => usersSet.add(user));
    }
  });
  this.uniqueAssignedUsers = Array.from(usersSet);
}

filterByAssignedTo() {
  if (this.selectedAssignedTo) {
    this.questions = this.allQuestions.filter(q => q.assignedTo?.includes(this.selectedAssignedTo));
  } else {
    this.questions = [...this.allQuestions];
  }
}

filterQuestions() {
  if (this.searchTerm.trim() === '' && !this.selectedAssignedTo) {
    this.questions = [...this.allQuestions]; 
    return;
  }

  const searchResults = this.fuse.search(this.searchTerm);
  const filteredResults = searchResults.map(result => result.item);
  if (this.selectedAssignedTo) {
    filteredResults.length !== 0 ?
    this.questions = filteredResults.filter(q => q.assignedTo?.includes(this.selectedAssignedTo)):
    this.questions = this.questions.filter(q => q.assignedTo?.includes(this.selectedAssignedTo));
  } else {
    this.questions = filteredResults;
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
  removeWhiteSpace(field: any): void {
    if (this.selectedQuestion  && this.selectedQuestion[field]) {
        this.selectedQuestion[field] = this.selectedQuestion[field].replace(/\s+/g, '');
    }
  }
}
