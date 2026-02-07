import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin } from 'lucide-react';
import qrCode from '../images/二维码.png';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 网站信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#3A3F4B]">网站信息</h3>
            <ul className="space-y-2 text-[#5F6470]">
              <li><a href="#" className="hover:text-[#E85A8A]">网站地图</a></li>
              <li><a href="#" className="hover:text-[#E85A8A]">网站声明</a></li>
              <li><a href="#" className="hover:text-[#E85A8A]">隐私保护</a></li>
              <li><a href="#" className="hover:text-[#E85A8A]">法律声明</a></li>
            </ul>
          </div>

          {/* 健康服务 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#3A3F4B]">健康服务</h3>
            <ul className="space-y-2 text-[#5F6470]">
              <li><Link to="/projects" className="hover:text-[#E85A8A]">国际宫健康管理工程</Link></li>
              <li><Link to="/lectures" className="hover:text-[#E85A8A]">专家健康大讲堂</Link></li>
              <li><Link to="/training" className="hover:text-[#E85A8A]">培训中心</Link></li>
              <li><Link to="/products" className="hover:text-[#E85A8A]">关爱产品</Link></li>
            </ul>
          </div>

          {/* 相关链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#3A3F4B]">相关链接</h3>
            <ul className="space-y-2 text-[#5F6470]">
              <li><a href="https://www.nwccw.gov.cn/" target="_blank" rel="noreferrer" className="hover:text-[#E85A8A]">国务院妇女儿童工作委员会</a></li>
              <li><a href="https://www.cwdf.org.cn/" target="_blank" rel="noreferrer" className="hover:text-[#E85A8A]">中国妇女发展基金会</a></li>
              <li><a href="http://www.nhfpc.gov.cn/" target="_blank" rel="noreferrer" className="hover:text-[#E85A8A]">国家卫生和计划生育委员会</a></li>
              <li><a href="https://www.cctf.org.cn/" target="_blank" rel="noreferrer" className="hover:text-[#E85A8A]">中国儿童少年基金会</a></li>
              <li><a href="http://www.ddzyyzx.com/" target="_blank" rel="noreferrer" className="hover:text-[#E85A8A]">当代中医药发展研究中心</a></li>
              <li><a href="https://www.cpam.org.cn/" target="_blank" rel="noreferrer" className="hover:text-[#E85A8A]">中国医疗保健国际交流促进会</a></li>
              <li><a href="http://yrmcf.org.cn/" target="_blank" rel="noreferrer" className="hover:text-[#E85A8A]">北京市于若木慈善基金会</a></li>
              <li><a href="http://www.jkcn.org/" target="_blank" rel="noreferrer" className="hover:text-[#E85A8A]">健康中国</a></li>
            </ul>
          </div>

          {/* 联系方式 */}
          <div id="contact-qr-section">
            <h3 className="text-lg font-semibold mb-4 text-[#3A3F4B]">联系我们</h3>
            <div className="space-y-3 text-[#7A7680]">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>010-53608360</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>北京丰台区葆台北路6号大溪地二区3号楼103</span>
              </div>
            </div>
            <div className="mt-4">
              <img
                src={qrCode}
                alt="联系我们二维码"
                className="w-24 h-24 rounded-md border border-red-700/40 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-[#E5C0C8]/70 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-[#9A9AA3] text-sm"></div>
            <div className="text-[#9A9AA3] text-sm mt-4 md:mt-0">
              <p>网站标识码：1234567890 | ICP备案号：京ICP备12345678号</p>
              <p>© 2024 国际宫健康管理协会 版权所有</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
