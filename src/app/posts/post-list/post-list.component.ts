import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";

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
  private postsSub: Subscription;

  constructor(public postService: PostService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPost(this.postPerPage, this.currentPage);
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: {posts: Post[], postCount: number}) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1;
    this.postPerPage = pageData.pageSize;
    this.postService.getPost(this.postPerPage, this.currentPage);
  }

  onDelete(postId?: string) {
    if (postId !== undefined) {
      this.postService.deletePost(postId).subscribe(() => {
       this.postService.getPost(this.postPerPage, this.currentPage);
      });
    }
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
