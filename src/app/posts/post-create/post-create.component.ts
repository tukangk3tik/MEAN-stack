import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "src/app/model/PostModel";
import { PostService } from "src/app/service/posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  /**
   * when page load, post will be empty, there will be error.
   * To avoid it error, use null safety (?) in template like post?.title
   */
  isLoading = false;  //status for loading
  private mode = 'create';
  private postId?: string;

  constructor (public postsService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId')?.toString();
        if (this.postId !== undefined) {
          //set loading true
          this.isLoading = true;

          //work synchronously
          this.postsService.getPostDetail(this.postId)
            .subscribe(postData => {
              //set loading false when receive data
              this.isLoading = false;

              this.post = {id: postData._id, title: postData.title, content: postData.content}
            });
        }
      } else {
        this.mode = 'create';
        this.postId = undefined;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      if (this.postId !== undefined)
        this.postsService.updatePost(
          this.postId,
          form.value.title,
          form.value.content
        );
    }

    form.resetForm();
  }

}
