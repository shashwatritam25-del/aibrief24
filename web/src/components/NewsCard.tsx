"use client";

import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Clock, TrendingUp } from "lucide-react";
import { Article } from "@/types";

interface NewsCardProps {
  article: Article;
  index?: number;
}

export function NewsCard({ article, index = 0 }: NewsCardProps) {
  const publishedDate = new Date(article.published_at);
  const formattedDate = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-white/[0.03] border border-white/[0.05] hover:border-indigo-500/30 transition-all duration-500 backdrop-blur-xl hover:shadow-[0_0_40px_rgba(79,70,229,0.15)]"
    >
      <div className="relative h-56 w-full overflow-hidden bg-white/[0.02]">
        {article.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={article.image_url}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
            <TrendingUp className="h-12 w-12 text-white/20" />
          </div>
        )}
        <div className="absolute top-4 left-4 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md border border-white/10 uppercase">
          {article.category}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 z-10">
        <div className="flex items-center gap-2 text-xs text-white/50 mb-4 font-medium tracking-wide">
          <span className="text-indigo-400 capitalize">{article.source}</span>
          <span>•</span>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <h3 className="mb-3 text-xl font-bold leading-snug text-white/90 group-hover:text-indigo-300 transition-colors line-clamp-2">
          {article.title}
        </h3>
        
        <p className="mb-6 flex-1 text-sm leading-relaxed text-white/60 line-clamp-3">
          {article.summary}
        </p>

        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors mt-auto w-fit group/link"
        >
          Read full article
          <ExternalLink className="w-4 h-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
      </div>
      
      {/* Decorative gradient blob */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
    </motion.div>
  );
}
