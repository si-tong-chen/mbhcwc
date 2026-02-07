import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo1 from '../images/logo_1.jpg';
import logo2 from '../images/logo_2.jpg';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: '首页', to: '/' },
    { name: '协会简介', to: '/association' },
    { name: '协会资讯', to: '/news' },
    { name: '协会公告', to: '/notices' },
    { name: '专家名说', to: '/experts' },
    { name: '专题视频', to: '/videos' },
    { name: '关爱产品', to: '/products' },
    { name: '宫管理', to: '/projects' },
    { name: '教育培训', to: '/training' },
    { name: '工作站', to: '/stations' },
    { name: '联系我们', type: 'contact' }
  ];

  const scrollToContactQr = () => {
    const target = document.getElementById('contact-qr-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleContactClick = () => {
    setIsMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/?target=contact');
      return;
    }
    requestAnimationFrame(scrollToContactQr);
  };

  return (
    <nav className="bg-[#F7C6D0] shadow-lg">
      {/* Brandbar */}
      <div className="border-b border-[#E5C0C8]/50">
        <div className="max-w-[1200px] mx-auto px-6 h-24 flex items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={logo1}
                alt="机构徽标一"
                className="w-20 h-20 object-cover rounded-full border-2 border-[#EFB7BA]"
              />
              <img
                src={logo2}
                alt="机构徽标二"
                className="w-20 h-20 object-cover rounded-full border-2 border-[#EFB7BA]"
              />
            </div>
            <div>
              <h1 className="text-[37px] font-semibold text-[#F53163] leading-[1.2]">
                当代中医药发展研究中心关爱母婴健康工作委员会
              </h1>
              <p className="mt-1 text-lg font-bold text-[#194F92]">关爱母婴健康 促进产业发展</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <div className="border-b border-[#E5C0C8]/50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-center justify-between h-12">
            <ul className="hidden lg:flex flex-wrap items-center gap-6">
              {navItems.map((item, index) => (
                <li key={index}>
                  {item.type === 'contact' ? (
                    <button
                      type="button"
                      onClick={handleContactClick}
                      className="inline-flex items-center h-10 px-3 text-sm font-medium text-[#194F92] whitespace-nowrap rounded-md hover:bg-white/40"
                    >
                      <span>{item.name}</span>
                    </button>
                  ) : item.to ? (
                    <Link
                      to={item.to}
                      className="inline-flex items-center h-10 px-3 text-sm font-medium text-[#194F92] whitespace-nowrap rounded-md hover:bg-white/40"
                    >
                      <span>{item.name}</span>
                      {item.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                    </Link>
                  ) : (
                    <a
                      href={item.href}
                      className="inline-flex items-center h-10 px-3 text-sm font-medium text-[#194F92] whitespace-nowrap rounded-md hover:bg-white/40"
                    >
                      <span>{item.name}</span>
                      {item.hasDropdown && <ChevronDown className="ml-1 h-4 w-4" />}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <button
              className="lg:hidden text-[#194F92]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden border-t border-[#E5C0C8]/50 py-2">
              {navItems.map((item, index) => (
                item.type === 'contact' ? (
                  <button
                    key={index}
                    type="button"
                    onClick={handleContactClick}
                    className="block w-full text-left py-2 px-2 text-sm text-[#194F92] hover:bg-white/50 rounded-md"
                  >
                    {item.name}
                  </button>
                ) : item.to ? (
                  <Link
                    key={index}
                    to={item.to}
                    className="block py-2 px-2 text-sm text-[#194F92] hover:bg-white/50 rounded-md"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <a
                    key={index}
                    href={item.href}
                    className="block py-2 px-2 text-sm text-[#194F92] hover:bg-white/50 rounded-md"
                  >
                    {item.name}
                  </a>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
