export interface Meme {
  id?: number;
  topText: string;
  bottomText: string;
  imageUrl: string;
  customImage?: File;
}

export interface MemeTemplate {
  id: number;
  name: string;
  url: string;
}