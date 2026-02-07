import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: '"宫"健康管理',
      subtitle: '"宫"健康管理是韩国任相姬教授以面部、身体护理及子宫护理的临床经验为基础，研究出的一套有体系、科学的健康子宫护理方法。以全息疗法为核心，全方位、多维度来守护女性"宫"的健康；女子子宫视为上天给女性的馈赠，从身、心、灵出发调理女性"宫"健康。以顾客体验感为服务宗旨，全心全意为顾客服务以帮助顾客保护子宫为己任，而设立的品牌。\n\n关爱母婴健康工作委员会历经长达6年市场调研及对母婴行业女性市场的属性分析，2024年携手云科教育职业培训学校与任相姬教授团队及其品牌达成中国区战略合作。',
      image: 'https://photo.bj.ide.test.sankuai.com/?keyword=health,medical&width=1200&height=400'
    },
    {
      title: '宫管理创始人，名誉专家',
      subtitle: '',
      image: 'https://photo.bj.ide.test.sankuai.com/?keyword=lecture,education&width=1200&height=400'
    },
    {
      title: '国际"宫"健康管理技术招生',
      subtitle: '0基础也可包教包会，国际"宫"管理技术招生，教你一套技术，让你享受一生',
      image: 'https://photo.bj.ide.test.sankuai.com/?keyword=mother,child,health&width=1200&height=400'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative h-96 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="mx-auto object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-[#F7C6D0]/80 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl px-4">
              <h2 className="text-4xl font-bold mb-4 text-[#194F92]">{slide.title}</h2>
              {slide.subtitle && (
                <p className="text-lg whitespace-pre-line">{slide.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
