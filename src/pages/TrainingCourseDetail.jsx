import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getCourseBySlug, getTrackBySlug } from '../data/trainingCourses';

const TrainingCourseDetail = () => {
  const { courseSlug } = useParams();
  const course = getCourseBySlug(courseSlug);
  const track = course ? getTrackBySlug(course.trackSlug) : null;

  if (!course || !track) return <Navigate to="/training" replace />;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-12 md:py-16 pb-28 md:pb-16">
        <div className="container mx-auto px-4">
          <section className="training-detail-hero rounded-2xl p-6 md:p-8">
            <div className="text-sm text-[#194F92]">
              <Link to="/training" className="hover:underline">培训中心</Link>
              <span className="mx-2 text-[#9CA3AF]">/</span>
              <Link to={`/training/tracks/${track.slug}`} className="hover:underline">{track.name}</Link>
              <span className="mx-2 text-[#9CA3AF]">/</span>
              <span>{course.name}</span>
            </div>

            <h1 className="mt-3 text-3xl md:text-4xl font-bold text-[#1F2937]">{course.name}</h1>
            <p className="mt-4 text-[#4B5563] leading-7 max-w-3xl">{course.summary}</p>
            <p className="mt-2 text-sm text-[#6B7280]">适合人群：{course.audience}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a href="tel:01053608360" className="training-primary-btn">立即报名</a>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">课程介绍</h2>
              <div className="mt-4 space-y-3">
                {course.introParagraphs.map((paragraph, index) => (
                  <p key={`${course.slug}-intro-${index}`} className="training-paragraph">{paragraph}</p>
                ))}
              </div>
            </article>

            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">报考对象</h2>
              <p className="mt-4 training-paragraph">{course.examTarget}</p>
            </article>
          </section>

          <section className="mt-6 rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
            <h2 className="training-section-title">课程设置</h2>
            <p className="mt-4 training-paragraph">{course.curriculumNote}</p>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              <div className="training-info-pill">
                <span className="training-pill-label">学习周期</span>
                <span>{course.durationTag}</span>
              </div>
              <div className="training-info-pill">
                <span className="training-pill-label">课程学时</span>
                <span>{course.hours}</span>
              </div>
              <div className="training-info-pill">
                <span className="training-pill-label">学习方式</span>
                <span>{course.mode}</span>
              </div>
              <div className="training-info-pill">
                <span className="training-pill-label">费用与班型</span>
                <span>{course.priceNote}</span>
              </div>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">报名须知</h2>
              <ul className="mt-4 space-y-2">
                {course.registrationNotice.map((item, index) => (
                  <li key={`${course.slug}-notice-${index}`} className="training-list-item">{item}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">就业方向</h2>
              <ul className="mt-4 space-y-2">
                {course.employmentDirections.map((item, index) => (
                  <li key={`${course.slug}-job-${index}`} className="training-list-item">{item}</li>
                ))}
              </ul>
            </article>
          </section>

          <section className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">培训时间与地点</h2>
              <div className="mt-4 space-y-3">
                <p className="training-paragraph"><span className="font-medium text-[#1F2937]">培训时间：</span>{course.trainingTime}</p>
                <p className="training-paragraph"><span className="font-medium text-[#1F2937]">培训地点：</span>{course.trainingLocation}</p>
              </div>
            </article>

            <article className="rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
              <h2 className="training-section-title">证书展示</h2>
              <div className="mt-4 training-certificate-frame">
                <img src={course.certificateImage} alt={course.certificateImageAlt} className="training-certificate-image" />
              </div>
              <p className="mt-3 text-sm text-[#4B5563] leading-6">{course.certificate}</p>
            </article>
          </section>

          <section id="training-contact" className="mt-6 rounded-2xl border border-[#F3D5DC] bg-white/95 p-6">
            <h2 className="training-section-title">联系我们</h2>
            <div className="mt-4 space-y-2">
              <p className="training-paragraph"><span className="font-medium text-[#1F2937]">招生电话：</span>{course.contactInfo.phone}</p>
              <p className="training-paragraph"><span className="font-medium text-[#1F2937]">招生地址：</span>{course.contactInfo.address}</p>
            </div>
          </section>
        </div>
      </main>

      <div className="training-mobile-cta">
        <a href={`tel:${course.contactInfo.phone}`}>电话咨询</a>
        <a href={`tel:${course.contactInfo.phone}`}>立即报名</a>
      </div>

      <Footer />
    </div>
  );
};

export default TrainingCourseDetail;
