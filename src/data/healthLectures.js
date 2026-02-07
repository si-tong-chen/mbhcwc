import doctorFemale01 from '../images/doctor_female_01.png';
import doctorFemale02 from '../images/doctor_female_02.jpg';
import portraitAsian01 from '../images/portrait_asian_01.png';
import portraitAsian02 from '../images/portrait_asian_02.jpg';
import portraitElderly01 from '../images/portrait_elderly_01.jpg';
import portraitAsian04 from '../images/portrait_asian_04.png';

export const healthLectures = [
  {
    slug: 'cvd-prevention-2026-03-12',
    title: '张教授：心血管疾病预防与家庭风险管理',
    speaker: '张教授',
    speakerTitle: '心血管健康管理专家',
    dateTime: '2026-03-12T14:00:00+08:00',
    location: '北京·线上同步直播',
    avatar: doctorFemale01,
    summary: '聚焦家庭高危因素识别与日常干预策略，帮助建立可执行的预防方案。',
    content: [
      '本场讲座将围绕家庭常见心血管风险因素展开，系统介绍血压、血脂、体重、睡眠与压力管理的协同策略。',
      '讲座将结合典型家庭场景讲解如何进行早期识别、生活方式干预与阶段复盘，提升日常健康管理效率。',
      '适合关注中老年家庭健康与慢病预防的人群参与。'
    ]
  },
  {
    slug: 'women-health-care-2026-03-25',
    title: '李主任：女性健康保健与周期调养',
    speaker: '李主任',
    speakerTitle: '女性健康与康复专家',
    dateTime: '2026-03-25T10:00:00+08:00',
    location: '上海·线上同步直播',
    avatar: doctorFemale02,
    summary: '从周期管理到产后修复，讲解女性健康长期管理的关键路径。',
    content: [
      '讲座将围绕女性不同阶段的健康需求，介绍周期调养、营养支持和日常生活方式优化策略。',
      '针对常见问题提供家庭可执行的管理建议，并说明何时需要就医评估。',
      '重点强调“持续管理”对女性身心状态稳定的长期价值。'
    ]
  },
  {
    slug: 'tcm-postpartum-2025-12-18',
    title: '柴松岩：产后调养与体质重建实务',
    speaker: '柴松岩',
    speakerTitle: '中医妇科专家',
    dateTime: '2025-12-18T19:30:00+08:00',
    location: '北京·学术报告厅',
    avatar: portraitAsian01,
    summary: '从体质辨识出发讲解产后恢复策略，帮助家庭建立科学调养方案。',
    videoUrl: 'https://www.bilibili.com/video/BV1GJ411x7h7',
    content: [
      '本讲座重点分享了产后常见问题的辨识方法与调养思路，强调个体化与阶段性干预。',
      '通过案例分析说明了饮食、作息、情绪支持与随访在恢复过程中的作用。',
      '讲座最后设置现场问答，围绕家庭照护误区进行了集中解答。'
    ]
  },
  {
    slug: 'child-growth-2025-11-06',
    title: '顾秀莲：儿童成长关键期的家庭支持',
    speaker: '顾秀莲',
    speakerTitle: '妇幼健康事业倡导者',
    dateTime: '2025-11-06T15:00:00+08:00',
    location: '广州·公益讲堂',
    avatar: portraitAsian02,
    summary: '围绕成长关键期的营养、心理和家庭互动提出系统性建议。',
    videoUrl: 'https://www.bilibili.com/video/BV1xx411c7mD',
    content: [
      '讲座聚焦儿童成长关键期，强调家庭支持在行为习惯、营养结构和情绪发展的作用。',
      '结合社区实践案例说明了“家校社协同”对儿童健康成长的重要性。',
      '为家长提供了分阶段、可执行的家庭干预建议。'
    ]
  },
  {
    slug: 'women-mental-2025-09-20',
    title: '裘笑梅：女性身心协同康复专题',
    speaker: '裘笑梅',
    speakerTitle: '妇科名医',
    dateTime: '2025-09-20T14:30:00+08:00',
    location: '杭州·线上直播',
    avatar: portraitElderly01,
    summary: '讲解身心协同康复模型，帮助女性建立长期稳定的健康节律。',
    videoUrl: 'https://www.bilibili.com/video/BV1mK4y1C7Bz',
    content: [
      '本场讲座提出“身心共治”的康复路径，重点介绍睡眠、运动与情绪调适的联动机制。',
      '通过临床案例展示了个体化方案在长期干预中的优势。',
      '讲座还针对常见误区提供了实用纠偏建议。'
    ]
  },
  {
    slug: 'maternal-nutrition-2025-08-08',
    title: '林静：母婴营养管理与科学喂养',
    speaker: '林静',
    speakerTitle: '母婴营养与护理专家',
    dateTime: '2025-08-08T09:30:00+08:00',
    location: '长沙·健康中心',
    avatar: portraitAsian04,
    summary: '围绕母婴营养评估与喂养策略，提供阶段化家庭指导方案。',
    videoUrl: 'https://www.bilibili.com/video/BV1J4411H7nV',
    content: [
      '讲座系统介绍了孕产期与婴幼儿阶段的营养管理重点，强调评估先行与动态调整。',
      '现场结合家庭喂养案例，说明了常见喂养误区与改进方式。',
      '课程最后提供了可落地的一周家庭营养管理模板。'
    ]
  }
];

export const getHealthLectureBySlug = (slug) => healthLectures.find((item) => item.slug === slug);
