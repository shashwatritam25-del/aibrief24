import os
import time
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHANNEL_ID = os.getenv("TELEGRAM_CHANNEL_ID")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_og_image(url):
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"}
        res = requests.get(url, headers=headers, timeout=10)
        soup = BeautifulSoup(res.text, "html.parser")
        meta_og = soup.find("meta", property="og:image")
        if meta_og and meta_og.get("content"):
            return meta_og["content"]
    except Exception as e:
        print(f"Error fetching og:image for {url}: {e}")
    return None

def scrape_huggingface_papers():
    print("Scraping Hugging Face Papers...")
    url = "https://huggingface.co/papers"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        
        articles = []
        # HuggingFace papers typically use h3 for titles
        for article in soup.select("article")[:3]: # limit to top 3 for now
            title_elem = article.select_one("h3")
            link_elem = article.select_one("h3 a")
            summary_elem = article.select_one("p")
            
            if title_elem and link_elem:
                title = title_elem.text.strip()
                link = "https://huggingface.co" + link_elem["href"]
                summary = summary_elem.text.strip() if summary_elem else "A new paper published on Hugging Face."
                img = article.select_one("img")
                img_url = get_og_image(link)
                
                if not img_url:
                    if img and "src" in img.attrs:
                        src = img["src"]
                        img_url = f"https://huggingface.co{src}" if src.startswith("/") else src
                
                articles.append({
                    "title": title,
                    "summary": summary,
                    "category": "Model Updates",
                    "source_url": link,
                    "image_url": img_url
                })
        return articles
    except Exception as e:
        print(f"Error scraping HF: {e}")
        return []

def scrape_techcrunch_ai():
    print("Scraping TechCrunch AI...")
    url = "https://techcrunch.com/category/artificial-intelligence/"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "html.parser")
        
        articles = []
        for article in soup.select(".loop-card")[:3]:
            title_elem = article.select_one("h2, .loop-card__title a")
            summary_elem = article.select_one(".loop-card__content")
            
            if title_elem:
                title = title_elem.text.strip()
                link = title_elem["href"] if title_elem.name == "a" else title_elem.find("a")["href"]
                summary = summary_elem.text.strip() if summary_elem else "Read the latest AI news on TechCrunch."
                img = article.select_one("img")
                img_url = get_og_image(link)
                
                if not img_url:
                    if img and "src" in img.attrs:
                        img_url = img["src"]
                    elif img and "srcset" in img.attrs:
                        img_url = img["srcset"].split()[0]
                
                articles.append({
                    "title": title,
                    "summary": summary,
                    "category": "Startup News",
                    "source_url": link,
                    "image_url": img_url
                })
        return articles
    except Exception as e:
        print(f"Error scraping TechCrunch: {e}")
        return []

import re

def scrape_producthunt_ai():
    print("Scraping Product Hunt AI via RSS...")
    try:
        url = "https://www.producthunt.com/feed?category=artificial-intelligence"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, "xml")
        
        articles = []
        for item in soup.find_all("entry")[:3]:
            title_elem = item.find("title")
            link_elem = item.find("link")
            summary_elem = item.find("content")
            
            if title_elem and link_elem:
                title = title_elem.text.strip()
                link = link_elem["href"]
                summary = BeautifulSoup(summary_elem.text, "html.parser").text.strip() if summary_elem else f"New AI product launch: {title} on Product Hunt."
                
                # Product Hunt blocks fetching og:image and thum.io returns Cloudflare challenges.
                # Returning None ensures the frontend uses the clean, dynamic `<TrendingUp/>` fallback icon.
                img_url = None
                
                articles.append({
                    "title": title,
                    "summary": summary[:200] + "..." if len(summary) > 200 else summary,
                    "category": "New AI Tools",
                    "source_url": link,
                    "image_url": img_url
                })
        return articles
    except Exception as e:
        print(f"Error scraping Product Hunt: {e}")
        return []

import html
import json

def scrape_yc_launches():
    print("Scraping YC Launches via embedded JSON...")
    try:
        url = "https://www.ycombinator.com/launches"
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        articles = []
        for line in response.text.split('\n'):
            if "total_vote_count" in line:
                extracted = re.findall(r'(\[{"id":\d+,"title":.*?}\])', line)
                if extracted:
                    js = json.loads(extracted[0])
                    for item in js[:3]:
                        title = item.get("title", "")
                        tagline = item.get("tagline", "")
                        link = item.get("search_path", "")
                        if not link.startswith("http"):
                            link = "https://www.ycombinator.com" + link
                        summary = tagline if tagline else "A new product launched by Y Combinator."
                        
                        img_url = get_og_image(link)
                        
                        articles.append({
                            "title": title,
                            "summary": summary,
                            "category": "SaaS Launches",
                            "source_url": link,
                            "image_url": img_url
                        })
                    break # Only parse the first matching chunk
                    
        return articles
    except Exception as e:
        print(f"Error scraping YC: {e}")
        return []


def save_to_supabase(articles):
    print(f"Saving {len(articles)} articles to Supabase...")
    saved_count = 0
    updated_count = 0
    for article in articles:
        try:
            # Check if it already exists to avoid unique constraint errors
            existing = supabase.table("news_items").select("id, image_url").eq("source_url", article["source_url"]).execute()
            if not existing.data:
                supabase.table("news_items").insert(article).execute()
                saved_count += 1
                print(f"Saved: {article['title']}")
            else:
                if not existing.data[0].get("image_url") and article.get("image_url"):
                    supabase.table("news_items").update({"image_url": article["image_url"]}).eq("id", existing.data[0]["id"]).execute()
                    updated_count += 1
                    print(f"Updated Image: {article['title']}")
                else:
                    print(f"Skipped (already exists): {article['title']}")
        except Exception as e:
            print(f"Error inserting/updating {article['title']}: {e}")
    print(f"Total newly saved articles: {saved_count}")
    print(f"Total backfilled images: {updated_count}")

def main():
    print("Starting AIBrief24 Scraper...")
    all_articles = []
    
    hf_papers = scrape_huggingface_papers()
    tc_news = scrape_techcrunch_ai()
    ph_tools = scrape_producthunt_ai()
    yc_launches = scrape_yc_launches()
    
    all_articles.extend(hf_papers)
    all_articles.extend(tc_news)
    all_articles.extend(ph_tools)
    all_articles.extend(yc_launches)
    
    if all_articles:
        save_to_supabase(all_articles)
    else:
        print("No articles scraped.")

if __name__ == "__main__":
    main()
