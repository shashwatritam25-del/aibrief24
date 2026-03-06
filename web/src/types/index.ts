export interface Article {
  id: string;
  title: string;
  source: string;
  link: string;
  summary: string;
  category: string;
  image_url: string | null;
  published_at: string;
  created_at: string;
}
