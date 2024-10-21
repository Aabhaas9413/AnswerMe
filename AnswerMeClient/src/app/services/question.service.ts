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
    // Convert Date objects to strings in MM/DD/YYYY format before sending
    const payload = {
        fields: {
            "companyName": question.companyName ?? '',
            "_companyId": question._companyId ?? '',
            "question": question.question ?? '',
            "answer": question.answer ?? '',
            "createdAt": this.formatDate(question.createdAt) ?? '',
            "createdBy": question.createdBy ?? '',
            "updatedAt": this.formatDate(question.updatedAt) ?? '',
            "updatedBy": question.updatedBy ?? '',
            "assignedTo": question.assignedTo ?? '',
            "properties": question.properties ? JSON.stringify(question.properties) : '{}',
            "questionDescription": question.questionDescription ?? ''
        }
    };

    // Remove fields with empty strings or undefined values
    const cleanedPayload = {
        fields: Object.fromEntries(
            Object.entries(payload.fields).filter(([key, value]) => value !== '' && value !== undefined)
        )
    };

    return this.http.post<Question>(this.apiUrl, cleanedPayload).pipe(
        catchError((error) => {
            console.error('Error adding question:', error);
            throw new Error('Failed to add question');
        })
    );
}

// Utility function to convert Date objects to MM/DD/YYYY format
private formatDate(date: Date): string {
    if (!date) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}


updateQuestion(_recordId: string, question: Partial<Question>): Observable<Question> {
  // Convert the `question` object to match the Airtable format with correct camelCase keys
  const payload = {
    fields: {
      companyName: question.companyName ?? '',
      _companyId: question._companyId ?? '',
      question: question.question ?? '',
      answer: question.answer ?? '',
      createdAt: question.createdAt ? this.formatDate(new Date(question.createdAt)) : '',
      createdBy: question.createdBy ?? '',
      updatedAt: question.updatedAt ? this.formatDate(new Date(question.updatedAt)) : '',
      updatedBy: question.updatedBy ?? '',
      assignedTo: question.assignedTo ?? '',
      properties: question.properties ? question.properties : {}, // Keep properties as an object
      questionDescription: question.questionDescription ?? ''
    }
  };

  // Clean the payload to remove any empty or undefined fields
  const cleanedPayload = {
    fields: Object.fromEntries(
      Object.entries(payload.fields).filter(([_, value]) => value !== '' && value !== undefined)
    )
  };

  console.log('Prepared Payload for Update:', cleanedPayload); // Log to verify payload

  return this.http.put<Question>(`${this.apiUrl}/${_recordId}`, cleanedPayload).pipe(
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
