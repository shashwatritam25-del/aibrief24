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
                
                articles.append({
                    "title": title,
                    "summary": summary,
                    "category": "Model Updates",
                    "source_url": link,
                    "image_url": "https://huggingface.co/front/assets/huggingface_logo-noborder.svg" # default hf image
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
                
                articles.append({
                    "title": title,
                    "summary": summary,
                    "category": "Startup News",
                    "source_url": link,
                    "image_url": "https://techcrunch.com/wp-content/uploads/2015/02/cropped-cropped-favicon-1.png"
                })
        return articles
    except Exception as e:
        print(f"Error scraping TechCrunch: {e}")
        return []

from playwright.sync_api import sync_playwright

def scrape_producthunt_ai():
    print("Scraping Product Hunt AI with Playwright...")
    try:
        articles = []
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
            page.goto("https://www.producthunt.com/topics/artificial-intelligence", timeout=15000)
            
            # Wait for loaded posts
            page.wait_for_selector("a[data-test='post-name']", timeout=5000)
            
            items = page.locator("a[data-test='post-name']").all()[:3]
            for item in items:
                title = item.inner_text().strip()
                link = "https://www.producthunt.com" + item.get_attribute("href")
                summary = f"New AI product launch: {title} on Product Hunt."
                
                articles.append({
                    "title": title,
                    "summary": summary,
                    "category": "New AI Tools",
                    "source_url": link,
                    "image_url": "https://ph-static.imgix.net/ph-logo-1.png"
                })
            browser.close()
        return articles
    except Exception as e:
        print(f"Error scraping Product Hunt: {e}")
        return []

def scrape_yc_launches():
    print("Scraping YC Launches with Playwright as fallback...")
    try:
        articles = []
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            page = browser.new_page(user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36")
            page.goto("https://www.ycombinator.com/launches", timeout=15000)
            
            # Wait for loaded titles
            page.wait_for_selector(".launch-title", timeout=5000)
            
            items = page.locator("a.launch-title").all()[:3]
            for item in items:
                title = item.inner_text().strip()
                link = "https://www.ycombinator.com" + item.get_attribute("href")
                summary = "A new product launched by Y Combinator."
                
                articles.append({
                    "title": title,
                    "summary": summary,
                    "category": "SaaS Launches",
                    "source_url": link,
                    "image_url": "https://news.ycombinator.com/y18.svg"
                })
            browser.close()
        return articles
    except Exception as e:
        print(f"Error scraping YC: {e}")
        return []


def save_to_supabase(articles):
    print(f"Saving {len(articles)} articles to Supabase...")
    saved_count = 0
    for article in articles:
        try:
            # Check if it already exists to avoid unique constraint errors
            existing = supabase.table("news_items").select("id").eq("source_url", article["source_url"]).execute()
            if not existing.data:
                supabase.table("news_items").insert(article).execute()
                saved_count += 1
                print(f"Saved: {article['title']}")
            else:
                print(f"Skipped (already exists): {article['title']}")
        except Exception as e:
            print(f"Error inserting {article['title']}: {e}")
    print(f"Total newly saved articles: {saved_count}")

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
