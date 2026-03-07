import os
import requests
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
TELEGRAM_CHANNEL_ID = os.getenv("TELEGRAM_CHANNEL_ID", "").strip()

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_top_daily_news():
    # Get news from the last 24 hours
    yesterday = (datetime.utcnow() - timedelta(days=1)).isoformat()
    try:
        response = supabase.table("news_items") \
            .select("*") \
            .gte("created_at", yesterday) \
            .order("created_at", desc=True) \
            .limit(3) \
            .execute()
        return response.data
    except Exception as e:
        print(f"Error fetching from Supabase: {e}")
        return []

def format_telegram_message(items):
    if not items:
        return None
        
    msg = "🚀 *AIBrief24 Daily Digest* 🚀\n"
    msg += "Cutting through the noise to bring you the signal.\n\n"
    
    for i, item in enumerate(items, 1):
        number_emoji = ["1️⃣", "2️⃣", "3️⃣"][i-1] if i <= 3 else f"{i}."
        msg += f"{number_emoji} *{item['title']}*\n\n"
        msg += f"The Brief: {item['summary']}\n"
        msg += f"🔗 [Source Link]({item['source_url']})\n\n"
        
    msg += "💡 Read more deep dives at: [aibrief24.com](https://aibrief24.com)\n"
    msg += "#AI #SaaS #TechNews #AIBrief24"
    return msg

def send_telegram_message(text):
    if not text:
        print("No message to send.")
        return
        
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHANNEL_ID,
        "text": text,
        "parse_mode": "Markdown",
        "disable_web_page_preview": False
    }
    
    try:
        response = requests.post(url, json=payload, timeout=10)
        response.raise_for_status()
        print("Successfully sent message to Telegram!")
    except Exception as e:
        print(f"Error sending message to Telegram: {e}")
        if 'response' in locals() and hasattr(response, 'text'):
            print(response.text)

def main():
    print("Fetching today's top news...")
    top_news = get_top_daily_news()
    
    if not top_news:
        print("No news found for today. Exiting.")
        return
        
    print(f"Found {len(top_news)} news items. Formatting message...")
    message = format_telegram_message(top_news)
    
    print("Sending to Telegram...")
    send_telegram_message(message)

if __name__ == "__main__":
    main()
