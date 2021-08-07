import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/service/auth.service";

import { PostService } from "src/app/service/posts.service";
import { Post } from "../../model/PostModel";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: "First Post", content: "This is the first post's content"},
  //   {title: "Second Post", content: "This is the second post's content"},
  //   {title: "Third Post", content: "This is the third post's content"}
  // ];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 10;
  postPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(public postService: PostService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPost(this.postPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPost(this.postPerPage, this.currentPage);
  }

  onDelete(postId?: string) {
    this.isLoading = true;
    if (postId !== undefined) {
      this.postService.deletePost(postId).subscribe(() => {
       this.postService.getPost(this.postPerPage, this.currentPage);
      }, () => {
        this.isLoading = false;
      });
    }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
