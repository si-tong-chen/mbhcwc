import certificatePlaceholder from '../images/certificate-placeholder.svg';
import { resolveContentModule } from './runtimeContent';

const fallbackTracks = [
  {
    slug: 'maternal-early-education',
    name: '母婴照护与早教服务',
    positioning: '面向母婴照护、托育与家庭教育场景，强调上岗能力与沟通服务能力。',
    hero: {
      title: '从育婴到家庭教育，一条线提升就业竞争力',
      subtitle: '适合零基础转行、托育机构从业者及家庭服务从业者。'
    },
    audience: ['托育机构从业者', '家庭服务从业者', '零基础转行学员'],
    jobRoles: ['育婴师', '保育员', '家庭育儿指导', '早教支持岗位'],
    courseSlugs: ['yuyingshi', 'baoyuyuan', 'yingyoujiayuyuan', 'muyinghulishi', 'qingshangjiaoyu-peixunshi']
  },
  {
    slug: 'women-postpartum-care',
    name: '女性与产后调理服务',
    positioning: '围绕女性周期健康、产后恢复与哺乳支持构建实操型服务能力。',
    hero: {
      title: '聚焦女性健康与产后恢复的高需求岗位',
      subtitle: '突出实操、评估与个体化调理方案能力。'
    },
    audience: ['母婴门店服务人员', '产后修复机构从业者', '健康管理转岗人员'],
    jobRoles: ['女性健康调理', '催乳服务', '产后康复服务'],
    courseSlugs: ['zhongyi-nvxing-jiankang-tiaolishi', 'zhongyi-cuirushi', 'zhongyi-chanhou-kangfushi']
  },
  {
    slug: 'tcm-rehab-therapy',
    name: '中医康复理疗服务',
    positioning: '以中医康复与理疗技术为主，覆盖推拿、经络、针灸等核心技能。',
    hero: {
      title: '构建中医康复理疗多技术协同能力',
      subtitle: '适合健康服务机构、理疗馆和康复中心岗位发展。'
    },
    audience: ['理疗馆从业者', '康复中心辅助岗位', '中医养生方向学员'],
    jobRoles: ['康复理疗师', '推拿调理师', '针灸技术支持'],
    courseSlugs: [
      'zhongyi-kangfu-liliaoshi',
      'yajiankang-tiaolishi',
      'zhongyi-xuewei-tiaolishi',
      'zhongyi-tuina-shi',
      'zhongyi-jingluo-tiaolishi',
      'zhongyi-jizhu-baojianshi',
      'zhongyi-daidian-tuina-jishu',
      'zhongyi-zhenjiu',
      'zhongyi-xiaoer-tuina-baojianshi'
    ]
  },
  {
    slug: 'tcm-external-therapy',
    name: '中医外治与特色技术',
    positioning: '覆盖中医外治法与特色技术，强化项目化操作与门店服务落地。',
    hero: {
      title: '特色技术项目化训练，打造差异化服务能力',
      subtitle: '适合养生馆、门店技术岗及项目负责人。'
    },
    audience: ['养生馆技术人员', '门店项目负责人', '中医外治技术爱好者'],
    jobRoles: ['外治技术师', '门店特色项目技师', '美容与足病调理服务'],
    courseSlugs: ['zhongyi-zubing-xiuzhishi', 'zhongyi-yaoyun-shi', 'zhongyi-yaoyu-shi', 'baojian-bianshushi', 'baojian-baguanshi', 'zhongyi-meirong-shi']
  },
  {
    slug: 'health-management',
    name: '健康管理专项',
    positioning: '聚焦评估、干预和持续跟踪，适配社区与机构健康管理岗位。',
    hero: {
      title: '把评估与干预能力转化为稳定就业能力',
      subtitle: '适合健康管理方向从业者与转岗人员。'
    },
    audience: ['健康服务机构人员', '社区健康岗位从业者', '慢病管理方向学员'],
    jobRoles: ['健康管理师', '身高管理师'],
    courseSlugs: ['jiankang-guanlishi', 'shengao-guanlishi']
  }
];

const defaultContactInfo = {
  phone: '010-53608360',
  address: '北京市丰台区玉泉营桥西北角北京111文化产业园B1座三层'
};

const defaultRegistrationNotice = ['即日起即可报名。', '报名需提交身份证、学历证复印件及2寸蓝底证件照4张。'];

const defaultEmploymentDirections = ['康复理疗机构', '社区卫生服务站', '养老院康复技术岗位', '医疗体检机构', '养生美容机构'];

const buildCourse = ({
  slug,
  name,
  trackSlug,
  summary,
  audience,
  durationTag,
  hasPractical = true,
  hasCertificate = true,
  hours,
  mode,
  certificate,
  priceNote,
  introParagraphs,
  examTarget,
  curriculumNote,
  registrationNotice,
  employmentDirections,
  trainingTime,
  trainingLocation,
  contactInfo,
  certificateImage,
  certificateImageAlt
}) => ({
  slug,
  name,
  trackSlug,
  summary,
  audience,
  durationTag,
  hasPractical,
  hasCertificate,
  hours,
  mode,
  certificate,
  priceNote,
  introParagraphs: introParagraphs ?? [
    `${name}课程围绕岗位核心能力设计，注重理论与实操结合。`,
    '通过标准化训练流程，帮助学员形成可落地的服务能力。'
  ],
  examTarget: examTarget ?? '在职相关从业人员及有志从事本职业的社会人士，不限户籍。',
  curriculumNote:
    curriculumNote ??
    '全日制授课，学习期满并通过考试考核后，由当代中医药发展研究中心颁发相应培训证书。',
  registrationNotice: registrationNotice ?? defaultRegistrationNotice,
  employmentDirections: employmentDirections ?? defaultEmploymentDirections,
  trainingTime: trainingTime ?? '根据各地招生情况待定。',
  trainingLocation: trainingLocation ?? '全国招生，分区域培训。',
  contactInfo: contactInfo ?? defaultContactInfo,
  certificateImage: certificateImage ?? certificatePlaceholder,
  certificateImageAlt: certificateImageAlt ?? `${name}证书示意图`
});

const fallbackCourses = [
  buildCourse({
    slug: 'yuyingshi',
    name: '育婴师',
    trackSlug: 'maternal-early-education',
    summary: '覆盖婴幼儿生活照护、喂养与成长观察，强调家庭场景实操。',
    audience: '适合新手宝妈、月嫂转岗、托育机构从业者。',
    durationTag: '4-8周',
    hours: '90学时（理论50 + 实操40）',
    mode: '线上理论 + 线下实操',
    certificate: '育婴师培训证书（按考核标准发放）',
    priceNote: '学费区间：¥2800-¥4200（以班型为准）'
  }),
  buildCourse({
    slug: 'baoyuyuan',
    name: '保育员',
    trackSlug: 'maternal-early-education',
    summary: '围绕托育机构日常保育流程，强化保教协同与安全管理能力。',
    audience: '适合托幼机构在岗人员与拟上岗人员。',
    durationTag: '4-8周',
    hours: '84学时（理论44 + 实操40）',
    mode: '线下集中授课 + 场景演练',
    certificate: '保育员培训证书',
    priceNote: '学费区间：¥2600-¥3900'
  }),
  buildCourse({
    slug: 'yingyoujiayuyuan',
    name: '婴幼家育员',
    trackSlug: 'maternal-early-education',
    summary: '面向家庭入户与家庭教育支持场景，建立系统家育服务能力。',
    audience: '适合家庭服务从业者与育儿指导转岗人员。',
    durationTag: '4-8周',
    hours: '96学时（理论52 + 实操44）',
    mode: '线上直播 + 线下督导',
    certificate: '婴幼家育员培训证书',
    priceNote: '学费区间：¥3000-¥4500'
  }),
  buildCourse({
    slug: 'muyinghulishi',
    name: '母婴护理师',
    trackSlug: 'maternal-early-education',
    summary: '聚焦产妇与新生儿照护全流程，提升服务标准化与职业素养。',
    audience: '适合母婴护理岗位新人及月嫂升级学习。',
    durationTag: '4-8周',
    hours: '100学时（理论56 + 实操44）',
    mode: '线下实训为主',
    certificate: '母婴护理师培训证书',
    priceNote: '学费区间：¥3200-¥4800'
  }),
  buildCourse({
    slug: 'qingshangjiaoyu-peixunshi',
    name: '情商教育培训师',
    trackSlug: 'maternal-early-education',
    summary: '培养儿童情绪识别、表达与行为支持教学能力。',
    audience: '适合早教、托育与家庭教育方向从业者。',
    durationTag: '8-12周',
    hours: '108学时（理论66 + 实操42）',
    mode: '线上理论 + 线下工作坊',
    certificate: '情商教育培训师培训证书',
    priceNote: '学费区间：¥3600-¥5200'
  }),
  buildCourse({
    slug: 'zhongyi-nvxing-jiankang-tiaolishi',
    name: '中医女性健康调理师',
    trackSlug: 'women-postpartum-care',
    summary: '围绕女性周期管理与亚健康调理，建立评估与方案制定能力。',
    audience: '适合产后中心、女性健康门店与养生馆从业者。',
    durationTag: '8-12周',
    hours: '112学时（理论62 + 实操50）',
    mode: '线上理论 + 线下手法训练',
    certificate: '中医女性健康调理师培训证书',
    priceNote: '学费区间：¥4200-¥6200'
  }),
  buildCourse({
    slug: 'zhongyi-cuirushi',
    name: '中医催乳师',
    trackSlug: 'women-postpartum-care',
    summary: '聚焦产后泌乳支持与乳房护理，强调实操安全与沟通。',
    audience: '适合母婴护理、月子中心和家政服务人员。',
    durationTag: '4-8周',
    hours: '88学时（理论40 + 实操48）',
    mode: '线下实操集训',
    certificate: '中医催乳师培训证书',
    priceNote: '学费区间：¥3000-¥4600'
  }),
  buildCourse({
    slug: 'zhongyi-chanhou-kangfushi',
    name: '中医产后康复师',
    trackSlug: 'women-postpartum-care',
    summary: '围绕盆底、体态与体能恢复建立产后康复技术体系。',
    audience: '适合产康机构、健管中心和康复岗位从业者。',
    durationTag: '8-12周',
    hours: '120学时（理论60 + 实操60）',
    mode: '线下实训 + 案例督导',
    certificate: '中医产后康复师培训证书',
    priceNote: '学费区间：¥4500-¥6800'
  }),
  buildCourse({
    slug: 'zhongyi-kangfu-liliaoshi',
    name: '中医康复理疗师',
    trackSlug: 'tcm-rehab-therapy',
    summary: '理疗是利用微弱的外在物理因素引起人体生理反应，进而影响人体功能并促进伤病康复。',
    audience: '在职康复理疗师和有志从事康复理疗工作者，以及应往届大中专毕业生等中医爱好人士。',
    durationTag: '8-12周',
    hours: '110学时（理论58 + 实操52）',
    mode: '全日制授课',
    certificate:
      '经考试考核合格后，由当代中医药发展研究中心颁发相应等级康复理疗师证书，全国通用、证书网上注册备案。',
    priceNote: '学费区间：咨询教务（以当期招生方案为准）',
    introParagraphs: [
      '理疗师：提供康复理疗指导或帮助的人，理疗即物理疗法，其优点是作用广泛，无损伤性，又没有痛苦，比较安全，对许多病伤均有不同程度的治疗效果。尽管如此，做理疗的病人仍应掌握一定的知识，积极地与医生配合，以利于提高疗效，缩短疗程，保证安全。',
      '理疗是利用微弱的外在物理因素引起人体的生理反应，通过这些反应影响人体的功能，克制病因，促进伤病的康复。'
    ],
    examTarget: '在职康复理疗师和有志从事康复理疗工作者以及应往届大中专毕业生等中医爱好人士，不限户籍。',
    curriculumNote:
      '全日制授课，学习期满，经考试考核合格，由当代中医药发展研究中心颁发相应等级的康复理疗师国家职业资格证书，全国通用、证书网上注册备案，终身免检，可用于持证上岗、升职加薪和职业能力提升。',
    registrationNotice: ['即日起即可报名。', '报名时需提交本人身份证、学历证复印件和2寸蓝底证件照4张。'],
    employmentDirections: ['各康复理疗机构', '社区卫生服务站', '养老院康复理疗技术岗位', '医疗体检机构', '养生美容机构'],
    trainingTime: '根据各地招生情况待定。',
    trainingLocation: '全国招生，分区域培训。',
    contactInfo: {
      phone: '010-53608360',
      address: '北京市丰台区玉泉营桥西北角北京111文化产业园B1座三层'
    },
    certificateImageAlt: '中医康复理疗师证书照片占位图'
  }),
  buildCourse({
    slug: 'yajiankang-tiaolishi',
    name: '亚健康调理师',
    trackSlug: 'tcm-rehab-therapy',
    summary: '面向亚健康人群评估与调理，建立持续干预能力。',
    audience: '适合健康馆、体检后干预岗位与养生服务人员。',
    durationTag: '8-12周',
    hours: '104学时（理论60 + 实操44）',
    mode: '线上理论 + 实操训练',
    certificate: '亚健康调理师培训证书',
    priceNote: '学费区间：¥3800-¥5800'
  }),
  buildCourse({
    slug: 'zhongyi-xuewei-tiaolishi',
    name: '中医穴位调理师',
    trackSlug: 'tcm-rehab-therapy',
    summary: '系统学习常用穴位定位与调理配伍，强化安全操作。',
    audience: '适合理疗和养生岗位从业者。',
    durationTag: '4-8周',
    hours: '92学时（理论42 + 实操50）',
    mode: '线下面授实训',
    certificate: '中医穴位调理师培训证书',
    priceNote: '学费区间：¥3200-¥4800'
  }),
  buildCourse({
    slug: 'zhongyi-tuina-shi',
    name: '中医推拿师',
    trackSlug: 'tcm-rehab-therapy',
    summary: '重点训练推拿基本功与服务流程，适配门店上岗场景。',
    audience: '适合理疗馆、养生馆技术岗位人员。',
    durationTag: '8-12周',
    hours: '118学时（理论50 + 实操68）',
    mode: '线下实操 + 案例带教',
    certificate: '中医推拿师培训证书',
    priceNote: '学费区间：¥4200-¥6500'
  }),
  buildCourse({
    slug: 'zhongyi-jingluo-tiaolishi',
    name: '中医经络调理师',
    trackSlug: 'tcm-rehab-therapy',
    summary: '围绕经络辨识与调理路径，形成标准化服务方案。',
    audience: '适合中医养生方向从业者。',
    durationTag: '8-12周',
    hours: '106学时（理论56 + 实操50）',
    mode: '线上理论 + 线下手法训练',
    certificate: '中医经络调理师培训证书',
    priceNote: '学费区间：¥4000-¥6000'
  }),
  buildCourse({
    slug: 'zhongyi-jizhu-baojianshi',
    name: '中医脊柱保健师',
    trackSlug: 'tcm-rehab-therapy',
    summary: '针对体态与脊柱健康管理，训练评估与保健调理技能。',
    audience: '适合康复、健身和理疗相关从业者。',
    durationTag: '8-12周',
    hours: '122学时（理论60 + 实操62）',
    mode: '线下实训',
    certificate: '中医脊柱保健师培训证书',
    priceNote: '学费区间：¥4600-¥7000'
  }),
  buildCourse({
    slug: 'zhongyi-daidian-tuina-jishu',
    name: '中医带电推拿技术',
    trackSlug: 'tcm-rehab-therapy',
    summary: '结合仪器与手法，建立标准化、可复制的门店技术流程。',
    audience: '适合门店技术升级和项目负责人。',
    durationTag: '4-8周',
    hours: '86学时（理论36 + 实操50）',
    mode: '线下设备操作实训',
    certificate: '中医带电推拿技术培训证书',
    priceNote: '学费区间：¥3600-¥5400'
  }),
  buildCourse({
    slug: 'zhongyi-zhenjiu',
    name: '中医针灸',
    trackSlug: 'tcm-rehab-therapy',
    summary: '系统掌握针灸基础理论、常用穴位与规范化操作要求。',
    audience: '适合中医从业者及相关技术岗位人员。',
    durationTag: '12周以上',
    hours: '156学时（理论78 + 实操78）',
    mode: '线下实操 + 导师督导',
    certificate: '中医针灸培训证书',
    priceNote: '学费区间：¥5800-¥9000'
  }),
  buildCourse({
    slug: 'zhongyi-xiaoer-tuina-baojianshi',
    name: '中医小儿推拿保健师',
    trackSlug: 'tcm-rehab-therapy',
    summary: '针对婴幼儿常见问题进行小儿推拿保健服务训练。',
    audience: '适合母婴门店、小儿推拿馆从业者。',
    durationTag: '8-12周',
    hours: '116学时（理论52 + 实操64）',
    mode: '线下小班实操',
    certificate: '中医小儿推拿保健师培训证书',
    priceNote: '学费区间：¥4300-¥6600'
  }),
  buildCourse({
    slug: 'zhongyi-zubing-xiuzhishi',
    name: '中医足病修治师',
    trackSlug: 'tcm-external-therapy',
    summary: '面向足部常见问题评估与修治技术，适配门店项目落地。',
    audience: '适合足疗门店、养生门店技术岗。',
    durationTag: '8-12周',
    hours: '114学时（理论50 + 实操64）',
    mode: '线下实训',
    certificate: '中医足病修治师培训证书',
    priceNote: '学费区间：¥4200-¥6500'
  }),
  buildCourse({
    slug: 'zhongyi-yaoyun-shi',
    name: '中医药熨师',
    trackSlug: 'tcm-external-therapy',
    summary: '学习药熨技术在保健与调理场景中的应用方法与规范。',
    audience: '适合中医馆、养生馆及康复项目岗。',
    durationTag: '4-8周',
    hours: '82学时（理论34 + 实操48）',
    mode: '线下实操训练',
    certificate: '中医药熨师培训证书',
    priceNote: '学费区间：¥3000-¥4500'
  }),
  buildCourse({
    slug: 'zhongyi-yaoyu-shi',
    name: '中医药浴师',
    trackSlug: 'tcm-external-therapy',
    summary: '围绕药浴调理流程、体质适配和服务标准进行训练。',
    audience: '适合养生馆和健康管理机构服务人员。',
    durationTag: '4-8周',
    hours: '80学时（理论32 + 实操48）',
    mode: '线下操作 + 场景演练',
    certificate: '中医药浴师培训证书',
    priceNote: '学费区间：¥2800-¥4300'
  }),
  buildCourse({
    slug: 'baojian-bianshushi',
    name: '保健砭术师',
    trackSlug: 'tcm-external-therapy',
    summary: '学习砭术技术在日常保健场景中的规范应用。',
    audience: '适合中医外治与养生项目从业者。',
    durationTag: '4-8周',
    hours: '86学时（理论36 + 实操50）',
    mode: '线下小班实操',
    certificate: '保健砭术师培训证书',
    priceNote: '学费区间：¥3200-¥4700'
  }),
  buildCourse({
    slug: 'baojian-baguanshi',
    name: '保健拔罐师',
    trackSlug: 'tcm-external-therapy',
    summary: '系统掌握拔罐技术与组合方案，提升门店特色项目能力。',
    audience: '适合养生馆、中医馆项目技师。',
    durationTag: '4-8周',
    hours: '84学时（理论34 + 实操50）',
    mode: '线下实操课',
    certificate: '保健拔罐师培训证书',
    priceNote: '学费区间：¥3000-¥4600'
  }),
  buildCourse({
    slug: 'zhongyi-meirong-shi',
    name: '中医美容师',
    trackSlug: 'tcm-external-therapy',
    summary: '结合中医调理理念与美容服务，打造项目化技术能力。',
    audience: '适合美容院、中医美容门店从业者。',
    durationTag: '8-12周',
    hours: '118学时（理论58 + 实操60）',
    mode: '线下实训 + 案例教学',
    certificate: '中医美容师培训证书',
    priceNote: '学费区间：¥4500-¥6800'
  }),
  buildCourse({
    slug: 'jiankang-guanlishi',
    name: '健康管理师',
    trackSlug: 'health-management',
    summary: '建立评估、干预、随访一体化健康管理能力。',
    audience: '适合体检中心、健管机构与社区健康岗位人员。',
    durationTag: '12周以上',
    hours: '160学时（理论90 + 实操70）',
    mode: '线上理论 + 线下实践',
    certificate: '健康管理师培训证书',
    priceNote: '学费区间：¥5200-¥8600'
  }),
  buildCourse({
    slug: 'shengao-guanlishi',
    name: '身高管理师',
    trackSlug: 'health-management',
    summary: '聚焦儿童与青少年身高管理，覆盖评估、干预与家长沟通。',
    audience: '适合儿童健康管理与成长门诊相关岗位。',
    durationTag: '8-12周',
    hours: '124学时（理论64 + 实操60）',
    mode: '线上理论 + 线下案例训练',
    certificate: '身高管理师培训证书',
    priceNote: '学费区间：¥4300-¥6900'
  })
];

const fallbackFeaturedCourseSlugs = [
  'yuyingshi',
  'zhongyi-chanhou-kangfushi',
  'zhongyi-kangfu-liliaoshi',
  'zhongyi-zhenjiu',
  'jiankang-guanlishi',
  'shengao-guanlishi'
];

const fallbackFeaturedCourseSlugSet = new Set(fallbackFeaturedCourseSlugs);
const fallbackCoursesWithFeatured = fallbackCourses.map((course) => ({
  ...course,
  isFeatured: course.isFeatured ?? fallbackFeaturedCourseSlugSet.has(course.slug)
}));

const trainingHomeCategories = ['母婴', '中医', '健康', '其他'];

const inferTrackHomeCategory = (track = {}) => {
  const slug = String(track?.slug || '');
  if (slug.includes('maternal') || slug.includes('women') || slug.includes('postpartum')) return '母婴';
  if (slug.includes('tcm')) return '中医';
  if (slug.includes('health')) return '健康';
  return '其他';
};

const normalizeTrack = (track = {}) => ({
  ...track,
  slug: String(track.slug || '').trim(),
  name: String(track.name || '').trim(),
  positioning: String(track.positioning || '').trim(),
  status: String(track.status || 'published'),
  sort_order: Math.max(0, Number(track.sort_order || 0)),
  hero: {
    title: String(track?.hero?.title || '').trim(),
    subtitle: String(track?.hero?.subtitle || '').trim()
  },
  audience: Array.isArray(track.audience) ? track.audience.map((item) => String(item || '').trim()).filter(Boolean) : [],
  jobRoles: Array.isArray(track.jobRoles) ? track.jobRoles.map((item) => String(item || '').trim()).filter(Boolean) : [],
  courseSlugs: Array.isArray(track.courseSlugs) ? track.courseSlugs.map((item) => String(item || '').trim()).filter(Boolean) : [],
  homeCategory: trainingHomeCategories.includes(track.homeCategory) ? track.homeCategory : inferTrackHomeCategory(track)
});

const normalizeCourse = (course = {}) => ({
  ...course,
  slug: String(course.slug || '').trim(),
  name: String(course.name || '').trim(),
  trackSlug: String(course.trackSlug || '').trim(),
  summary: String(course.summary || '').trim(),
  status: String(course.status || 'published'),
  sort_order: Math.max(0, Number(course.sort_order || 0)),
  isFeatured: Boolean(course.isFeatured),
  audience: String(course.audience || '').trim(),
  durationTag: String(course.durationTag || '').trim(),
  hasPractical: Boolean(course.hasPractical),
  hasCertificate: Boolean(course.hasCertificate),
  hours: String(course.hours || '').trim(),
  mode: String(course.mode || '').trim(),
  certificate: String(course.certificate || '').trim(),
  priceNote: String(course.priceNote || '').trim(),
  introParagraphs: Array.isArray(course.introParagraphs) ? course.introParagraphs.map((item) => String(item || '').trim()).filter(Boolean) : [],
  examTarget: String(course.examTarget || '').trim(),
  curriculumNote: String(course.curriculumNote || '').trim(),
  registrationNotice: Array.isArray(course.registrationNotice) ? course.registrationNotice.map((item) => String(item || '').trim()).filter(Boolean) : [],
  employmentDirections: Array.isArray(course.employmentDirections) ? course.employmentDirections.map((item) => String(item || '').trim()).filter(Boolean) : [],
  trainingTime: String(course.trainingTime || '').trim(),
  trainingLocation: String(course.trainingLocation || '').trim(),
  contactInfo: {
    phone: String(course?.contactInfo?.phone || '').trim(),
    address: String(course?.contactInfo?.address || '').trim()
  },
  certificateImage: String(course.certificateImage || '').trim(),
  certificateImageAlt: String(course.certificateImageAlt || '').trim()
});

const sortByOrderAndUpdated = (a, b) => {
  const bySort = Number(a?.sort_order || 0) - Number(b?.sort_order || 0);
  if (bySort !== 0) return bySort;
  return String(b?.updated_at || '').localeCompare(String(a?.updated_at || ''));
};

const runtimeTracks = resolveContentModule('trainingTracks', fallbackTracks).map((item) => normalizeTrack(item));
const runtimeCourses = resolveContentModule('trainingCourses', fallbackCoursesWithFeatured).map((item) => normalizeCourse(item));

const publishedCourses = runtimeCourses
  .filter((course) => course.status === 'published')
  .sort(sortByOrderAndUpdated);

const publishedTracksRaw = runtimeTracks
  .filter((track) => track.status === 'published')
  .sort(sortByOrderAndUpdated);

const publishedTrackSlugSet = new Set(publishedTracksRaw.map((track) => track.slug));

export const courses = publishedCourses.filter((course) => publishedTrackSlugSet.has(course.trackSlug));

export const tracks = publishedTracksRaw.map((track) => {
  const linkedSlugs = courses
    .filter((course) => course.trackSlug === track.slug)
    .map((course) => course.slug);
  return {
    ...track,
    courseSlugs: linkedSlugs
  };
});
export const featuredCourseSlugs = fallbackFeaturedCourseSlugs;

const courseMap = new Map(courses.map((course) => [course.slug, course]));

export const getTrackBySlug = (trackSlug) => tracks.find((track) => track.slug === trackSlug);

export const getCourseBySlug = (courseSlug) => courses.find((course) => course.slug === courseSlug);

export const getCoursesByTrackSlug = (trackSlug) => courses.filter((course) => course.trackSlug === trackSlug);

export const getFeaturedCourses = () => {
  const featuredByFlag = courses.filter((course) => course.isFeatured);
  if (featuredByFlag.length > 0) return featuredByFlag;
  return featuredCourseSlugs.map((slug) => courseMap.get(slug)).filter(Boolean);
};
