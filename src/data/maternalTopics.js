import maternalChild from '../images/mother_kids/儿童健康检查.png';
import maternalParenting from '../images/mother_kids/科学育儿指导.png';
import maternalTraining from '../images/mother_kids/专业育儿培训.png';
import maternalMother from '../images/mother_kids/母亲身心健康.png';
import maternalScreening from '../images/mother_kids/健康筛查干预.png';
import maternalNewborn from '../images/mother_kids/新生儿与婴儿健康.png';
import { resolveContentModule } from './runtimeContent';

const baseTopics = [
  {
    slug: 'pregnancy-prenatal-management',
    title: '孕期与产前管理',
    positioning: '从备孕到分娩前的知识科普与实践指南',
    image: maternalTraining,
    subcategories: [
      { slug: 'preconception-assessment', title: '备孕评估与咨询' },
      { slug: 'prenatal-checkup-risk', title: '孕期体检与风险评估' },
      { slug: 'pregnancy-nutrition', title: '孕期营养指导' },
      { slug: 'fetal-education-mental-support', title: '胎教与心理支持' },
      { slug: 'high-risk-pregnancy', title: '高危妊娠管理' },
      { slug: 'delivery-preparation', title: '分娩准备指导' }
    ]
  },
  {
    slug: 'newborn-infant-health',
    title: '新生儿与婴儿健康',
    positioning: '0-1 岁医学常识与家庭护理知识',
    image: maternalNewborn,
    subcategories: [
      { slug: 'newborn-care-guidance', title: '新生儿护理指导' },
      { slug: 'jaundice-management', title: '黄疸管理' },
      { slug: 'preterm-support', title: '早产儿支持' },
      { slug: 'breastfeeding-guidance', title: '母乳与喂养指导' },
      { slug: 'infant-common-diseases', title: '婴儿常见疾病管理' },
      { slug: 'vaccine-consultation', title: '疫苗咨询' }
    ]
  },
  {
    slug: 'child-development-management',
    title: '儿童生长发育管理',
    positioning: '1-12 岁成长监测与发展教育',
    image: maternalChild,
    subcategories: [
      { slug: 'growth-development-assessment', title: '生长发育评估' },
      { slug: 'height-weight-management', title: '身高体重管理' },
      { slug: 'language-development-assessment', title: '语言发育评估' },
      { slug: 'sensory-integration-support', title: '感统训练支持' },
      { slug: 'attention-behavior-screening', title: '注意力与行为问题筛查' },
      { slug: 'developmental-delay-intervention', title: '发育迟缓干预' }
    ]
  },
  {
    slug: 'screening-medical-intervention',
    title: '健康筛查与医学干预',
    positioning: '医学风险识别与干预知识普及',
    image: maternalScreening,
    subcategories: [
      { slug: 'routine-health-checkup', title: '常规健康体检' },
      { slug: 'development-screening', title: '发育筛查' },
      { slug: 'allergy-immunity-management', title: '过敏与免疫管理' },
      { slug: 'chronic-disease-management', title: '慢性病管理' },
      { slug: 'nutrition-assessment', title: '营养评估' },
      { slug: 'personalized-intervention-plan', title: '个性化健康干预方案' }
    ]
  },
  {
    slug: 'scientific-parenting-family-guidance',
    title: '科学育儿与家庭指导',
    positioning: '日常养育能力与方法体系建设',
    image: maternalParenting,
    subcategories: [
      { slug: 'family-parenting-consulting', title: '家庭养育咨询' },
      { slug: 'sleep-management', title: '睡眠管理' },
      { slug: 'emotion-behavior-management', title: '情绪与行为管理' },
      { slug: 'parent-child-relationship-guidance', title: '亲子关系指导' },
      { slug: 'family-education-methods', title: '家庭教育方法' },
      { slug: 'home-environment-optimization', title: '家庭环境优化建议' }
    ]
  },
  {
    slug: 'maternal-physical-mental-support',
    title: '母亲身心健康支持',
    positioning: '核心照护者的身心健康知识支持',
    image: maternalMother,
    subcategories: [
      { slug: 'postpartum-rehabilitation', title: '产后康复' },
      { slug: 'postpartum-mental-support', title: '产后心理支持' },
      { slug: 'lactation-support', title: '哺乳期支持' },
      { slug: 'working-mother-support', title: '职场母亲支持' },
      { slug: 'long-term-women-health', title: '女性长期健康管理' }
    ]
  }
];

const createGenericArticle = (topicTitle, subTitle, subSlug, index) => ({
  slug: `${subSlug}-knowledge-guide-${index + 1}`,
  title: `${subTitle}第${index + 1}讲：家庭实操与关键细节`,
  author: '关爱母婴健康网',
  publishedAt: `2020-01-${String((index % 20) + 1).padStart(2, '0')}`,
  body: [
    `${subTitle}是“${topicTitle}”模块中的核心主题。本篇内容将从日常观察、关键指标和家庭实践三个层面进行讲解。`,
    '建议先建立连续记录习惯，再结合阶段变化进行判断，避免只凭单次现象下结论。',
    '家庭执行时可采用“每周一次复盘”的方式，把有效做法沉淀为固定流程。'
  ]
});

const babyNutrientArticle = {
  slug: 'how-to-judge-baby-lack-of-calcium-iron-zinc-vitamin',
  title: '如何判断宝宝是否缺钙、铁、锌、维生素！（宝妈收藏）',
  author: '关爱母婴健康网',
  publishedAt: '2020-01-17',
  body: [
    '日常生活中，怎样判断宝宝是否缺少钙、铁、锌等营养元素，不至于盲目为孩子补充，或者错过宝宝最佳补充时间，影响宝宝成长发育。为避免这些问题，我们可以看看以下孩子缺乏营养元素的常见表现及补充方法，让宝妈们在育儿道路上少走弯路、及时调整。',
    '缺钙常见表现包括夜间易惊醒、出汗偏多、情绪烦躁等；缺铁可能表现为面色偏白、注意力不集中、容易疲劳；缺锌则可能出现食欲下降、味觉减退等情况。以上都需要结合年龄和生长曲线综合判断。',
    '补充建议应以“先评估、再干预”为原则。优先通过均衡饮食改善，必要时在医生指导下进行实验室检查和营养补充，不建议自行长期使用高剂量补充剂。'
  ]
};

const withArticles = baseTopics.map((topic) => ({
  ...topic,
  subcategories: topic.subcategories.map((sub) => {
    const generatedArticles = Array.from({ length: 12 }, (_, index) =>
      createGenericArticle(topic.title, sub.title, sub.slug, index)
    );
    const articles =
      sub.slug === 'nutrition-assessment'
        ? [babyNutrientArticle, ...generatedArticles.slice(0, 11)]
        : generatedArticles;
    return { ...sub, articles };
  })
}));

const pickPublishedArticles = (topics = []) =>
  topics.map((topic) => ({
    ...topic,
    subcategories: (Array.isArray(topic.subcategories) ? topic.subcategories : []).map((sub) => ({
      ...sub,
      articles: (Array.isArray(sub.articles) ? sub.articles : [])
        .filter((article) => (article?.status || 'published') === 'published')
        .sort((a, b) => Number(a?.sort_order || 0) - Number(b?.sort_order || 0))
    }))
  }));

export const maternalTopics = pickPublishedArticles(resolveContentModule('maternalTopics', withArticles));

export const getMaternalTopicBySlug = (topicSlug) =>
  maternalTopics.find((topic) => topic.slug === topicSlug);

export const getMaternalTopicSubcategory = (topicSlug, subSlug) => {
  const topic = getMaternalTopicBySlug(topicSlug);
  if (!topic) return null;
  const subcategory = topic.subcategories.find((item) => item.slug === subSlug);
  if (!subcategory) return null;
  return { ...subcategory, topic };
};

export const getMaternalKnowledgeArticle = (topicSlug, subSlug, articleSlug) => {
  const subcategory = getMaternalTopicSubcategory(topicSlug, subSlug);
  if (!subcategory) return null;
  const article = subcategory.articles.find((item) => item.slug === articleSlug);
  if (!article) return null;
  return { ...article, subcategory };
};
