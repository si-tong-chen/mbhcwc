import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { getProductBySlug } from '../data/products';

const ProductDetail = () => {
  const { slug } = useParams();
  const product = getProductBySlug(slug);

  if (!product) return <Navigate to="/" replace />;

  const highlights = Array.isArray(product.highlights) ? product.highlights : [];
  const specs = Array.isArray(product.specs) ? product.specs : [];
  const description = Array.isArray(product.description) ? product.description : [];
  const usage = Array.isArray(product.usage) ? product.usage : [];
  const faq = Array.isArray(product.faq) ? product.faq : [];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#FFF7F9_0%,#FFF1F4_100%)]">
      <Header />
      <Navigation />

      <main className="py-16">
        <div className="container mx-auto px-4">
          <article className="max-w-6xl mx-auto rounded-2xl bg-white/95 border border-[#E5C0C8]/60 shadow-md p-6 md:p-10">
            <div className="mb-6 text-sm text-[#194F92]">
              <Link to="/" className="hover:underline">返回首页</Link>
            </div>

            <section className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8">
              <div className="rounded-2xl overflow-hidden border border-[#F3D5DC] bg-white">
                <img src={product.cover} alt={product.name} className="w-full h-[360px] object-cover" />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="mt-2 text-sm text-gray-500">{product.category}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded-full border border-[#F3D5DC] text-[#C73A5C]">{product.tag}</span>
                  {highlights.map((item) => (
                    <span key={item} className="text-xs px-2 py-1 rounded-full bg-[#F9E5EA] text-[#A84A62]">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-[#E5C0C8]/60 bg-[#FFF9FB] p-4">
                  <h2 className="font-semibold text-gray-900">商品参数</h2>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    {specs.map((item) => (
                      <div key={item.label} className="flex">
                        <span className="w-24 text-gray-500">{item.label}</span>
                        <span>{item.value}</span>
                      </div>
                    ))}
                    {specs.length === 0 ? <div className="text-gray-500">暂无参数</div> : null}
                  </div>
                </div>

                <div className="mt-5 text-sm text-gray-500">
                  本页面仅展示商品介绍信息，不提供在线支付。
                </div>
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900">商品介绍</h2>
              <div className="mt-4 space-y-4 text-gray-700 leading-8">
                {description.map((item) => (
                  <p key={item}>{item}</p>
                ))}
                {description.length === 0 ? <p>暂无介绍内容</p> : null}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900">使用建议</h2>
              <ul className="mt-4 space-y-3">
                {usage.map((item) => (
                  <li key={item} className="rounded-xl border border-[#E5C0C8]/60 bg-[#FFF9FB] p-4 text-gray-700 leading-7">
                    {item}
                  </li>
                ))}
                {usage.length === 0 ? <li className="rounded-xl border border-[#E5C0C8]/60 bg-[#FFF9FB] p-4 text-gray-500">暂无使用建议</li> : null}
              </ul>
            </section>

            <section className="mt-10">
              <h2 className="text-xl font-semibold text-gray-900">常见问题</h2>
              <div className="mt-4 space-y-3">
                {faq.map((item) => (
                  <div key={item.q} className="rounded-xl border border-[#E5C0C8]/60 bg-white p-4">
                    <div className="font-semibold text-gray-900">{item.q}</div>
                    <div className="mt-2 text-gray-700">{item.a}</div>
                  </div>
                ))}
                {faq.length === 0 ? <div className="rounded-xl border border-[#E5C0C8]/60 bg-white p-4 text-gray-500">暂无常见问题</div> : null}
              </div>
            </section>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
