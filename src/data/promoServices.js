import cover1 from '../images/cover_1.png';
import cover2 from '../images/cover_2.png';
import productHero from '../images/product_hero.jpg';

export const promoCategories = [
  {
    slug: 'reproductive-medicine',
    name: '生育医学项目',
    positioning: '面向备孕与生育支持需求，提供国际协同医疗服务路径。',
    hero: {
      title: '国际生育医学协作服务',
      subtitle: '覆盖咨询评估、方案制定、机构对接与全流程支持。'
    },
    highlights: ['国际机构协作', '多语种服务', '流程透明可追踪']
  },
  {
    slug: 'cell-biobank',
    name: '细胞生物样本储存库',
    positioning: '围绕细胞样本存储、检测与管理提供标准化能力支撑。',
    hero: {
      title: '全球级细胞样本存储能力',
      subtitle: '高标准实验体系与大规模库容并行，满足科研与临床协作。'
    },
    highlights: ['700万份库容量', '20000平米实验室', 'GMP标准体系']
  },
  {
    slug: 'gene-engineering',
    name: '基因工程服务技术',
    positioning: '提供5类基因工程服务技术，覆盖检测、分析与应用协同。',
    hero: {
      title: '基因工程技术服务矩阵',
      subtitle: '先以标准化能力框架落地，后续可按技术类别扩展详情。'
    },
    highlights: ['5类技术占位', '可扩展服务模型', '多场景协作']
  }
];

const defaultFaq = [
  {
    q: '是否可以先做咨询再决定？',
    a: '可以，支持先进行需求评估与方案说明，再进入正式流程。'
  },
  {
    q: '价格是否固定？',
    a: '页面展示为区间价格，具体费用会受个体情况、地区与服务范围影响。'
  },
  {
    q: '服务周期一般多久？',
    a: '不同服务周期不同，详情页会给出常见周期范围与关键节点。'
  }
];

const defaultContact = {
  phone: '010-53608360',
  wechat: 'health-service-001',
  address: '北京市丰台区玉泉营桥西北角北京111文化产业园B1座三层'
};

const buildService = ({
  slug,
  categorySlug,
  title,
  subtitle,
  summary,
  audience,
  audienceTags,
  process,
  deliveryCycle,
  regions,
  priceRange,
  priceFactors,
  capabilities,
  certifications,
  faq = defaultFaq,
  contact = defaultContact,
  coverImage = cover1,
  riskNotice,
  complianceNotice
}) => ({
  slug,
  categorySlug,
  title,
  subtitle,
  summary,
  audience,
  audienceTags,
  process,
  deliveryCycle,
  regions,
  priceRange,
  priceFactors,
  capabilities,
  certifications,
  faq,
  contact,
  coverImage,
  riskNotice,
  complianceNotice
});

export const promoServices = [
  buildService({
    slug: 'kulakov-ivf-third-party',
    categorySlug: 'reproductive-medicine',
    title: '俄罗斯库拉科夫国家妇产围产学医学研究中心',
    subtitle: '自卵自精试管婴儿 / 第三方助孕项目',
    summary: '提供生育医学国际协作服务，覆盖评估、方案、机构对接与流程管理。',
    audience: [
      '有跨境辅助生育需求的家庭',
      '需要第三方助孕协同支持的客户',
      '希望获得国际机构医疗资源对接的用户'
    ],
    audienceTags: ['备孕家庭', '医疗协同', '跨境服务'],
    process: [
      '初步咨询与生育历史评估',
      '个体化方案设计与机构匹配',
      '签约与医疗资料准备',
      '赴外就诊与流程管理',
      '阶段复盘与后续支持'
    ],
    deliveryCycle: '3-9个月',
    regions: ['俄罗斯', '中国'],
    priceRange: '¥180,000 - ¥680,000',
    priceFactors: ['基础身体条件', '治疗方案复杂度', '是否包含第三方助孕服务', '周期次数与服务包范围'],
    capabilities: ['多语种医疗沟通协同', '全流程节点管理', '机构对接与文档支持', '阶段风险提醒机制'],
    certifications: ['合作机构合规资质审查机制', '服务流程留痕管理'],
    coverImage: productHero,
    riskNotice: '辅助生育项目存在医学不确定性，结果受个体健康状态、方案匹配和执行过程影响。',
    complianceNotice: '服务信息仅用于咨询参考，不构成医疗承诺；具体诊疗请以执业医疗机构意见为准。'
  }),
  buildService({
    slug: 'global-cell-biobank-storage',
    categorySlug: 'cell-biobank',
    title: '全球最大细胞生物样本储存库',
    subtitle: '细胞样本制备、检测与长期储存服务',
    summary: '委员会与全球最大细胞生物样本储存库合作，实验中心分布欧洲多个重点城市。',
    audience: ['科研机构', '医疗机构', '高净值健康管理用户'],
    audienceTags: ['科研合作', '机构服务', '长期储存'],
    process: ['需求定义与样本类型确认', '样本采集与转运标准校验', '细胞制备与检测', '分级入库与数字化管理', '周期复核与调用服务'],
    deliveryCycle: '1-6周（首批建档）',
    regions: ['欧洲', '中国', '全球协作'],
    priceRange: '¥30,000 - ¥220,000',
    priceFactors: ['样本类型与数量', '检测深度', '储存年限', '跨境协作与转运要求'],
    capabilities: [
      '细胞制备与检测实验室面积达20000平米',
      '库容量达700万份',
      '实验中心覆盖欧洲多个重点城市',
      '采用美国FDA认证的样本收集储存和信息管理系统'
    ],
    certifications: ['国际GMP标准细胞检定实验室', 'MVE HEco系列冻结装置', 'TUV国际 ISO9001质量体系认证'],
    coverImage: cover2,
    riskNotice: '样本质量受采集、转运、存储条件影响，需严格遵循标准流程。',
    complianceNotice: '样本管理与使用须符合当地法规及伦理要求，涉及跨境时需完成合规审批。'
  }),
  buildService({
    slug: 'gene-tech-01',
    categorySlug: 'gene-engineering',
    title: '基因工程服务技术（01）',
    subtitle: '技术分类占位页（后续可替换正式名称）',
    summary: '用于承载第一类基因工程服务能力描述与商务信息。',
    audience: ['科研机构', '医疗合作机构'],
    audienceTags: ['技术服务', '科研协作'],
    process: ['需求沟通', '方案设计', '执行交付', '数据复核'],
    deliveryCycle: '2-8周',
    regions: ['中国', '欧洲'],
    priceRange: '¥50,000 - ¥300,000',
    priceFactors: ['检测维度', '样本量', '交付周期'],
    capabilities: ['支持后续扩展详细技术说明'],
    certifications: ['按项目合规要求执行'],
    coverImage: cover1,
    riskNotice: '基因工程服务需在合规框架内开展。',
    complianceNotice: '具体技术边界与适应范围以正式版本为准。'
  }),
  buildService({
    slug: 'gene-tech-02',
    categorySlug: 'gene-engineering',
    title: '基因工程服务技术（02）',
    subtitle: '技术分类占位页（后续可替换正式名称）',
    summary: '用于承载第二类基因工程服务能力描述与商务信息。',
    audience: ['科研机构', '医疗合作机构'],
    audienceTags: ['技术服务', '科研协作'],
    process: ['需求沟通', '方案设计', '执行交付', '数据复核'],
    deliveryCycle: '2-8周',
    regions: ['中国', '欧洲'],
    priceRange: '¥50,000 - ¥300,000',
    priceFactors: ['检测维度', '样本量', '交付周期'],
    capabilities: ['支持后续扩展详细技术说明'],
    certifications: ['按项目合规要求执行'],
    coverImage: cover2,
    riskNotice: '基因工程服务需在合规框架内开展。',
    complianceNotice: '具体技术边界与适应范围以正式版本为准。'
  }),
  buildService({
    slug: 'gene-tech-03',
    categorySlug: 'gene-engineering',
    title: '基因工程服务技术（03）',
    subtitle: '技术分类占位页（后续可替换正式名称）',
    summary: '用于承载第三类基因工程服务能力描述与商务信息。',
    audience: ['科研机构', '医疗合作机构'],
    audienceTags: ['技术服务', '科研协作'],
    process: ['需求沟通', '方案设计', '执行交付', '数据复核'],
    deliveryCycle: '2-8周',
    regions: ['中国', '欧洲'],
    priceRange: '¥50,000 - ¥300,000',
    priceFactors: ['检测维度', '样本量', '交付周期'],
    capabilities: ['支持后续扩展详细技术说明'],
    certifications: ['按项目合规要求执行'],
    coverImage: cover1,
    riskNotice: '基因工程服务需在合规框架内开展。',
    complianceNotice: '具体技术边界与适应范围以正式版本为准。'
  }),
  buildService({
    slug: 'gene-tech-04',
    categorySlug: 'gene-engineering',
    title: '基因工程服务技术（04）',
    subtitle: '技术分类占位页（后续可替换正式名称）',
    summary: '用于承载第四类基因工程服务能力描述与商务信息。',
    audience: ['科研机构', '医疗合作机构'],
    audienceTags: ['技术服务', '科研协作'],
    process: ['需求沟通', '方案设计', '执行交付', '数据复核'],
    deliveryCycle: '2-8周',
    regions: ['中国', '欧洲'],
    priceRange: '¥50,000 - ¥300,000',
    priceFactors: ['检测维度', '样本量', '交付周期'],
    capabilities: ['支持后续扩展详细技术说明'],
    certifications: ['按项目合规要求执行'],
    coverImage: cover2,
    riskNotice: '基因工程服务需在合规框架内开展。',
    complianceNotice: '具体技术边界与适应范围以正式版本为准。'
  }),
  buildService({
    slug: 'gene-tech-05',
    categorySlug: 'gene-engineering',
    title: '基因工程服务技术（05）',
    subtitle: '技术分类占位页（后续可替换正式名称）',
    summary: '用于承载第五类基因工程服务能力描述与商务信息。',
    audience: ['科研机构', '医疗合作机构'],
    audienceTags: ['技术服务', '科研协作'],
    process: ['需求沟通', '方案设计', '执行交付', '数据复核'],
    deliveryCycle: '2-8周',
    regions: ['中国', '欧洲'],
    priceRange: '¥50,000 - ¥300,000',
    priceFactors: ['检测维度', '样本量', '交付周期'],
    capabilities: ['支持后续扩展详细技术说明'],
    certifications: ['按项目合规要求执行'],
    coverImage: cover1,
    riskNotice: '基因工程服务需在合规框架内开展。',
    complianceNotice: '具体技术边界与适应范围以正式版本为准。'
  })
];

export const getPromoCategoryBySlug = (slug) =>
  promoCategories.find((item) => item.slug === slug);

export const getPromoServicesByCategory = (categorySlug) =>
  promoServices.filter((item) => item.categorySlug === categorySlug);

export const getPromoServiceBySlug = (categorySlug, serviceSlug) =>
  promoServices.find((item) => item.categorySlug === categorySlug && item.slug === serviceSlug);
