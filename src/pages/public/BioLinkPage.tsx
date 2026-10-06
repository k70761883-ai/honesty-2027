import React, { useEffect, useState } from 'react';
import { ExternalLink, MessageCircle } from 'lucide-react';
import { BioLinkPage as BioLinkPageData } from '../../types';
import { getBioLinkPage } from '../../services/bioLinks';

interface BioLinkPageProps {
  slug?: string;
}

const BioLinkPage: React.FC<BioLinkPageProps> = ({ slug }) => {
  const [page, setPage] = useState<BioLinkPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getBioLinkPage(slug)
      .then((data) => {
        if (!cancelled) setPage(data);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(reason instanceof Error ? reason.message : 'Halaman link tidak dapat dimuat.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#fafaf6] text-sm text-[#8b8378]">Memuat halaman...</div>;
  }

  if (error || !page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafaf6] px-6 text-center">
        <div className="max-w-sm">
          <h1 className="text-xl font-semibold text-[#42392f]">{error ? 'Halaman belum siap' : 'Link tidak ditemukan'}</h1>
          <p className="mt-2 text-sm leading-6 text-[#82796f]">{error || 'Halaman ini tidak tersedia atau belum dipublikasikan.'}</p>
        </div>
      </main>
    );
  }

  const whatsapp = page.whatsapp_number.replace(/\D/g, '');
  const whatsappUrl = whatsapp ? `https://wa.me/${whatsapp}` : '';

  return (
    <main className="min-h-screen bg-[#fafaf6] pb-14 text-[#292821]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="mx-auto min-h-screen w-full max-w-[590px] bg-[#fafaf6] shadow-[0_0_30px_rgba(35,30,24,0.06)]">
        <div className="relative h-[220px] overflow-visible bg-[#b8aa98]">
          {page.cover_url && <img src={page.cover_url} alt="" className="absolute inset-0 h-full w-full object-cover" />}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute -bottom-[58px] left-1/2 z-10 h-[132px] w-[132px] -translate-x-1/2 overflow-hidden rounded-full border-[5px] border-[#fafaf6] bg-[#d8d0c4] shadow-sm">
            {page.avatar_url ? (
              <img src={page.avatar_url} alt={page.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-light text-white">
                {(page.title || '?').slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <section className="px-6 pt-[164px] text-center">
          <h1 className="text-[27px] font-medium tracking-wide text-[#25241f]">{page.title}</h1>
          {page.subtitle && <p className="mt-3 text-[18px] font-normal tracking-wide text-[#77736e]">{page.subtitle}</p>}

          <div className="mx-auto mt-11 flex max-w-[535px] flex-col gap-[18px]">
            {whatsappUrl && (
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[72px] items-center justify-center gap-3 rounded-[15px] bg-[#b8aa98] px-5 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-sm transition hover:bg-[#a99985] focus:outline-none focus:ring-2 focus:ring-[#8f7b65] focus:ring-offset-2">
                <MessageCircle size={17} aria-hidden="true" />
                {page.whatsapp_label || 'WhatsApp'}
              </a>
            )}
            {page.links.map((link) => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex min-h-[72px] items-center justify-center gap-3 rounded-[15px] bg-[#b8aa98] px-5 text-sm font-semibold uppercase tracking-[0.24em] text-white shadow-sm transition hover:bg-[#a99985] focus:outline-none focus:ring-2 focus:ring-[#8f7b65] focus:ring-offset-2">
                <ExternalLink size={16} aria-hidden="true" />
                {link.title}
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default BioLinkPage;
