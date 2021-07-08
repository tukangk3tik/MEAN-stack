import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

import { Post } from "../model/PostModel";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPost() {
    this.http.get<{message: String, posts: Post[]}>('http://localhost:3000/api/post')
      .subscribe((postData) => {
          this.posts = postData.posts;
          this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: undefined, title: title, content: content};
    this.http
      .post<{message: string}>("http://localhost:3000/api/post", post)
      .subscribe(responseData => {
        console.log(responseData.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
