import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

const News = () => {
  const newsItems = [
    {
      title: '市政府召开2024年经济工作会议',
      date: '2024-02-04',
      category: '政务动态',
      summary: '会议总结2023年工作成果，部署2024年重点任务...'
    },
    {
      title: '关于进一步优化营商环境的实施意见',
      date: '2024-02-03',
      category: '政策文件',
      summary: '为深入贯彻落实党中央、国务院决策部署...'
    },
    {
      title: '春节期间政务服务安排通知',
      date: '2024-02-02',
      category: '通知公告',
      summary: '根据国务院办公厅关于2024年春节假期安排...'
    },
    {
      title: '数字政府建设取得阶段性成果',
      date: '2024-02-01',
      category: '工作动态',
      summary: '我市数字政府建设稳步推进，政务服务效能显著提升...'
    }
  ];

  const notices = [
    {
      title: '关于征集2024年民生实事项目的公告',
      date: '2024-02-04',
      urgent: true
    },
    {
      title: '市政务服务中心搬迁公告',
      date: '2024-02-03',
      urgent: false
    },
    {
      title: '春节期间12345热线服务时间调整',
      date: '2024-02-02',
      urgent: false
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 新闻动态 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">新闻动态</h2>
                <button className="text-blue-900 hover:text-blue-700 flex items-center space-x-1">
                  <span>更多</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-6">
                {newsItems.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-900 cursor-pointer">
                        {item.title}
                      </h3>
                      <span className="text-sm text-blue-900 bg-blue-50 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{item.summary}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 通知公告 */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">通知公告</h2>
                <button className="text-blue-900 hover:text-blue-700 flex items-center space-x-1">
                  <span>更多</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {notices.map((notice, index) => (
                  <div key={index} className="border-l-4 border-blue-900 pl-4">
                    <div className="flex items-start justify-between">
                      <h3 className={`font-medium text-gray-900 hover:text-blue-900 cursor-pointer ${
                        notice.urgent ? 'text-red-600' : ''
                      }`}>
                        {notice.title}
                        {notice.urgent && (
                          <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            紧急
                          </span>
                        )}
                      </h3>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      {notice.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 快速链接 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">快速链接</h3>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-blue-900">政府信息公开</a>
                <a href="#" className="block text-gray-600 hover:text-blue-900">政务服务网</a>
                <a href="#" className="block text-gray-600 hover:text-blue-900">公共资源交易</a>
                <a href="#" className="block text-gray-600 hover:text-blue-900">信用信息共享</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default News;
