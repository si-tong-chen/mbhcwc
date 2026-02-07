import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Navigation from '../components/Navigation';
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import productHero from '../images/product_hero.jpg';
import productBook from '../images/product_book.png';
import productBp from '../images/product_bp.jpg';
import product2 from '../images/product_2.jpg';
import charityPoverty from '../images/charity_poverty.jpg';
import charityClinic from '../images/charity_clinic.jpg';
import charityEdu from '../images/charity_edu.jpg';
import { focusNews } from '../data/focusNews';
import { associationNotices } from '../data/associationNotices';
import { internationalProjects } from '../data/internationalProjects';
import { expertVoices } from '../data/expertVoices';
import { healthLectures } from '../data/healthLectures';
import { maternalTopics } from '../data/maternalTopics';
const Index = () => {
  const location = useLocation();
  const homeFocusNews = focusNews.slice(0, 3);
  const homeAssociationNotices = [...associationNotices]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);
  const homeInternationalProjects = [...internationalProjects]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);
  const homeExpertVoices = expertVoices.slice(0, 3);
  const now = new Date();
  const upcomingHomeHealthLectures = [...healthLectures]
    .filter((item) => new Date(item.dateTime) >= now)
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .slice(0, 6);
  const pastHomeHealthLectures = [...healthLectures]
    .filter((item) => new Date(item.dateTime) < now && item.videoUrl)
    .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
    .slice(0, 6);
  const [focusIndex, setFocusIndex] = useState(0);
  const [trainingCategory, setTrainingCategory] = useState('母婴');
  const [upcomingLectureIndex, setUpcomingLectureIndex] = useState(0);
  const [pastLectureIndex, setPastLectureIndex] = useState(0);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinSubmitting, setJoinSubmitting] = useState(false);
  const [joinStatus, setJoinStatus] = useState({ type: '', message: '' });
  const [joinForm, setJoinForm] = useState({
    project: '',
    name: '',
    phone: '',
    city: '',
    message: ''
  });

  useEffect(() => {
    if (homeFocusNews.length <= 1) return;
    const timer = setInterval(() => {
      setFocusIndex((prev) => (prev + 1) % homeFocusNews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [homeFocusNews.length]);

  useEffect(() => {
    if (upcomingHomeHealthLectures.length <= 1) return;
    const timer = setInterval(() => {
      setUpcomingLectureIndex((prev) => (prev + 1) % upcomingHomeHealthLectures.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [upcomingHomeHealthLectures.length]);

  useEffect(() => {
    if (pastHomeHealthLectures.length <= 1) return;
    const timer = setInterval(() => {
      setPastLectureIndex((prev) => (prev + 1) % pastHomeHealthLectures.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [pastHomeHealthLectures.length]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname !== '/' || params.get('target') !== 'contact') return;
    const timer = setTimeout(() => {
      const target = document.getElementById('contact-qr-section');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (location.pathname !== '/' || params.get('target') !== 'maternal-topic') return;
    const timer = setTimeout(() => {
      const target = document.getElementById('maternal-topic-section');
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
    return () => clearTimeout(timer);
  }, [location.pathname, location.search]);

  const currentFocus = homeFocusNews[focusIndex];
  const formatFocusDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-');
    return {
      day,
      ym: `${year}.${month}`
    };
  };
  const currentFocusDate = formatFocusDate(currentFocus.date);
  const secondaryFocus = homeFocusNews.filter((_, index) => index !== focusIndex).slice(0, 2);

  const trainingPaths = {
    母婴: {
      hero: {
        title: '母婴照护与早教服务',
        desc: '从育婴、保育到家育与情商教育，覆盖母婴服务核心岗位。',
        tags: ['入门首选', '官方推荐'],
        href: '/training/tracks/maternal-early-education'
      },
      paths: [
        {
          stageLabel: '入门',
          title: '育婴师',
          who: '适合新手与家庭照护从业者',
          tag: '入门首选',
          href: '/training/courses/yuyingshi'
        },
        {
          stageLabel: '进阶',
          title: '母婴护理师',
          who: '适合一线护理经验者提升',
          tag: '就业导向',
          href: '/training/courses/muyinghulishi'
        },
        {
          stageLabel: '专项',
          title: '情商教育培训师',
          who: '适合早教与家庭教育从业者',
          tag: '实操为主',
          href: '/training/courses/qingshangjiaoyu-peixunshi'
        }
      ],
      totalCount: 5
    },
    中医: {
      hero: {
        title: '中医康复理疗服务',
        desc: '覆盖理疗、推拿、经络、针灸与小儿推拿的完整实操路径。',
        tags: ['就业导向', '实操为主'],
        href: '/training/tracks/tcm-rehab-therapy'
      },
      paths: [
        {
          stageLabel: '入门',
          title: '中医康复理疗师',
          who: '适合健康理疗新人',
          tag: '入门首选',
          href: '/training/courses/zhongyi-kangfu-liliaoshi'
        },
        {
          stageLabel: '进阶',
          title: '中医穴位调理师',
          who: '适合有基础的调理从业者',
          tag: '官方推荐',
          href: '/training/courses/zhongyi-xuewei-tiaolishi'
        },
        {
          stageLabel: '专项',
          title: '中医针灸',
          who: '适合提升专项能力者',
          tag: '实操为主',
          href: '/training/courses/zhongyi-zhenjiu'
        }
      ],
      totalCount: 9
    },
    健康: {
      hero: {
        title: '健康管理专项路径',
        desc: '聚焦评估与干预，建立持续管理能力。',
        tags: ['入门首选', '官方推荐'],
        href: '/training/tracks/health-management'
      },
      paths: [
        {
          stageLabel: '入门',
          title: '身高管理师',
          who: '适合健康管理方向新手',
          tag: '入门首选',
          href: '/training/courses/shengao-guanlishi'
        },
        {
          stageLabel: '进阶',
          title: '健康管理师',
          who: '适合体检与慢病管理岗位',
          tag: '就业导向',
          href: '/training/courses/jiankang-guanlishi'
        },
        {
          stageLabel: '专项',
          title: '健康管理师（进阶）',
          who: '适合系统化提升干预能力',
          tag: '官方推荐',
          href: '/training/courses/jiankang-guanlishi'
        }
      ],
      totalCount: 2
    }
  };
  const currentPath = trainingPaths[trainingCategory];

  const openJoinForm = (project) => {
    setJoinStatus({ type: '', message: '' });
    setJoinForm((prev) => ({ ...prev, project }));
    setShowJoinForm(true);
  };

  const closeJoinForm = () => {
    setShowJoinForm(false);
    setJoinSubmitting(false);
  };

  const handleJoinFieldChange = (key, value) => {
    setJoinForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleJoinSubmit = async (event) => {
    event.preventDefault();
    const name = joinForm.name.trim();
    const phone = joinForm.phone.trim();
    const city = joinForm.city.trim();
    if (!name || !phone || !city) {
      setJoinStatus({ type: 'error', message: '请填写姓名、手机号和所在城市。' });
      return;
    }

    setJoinSubmitting(true);
    setJoinStatus({ type: '', message: '' });

    try {
      const response = await fetch('/api/charity-participation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: joinForm.project,
          name,
          phone,
          city,
          message: joinForm.message.trim(),
          source: 'homepage-charity'
        })
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.message || '提交失败，请稍后重试。');
      }

      setJoinStatus({ type: 'success', message: '提交成功，我们会尽快与您联系。' });
      setJoinForm({
        project: joinForm.project,
        name: '',
        phone: '',
        city: '',
        message: ''
      });
    } catch (error) {
      setJoinStatus({ type: 'error', message: error.message || '提交失败，请稍后重试。' });
    } finally {
      setJoinSubmitting(false);
    }
  };

  const projectPromos = [
    {
      title: '生育医学项目',
      desc: '国际协同生育医学服务，覆盖评估、方案与流程支持。',
      href: '/promo/reproductive-medicine',
      sceneCoverClass: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF6F8_100%)]',
      sceneLabel: '医疗协作'
    },
    {
      title: '细胞生物样本储存库',
      desc: '全球级样本储存与检测能力，支撑科研与健康管理服务。',
      href: '/promo/cell-biobank',
      sceneCoverClass: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF6F8_100%)]',
      sceneLabel: '细胞储存'
    },
    {
      title: '基因工程服务技术',
      desc: '5类基因工程技术服务，支持后续按技术类别持续扩展。',
      href: '/promo/gene-engineering',
      sceneCoverClass: 'bg-[linear-gradient(180deg,#FFFFFF_0%,#FFF6F8_100%)]',
      sceneLabel: '技术服务'
    }
  ];

  const ProjectPromoCard = ({ item }) => (
    <Link
      to={item.href}
      className="group block rounded-2xl bg-white border border-[#F6E1E6] shadow-[0_10px_30px_rgba(0,0,0,0.06)] overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4A7B9]/60"
    >
      <div className={`relative h-12 md:h-14 w-full ${item.sceneCoverClass}`}>
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white/60 to-transparent"></div>
        <div className="absolute left-5 bottom-3 px-3 py-1 rounded-full bg-[#FFF0F3] text-xs font-medium text-[#C73A5C]">
          {item.sceneLabel}
        </div>
      </div>
      <div className="p-6">
        <div className="text-lg font-semibold text-[#1F2937]">{item.title}</div>
        <div className="mt-2 text-sm text-[#6B7280] leading-6">{item.desc}</div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-[#9CA3AF]">项目介绍与服务入口</span>
          <span className="text-sm font-medium text-[#C73A5C] group-hover:text-[#B83250] group-hover:underline">查看详情 →</span>
        </div>
      </div>
    </Link>
  );
  const goPrev = () => setFocusIndex((prev) => (prev - 1 + homeFocusNews.length) % homeFocusNews.length);
  const goNext = () => setFocusIndex((prev) => (prev + 1) % homeFocusNews.length);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      {/* 添加祥云纹样背景 */}
      <div className="fixed inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5C30 5 15 20 15 40c0 15 10 25 25 30 15 5 25 15 25 30 0-15 10-25 25-30 15-5 25-15 25-30 0-20-15-35-35-35z' fill='%23d97706'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }}></div>
      
      {/* 顶部点阵纹理 */}
      <div className="fixed top-0 left-0 right-0 h-32 opacity-10 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, %23EFB7BA 1px, transparent 1px)`,
        backgroundSize: '20px 20px'
      }}></div>

      <Header />
      <Navigation />
      <Hero />
      
      {/* 最新提示和协会工作快捷入口 */}
      <div className="bg-[#DDE3F3] text-[#194F92] py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* 最新提示 - 滚动播出 */}
            <div className="flex items-center overflow-hidden">
              <span className="bg-[#EFB7BA] text-[#194F92] px-2 py-1 rounded text-sm font-bold mr-4 flex-shrink-0">最新提示</span>
              <div className="overflow-hidden whitespace-nowrap text-[#194F92]">
                <div className="inline-block animate-marquee text-[#194F92]">
                  市委常委"推销员"，生态科技带身边— 中共九江市委常委陈和民率领招商考察团进京调研
                </div>
              </div>
            </div>
            
            {/* 协会工作快捷入口 */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Link to="/training" className="flex items-center space-x-1 text-[#F53163] hover:text-[#194F92] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-sm">职业技能培训</span>
                </Link>
                <Link to="/?target=maternal-topic" className="flex items-center space-x-1 text-[#F53163] hover:text-[#194F92] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span className="text-sm">母婴工作站</span>
                </Link>
                <a href="#" className="flex items-center space-x-1 text-[#F53163] hover:text-[#194F92] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm">证书查询</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
      
      {/* 焦点新闻 - 平铺整个页面 */}
      <section className="py-16 bg-gradient-to-b from-white/70 to-[#E5C0C8]/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="bg-white/90 rounded-lg shadow-md p-6 border border-[#E5C0C8]/60">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 relative">
                焦点新闻
                <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
              </h2>
              <Link to="/news" className="text-sm font-medium text-[#194F92] hover:text-[#194F92] hover:underline">
                查看更多
              </Link>
            </div>
            
            {/* 焦点新闻主视觉区域 */}
            <div className="mb-6">
              <div className="relative rounded-lg overflow-hidden shadow-md">
                <Link to={`/news/${currentFocus.slug}`} aria-label={currentFocus.title}>
                  <img
                    src={currentFocus.image}
                    alt="焦点新闻主图"
                    className="w-full h-[271px] object-cover"
                  />
                </Link>

                <button
                  type="button"
                  aria-label="上一条"
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="下一条"
                  onClick={goNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-start">
                    {/* 日期展示块 */}
                    <div className="bg-[#EFB7BA] text-white px-4 py-3 rounded-lg mr-4 text-center">
                      <div className="text-3xl font-bold">{currentFocusDate.day}</div>
                      <div className="text-sm">{currentFocusDate.ym}</div>
                    </div>
                    {/* 新闻标题 */}
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        <Link to={`/news/${currentFocus.slug}`} className="hover:underline">
                          {currentFocus.title}
                        </Link>
                      </h3>
                      <p className="text-gray-200">{currentFocus.date}</p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 right-6 flex items-center gap-2">
                  {homeFocusNews.map((item, index) => (
                    <button
                      key={item.title}
                      type="button"
                      aria-label={`切换到第 ${index + 1} 条`}
                      onClick={() => setFocusIndex(index)}
                      className={`h-2.5 rounded-full transition ${index === focusIndex ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* 次级新闻列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {secondaryFocus.map((item) => (
                <div key={item.title} className="border-l-4 border-[#EFB7BA] pl-4 py-2">
                  <h3 className="font-semibold text-gray-900 hover:text-[#194F92] mb-1">
                    <Link to={`/news/${item.slug}`} className="hover:underline">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 第二层：协会公告和国际宫健康管理工程并列 */}
      <section className="py-16 bg-gradient-to-b from-[#FAFAFB] to-[#E5C0C8]/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 协会公告 */}
            <div className="bg-white/90 rounded-lg shadow-md p-6 border border-[#E5C0C8]/60">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 relative">
                  协会公告
                  <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
                </h2>
                <Link to="/notices" className="text-sm font-medium text-[#194F92] hover:text-[#194F92] hover:underline">
                  查看更多
                </Link>
              </div>
              <div className="space-y-4">
                {homeAssociationNotices.map((item) => (
                  <div key={item.slug} className="pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#E5C0C8]/300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 hover:text-[#194F92]">
                          <Link to={`/notices/${item.slug}`} className="hover:underline">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 国际宫健康管理工程 */}
            <div className="bg-white/90 rounded-lg shadow-md p-6 border border-[#E5C0C8]/60">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 relative">
                  国际宫健康管理工程
                  <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
                </h2>
                <Link to="/projects" className="text-sm font-medium text-[#194F92] hover:text-[#194F92] hover:underline">
                  查看更多
                </Link>
              </div>
              <div className="space-y-4">
                {homeInternationalProjects.map((item) => (
                  <div key={item.slug} className="pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start">
                      <div className="w-2 h-2 bg-[#E5C0C8]/300 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <div>
                        <h3 className="font-semibold text-gray-900 hover:text-[#194F92]">
                          <Link to={`/projects/${item.slug}`} className="hover:underline">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 专家健康大讲堂 */}
      <section className="py-16 bg-[#E5C0C8]/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-6 items-stretch">
            {/* 名家名说 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E5C0C8]/60 h-full flex flex-col col-span-12 lg:col-span-8">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 relative">
                    名家名说
                    <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
                  </h2>
                </div>
                <Link to="/experts" className="text-sm font-medium text-[#194F92] hover:text-[#194F92] hover:underline">
                  查看更多
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 flex-1 items-stretch">
                {homeExpertVoices.map((expert) => (
                  <div
                    key={expert.slug}
                    className="bg-white p-5 rounded-xl border border-[#E5C0C8]/60 shadow-sm h-full min-h-[280px] flex flex-col items-center text-center"
                  >
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="w-20 h-20 rounded-full object-cover border-2 border-[#EFB7BA]/70 bg-[#E5C0C8]/30 mt-2"
                    />

                    <h3 className="mt-4 font-semibold text-gray-900">
                      <Link to={`/experts/${expert.slug}`} className="hover:text-[#194F92] hover:underline">
                        {expert.name}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 text-center line-clamp-2">{expert.institution}</p>
                    <div className="mt-4 w-full bg-[#E5C0C8]/30 rounded-lg p-3 text-sm text-gray-700 line-clamp-4 relative">
                      <span className="absolute top-2 left-3 text-[#CBD5F0]/60 text-lg" aria-hidden="true">“</span>
                      {expert.quote}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 专家健康大讲堂 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-[#E5C0C8]/60 h-full flex flex-col col-span-12 lg:col-span-4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 relative">
                    专家健康大讲堂
                    <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
                  </h2>
                </div>
                <div className="flex items-center">
                  <Link to="/lectures" className="text-sm font-medium text-[#194F92] hover:text-[#194F92] hover:underline">
                    查看更多
                  </Link>
                  <Link to="/lectures/book" className="ml-3 px-3 py-1 text-xs rounded-full bg-[#E5C0C8]/30 text-[#194F92] border border-[#EFB7BA]/70 hover:bg-[#E5C0C8]/40">
                    预约讲座
                  </Link>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-[#194F92] mb-2">近期讲座</div>
                <ul>
                  {upcomingHomeHealthLectures.length === 0 && (
                    <li className="py-3 text-sm text-gray-500">暂无进行中或即将开始的讲座</li>
                  )}
                  {upcomingHomeHealthLectures.length > 0 && [upcomingHomeHealthLectures[upcomingLectureIndex % upcomingHomeHealthLectures.length]].map((lecture) => (
                    <li key={lecture.slug} className="flex items-center gap-4 py-4 hover:bg-[#E5C0C8]/30">
                      <img
                        src={lecture.avatar}
                        alt="专家头像"
                        className="w-12 h-12 rounded-full object-cover border border-[#EFB7BA]/60 bg-[#E5C0C8]/30" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">{lecture.title}</div>
                        <div className="text-sm text-gray-500">{new Date(lecture.dateTime).toLocaleString('zh-CN', { hour12: false })}</div>
                      </div>
                      <Link to={`/lectures/${lecture.slug}`} className="px-3 py-1 text-xs rounded-full border border-[#EFB7BA]/70 text-[#194F92] hover:bg-[#E5C0C8]/30">
                        详情
                      </Link>
                    </li>
                  ))}
                </ul>
                {upcomingHomeHealthLectures.length > 1 && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {upcomingHomeHealthLectures.map((lecture, index) => (
                      <button
                        key={lecture.slug}
                        type="button"
                        aria-label={`切换到近期讲座 ${index + 1}`}
                        onClick={() => setUpcomingLectureIndex(index)}
                        className={`h-2 rounded-full transition ${
                          index === upcomingLectureIndex % upcomingHomeHealthLectures.length
                            ? 'w-5 bg-[#194F92]/80'
                            : 'w-2 bg-[#194F92]/20 hover:bg-[#194F92]/35'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-[#E5C0C8]/60">
                <div className="text-xs font-medium text-[#C73A5C] mb-2">往期视频回放</div>
                <ul>
                  {pastHomeHealthLectures.length === 0 && (
                    <li className="py-3 text-sm text-gray-500">暂无可观看的往期回放</li>
                  )}
                  {pastHomeHealthLectures.length > 0 && [pastHomeHealthLectures[pastLectureIndex % pastHomeHealthLectures.length]].map((lecture) => (
                    <li key={lecture.slug} className="flex items-center gap-4 py-4 hover:bg-[#F9E5EA] border-b border-[#E5C0C8]/60">
                      <img
                        src={lecture.avatar}
                        alt="专家头像"
                        className="w-12 h-12 rounded-full object-cover border border-[#EFB7BA]/60 bg-[#E5C0C8]/30" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">{lecture.title}</div>
                        <div className="text-sm text-gray-500">{new Date(lecture.dateTime).toLocaleString('zh-CN', { hour12: false })}</div>
                      </div>
                      <a
                        href={lecture.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1 text-xs rounded-full border border-[#EFB7BA]/70 text-[#C73A5C] hover:bg-[#F9E5EA]"
                      >
                        视频回放
                      </a>
                    </li>
                  ))}
                </ul>
                {pastHomeHealthLectures.length > 1 && (
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {pastHomeHealthLectures.map((lecture, index) => (
                      <button
                        key={lecture.slug}
                        type="button"
                        aria-label={`切换到往期回放 ${index + 1}`}
                        onClick={() => setPastLectureIndex(index)}
                        className={`h-2 rounded-full transition ${
                          index === pastLectureIndex % pastHomeHealthLectures.length
                            ? 'w-5 bg-[#C73A5C]/80'
                            : 'w-2 bg-[#C73A5C]/20 hover:bg-[#C73A5C]/35'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 母婴健康专题 */}
      <section id="maternal-topic-section" className="maternal-topic">
        <div className="maternal-topic__band">
          <div className="maternal-topic__inner">
            <div className="maternal-topic__header">
              <div className="maternal-topic__title">
                <span>母婴健康专题</span>
              </div>
            </div>
            <div className="maternal-topic__grid">
              {maternalTopics.map((topic) => (
                <Link
                  key={topic.slug}
                  to={`/maternal/${topic.slug}`}
                  className="group relative rounded-2xl overflow-hidden border border-[#E5C0C8]/60 bg-white shadow-sm h-44"
                >
                  <img src={topic.image} alt={topic.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <h3 className="text-lg font-semibold">{topic.title}</h3>
                    <p className="mt-1 text-sm text-white/90 line-clamp-2">{topic.positioning}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 关爱产品 + 公益家园 */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 关爱产品 */}
            <div className="rounded-2xl p-7 border border-[#F3D5DC] shadow-none bg-[#FAFAFB]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 relative inline-block">
                  关爱产品
                  <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
                </h2>
                <Link to="/products" className="text-sm font-medium text-[#194F92] hover:text-[#143B70] hover:underline">
                  查看更多
                </Link>
              </div>

              <div className="rounded-2xl bg-white border border-[#F3D5DC] shadow-[0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-6">
                    <div className="text-xl font-semibold text-gray-900">家庭健康推荐方案</div>
                    <p className="mt-2 text-sm text-gray-600 leading-6">覆盖认知、监测与日常行动</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-[#FADADD] text-[#C73A5C]">官方推荐</span>
                      <span className="text-xs px-2 py-1 rounded-full border border-[#F3D5DC] text-[#C73A5C]">家庭适用</span>
                    </div>
                    <Link to="/plans/family-health" className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-[#194F92] text-white text-sm font-medium shadow-[0_6px_16px_rgba(0,0,0,0.12)] hover:bg-[#143B70] transition">
                      查看推荐方案 →
                    </Link>
                  </div>
                  <div className="relative w-full md:w-64 h-28 md:h-auto overflow-hidden">
                    <img
                      src={productHero}
                      alt="家庭健康推荐方案封面"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent"></div>
                    <div className="absolute inset-0 bg-[#194F92]/10 mix-blend-multiply"></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link to="/products/zhonghua-zhongyi-kunlun-book" className="flex items-center justify-between rounded-xl bg-white border border-[#F3D5DC] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#F3D5DC]">
                      <img
                        src={productBook}
                        alt="中华中医昆仑（书籍）"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#194F92]/10 mix-blend-multiply"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">中华中医昆仑（书籍）</div>
                      <div className="text-xs text-gray-500 mt-1">中医文化读物</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full border border-[#F3D5DC] text-[#C73A5C]">中医文化</span>
                </Link>
                <Link to="/products/tiandi-jinghua-water" className="flex items-center justify-between rounded-xl bg-white border border-[#F3D5DC] px-4 py-3 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#F3D5DC]">
                      <img
                        src={product2}
                        alt="天地精华"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#194F92]/10 mix-blend-multiply"></div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">天地精华</div>
                      <div className="text-xs text-gray-500 mt-1">天然矿泉水</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full border border-[#F3D5DC] text-[#C73A5C]">日常饮用</span>
                </Link>
              </div>
            </div>

            {/* 培训中心 */}
            <div id="training-center" className="rounded-2xl border border-[#F3D5DC] bg-[#FAFAFB] p-8 shadow-none">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 relative">
                    培训中心
                    <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
                  </h2>
                </div>
                <Link to="/training" className="text-sm font-medium text-[#194F92] hover:text-[#143B70] hover:underline">查看更多</Link>
              </div>

              <div className="flex items-center gap-3 mt-6">
                {['母婴', '中医', '健康'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onMouseEnter={() => setTrainingCategory(item)}
                    onFocus={() => setTrainingCategory(item)}
                    className={`text-sm px-5 py-2 rounded-full border transition ${
                      trainingCategory === item
                        ? 'bg-[#194F92] text-white border-[#194F92]'
                        : 'bg-white text-gray-700 border-[#E5C0C8]/60 hover:bg-[#E5C0C8]/30'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-12 gap-6 items-stretch mt-6">
                <Link
                  to={currentPath.hero.href}
                  className="col-span-12 lg:col-span-5 rounded-2xl bg-white border border-[#F3D5DC] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-6 flex flex-col justify-between transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#194F92]/20"
                >
                  <div>
                    <div className="text-xl font-semibold text-gray-900">{currentPath.hero.title}</div>
                    <p className="mt-2 text-sm text-gray-600 leading-6">{currentPath.hero.desc}</p>
                    <div className="mt-2 text-xs text-gray-500">
                      预计学习周期：4–8 周｜适合零基础
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentPath.hero.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full border border-[#F3D5DC] text-[#C73A5C]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-6 text-sm font-medium text-[#194F92] hover:text-[#143B70] hover:underline">查看学习路径 →</div>
                </Link>

                <div className="col-span-12 lg:col-span-7 flex flex-col gap-4">
                  {currentPath.paths.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="rounded-2xl bg-white border border-[#F3D5DC] shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-5 flex items-start justify-between min-h-[120px] transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#194F92]/20"
                    >
                      <div>
                        <div className="text-xs text-[#194F92] font-medium">{item.stageLabel}</div>
                        <div className="mt-1 text-base font-semibold text-gray-900">{item.title}</div>
                        <div className="mt-1 text-sm text-gray-500 line-clamp-1">{item.who}</div>
                      </div>
                      <div className="text-right ml-4 flex flex-col items-end self-stretch justify-between">
                        <span className="text-xs px-2 py-1 rounded-full bg-[#F3F4F6] text-[#9CA3AF]">
                          {item.tag}
                        </span>
                        <div className="text-sm font-medium text-[#194F92] hover:text-[#143B70] hover:underline">查看详情 →</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <Link to="/training" className="text-sm font-medium text-[#194F92] hover:text-[#143B70] hover:underline after:content-['→'] after:ml-1">
                  查看更多职业方向（{currentPath.totalCount}项）
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 项目推广 */}
      <section className="py-16 bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            {/* 项目推广 */}
            <div className="rounded-[20px] bg-white/55 shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-7 md:p-8">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-[#1F2937] relative">
                    项目推广
                    <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
                  </h2>
                </div>
                <Link to="/promo" className="text-sm font-medium text-[#C73A5C] hover:text-[#B83250] hover:underline">
                  查看更多
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {projectPromos.map((item) => (
                  <ProjectPromoCard key={item.title} item={item} />
                ))}
              </div>
            </div>

            {/* 公益家园 */}
            <div className="bg-white/55 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-7 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[#1F2937] relative inline-block">
                  公益家园
                  <span className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
                </h2>
              </div>
              <div className="space-y-4">
                <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-5 flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#F3D5DC]">
                      <img
                        src={charityPoverty}
                        alt="健康扶贫行动"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#FADADD]/35"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1F2937]">健康扶贫行动</div>
                      <div className="mt-1 text-sm text-[#6B7280]">支持社区长期健康服务</div>
                      <div className="mt-1 text-xs text-[#9CA3AF]">
                        已帮助 <span className="font-semibold text-[#C73A5C]">10,000+</span> 人
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openJoinForm('健康扶贫行动')}
                    className="text-sm font-medium text-[#194F92] hover:text-[#143B70] hover:underline after:content-['→'] after:ml-1"
                  >
                    我要参与
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-5 flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#F3D5DC]">
                      <img
                        src={charityClinic}
                        alt="爱心义诊活动"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#FADADD]/35"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1F2937]">爱心义诊活动</div>
                      <div className="mt-1 text-sm text-[#6B7280]">推动基层健康咨询与义诊</div>
                      <div className="mt-1 text-xs text-[#9CA3AF]">
                        累计服务 <span className="font-semibold text-[#C73A5C]">50,000+</span> 人次
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openJoinForm('爱心义诊活动')}
                    className="text-sm font-medium text-[#194F92] hover:text-[#143B70] hover:underline after:content-['→'] after:ml-1"
                  >
                    我要参与
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-5 flex items-center justify-between transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#F3D5DC]">
                      <img
                        src={charityEdu}
                        alt="健康知识普及"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-[#FADADD]/35"></div>
                    </div>
                    <div>
                      <div className="font-semibold text-[#1F2937]">健康知识普及</div>
                      <div className="mt-1 text-sm text-[#6B7280]">一起推动社区健康教育</div>
                      <div className="mt-1 text-xs text-[#9CA3AF]">
                        覆盖 <span className="font-semibold text-[#C73A5C]">200+</span> 社区
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openJoinForm('健康知识普及')}
                    className="text-sm font-medium text-[#194F92] hover:text-[#143B70] hover:underline after:content-['→'] after:ml-1"
                  >
                    我要参与
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 关爱工作站 */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative inline-block">
              关爱工作站
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]"></span>
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mt-6">
              在全国各地设立关爱工作站，为社区居民提供就近、便捷的健康服务，打通健康服务"最后一公里"。
            </p>
          </div>
          <div className="relative mt-10">
            <div className="absolute inset-x-10 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-[#EFB7BA]/60 to-transparent pointer-events-none"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 md:w-20 md:h-20 rounded-full bg-[#EFB7BA] ring-1 ring-white/20 shadow-sm flex items-center justify-center">
                  <span className="text-white text-xl md:text-2xl font-bold tracking-tight">200+</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">工作站数量</h3>
                <p className="text-sm text-slate-500">覆盖全国主要城市</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 md:w-20 md:h-20 rounded-full bg-[#EFB7BA] ring-1 ring-white/20 shadow-sm flex items-center justify-center">
                  <span className="text-white text-xl md:text-2xl font-bold tracking-tight">50万+</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">服务人次</h3>
                <p className="text-sm text-slate-500">累计服务社区居民</p>
              </div>
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-20 h-20 md:w-20 md:h-20 rounded-full bg-[#EFB7BA] ring-1 ring-white/20 shadow-sm flex items-center justify-center">
                  <span className="text-white text-2xl md:text-3xl font-bold tracking-tight">98%</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">满意度</h3>
                <p className="text-sm text-slate-500">居民满意度评价</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showJoinForm ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#F3D5DC]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F3D5DC]">
              <div>
                <h3 className="text-lg font-semibold text-[#1F2937]">公益参与登记</h3>
                <p className="text-sm text-[#6B7280] mt-1">项目：{joinForm.project}</p>
              </div>
              <button
                type="button"
                onClick={closeJoinForm}
                className="text-[#6B7280] hover:text-[#1F2937] text-sm"
              >
                关闭
              </button>
            </div>

            <form onSubmit={handleJoinSubmit} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm text-[#374151]">
                  姓名
                  <input
                    type="text"
                    value={joinForm.name}
                    onChange={(e) => handleJoinFieldChange('name', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CBD5F0]"
                    placeholder="请输入姓名"
                  />
                </label>
                <label className="text-sm text-[#374151]">
                  手机号
                  <input
                    type="tel"
                    value={joinForm.phone}
                    onChange={(e) => handleJoinFieldChange('phone', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CBD5F0]"
                    placeholder="请输入手机号"
                  />
                </label>
              </div>

              <label className="text-sm text-[#374151] block">
                所在城市
                <input
                  type="text"
                  value={joinForm.city}
                  onChange={(e) => handleJoinFieldChange('city', e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CBD5F0]"
                  placeholder="例如：北京"
                />
              </label>

              <label className="text-sm text-[#374151] block">
                备注（选填）
                <textarea
                  value={joinForm.message}
                  onChange={(e) => handleJoinFieldChange('message', e.target.value)}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-[#E5C0C8] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#CBD5F0]"
                  placeholder="请填写您的参与意向或可参与时间"
                />
              </label>

              {joinStatus.message ? (
                <p className={`text-sm ${joinStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {joinStatus.message}
                </p>
              ) : null}

              <div className="flex items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeJoinForm}
                  className="px-4 py-2 text-sm rounded-lg border border-[#E5C0C8] text-[#4B5563] hover:bg-[#FAFAFB]"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={joinSubmitting}
                  className="px-4 py-2 text-sm rounded-lg bg-[#194F92] text-white hover:bg-[#143B70] disabled:opacity-60"
                >
                  {joinSubmitting ? '提交中...' : '提交报名'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>);

};

export default Index;
