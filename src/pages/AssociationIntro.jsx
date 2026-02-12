import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { associationTeamStructure } from '../data/associationTeamStructure';

const sectionTabs = [
  { id: 'association-overview', label: '协会简介' },
  { id: 'team-structure', label: '团队构成' },
  { id: 'organization-structure', label: '组织机构' },
  { id: 'mission-vision', label: '使命远景' },
  { id: 'key-work', label: '主要工作' }
];

const organizationItems = [
  { title: '关爱母婴健康工作委员会办公室', content: '主持整个工作委员会各项事务运作事宜。' },
  { title: '母婴身心健康指导办公室', content: '运作关爱母婴身心康健项目。' },
  {
    title: '产后妈妈恢复指导办公室',
    content: '负责产后恢复类项目统筹与执行。',
    points: [
      '产后心理疏导项目',
      '产后身体调养项目',
      '产后塑身项目',
      '剖腹产疤痕修复项目',
      '女性生殖系统保健恢复项目',
      '产后康复家庭保健服务项目'
    ]
  },
  {
    title: '母婴产业技术指导办公室',
    content: '负责职业技能培训体系建设与实施。',
    points: ['孕婴康育员', '婴幼家育员', '小儿推拿师', '康复理疗师', '情商教育培训师', '育婴师', '保育员']
  },
  {
    title: '婴幼儿情商教育办公室',
    content: '负责婴幼儿成长与家庭教育相关项目。',
    points: ['幼儿情商培养项目', '问题儿童心理疏导项目', '家庭亲子教育项目']
  },
  { title: '母婴健康产业联盟办公室', content: '搭建母婴健康产业联盟，组织行业论坛，制定母婴健康行业标准。' },
  { title: '母婴健康产业及技术专家工作站', content: '集合国内外婴幼儿专家研发母婴产业最新科技产品及服务。' },
  { title: '海外母婴健康联络处', content: '搭建一带一路沿线国家的关爱母婴健康工作站，及国内与国外母婴企业间联络。' },
  { title: '全国关爱母婴健康工作站管理处', content: '指导全国各地县级关爱母婴健康工作站各项工作事宜。' },
  { title: '关爱母婴健康爱心基金', content: '接受社会各界赞助及捐款捐物，由当代中医药发展研究中心监督各款项物品的使用。' }
];

const missionBullets = [
  '成为母婴行业健康发展的行业领导',
  '成为母婴行业的联系枢纽',
  '成为母婴重要的信息交流平台',
  '成为母婴行业技术指导的科技中心',
  '成为母婴行业专业培训的教育基地',
  '成为母婴行业全面推广的宣传媒介'
];

const keyWorks = [
  { title: '建立母婴健康产业联盟', content: '建设拥有1000个企业会员，3000个关爱母婴健康分站，20万从业会员，1亿母婴会员的母婴健康产业联盟。' },
  { title: '组织行业开展中医药特色的母婴健康教育', content: '孕婴康育员、婴幼家育员、小儿推拿师、康复理疗师、情商教育培训师、育婴师保育员全年培养20万专业的母婴行业从业者。' },
  { title: '集合各界专家开展母婴健康方面的研讨和研究', content: '成立母婴健康专家委员会以及工作站，全年组织100场母婴健康研讨会，促成200项科技研究。' },
  { title: '为母婴产业企业提供标准认证、信息咨询、专家指导等服务', content: '全年为1000家企业提供各项服务2000-3000次。' },
  { title: '为企业解读国家在母婴健康方面的最新政策', content: '为100家母婴企业提供详尽的国家政策解读和战略规划。' },
  { title: '全国范围推广有利于母婴健康方向的科技应用', content: '在各级媒体推广母婴健康科技信息2000次以上，实现传播受众3亿人以上。' },
  { title: '举办母婴行业展览展示的产业交流活动', content: '拟办“中华国际关爱母婴健康交流论坛”，拟邀参展企业1000家，预计观展人次20万。' },
  { title: '开设母婴行业各类评选奖项', content: '为母婴行业的企业和个人，设立各类评选奖项和奖金。' },
  { title: '协助母婴企业进行维权，调解行业纠纷', content: '提供母婴行业知识产权申报与技术保护服务；提供个人与企业间、企业与企业间纠纷调解服务。' },
  { title: '联合科研单位为母婴人群研发更多的新型产品', content: '推出“母婴健康上门服务APP系统”，覆盖全国2000个市县，预计使用会员可达5000万人，实现上门母婴健康服务10亿次。' },
  { title: '成立“妈妈再就业”“妈妈创业”技能指导中心', content: '帮助1万名妈妈顺利融入社会，融入职场，自主创业。' },
  { title: '打造母婴健康“政产学研用融”产业示范集群', content: '整合母婴行业优秀企业，联手打造以母婴健康为中心的“政产学研用融”产业集群。' },
  { title: '母婴健康生态旅居调养小镇', content: '以母婴健康服务为中心建立母婴生态旅居调养式特色小镇。' },
  { title: '链接国内外优秀的孕婴企业', content: '搭建一带一路沿线国家的关爱母婴健康工作站，实现国内外的母婴企业交流合作。' }
];

const tabIds = sectionTabs.map((tab) => tab.id);

const AssociationIntro = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionFromQuery = searchParams.get('section') || '';
  const activeSection = tabIds.includes(sectionFromQuery) ? sectionFromQuery : sectionTabs[0].id;

  const activeMeta = useMemo(
    () => sectionTabs.find((item) => item.id === activeSection) ?? sectionTabs[0],
    [activeSection]
  );

  const switchSection = (nextId) => {
    const nextSearch = new URLSearchParams(searchParams);
    nextSearch.set('section', nextId);
    setSearchParams(nextSearch, { replace: true });
  };

  const renderSectionContent = () => {
    if (activeSection === 'association-overview') {
      return (
        <section className="space-y-4 text-[#374151] leading-8 text-[15px] md:text-base">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1F2937]">关爱母婴健康工作委员会简介</h2>
          <p>
            关爱母婴健康工作委员会隶属于当代中医药发展研究中心。当代中医药发展研究中心是民政部批准，由国家中医药管理局作为业务主管的民办非企业社会组织。“中心”响应国家关于大力发展我国中医药事业的号召，紧密团结和依靠我国广大中医药工作者，广泛组织动员社会力量，继承和发展中医药事业，服务社会，造福人民。
          </p>
          <p>
            工作委员会宗旨：推进中国母婴健康事业和产业发展，全方位打造服务广大母婴身心健康的社会组织和服务平台。工作委员会主要工作范围：组织行业开展健康教育、信息共享、行业联盟、行业维权、文化交流、联谊合作等。
          </p>
          <p>
            2016年全年我国新生儿分娩数为1846万人，是2000年以来出生人口最高的年份，其中二孩及以上占比超过45%。而我国的母婴护理服务的发展水平仍处于初级阶段，由于准入门槛和市场集中度低，区域特征明显，监管体系不完善等原因，导致行业竞争自由无序，行业发展良莠不齐，行业问题更是层出不穷。
          </p>
          <p>
            母婴行业的健康发展，不仅需要从业者的商业化运营，更需要正确的规范与指导，不仅需要敏锐的战略眼光，更需要拥有坚定正直的理念。为全面顺利地开展关爱母婴健康事业，提高妇女儿童的身心健康水平，制定母婴行业标准，规范不正当商业行为，当代中医药发展研究中心特在企业与社会之间，搭建具有领导和监督职能的社会组织，获得各界专家领导的一致赞誉。
          </p>
        </section>
      );
    }

    if (activeSection === 'team-structure') {
      return (
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1F2937]">关爱母婴健康工作委员会领导</h2>
          {associationTeamStructure.length ? (
            <div className="mt-6 flex flex-col gap-4">
              {associationTeamStructure.map((role) => (
                <article key={role.roleKey || role.slug} className="rounded-xl border border-[#F3D5DC] bg-[#FFF9FB] p-4 shadow-sm">
                  <h3 className="text-base font-semibold text-[#1F2937]">{role.roleTitle || role.title || '未命名职务'}</h3>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {(role.members || []).map((member) => (
                      <div key={member.id} className="rounded-xl border border-[#EFB7BA]/60 bg-white p-2">
                        <div className="mx-auto w-full max-w-[128px] aspect-[5/7] rounded-lg overflow-hidden border border-[#F3D5DC]">
                          {member.image ? (
                            <img src={member.image} alt={member.caption || '成员照片'} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center border border-dashed border-[#EFB7BA] text-xs text-[#C73A5C]">
                              照片
                            </div>
                          )}
                        </div>
                        <p className="mt-2 text-center text-xs text-[#374151]">{member.caption || '未填写文字'}</p>
                      </div>
                    ))}
                  </div>
                  {!role.members || role.members.length === 0 ? (
                    <div className="mt-3 rounded-lg border border-dashed border-[#EFB7BA] bg-white px-3 py-2 text-xs text-[#6B7280]">
                      暂无成员
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-[#E5C0C8] bg-[#FFF8FA] p-6 text-sm text-[#6B7280]">
              团队构成内容建设中
            </div>
          )}
        </section>
      );
    }

    if (activeSection === 'organization-structure') {
      return (
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1F2937]">组织结构及职能</h2>
          <div className="relative mt-6">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#F3D5DC]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-x-10">
              {organizationItems.map((item, index) => (
                <article key={item.title} className="rounded-xl border border-[#F3D5DC] bg-[#FFFCFD] p-4 md:p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#EA5036] text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h3 className="inline-flex flex-col items-start text-base md:text-lg font-semibold text-[#1F2937]">
                        <span>{item.title}</span>
                        <span className="mt-2 h-1 w-16 bg-gradient-to-r from-[#EFB7BA] to-[#CBD5F0]" />
                      </h3>
                      <p className="mt-2 text-sm md:text-base leading-7 text-[#4B5563]">{item.content}</p>
                      {item.points && item.points.length > 0 ? (
                        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
                          {item.points.map((point, pointIndex) => (
                            <li key={point} className="text-sm text-[#374151] leading-7">
                              {point}
                              {pointIndex < item.points.length - 1 ? ' /' : ''}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      );
    }

    if (activeSection === 'mission-vision') {
      return (
        <section>
          <h2 className="text-2xl md:text-3xl font-semibold text-[#1F2937]">关爱母婴健康工作委员会使命远景</h2>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#F3D5DC] bg-[#FFF6F9] p-4">
              <h3 className="text-base font-semibold text-[#C73A5C]">使命</h3>
              <p className="mt-2 text-[20px] text-center text-[#374151]">关爱母婴健康，引领行业发展</p>
            </div>
            <div className="rounded-xl border border-[#F3D5DC] bg-[#FFF6F9] p-4">
              <h3 className="text-base font-semibold text-[#C73A5C]">远景</h3>
              <p className="mt-2 text-[20px] text-center text-[#374151]">成为中国母婴产业最权威、最专业的资源平台</p>
            </div>
          </div>
          <div className="mt-6 rounded-xl border border-[#F3D5DC] bg-[#FFFCFD] p-4 md:p-5">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              {missionBullets.map((item) => (
                <li key={item} className="text-sm text-[#374151] leading-7">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      );
    }

    return (
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-[#1F2937]">关爱母婴健康工作委员会主要工作</h2>
        <ol className="mt-5 space-y-3">
          {keyWorks.map((work, index) => (
            <li key={work.title} className="rounded-xl border border-[#F3D5DC] bg-[#FFFCFD] p-4">
              <h3 className="text-base font-semibold text-[#1F2937]">{index + 1}、{work.title}</h3>
              <p className="mt-2 text-sm leading-7 text-[#4B5563]">{work.content}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <Header />
      <Navigation />

      <main className="py-8 md:py-10">
        <div className="w-full px-0 md:px-5">
          <section className="flex flex-row items-start gap-4 md:gap-8 overflow-x-auto">
            <aside className="w-[220px] md:w-[320px] xl:w-[360px] shrink-0">
              <div className="lg:sticky lg:top-6 relative bg-[#f4f4f4] px-6 md:px-8 py-6 min-h-[460px]">
                <div className="absolute left-0 top-4 bottom-4 w-[18px] bg-gradient-to-b from-[#f7b9b0] via-[#f37a62] to-[#e84a2f]" />
                <h2 className="pl-6 text-[40px] font-semibold tracking-[2px] text-[#e84a2f] leading-tight">协会简介</h2>
                <div className="mt-4 ml-2 h-5 w-[88%] bg-gradient-to-r from-[#f7d5d2] to-[#f36a4d]" />

                <nav className="mt-12 space-y-6 pl-8">
                  {sectionTabs.map((item) => {
                    const isActive = item.id === activeSection;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => switchSection(item.id)}
                        className={`block text-left transition-all ${
                          isActive ? 'text-[#F53163] font-semibold text-[24px] leading-[1.08]' : 'text-[#1f2937] font-semibold text-[20px] leading-[1.1] hover:text-[#F53163]'
                        }`}
                      >
                        {item.label}
                        {isActive ? <span className="ml-3 text-[#F53163]">&gt;&gt;</span> : null}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            <div className="flex-1 min-w-[680px] px-4 md:px-8 lg:pl-2">
              <article className="bg-transparent py-4">
                <h1 className="mb-6 text-[40px] font-semibold text-[#ea5036]">{activeMeta.label}</h1>
                <div key={activeSection} className="max-w-none text-[#2f2f2f] text-[34px] leading-[1.6] tracking-[0.2px]">
                  {renderSectionContent()}
                </div>
              </article>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AssociationIntro;
