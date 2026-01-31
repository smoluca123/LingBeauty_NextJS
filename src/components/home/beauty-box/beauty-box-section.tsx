'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { beautyBoxCategories, getArticlesByCategory } from './data';
import { Button } from '@/components/ui/button';
import { SectionHeadingCenter } from '@/components/home/section-heading';

export default function BeautyBoxSection() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredArticles = useMemo(
    () => getArticlesByCategory(activeTab),
    [activeTab],
  );

  return (
    <section className="">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          {/* <h2 className="mb-8 text-3xl font-bold uppercase tracking-wide text-foreground md:mb-10 md:text-4xl">
            GÓC ĐẸP BEAUTY BOX
          </h2> */}
          <SectionHeadingCenter
            title="GÓC ĐẸP BEAUTY BOX"
            subtitle="Khám phá những bài viết hay về làm đẹp"
            eyebrow="BEAUTY"
            className="w-full"
          />

          {/* Tabs */}
          <div className="-mx-4 overflow-x-auto px-4 scrollbar-hide">
            <div className="flex min-w-max justify-center gap-6 px-4 md:gap-8">
              {beautyBoxCategories.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  variant="ghost"
                  className={cn(
                    'relative pb-3 text-sm font-medium transition-colors duration-300 md:text-base',
                    'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5',
                    'after:bg-primary-pink after:transition-transform after:duration-300',
                    activeTab === tab.id
                      ? 'font-semibold text-foreground after:scale-x-100'
                      : 'text-muted-foreground after:scale-x-0 hover:text-foreground',
                  )}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:mb-16 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <article
              key={article.id}
              className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                {/* Badge */}
                <div className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-primary-pink shadow-md backdrop-blur-sm">
                  {article.category}
                </div>

                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-snug text-foreground">
                  {article.title}
                </h3>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground flex-1">
                  {article.description}
                </p>

                {/* Meta Info */}
                {(article.author || article.readTime) && (
                  <div className="mt-4 flex items-center gap-3 border-t border-border pt-4 text-xs text-muted-foreground h-fit">
                    {article.author && (
                      <span className="flex items-center gap-1">
                        <span>✍️</span>
                        {article.author}
                      </span>
                    )}
                    {article.readTime && (
                      <span className="flex items-center gap-1">
                        <span>⏱️</span>
                        {article.readTime}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Button className="rounded-full border-2 border-foreground bg-white px-12 py-4 text-base font-semibold text-foreground shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-foreground hover:text-white hover:shadow-xl active:translate-y-0  cursor-pointer">
            Tất cả bài viết
          </Button>
        </div>
      </div>
    </section>
  );
}
