import productBook from '../images/product_book.png';
import product2 from '../images/product_2.jpg';
import { resolveContentModule } from './runtimeContent';

const fallbackProducts = [
  {
    slug: 'zhonghua-zhongyi-kunlun-book',
    name: '中华中医昆仑（书籍）',
    category: '中医文化读物',
    tag: '中医文化',
    cover: productBook,
    gallery: [productBook],
    highlights: ['中医文化系统梳理', '家庭健康知识读本', '适合家庭收藏与学习'],
    specs: [
      { label: '产品类型', value: '图书' },
      { label: '适用人群', value: '家庭成员、健康从业者、学习者' },
      { label: '使用场景', value: '日常阅读、家庭共学、健康课程配套' }
    ],
    description: [
      '《中华中医昆仑》围绕中医基础理论、生活调养思想与常见健康观念进行系统梳理，强调“治未病”与日常养护的结合。',
      '内容编排以家庭易理解、可实践为导向，适合作为家庭健康知识读本，也可用于社区健康宣教辅助材料。',
      '建议结合个人体质和生活习惯进行学习与应用，不将单一章节内容直接替代个体化健康建议。'
    ],
    usage: [
      '每周安排 2-3 次固定阅读时段，配合家庭健康记录进行复盘。',
      '优先学习与当前家庭成员健康需求相关的章节，形成重点学习清单。',
      '将书中方法转化为可执行的饮食、作息、运动小目标。'
    ],
    faq: [
      { q: '这本书适合没有中医基础的人吗？', a: '适合，内容以通俗表达为主，建议从基础章节开始阅读。' },
      { q: '可以替代医生诊疗吗？', a: '不能。本书用于知识学习与日常管理，不替代医学诊疗。' }
    ]
  },
  {
    slug: 'tiandi-jinghua-water',
    name: '天地精华',
    category: '天然矿泉水',
    tag: '日常饮用',
    cover: product2,
    gallery: [product2],
    highlights: ['日常饮水补充', '家庭场景适配', '配合健康管理方案使用'],
    specs: [
      { label: '产品类型', value: '饮用水' },
      { label: '适用人群', value: '一般家庭人群' },
      { label: '建议场景', value: '居家、办公、运动后补水' }
    ],
    description: [
      '天地精华定位为家庭日常饮水选择，适合在规律饮水管理中作为稳定补水方案。',
      '在家庭健康管理实践中，建议将饮水与作息、运动、饮食计划联动，提升整体执行效果。',
      '不同年龄与体力活动人群的饮水量存在差异，应结合季节和个体情况调整。'
    ],
    usage: [
      '建立家庭饮水时间点：晨起、上午、午后、晚间分次补充。',
      '运动后优先小口多次饮水，避免一次性大量摄入。',
      '儿童饮水以少量多次为主，避免用含糖饮料替代。'
    ],
    faq: [
      { q: '每天喝多少更合适？', a: '可参考成人 1500-1700ml 的日常范围，并按气候和活动量动态调整。' },
      { q: '可以只在口渴时喝水吗？', a: '不建议。口渴通常已是轻度缺水信号，建议主动分次饮水。' }
    ]
  }
];

const normalizeProduct = (item = {}) => ({
  ...item,
  status: item.status || 'published',
  sort_order: Number(item.sort_order || 0),
  slug: item.slug || '',
  name: item.name || '',
  category: item.category || '',
  tag: item.tag || '',
  cover: item.cover || '',
  gallery: Array.isArray(item.gallery) ? item.gallery : [],
  highlights: Array.isArray(item.highlights) ? item.highlights : [],
  specs: Array.isArray(item.specs) ? item.specs : [],
  description: Array.isArray(item.description) ? item.description : [],
  usage: Array.isArray(item.usage) ? item.usage : [],
  faq: Array.isArray(item.faq) ? item.faq : []
});

const pickPublishedProducts = (rows = []) =>
  rows
    .map((item) => normalizeProduct(item))
    .filter((item) => item.status === 'published')
    .sort((a, b) => {
      const bySort = Number(a.sort_order || 0) - Number(b.sort_order || 0);
      if (bySort !== 0) return bySort;
      return String(a.updated_at || '').localeCompare(String(b.updated_at || ''));
    });

export const products = pickPublishedProducts(resolveContentModule('products', fallbackProducts));

export const getProductBySlug = (slug) => products.find((item) => item.slug === slug);
