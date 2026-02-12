import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { healthLecturesUpcoming } from '../data/healthLectures';

const HealthLectureBooking = () => {
  const [searchParams] = useSearchParams();
  const preferredLecture = searchParams.get('lecture') || '';
  const [submitted, setSubmitted] = useState(false);
  const upcomingLectures = useMemo(
    () => [...healthLecturesUpcoming].sort((a, b) => {
      const bySort = Number(a.sort_order || 0) - Number(b.sort_order || 0);
      if (bySort !== 0) return bySort;
      return new Date(a.dateTime) - new Date(b.dateTime);
    }),
    []
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="max-w-3xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-bold text-gray-900">预约讲座</h1>
              <Link to="/lectures" className="text-sm text-[#194F92] hover:underline">返回讲堂列表</Link>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm text-gray-700 mb-2">姓名</label>
                <input required className="w-full px-3 py-2 rounded border border-[#E5C0C8]/70 focus:outline-none focus:ring-2 focus:ring-[#EFB7BA]/60" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">手机号</label>
                <input required className="w-full px-3 py-2 rounded border border-[#E5C0C8]/70 focus:outline-none focus:ring-2 focus:ring-[#EFB7BA]/60" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">选择讲座</label>
                <select
                  defaultValue={preferredLecture}
                  className="w-full px-3 py-2 rounded border border-[#E5C0C8]/70 focus:outline-none focus:ring-2 focus:ring-[#EFB7BA]/60"
                >
                  <option value="">请选择讲座</option>
                  {upcomingLectures.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.title}（{new Date(item.dateTime).toLocaleString('zh-CN', { hour12: false })}）
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">备注</label>
                <textarea rows={4} className="w-full px-3 py-2 rounded border border-[#E5C0C8]/70 focus:outline-none focus:ring-2 focus:ring-[#EFB7BA]/60" />
              </div>
              <button type="submit" className="px-4 py-2 rounded-full bg-[#194F92] text-white hover:bg-[#143B70]">
                提交预约
              </button>
            </form>

            {submitted && (
              <div className="mt-5 rounded-lg bg-[#EEF6FF] border border-[#B7D3F5] px-4 py-3 text-sm text-[#194F92]">
                预约已提交，我们会尽快与您联系确认讲座席位。
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HealthLectureBooking;
