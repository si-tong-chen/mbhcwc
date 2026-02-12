import cover1 from '../images/cover_1.png';
import cover2 from '../images/cover_2.png';
import { resolveContentModule } from './runtimeContent';

const fallbackInternationalProjects = [
  {
    slug: 'master-tour-lecture-2024-03-15',
    title: '【视频】国际宫健康管理世界大师中国行任相姬教授',
    date: '2024-03-15',
    image: cover1,
    summary: '围绕女性全周期健康管理进行专题分享，介绍国际宫健康管理实践经验。',
    content: [
      '“国际宫健康管理世界大师中国行”专题活动顺利举办，任相姬教授围绕女性全周期健康管理进行系统分享。',
      '活动现场重点介绍了多维评估、阶段干预和家庭健康管理协同等实践经验，并就常见服务场景给出操作建议。',
      '后续将持续开展专题课程与案例研讨，推动国际经验与本地服务实践的融合落地。'
    ]
  },
  {
    slug: 'official-document-project-launch-2024-03-15',
    title: '【红头】女性私密护理国际宫健康管理工程红头文件',
    date: '2024-03-15',
    image: cover2,
    summary: '发布项目立项与推进文件，明确组织机制、实施计划与阶段目标。',
    content: [
      '女性私密护理国际宫健康管理工程红头文件正式发布，明确项目实施框架与推进路径。',
      '文件提出将围绕人才培训、服务规范、质量评估和示范点建设四个方向同步开展工作。',
      '项目将按阶段组织复盘评估，持续优化执行细则，保障实施质量。'
    ]
  },
  {
    slug: 'admission-brochure-project-2024-03-15',
    title: '【招生】"女性私密护理国际宫健康管理"招生简章',
    date: '2024-03-15',
    image: cover1,
    summary: '发布招生简章，明确课程模块、学习周期、实训安排与结业要求。',
    content: [
      '“女性私密护理国际宫健康管理”项目发布招生简章，面向相关从业人员开展体系化培训。',
      '课程涵盖理论知识、标准流程、实操演练与案例复盘，采用“集中授课+实训辅导”形式推进。',
      '简章同时公布报名条件、课程周期与结业评估标准，便于学员按计划学习提升。'
    ]
  },
  {
    slug: 'certificate-guide-2024-03-15',
    title: '【证书】国际宫健康管理师证书申领指南',
    date: '2024-03-15',
    image: cover2,
    summary: '明确证书申领流程与材料要求，规范资格审核与结果公示环节。',
    content: [
      '国际宫健康管理师证书申领指南发布，对申领流程、材料要求和时间节点进行统一说明。',
      '指南强调资格审核与过程留痕，要求各环节按标准执行，保障证书管理规范有序。',
      '相关机构可按指南组织学员申报，并做好咨询答疑和资料核验工作。'
    ]
  },
  {
    slug: 'service-standard-seminar-2025-02-20',
    title: '国际宫健康管理服务标准研讨会召开',
    date: '2025-02-20',
    image: cover1,
    summary: '聚焦服务流程与质量评估，形成标准化建设阶段性共识。',
    content: [
      '国际宫健康管理服务标准研讨会召开，专家围绕服务流程、风险提示与质量控制进行了深入交流。',
      '会议提出建立“标准流程+培训认证+质量评估”三位一体机制，提升服务一致性和可复制性。',
      '下一阶段将开展区域试点验证，持续完善标准文本。'
    ]
  },
  {
    slug: 'clinical-cooperation-base-2025-01-10',
    title: '国际宫健康管理临床协作基地授牌公告',
    date: '2025-01-10',
    image: cover2,
    summary: '首批协作基地完成授牌，进一步强化临床与健康管理协同。',
    content: [
      '国际宫健康管理临床协作基地首批授牌工作完成，标志着项目协同网络进一步完善。',
      '协作基地将承担案例研究、技术培训、服务评估与经验推广等任务。',
      '项目组将定期组织质量复盘，促进基地之间的经验共享。'
    ]
  },
  {
    slug: 'advanced-training-camp-2024-11-28',
    title: '国际宫健康管理高级研修营（第二期）开班',
    date: '2024-11-28',
    image: cover1,
    summary: '第二期研修营聚焦实操与案例，提升一线服务能力。',
    content: [
      '国际宫健康管理高级研修营（第二期）正式开班，课程重点覆盖实操规范与典型案例处理。',
      '研修营采用分阶段教学模式，结合现场演练与导师督导，提升培训实效。',
      '结业后将开展阶段回访，跟踪学员岗位应用情况。'
    ]
  },
  {
    slug: 'public-welfare-screening-plan-2024-09-05',
    title: '国际宫健康管理公益筛查行动计划发布',
    date: '2024-09-05',
    image: cover2,
    summary: '发布公益筛查计划，重点覆盖基层女性健康服务需求。',
    content: [
      '国际宫健康管理公益筛查行动计划正式发布，计划面向基层社区开展分层筛查和健康指导。',
      '行动将结合宣教活动、初筛评估和转介建议，提升健康风险早识别能力。',
      '各参与单位将按月提交数据反馈，用于优化服务组织方式。'
    ]
  },
  {
    slug: 'digital-case-system-online-2024-07-19',
    title: '国际宫健康管理数字化病例系统上线试运行',
    date: '2024-07-19',
    image: cover1,
    summary: '系统支持病例记录与随访跟踪，提升数据协同效率。',
    content: [
      '国际宫健康管理数字化病例系统上线试运行，支持病例记录、阶段评估与随访提醒。',
      '系统重点优化了机构协同和数据回溯功能，便于一线人员开展连续性服务。',
      '试运行阶段将持续收集反馈，完善稳定性与使用体验。'
    ]
  },
  {
    slug: 'annual-summary-and-plan-2024-12-22',
    title: '国际宫健康管理工程年度总结与2025计划发布',
    date: '2024-12-22',
    image: cover2,
    summary: '总结年度成果并发布下一年度重点推进方向。',
    content: [
      '国际宫健康管理工程发布年度总结，系统回顾了项目推进、培训开展和服务落地情况。',
      '同时公布2025年重点计划，明确将深化标准建设、扩大试点范围并强化数字化支撑。',
      '项目组表示将继续以服务质量为核心，推进工程稳步实施。'
    ]
  }
];

export const internationalProjects = resolveContentModule('internationalProjects', fallbackInternationalProjects);

export const getInternationalProjectBySlug = (slug) =>
  internationalProjects.find((item) => item.slug === slug);
