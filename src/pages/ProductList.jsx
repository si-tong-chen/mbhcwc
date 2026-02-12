import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { products } from '../data/products';

const ProductList = () => {
  const pageChunks = useMemo(() => {
    const chunkSize = 3;
    const chunks = [];
    for (let i = 0; i < products.length; i += chunkSize) {
      chunks.push(products.slice(i, i + chunkSize));
    }
    return chunks;
  }, []);
  const [chunkIndex, setChunkIndex] = useState(0);

  useEffect(() => {
    if (pageChunks.length <= 1) return;
    const timer = setInterval(() => {
      setChunkIndex((prev) => (prev + 1) % pageChunks.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [pageChunks.length]);

  const visibleProducts = pageChunks.length ? pageChunks[chunkIndex] : [];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <section className="max-w-6xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="pb-5 border-b border-[#E5C0C8]/60">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1F2937]">关爱产品</h1>
            </div>

            <div className="mt-2 text-xs text-[#6B7280]">
              {products.length > 3 ? `共 ${products.length} 个产品，当前展示第 ${chunkIndex + 1} 组（每组最多 3 个）` : `共 ${products.length} 个产品`}
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleProducts.map((product) => (
                <article key={product.slug} className="rounded-2xl border border-[#E5C0C8]/60 bg-white overflow-hidden shadow-sm">
                  <div className="h-52 bg-[#FDF2F5] overflow-hidden">
                    <img src={product.cover} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                    <p className="mt-1 text-sm text-[#194F92]">{product.category}</p>
                    <p className="mt-3 text-sm text-gray-600 leading-7">{product.description[0] || '暂无简介'}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full border border-[#F3D5DC] text-[#C73A5C]">{product.tag}</span>
                      {product.highlights.slice(0, 2).map((highlight) => (
                        <span key={highlight} className="text-xs px-2 py-1 rounded-full bg-[#F9E5EA] text-[#A84A62]">
                          {highlight}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5">
                      <Link to={`/products/${product.slug}`} className="text-sm font-medium text-[#194F92] hover:underline">
                        详情
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {pageChunks.length > 1 ? (
              <div className="mt-6 flex items-center justify-center gap-2">
                {pageChunks.map((_, index) => (
                  <button
                    key={`product-page-${index}`}
                    type="button"
                    aria-label={`切换到第 ${index + 1} 组产品`}
                    onClick={() => setChunkIndex(index)}
                    className={`h-2 rounded-full transition ${
                      index === chunkIndex ? 'w-5 bg-[#C73A5C]/80' : 'w-2 bg-[#C73A5C]/25 hover:bg-[#C73A5C]/45'
                    }`}
                  />
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductList;
