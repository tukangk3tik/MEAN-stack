import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post, PostApi } from "../model/PostModel";

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router : Router) {}

  routeTo(route?: string) {
    this.router.navigate(["/"]);
  }

  getPost() {
    this.http
      .get<{message: String, posts: PostApi[]}>('http://localhost:3000/api/post')
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
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

  getPostDetail(id: string) {
    //work synchronously
    return this.http.get<{ _id: string, title: string, content: string}>
      ("http://localhost:3000/api/post/" + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{message: string, post: PostApi}>(
        "http://localhost:3000/api/post",
        postData
      )
      .subscribe(responseData => {
        //get the return id for adding to the list
        const post: Post = {id: responseData.post._id,
          title: title,
          content: content,
          imagePath: responseData.post.imagePath
        }
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.routeTo();
      });
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id:id, title:title, content:content, imagePath: null };
    this.http
      .put("http://localhost:3000/api/post/" + id, post)
      .subscribe(response => {
        console.log(response)
        this.routeTo();
      });

  }

  deletePost(postId: string) {
    this.http
      .delete("http://localhost:3000/api/post/" + postId)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        this.routeTo();
      });
  }
}
