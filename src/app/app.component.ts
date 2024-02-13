import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Post } from './post.model';
import { PostService } from './post.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;
  constructor(private postService: PostService, private http: HttpClient) {}

  ngOnInit() {
    this.errorSub = this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });
    this.isFetching = true;

    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        // this.error=error.error.error

        // this.error=error.status
        this.error = error.message;
      }
    );
  }

  onCreatePost(postData: Post, postForm: NgForm) {
    // Send Http request
    // console.log(postData);
    this.postService.createAndStorePosts(postData);
    postForm.reset();
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;

    this.postService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }
  onHandleError() {
    this.error = null;
  }
  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }
  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
