import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const tierPlans = [
  {
    title: '第一层：家庭通用基础层',
    points: [
      '三餐规律：固定早餐时间，晚餐不过量，避免夜宵常态化。',
      '每日饮水：成人约 1500-1700ml，儿童按年龄分次饮水。',
      '餐盘结构：每餐做到“谷薯 + 蔬果 + 蛋白 + 适量油盐”。',
      '每周复盘：记录体重、睡眠时长、运动频次。'
    ]
  },
  {
    title: '第二层：重点人群强化层',
    points: [
      '孕产妇：重点关注铁、钙、叶酸与优质蛋白摄入。',
      '学龄儿童：强化早餐质量、奶类与豆制品、深色蔬菜摄入。',
      '中老年：控盐控油、优先蒸煮炖，增加鱼类与豆类比例。',
      '慢病人群：按医嘱控制总能量与关键指标（血压/血糖/血脂）。'
    ]
  },
  {
    title: '第三层：家庭行动落地层',
    points: [
      '“一周菜单”提前规划，减少临时高油高盐选择。',
      '家庭共同运动：每周至少 5 天，每次 30 分钟中等强度活动。',
      '睡眠优先级：成年人目标 7 小时以上，儿童按年龄保证时长。',
      '建立家庭健康看板：用可视化方式追踪执行率。'
    ]
  }
];

const weeklyChecklist = [
  '周一：更新本周采购清单（蔬果、奶豆、全谷物优先）',
  '周二：一次 30 分钟家庭快走/骑行',
  '周三：检查本周盐和油使用量',
  '周四：家庭晚餐增加 1 份深色蔬菜',
  '周五：复盘体重、睡眠、运动完成度',
  '周六：准备下周半成品食材',
  '周日：家庭健康会议（10 分钟）'
];

const FamilyHealthPlan = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <article className="max-w-5xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="mb-6">
              <Link to="/" className="text-sm text-[#194F92] hover:underline">返回首页</Link>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">家庭健康推荐方案</h1>
            <p className="mt-3 text-gray-600 leading-7">
              本方案以《中国居民膳食指南》倡导的平衡膳食与健康生活方式为框架，结合家庭场景，提供可执行、可复盘的分层行动建议。
            </p>

            <section className="mt-8 space-y-5">
              {tierPlans.map((tier) => (
                <div key={tier.title} className="rounded-xl border border-[#E5C0C8]/60 bg-[#FFF9FB] p-5">
                  <h2 className="text-lg font-semibold text-gray-900">{tier.title}</h2>
                  <ul className="mt-3 space-y-2 text-gray-700 leading-7">
                    {tier.points.map((point) => (
                      <li key={point}>- {point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900">一周执行清单</h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {weeklyChecklist.map((item) => (
                  <div key={item} className="rounded-lg border border-[#E5C0C8]/60 bg-white px-4 py-3 text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </section>

            <div className="mt-8 rounded-xl border border-[#F3D5DC] bg-[#FFF3F6] px-4 py-3 text-sm text-[#8B3A52]">
              说明：本页面为健康管理知识分享，不能替代个体化医疗诊疗建议；特殊人群请在医生指导下执行。
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FamilyHealthPlan;
