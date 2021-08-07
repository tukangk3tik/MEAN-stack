import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from "src/environments/environment";

import { Post, PostApi } from "../model/PostModel";

const BACKEND_URL = environment.apiUrl + '/post/';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router : Router) {}

  routeTo(route?: string) {
    this.router.navigate(["/"]);
  }

  getPost(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;

    this.http
      .get<{message: String, posts: PostApi[], maxPosts: number}>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        //returning object
        return { posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            imagePath: post.imagePath,
            id: post._id,
            creator: post.creator
          }
        }), maxPosts: postData.maxPosts}
      }))
      .subscribe(transformedPostData => {
        console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPostDetail(id: string) {
    //work synchronously
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>(BACKEND_URL + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{message: string, post: PostApi}>(
        BACKEND_URL,
        postData
      )
      .subscribe(responseData => {

        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    //const post: Post = { id:id, title:title, content:content, imagePath: null };
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      }
    }

    this.http
      .put(BACKEND_URL + id, postData)
      .subscribe(responseData => {

        this.router.navigate(["/"]);
      });

  }

  deletePost(postId: string) {
    return this.http
      .delete(BACKEND_URL + postId);
  }
}
