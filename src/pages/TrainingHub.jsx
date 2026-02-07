import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getFeaturedCourses, tracks } from '../data/trainingCourses';

const advantageItems = [
  {
    title: '证书体系',
    desc: '结业考核后发放对应培训证书，支持岗位能力证明。'
  },
  {
    title: '师资带教',
    desc: '由实战导师授课，结合真实案例讲解服务流程。'
  },
  {
    title: '实操训练',
    desc: '重点课程配置线下实操，提升上岗落地能力。'
  },
  {
    title: '就业支持',
    desc: '提供岗位方向建议与面试表达指导，提升转化效率。'
  }
];

const steps = ['咨询评估', '选课报名', '系统学习', '结业考核', '发证上岗'];

const TrainingHub = () => {
  const featuredCourses = getFeaturedCourses();

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <section className="training-hub-hero rounded-3xl p-6 md:p-10">
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-[#194F92]">职业技能培训中心</p>
              <h1 className="mt-3 text-3xl md:text-5xl font-bold text-[#1F2937] leading-tight">
                一站式培训入口，
                <span className="text-[#C73A5C]">清晰路径直达就业岗位</span>
              </h1>
              <p className="mt-4 text-base md:text-lg text-[#4B5563] leading-7">
                按就业方向组织课程，从母婴照护到中医康复再到健康管理，快速匹配适合你的学习路线。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href="tel:01053608360" className="training-primary-btn">立即咨询</a>
              </div>
            </div>
          </section>

          <section className="mt-10 md:mt-14">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#1F2937]">就业方向</h2>
              <span className="text-sm text-[#6B7280]">共 {tracks.length} 个方向</span>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {tracks.map((track) => (
                <Link key={track.slug} to={`/training/tracks/${track.slug}`} className="training-track-card">
                  <p className="text-xs font-medium text-[#194F92]">职业方向</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#1F2937]">{track.name}</h3>
                  <p className="mt-2 text-sm text-[#6B7280] leading-6">{track.positioning}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-xs text-[#9CA3AF]">{track.courseSlugs.length} 门课程</span>
                    <span className="text-sm font-medium text-[#C73A5C]">进入方向页 →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12 md:mt-16">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-[#1F2937]">热门科目</h2>
              <span className="text-sm text-[#6B7280]">左右滑动查看更多</span>
            </div>
            <div className="mt-5 training-scroll-row">
              {featuredCourses.map((course) => (
                <Link key={course.slug} to={`/training/courses/${course.slug}`} className="training-course-chip">
                  <div>
                    <p className="text-base font-semibold text-[#1F2937]">{course.name}</p>
                    <p className="mt-2 text-xs text-[#6B7280]">{course.durationTag} · {course.hours}</p>
                  </div>
                  <span className="mt-3 text-sm font-medium text-[#194F92]">查看课程详情</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white/90 border border-[#F3D5DC] p-6">
              <h2 className="text-2xl font-semibold text-[#1F2937]">培训优势</h2>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {advantageItems.map((item) => (
                  <article key={item.title} className="rounded-xl bg-[#FFF8FA] border border-[#F3D5DC] p-4">
                    <h3 className="text-base font-semibold text-[#1F2937]">{item.title}</h3>
                    <p className="mt-2 text-sm text-[#6B7280] leading-6">{item.desc}</p>
                  </article>
                ))}
              </div>
            </div>

            <div id="training-online-form" className="rounded-2xl bg-white/90 border border-[#F3D5DC] p-6">
              <h2 className="text-2xl font-semibold text-[#1F2937]">报名流程</h2>
              <ol className="mt-5 space-y-3">
                {steps.map((step, index) => (
                  <li key={step} className="training-step-item">
                    <span className="training-step-index">{index + 1}</span>
                    <span className="text-sm md:text-base text-[#374151]">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-6 rounded-xl bg-[#FFF8FA] border border-[#F3D5DC] p-4">
                <p className="text-sm text-[#4B5563] leading-6">
                  留资后由教务顾问在 1 个工作日内回访，协助你完成方向匹配、班型选择和开班安排。
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <div className="training-floating-cta" aria-label="培训咨询快捷入口">
        <a href="tel:01053608360">电话咨询</a>
      </div>

      <Footer />
    </div>
  );
};

export default TrainingHub;
