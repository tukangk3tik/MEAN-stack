export interface Post {
  title?: string;
  content?: string;
  imagePath?: string;
  id?: string;
  creator?: string;
}

export interface PostApi {
  title: string;
  content: string;
  imagePath: string;
  _id: string;
  creator: string;
}
