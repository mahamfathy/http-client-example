import { Injectable } from '@angular/core';
import { Post } from './post.model';
import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  error = new Subject<string>();
  constructor(private http: HttpClient) {}
  createAndStorePosts(postData: Post) {
    this.http
      .post<{ name: string }>(
        'https://ng-complete-course-a06be-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response',
        }
      )
      .subscribe((responseData) => {
        // console.log(responseData.headers),
        console.log(responseData),
          (error) => {
            this.error.next(error.message);
          };
      });
  }
  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    searchParams = searchParams.append('custom', 'key');
    return this.http
      .get<{ [key: string]: Post }>(
        'https://ng-complete-course-a06be-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello Maha' }),
          //  params: new HttpParams().set('print','pretty')
          params: searchParams,
          responseType: 'json', //this is the default for javascript
          //  responseType: 'text' //this is used to convert it to text not the default
        }
      )
      .pipe(
        map((resposeData) => {
          const postsArray: Post[] = [];
          for (const key in resposeData) {
            if (resposeData.hasOwnProperty(key)) {
              postsArray.push({ ...resposeData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  deletePosts() {
    return this.http
      .delete(
        'https://ng-complete-course-a06be-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events',
        }
      )
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
