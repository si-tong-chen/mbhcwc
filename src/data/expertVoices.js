import portraitAsian01 from '../images/portrait_asian_01.png';
import portraitAsian02 from '../images/portrait_asian_02.jpg';
import portraitElderly01 from '../images/portrait_elderly_01.jpg';
import portraitAsian04 from '../images/portrait_asian_04.png';
import doctorFemale01 from '../images/doctor_female_01.png';
import doctorFemale02 from '../images/doctor_female_02.jpg';
import { resolveContentModule } from './runtimeContent';

const fallbackExpertVoices = [
  {
    slug: 'chai-songyan',
    name: '柴松岩',
    title: '中国著名中医妇科专家',
    institution: '北京中医医院名医',
    image: portraitAsian01,
    quote: '许多女性妇科疾病源于月子调养不到位，想要二胎的家庭，一定要重视第一个月子的调养。',
    intro:
      '长期从事中医妇科临床与教学工作，关注女性体质调理、孕产康复及家庭健康管理路径建设。',
    topics: ['中医妇科', '产后调养', '体质重建'],
    insights: [
      '月子期是女性体质修复窗口期，科学调养可显著降低后续慢性不适。',
      '家庭照护应从“经验型”转向“评估型”，围绕症状变化动态调整方案。',
      '调养不只是饮食，更包括作息、情绪和持续随访。'
    ]
  },
  {
    slug: 'gu-xiulian',
    name: '顾秀莲',
    title: '妇幼健康事业倡导者',
    institution: '全国妇女联合会原主席',
    image: portraitAsian02,
    quote: '关心母婴事业，就是关心下一代，就是关心祖国的未来，这是一项值得我们奋斗一生的事业。',
    intro:
      '持续推动妇幼健康公益行动，强调“社会协同、家庭参与、基层可及”的健康服务体系。',
    topics: ['妇幼公益', '家庭健康', '社会协同'],
    insights: [
      '母婴健康是人口质量与家庭幸福的重要基础。',
      '基层服务能力建设需要政策支持与社会组织协同推进。',
      '健康教育应走进社区、走进家庭，形成长期影响。'
    ]
  },
  {
    slug: 'qiu-xiaomei',
    name: '裘笑梅',
    title: '妇科名医',
    institution: '上海中医药大学附属医院',
    image: portraitElderly01,
    quote: '坐月子，是女性体质重建的重要阶段。',
    intro:
      '擅长从中医整体观出发进行妇科调理，重视产后恢复期的个体化方案与持续干预。',
    topics: ['中医调理', '女性康复', '个体化方案'],
    insights: [
      '产后恢复应以循序渐进为原则，避免“一刀切”方案。',
      '阶段评估比一次性干预更有效，需关注睡眠和情绪指标。',
      '家庭成员共同参与可显著提升恢复效果。'
    ]
  },
  {
    slug: 'lin-jing',
    name: '林静',
    title: '母婴营养与护理专家',
    institution: '华南母婴健康研究中心',
    image: portraitAsian04,
    quote: '营养干预不是加法，而是精准匹配身体当前需求。',
    intro:
      '专注母婴营养与早期照护研究，长期开展社区营养教育和家庭护理指导。',
    topics: ['母婴营养', '家庭护理', '社区教育'],
    insights: [
      '孕产期营养管理应与体质、阶段和生活方式同步调整。',
      '婴幼儿喂养策略需结合个体发育节奏，不宜盲目追求统一标准。',
      '科学记录可帮助家庭更快识别问题并及时干预。'
    ]
  },
  {
    slug: 'zhang-min',
    name: '张敏',
    title: '慢病与家庭健康管理专家',
    institution: '城市社区健康促进委员会',
    image: doctorFemale01,
    quote: '健康管理最难的是坚持，最有效的也是坚持。',
    intro:
      '长期从事社区慢病随访与家庭健康干预工作，推动健康管理从“活动化”走向“日常化”。',
    topics: ['慢病管理', '随访体系', '家庭干预'],
    insights: [
      '家庭健康管理应建立可执行的小目标和复盘机制。',
      '数字化随访工具可以提升依从性，但关键仍是人机协同。',
      '健康行为改变需要“高频小步”，而非短期突击。'
    ]
  },
  {
    slug: 'li-xia',
    name: '李霞',
    title: '女性身心康复专家',
    institution: '女性健康与心理支持中心',
    image: doctorFemale02,
    quote: '身心共治，是女性健康长期稳定的关键。',
    intro:
      '聚焦女性产后心理支持与身心协同康复，倡导“评估-干预-追踪”的闭环服务模式。',
    topics: ['心理支持', '产后康复', '闭环服务'],
    insights: [
      '情绪状态是影响康复效果的核心变量，应纳入常规评估。',
      '身心协同干预比单一身体训练更容易获得持续改善。',
      '家庭沟通质量直接影响女性康复效率。'
    ]
  }
];

const normalizeExpert = (item) => {
  const safeItem = item || {};
  const name = (safeItem.name || safeItem.title || '未命名专家').toString();
  const topics = Array.isArray(safeItem.topics)
    ? safeItem.topics.filter(Boolean)
    : [];
  const insights = Array.isArray(safeItem.insights)
    ? safeItem.insights.filter(Boolean)
    : [];

  return {
    ...safeItem,
    name,
    title: (safeItem.title || '专家观点').toString(),
    institution: (safeItem.institution || '').toString(),
    quote: (safeItem.quote || safeItem.intro || '').toString(),
    intro: (safeItem.intro || '').toString(),
    image: (safeItem.image || '').toString(),
    topics,
    insights
  };
};

export const expertVoices = resolveContentModule('expertVoices', fallbackExpertVoices).map(normalizeExpert);

export const getExpertVoiceBySlug = (slug) => expertVoices.find((item) => item.slug === slug);
