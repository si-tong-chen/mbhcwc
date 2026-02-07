import React, { useState } from 'react';
import { Phone, Mail, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    const q = keyword.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : '/search');
  };

  return (
    <header className="site-header text-[#194F92] py-2">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>服务热线：010-53608360</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <form className="flex items-center space-x-2" onSubmit={handleSearch}>
              <input 
                type="text" 
                placeholder="请输入搜索内容" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="px-3 py-1 rounded text-[#194F92] text-xs w-40"
              />
              <button type="submit" className="bg-[#EFB7BA] hover:bg-[#E5C0C8] text-[#194F92] px-3 py-1 rounded text-xs flex items-center">
                <Search className="h-3 w-3 mr-1" />
                搜索
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
