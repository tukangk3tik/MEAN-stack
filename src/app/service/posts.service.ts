import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post, PostApi } from "../model/PostModel";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPost() {
    this.http
      .get<{message: String, posts: PostApi[]}>('http://localhost:3000/api/post')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe(transformedPosts => {
          this.posts = transformedPosts;
          this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: any = {title: title, content: content};
    this.http
      .post<{message: string, returnId: string}>("http://localhost:3000/api/post", post)
      .subscribe(responseData => {
        console.log(responseData.message);
        post.id = responseData.returnId; //get the return id for adding to the list

        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/post/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
