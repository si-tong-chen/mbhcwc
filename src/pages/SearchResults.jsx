import React, { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { focusNews } from '../data/focusNews';
import { associationNotices } from '../data/associationNotices';
import { internationalProjects } from '../data/internationalProjects';
import { expertVoices } from '../data/expertVoices';
import { healthLectures } from '../data/healthLectures';
import { products } from '../data/products';
import { courses as trainingCourses } from '../data/trainingCourses';
import { promoServices } from '../data/promoServices';
import { maternalTopics } from '../data/maternalTopics';

const typeMeta = {
  '焦点新闻': { color: 'text-[#194F92]', bg: 'bg-[#EAF2FF]' },
  '协会公告': { color: 'text-[#194F92]', bg: 'bg-[#EAF2FF]' },
  '国际工程': { color: 'text-[#194F92]', bg: 'bg-[#EAF2FF]' },
  '专家名说': { color: 'text-[#7C3AED]', bg: 'bg-[#F1E8FF]' },
  '健康讲堂': { color: 'text-[#C73A5C]', bg: 'bg-[#FFF0F3]' },
  '关爱产品': { color: 'text-[#0F766E]', bg: 'bg-[#E6FFFB]' },
  '培训课程': { color: 'text-[#B45309]', bg: 'bg-[#FFF7E6]' },
  '项目推广': { color: 'text-[#BE123C]', bg: 'bg-[#FFE4EC]' },
  '母婴知识': { color: 'text-[#1E40AF]', bg: 'bg-[#E8EEFF]' }
};

const normalize = (value) => (value || '').toLowerCase();

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const keyword = (searchParams.get('q') || '').trim();
  const normalizedKeyword = normalize(keyword);

  const results = useMemo(() => {
    if (!normalizedKeyword) return [];

    const records = [];

    focusNews.forEach((item) => {
      records.push({
        id: `news-${item.slug}`,
        type: '焦点新闻',
        title: item.title,
        summary: item.summary,
        date: item.date,
        path: `/news/${item.slug}`,
        haystack: normalize(`${item.title} ${item.summary} ${item.content.join(' ')}`)
      });
    });

    associationNotices.forEach((item) => {
      records.push({
        id: `notice-${item.slug}`,
        type: '协会公告',
        title: item.title,
        summary: item.summary,
        date: item.date,
        path: `/notices/${item.slug}`,
        haystack: normalize(`${item.title} ${item.summary} ${item.content.join(' ')}`)
      });
    });

    internationalProjects.forEach((item) => {
      records.push({
        id: `project-${item.slug}`,
        type: '国际工程',
        title: item.title,
        summary: item.summary,
        date: item.date,
        path: `/projects/${item.slug}`,
        haystack: normalize(`${item.title} ${item.summary} ${item.content.join(' ')}`)
      });
    });

    expertVoices.forEach((item) => {
      records.push({
        id: `expert-${item.slug}`,
        type: '专家名说',
        title: `${item.name}｜${item.title}`,
        summary: item.intro,
        date: '',
        path: `/experts/${item.slug}`,
        haystack: normalize(`${item.name} ${item.title} ${item.institution} ${item.quote} ${item.intro} ${item.topics.join(' ')}`)
      });
    });

    healthLectures.forEach((item) => {
      records.push({
        id: `lecture-${item.slug}`,
        type: '健康讲堂',
        title: item.title,
        summary: item.summary,
        date: item.dateTime,
        path: `/lectures/${item.slug}`,
        haystack: normalize(`${item.title} ${item.speaker} ${item.speakerTitle} ${item.location} ${item.summary} ${item.content.join(' ')}`)
      });
    });

    products.forEach((item) => {
      records.push({
        id: `product-${item.slug}`,
        type: '关爱产品',
        title: item.name,
        summary: item.description[0],
        date: '',
        path: `/products/${item.slug}`,
        haystack: normalize(`${item.name} ${item.category} ${item.tag} ${item.highlights.join(' ')} ${item.description.join(' ')}`)
      });
    });

    trainingCourses.forEach((item) => {
      records.push({
        id: `course-${item.slug}`,
        type: '培训课程',
        title: item.name,
        summary: item.summary,
        date: '',
        path: `/training/courses/${item.slug}`,
        haystack: normalize(`${item.name} ${item.summary} ${item.audience} ${item.certificate} ${item.priceNote}`)
      });
    });

    promoServices.forEach((item) => {
      records.push({
        id: `promo-${item.slug}`,
        type: '项目推广',
        title: item.title,
        summary: item.subtitle,
        date: '',
        path: `/promo/${item.categorySlug}/${item.slug}`,
        haystack: normalize(`${item.title} ${item.subtitle} ${item.summary} ${item.audience.join(' ')} ${item.capabilities.join(' ')} ${item.certifications.join(' ')}`)
      });
    });

    maternalTopics.forEach((topic) => {
      topic.subcategories.forEach((sub) => {
        sub.articles.forEach((article) => {
          records.push({
            id: `maternal-${topic.slug}-${sub.slug}-${article.slug}`,
            type: '母婴知识',
            title: article.title,
            summary: article.body[0],
            date: article.publishedAt,
            path: `/maternal/${topic.slug}/${sub.slug}/${article.slug}`,
            haystack: normalize(`${topic.title} ${sub.title} ${article.title} ${article.body.join(' ')}`)
          });
        });
      });
    });

    const terms = normalizedKeyword.split(/\s+/).filter(Boolean);
    const matched = records
      .filter((item) => terms.every((term) => item.haystack.includes(term)))
      .map((item) => {
        let score = 0;
        if (normalize(item.title).includes(normalizedKeyword)) score += 8;
        if (normalize(item.summary).includes(normalizedKeyword)) score += 4;
        score += Math.max(0, 3 - terms.length);
        return { ...item, score };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return String(b.date || '').localeCompare(String(a.date || ''));
      });

    return matched.slice(0, 200);
  }, [normalizedKeyword]);

  const groupedCount = useMemo(() => {
    const counter = new Map();
    results.forEach((item) => {
      counter.set(item.type, (counter.get(item.type) || 0) + 1);
    });
    return Array.from(counter.entries());
  }, [results]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <section className="max-w-6xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="pb-4 border-b border-[#E5C0C8]/60">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">全站搜索</h1>
              <p className="mt-2 text-sm text-gray-500">
                {keyword ? (
                  <>
                    关键词：<span className="text-[#194F92]">{keyword}</span>，共找到 <span className="text-[#C73A5C] font-semibold">{results.length}</span> 条结果
                  </>
                ) : (
                  '请输入关键词进行全站搜索。'
                )}
              </p>
              {groupedCount.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {groupedCount.map(([type, count]) => {
                    const meta = typeMeta[type] || { color: 'text-[#374151]', bg: 'bg-[#F3F4F6]' };
                    return (
                      <span key={type} className={`text-xs px-2 py-1 rounded-full ${meta.bg} ${meta.color}`}>
                        {type} {count}
                      </span>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <div className="mt-4 divide-y divide-[#E5C0C8]/60">
              {keyword && results.length === 0 ? (
                <div className="py-12 text-center text-gray-500">暂无匹配结果，请尝试更短或不同的关键词。</div>
              ) : null}

              {!keyword ? (
                <div className="py-12 text-center text-gray-500">可搜索：新闻、公告、项目、专家、讲堂、产品、培训、项目推广、母婴知识。</div>
              ) : null}

              {results.map((item) => {
                const meta = typeMeta[item.type] || { color: 'text-[#374151]', bg: 'bg-[#F3F4F6]' };
                return (
                  <article key={item.id} className="py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${meta.bg} ${meta.color}`}>{item.type}</span>
                          {item.date ? <span className="text-xs text-gray-400">{item.date}</span> : null}
                        </div>
                        <h2 className="mt-2 text-lg font-semibold text-gray-900 leading-7">
                          <Link to={item.path} className="hover:text-[#194F92] hover:underline">
                            {item.title}
                          </Link>
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 leading-7">{item.summary}</p>
                        <Link to={item.path} className="mt-3 inline-block text-sm text-[#194F92] hover:underline">
                          打开详情
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchResults;
