import { Component, EventEmitter, Output } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from "../../model/PostModel";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
  enteredTitle = '';
  enteredContent = '';
  @Output() postCreated = new EventEmitter<Post>();

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const post = {
      title: form.value.title,
      content: form.value.content
    }

    this.postCreated.emit(post);
  }

}
