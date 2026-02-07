import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getHealthLectureBySlug } from '../data/healthLectures';

const HealthLectureDetail = () => {
  const { slug } = useParams();
  const lecture = getHealthLectureBySlug(slug);

  if (!lecture) return <Navigate to="/lectures" replace />;

  const isPast = new Date(lecture.dateTime) < new Date();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <article className="max-w-4xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="mb-6 flex items-center justify-between gap-3">
              <Link to="/lectures" className="text-sm text-[#194F92] hover:underline">返回讲堂列表</Link>
              {!isPast && (
                <Link to={`/lectures/book?lecture=${lecture.slug}`} className="px-3 py-1.5 text-sm rounded-full bg-[#194F92] text-white hover:bg-[#143B70]">
                  预约讲座
                </Link>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">{lecture.title}</h1>
            <div className="mt-4 pb-5 border-b border-[#E5C0C8]/60 text-sm text-gray-500 space-y-1">
              <p>主讲人：{lecture.speaker}（{lecture.speakerTitle}）</p>
              <p>时间：{new Date(lecture.dateTime).toLocaleString('zh-CN', { hour12: false })}</p>
              <p>地点：{lecture.location}</p>
            </div>

            <div className="mt-6 flex items-start gap-4">
              <img src={lecture.avatar} alt={lecture.speaker} className="w-16 h-16 rounded-full object-cover border border-[#EFB7BA]/60" />
              <p className="text-gray-700 leading-8">{lecture.summary}</p>
            </div>

            <div className="mt-8 space-y-5 text-[17px] leading-8 text-gray-700">
              {lecture.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {isPast && lecture.videoUrl && (
              <div className="mt-10 pt-6 border-t border-[#E5C0C8]/60">
                <a
                  href={lecture.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-4 py-2 rounded-full bg-[#C73A5C] text-white text-sm hover:bg-[#B83250]"
                >
                  观看往期讲座视频
                </a>
              </div>
            )}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthLectureDetail;
