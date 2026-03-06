import { supabase } from "@/lib/supabase";
import { HomeFeed } from "@/components/HomeFeed";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching articles:", error);
  }

  return (
    <main className="min-h-screen">
      <HomeFeed initialArticles={articles || []} />
    </main>
  );
}
