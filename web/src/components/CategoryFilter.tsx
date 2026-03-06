"use client";

import { motion } from "framer-motion";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-12">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectCategory(null)}
        className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
          selectedCategory === null
            ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-400/50"
            : "bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white border border-white/10"
        }`}
      >
        All News
      </motion.button>

      {categories.map((category) => (
        <motion.button
          key={category}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(category)}
          className={`px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 capitalize ${
            selectedCategory === category
              ? "bg-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] border border-indigo-400/50"
              : "bg-white/[0.03] text-white/60 hover:bg-white/[0.08] hover:text-white border border-white/10"
          }`}
        >
          {category}
        </motion.button>
      ))}
    </div>
  );
}
