import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/questions.model';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:3000/api/questions'; // Base URL of your Express API

  constructor(private http: HttpClient) { }

  // GET all questions
  getQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(this.apiUrl).pipe(
      map(data => data.map(item => this.convertKeysToLowerCase(item))),
      catchError((error) => {
        console.error('Error fetching questions:', error);
        throw new Error('Failed to load questions');
      })
    );
  }

  // POST a new question
  addQuestion(question: Question): Observable<Question> {
    const payload = {
      fields: { ...question }
    };
    return this.http.post<Question>(this.apiUrl, payload).pipe(
      catchError((error) => {
        console.error('Error adding question:', error);
        throw new Error('Failed to add question');
      })
    );
  }

  // PUT (update) an existing question by _recordId
  updateQuestion(_recordId: string, question: Partial<Question>): Observable<Question> {
    const payload = {
      fields: { ...question }
    };
    return this.http.put<Question>(`${this.apiUrl}/${_recordId}`, payload).pipe(
      catchError((error) => {
        console.error('Error updating question:', error);
        throw new Error('Failed to update question');
      })
    );
  }

  // PATCH (partial update) a question by _recordId
  patchQuestion(_recordId: string, question: Partial<Question>): Observable<Question> {
    const payload = {
      fields: { ...question }
    };
    return this.http.patch<Question>(`${this.apiUrl}/${_recordId}`, payload).pipe(
      catchError((error) => {
        console.error('Error patching question:', error);
        throw new Error('Failed to patch question');
      })
    );
  }

  // DELETE a question by _recordId
  deleteQuestion(_recordId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${_recordId}`).pipe(
      catchError((error) => {
        console.error('Error deleting question:', error);
        throw new Error('Failed to delete question');
      })
    );
  }

  // Utility method to convert object keys to lower case
  private convertKeysToLowerCase(item: any): any {
    const newObject: any = {};
    Object.keys(item).forEach(key => {
      const keyReplaced = key.replace(/\s/g, '');
      const lowerCaseKey = keyReplaced.charAt(0).toLowerCase() + keyReplaced.slice(1);
      newObject[lowerCaseKey] = item[key];
    });
    return newObject;
  }
}
