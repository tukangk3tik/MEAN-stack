import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap} from "@angular/router";
import { Post } from "src/app/model/PostModel";
import { PostService } from "src/app/service/posts.service";
import { mimeType } from "./mime-type.validator";

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
  form : FormGroup;
  imagePreview: string;
  private mode = 'create';
  private postId?: string;

  constructor (public postsService: PostService, public route: ActivatedRoute) { }

  ngOnInit() {
    /**
     * Form validation
     */
    this.form = new FormGroup({
      'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
      'content': new FormControl(null, {validators: [Validators.required]}),
      'image': new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

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

              this.post = {
                id: postData._id,
                title: postData.title,
                content: postData.content,
                imagePath: null,
              }

              this.form.setValue({
                title: this.post.title,
                content: this.post.content
              })
            });
        }
      } else {
        this.mode = 'create';
        this.postId = undefined;
      }
    });
  }

  //for image picker
  onImagePicked(event: Event) {
    const getFile = (event.target as HTMLInputElement).files;

    if (getFile !== null) {
      const file = getFile[0];
      this.form.patchValue({image: file});
      this.form.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      }
      reader.readAsDataURL(file);

    }
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
    } else {
      if (this.postId !== undefined)
        this.postsService.updatePost(
          this.postId,
          this.form.value.title,
          this.form.value.content
        );
    }

    this.form.reset();
  }

}
