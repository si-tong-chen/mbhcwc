import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getExpertVoiceBySlug } from '../data/expertVoices';

const ExpertVoiceDetail = () => {
  const { slug } = useParams();
  const expert = getExpertVoiceBySlug(slug);

  if (!expert) {
    return <Navigate to="/experts" replace />;
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="max-w-6xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md overflow-hidden">
            <div className="px-6 md:px-10 py-8 border-b border-[#E5C0C8]/60 bg-[linear-gradient(120deg,#FFF8FA_0%,#FDF2F5_100%)]">
              <Link to="/experts" className="text-sm text-[#194F92] hover:underline">
                返回名家名说
              </Link>
            </div>

            <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
              <aside className="rounded-2xl border border-[#E5C0C8]/60 bg-[#FFF9FB] overflow-hidden">
                <img src={expert.image} alt={expert.name} className="w-full h-72 object-cover" />
                <div className="p-5">
                  <h1 className="text-2xl font-semibold text-gray-900">{expert.name}</h1>
                  <p className="mt-2 text-sm text-[#194F92]">{expert.title}</p>
                  <p className="mt-1 text-sm text-gray-500">{expert.institution}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {expert.topics.map((topic) => (
                      <span key={topic} className="text-xs px-2.5 py-1 rounded-full bg-[#F9E5EA] text-[#A84A62]">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </aside>

              <article>
                <blockquote className="rounded-2xl border border-[#E5C0C8]/60 bg-[#FFF8FA] p-6 text-lg leading-8 text-gray-700">
                  “{expert.quote}”
                </blockquote>

                <section className="mt-6">
                  <h2 className="text-xl font-semibold text-gray-900">名家简介</h2>
                  <p className="mt-3 text-gray-700 leading-8">{expert.intro}</p>
                </section>

                <section className="mt-8">
                  <h2 className="text-xl font-semibold text-gray-900">核心观点</h2>
                  <ul className="mt-4 space-y-3">
                    {expert.insights.map((insight) => (
                      <li key={insight} className="rounded-xl border border-[#E5C0C8]/50 bg-white p-4 text-gray-700 leading-7">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </section>
              </article>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ExpertVoiceDetail;
