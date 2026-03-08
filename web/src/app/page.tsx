import { supabase } from "@/lib/supabase";
import { HomeFeed } from "@/components/HomeFeed";
import { Article } from "@/types";

export const revalidate = 0; // Temporarily bypass cache to load new fallback icons

export default async function Home() {
  const { data: rawArticles, error } = await supabase
    .from("news_items")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
  }

  const articles: Article[] = (rawArticles || []).map((item: any) => {
    let sourceName = "Unknown";
    try {
      if (item.source_url) {
        const url = new URL(item.source_url);
        sourceName = url.hostname.replace("www.", "");
      }
    } catch (e) {
      // ignore
    }

    return {
      id: item.id,
      title: item.title,
      summary: item.summary,
      category: item.category,
      source: sourceName,
      link: item.source_url,
      image_url: item.image_url,
      published_at: item.published_at,
      created_at: item.created_at,
    };
  });

  return (
    <main className="min-h-screen">
      <HomeFeed initialArticles={articles} />
    </main>
  );
}

