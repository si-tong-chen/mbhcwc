import React, { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getCoursesByTrackSlug, getTrackBySlug } from '../data/trainingCourses';

const durationOptions = ['全部周期', '4-8周', '8-12周', '12周以上'];

const TrainingTrack = () => {
  const { trackSlug } = useParams();
  const track = getTrackBySlug(trackSlug);
  const courses = getCoursesByTrackSlug(trackSlug);

  const [durationFilter, setDurationFilter] = useState('全部周期');
  const [practicalFilter, setPracticalFilter] = useState('全部');
  const [certificateFilter, setCertificateFilter] = useState('全部');

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const durationMatched = durationFilter === '全部周期' || course.durationTag === durationFilter;
        const practicalMatched =
          practicalFilter === '全部' ||
          (practicalFilter === '含实操' && course.hasPractical) ||
          (practicalFilter === '纯理论' && !course.hasPractical);
        const certificateMatched =
          certificateFilter === '全部' ||
          (certificateFilter === '可考证' && course.hasCertificate) ||
          (certificateFilter === '不考证' && !course.hasCertificate);

        return durationMatched && practicalMatched && certificateMatched;
      }),
    [courses, durationFilter, practicalFilter, certificateFilter]
  );

  if (!track) return <Navigate to="/training" replace />;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <section className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6 md:p-8">
            <div className="text-sm text-[#194F92]">
              <Link to="/training" className="hover:underline">培训中心</Link>
              <span className="mx-2 text-[#9CA3AF]">/</span>
              <span>{track.name}</span>
            </div>

            <h1 className="mt-3 text-3xl font-bold text-[#1F2937]">{track.name}</h1>
            <p className="mt-3 text-[#4B5563] leading-7">{track.positioning}</p>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#F3D5DC] bg-[#FFF8FA] p-4">
                <p className="text-sm font-medium text-[#194F92]">适合人群</p>
                <p className="mt-2 text-sm text-[#4B5563]">{track.audience.join('、')}</p>
              </div>
              <div className="rounded-xl border border-[#F3D5DC] bg-[#FFF8FA] p-4">
                <p className="text-sm font-medium text-[#194F92]">就业岗位</p>
                <p className="mt-2 text-sm text-[#4B5563]">{track.jobRoles.join('、')}</p>
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-2xl border border-[#F3D5DC] bg-white/95 p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#6B7280]">学习周期</span>
                {durationOptions.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setDurationFilter(item)}
                    className={`training-filter-btn ${durationFilter === item ? 'is-active' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#6B7280]">实操</span>
                {['全部', '含实操', '纯理论'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPracticalFilter(item)}
                    className={`training-filter-btn ${practicalFilter === item ? 'is-active' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-[#6B7280]">证书</span>
                {['全部', '可考证', '不考证'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCertificateFilter(item)}
                    className={`training-filter-btn ${certificateFilter === item ? 'is-active' : ''}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <article key={course.slug} className="training-course-card">
                  <div>
                    <h2 className="text-lg font-semibold text-[#1F2937]">
                      {course.name}
                    </h2>
                    <p className="mt-2 text-sm text-[#6B7280] leading-6">{course.audience}</p>
                  </div>
                  <div className="mt-4 space-y-1 text-sm text-[#4B5563]">
                    <p>学习周期：{course.durationTag}</p>
                    <p>课程学时：{course.hours}</p>
                    <p>证书：{course.hasCertificate ? '支持' : '不支持'}</p>
                  </div>
                  <Link to={`/training/courses/${course.slug}`} className="mt-5 training-inline-link">
                    查看详情 →
                  </Link>
                </article>
              ))}
            </div>

            {!filteredCourses.length ? (
              <div className="mt-6 rounded-xl border border-dashed border-[#E5C0C8] bg-[#FFF8FA] p-6 text-sm text-[#6B7280]">
                当前筛选条件下暂无课程，请调整筛选条件后再试。
              </div>
            ) : null}
          </section>

          <section className="mt-6 rounded-2xl border border-[#F3D5DC] bg-white/95 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[#1F2937]">方向咨询</h3>
              <p className="mt-2 text-sm text-[#6B7280]">不确定选哪门课？教务顾问可根据你的基础和目标给出推荐路径。</p>
            </div>
            <div className="flex gap-3">
              <a href="tel:01053608360" className="training-primary-btn">电话咨询</a>
              <Link to="/training" className="training-secondary-btn">返回培训中心</Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrainingTrack;
