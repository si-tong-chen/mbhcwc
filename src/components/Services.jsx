import React from 'react';
import { FileText, Users, Building, CreditCard, Phone, Globe } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: '办事服务',
      description: '在线办理各类政务服务事项',
      link: '#'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: '互动交流',
      description: '政民互动，意见建议反馈',
      link: '#'
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: '信息公开',
      description: '政府信息主动公开查询',
      link: '#'
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: '便民服务',
      description: '生活缴费、证件办理等',
      link: '#'
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: '12345热线',
      description: '政务服务便民热线',
      link: '#'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: '数据开放',
      description: '政府数据资源开放共享',
      link: '#'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">政务服务</h2>
          <p className="text-gray-600">便民利民，高效服务</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className="text-blue-900 group-hover:text-blue-700 transition-colors">
                  {service.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-blue-50 p-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">1000+</h3>
              <p className="text-gray-600">服务事项</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">24小时</h3>
              <p className="text-gray-600">在线服务</p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">98%</h3>
              <p className="text-gray-600">满意度</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
