-- supabase_schema.sql
-- This schema defines the tables required for the AIBrief24 application.

CREATE TABLE news_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Model Updates', 'New AI Tools', 'SaaS Launches', 'Startup News')),
    source_url TEXT NOT NULL UNIQUE,
    image_url TEXT,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optional: Create an index on category and published_at for faster queries
CREATE INDEX idx_news_items_category ON news_items(category);
CREATE INDEX idx_news_items_published_at ON news_items(published_at DESC);
