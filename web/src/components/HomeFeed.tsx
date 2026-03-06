"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Article } from "@/types";
import { NewsCard } from "./NewsCard";
import { CategoryFilter } from "./CategoryFilter";

export function HomeFeed({ initialArticles }: { initialArticles: Article[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    return Array.from(new Set(initialArticles.map((a) => a.category))).sort();
  }, [initialArticles]);

  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return initialArticles;
    return initialArticles.filter((a) => a.category === selectedCategory);
  }, [initialArticles, selectedCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-semibold tracking-wide mb-6 border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            Live AI Updates
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50 mb-6 drop-shadow-sm">
            The Bleeding Edge of AI
          </h1>
          <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-medium leading-relaxed">
            Curated, real-time intelligence on Artificial Intelligence, Machine Learning, and Robotics. Stay ahead of the curve.
          </p>
        </motion.div>
      </div>

      <div className="flex justify-center">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 text-white/40 font-medium text-lg">
          No articles found for this category.
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4 }}
              >
                <NewsCard article={article} index={index} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
