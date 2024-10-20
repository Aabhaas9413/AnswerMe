import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, pipe, catchError } from 'rxjs';
import { Question } from '../models/questions.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private jsonUrl = 'assets/sample.json';

  constructor(private http: HttpClient) { }
  getQuestions(): Observable<Question[]> {
    return this.http.get<any[]>(this.jsonUrl).pipe(
      map(data => data.map(item => this.convertKeysToLowerCase(item))),
      catchError((error) => {
        console.error('Error fetching questions:', error);
        throw new Error('Failed to load questions');
      })
    );
  }

  private convertKeysToLowerCase(item: any): any {
    const newObject: any = {};
    Object.keys(item).forEach(key => {
      const keyReplaced = key.replace(/\s/g, '')
      const lowerCaseKey = keyReplaced.charAt(0).toLowerCase() + keyReplaced.slice(1);
      newObject[lowerCaseKey] = item[key];
    });
    return newObject;
  }
}
