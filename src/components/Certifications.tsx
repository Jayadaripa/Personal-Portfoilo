
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  X,
} from 'lucide-react';

import { certificates, type CertificateItem } from '../data/portfolio';

function candidateUrls(file: string): string[] {
  const encoded = encodeURIComponent(file);

  return [
    `/certificates/${encoded}`,
    `/Certificates/${encoded}`,
  ];
}

function useCertificateAsset(file: string | null) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<
    'loading' | 'available' | 'missing'
  >('loading');

  useEffect(() => {
    if (!file) {
      setStatus('missing');
      setResolvedUrl(null);
      return;
    }

    let cancelled = false;

    setStatus('loading');
    setResolvedUrl(null);

    const probe = async () => {
      for (const url of candidateUrls(file)) {
        try {
          let res = await fetch(url, { method: 'HEAD' });

          if (res.status === 405 || res.status === 501) {
            res = await fetch(url);
          }

          const contentType =
            res.headers.get('content-type') || '';

          if (res.ok && !contentType.includes('text/html')) {
            if (!cancelled) {
              setResolvedUrl(url);
              setStatus('available');
            }

            return;
          }
        } catch {
          // Try the next possible path.
        }
      }

      if (!cancelled) {
        setStatus('missing');
      }
    };

    void probe();

    return () => {
      cancelled = true;
    };
  }, [file]);

  return { status, resolvedUrl };
}

/* Certificate thumbnail with PDF preview support */

function CertificateThumbnail({
  file,
  preview,
  name,
}: {
  file: string;
  preview?: string;
  name: string;
}) {
  const isImage = /\.(png|jpe?g|webp)$/i.test(file);

  const imageSource =
    preview || (isImage ? candidateUrls(file)[0] : null);

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageSource]);

  if (!imageSource || failed) {
    return null;
  }

  return (
    <div className="mb-4 aspect-[16/10] w-full overflow-hidden rounded-lg border border-white/[0.08] bg-[#070A10]">
      <img
        src={imageSource}
        alt={`${name} preview`}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.03]"
      />
    </div>
  );
}

/* Certificate modal */

interface CertificateModalProps {
  item: CertificateItem;
  onClose: () => void;
}

export function CertificateModal({
  item,
  onClose,
}: CertificateModalProps) {
  const { status, resolvedUrl } = useCertificateAsset(item.file);

  const isPdf = /\.pdf$/i.test(item.file);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{
          duration: 0.2,
          ease: [0.16, 1, 0.3, 1],
        }}
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
        className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0B0E15] p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate viewer"
          className="absolute top-5 right-5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#9CA3B4] transition-colors hover:border-white/25 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="pr-10">
          <p className="text-xs font-medium text-[#60A5FA]">
            {[
              item.category,
              item.subcategory,
              item.issuer,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>

          <h3 className="mt-1.5 font-display text-2xl font-bold text-[#F8FAFC]">
            {item.name}
          </h3>
        </div>

        <div className="mt-5 flex-1 overflow-y-auto">
          {status === 'available' && resolvedUrl ? (
            isPdf ? (
              <iframe
                src={resolvedUrl}
                title={item.name}
                className="h-[55vh] w-full rounded-xl border border-white/10 bg-[#06080C]"
              />
            ) : (
              <img
                src={resolvedUrl}
                alt={`${item.name} certificate`}
                className="max-h-[58vh] w-full rounded-xl border border-white/10 object-contain bg-[#06080C]"
              />
            )
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-[#070A10] p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#60A5FA]">
                <Award size={24} />
              </div>

              <p className="mt-4 font-display text-lg font-semibold text-[#F8FAFC]">
                {item.name}
              </p>

              {item.description && (
                <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#A2AAB9]">
                  {item.description}
                </p>
              )}

              {item.skills && (
                <p className="mt-3 text-xs text-[#93C5FD]">
                  Skills Covered: {item.skills}
                </p>
              )}

              <p className="mt-5 font-mono text-xs text-[#6E778B]">
                Credential File: public/certificates/{item.file}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-4">
          <span className="text-xs text-[#8C95A8]">
            {item.date
              ? `Issued ${item.date}`
              : 'Verified Portfolio Record'}
          </span>

          <div className="flex items-center gap-3">
            {status === 'available' && resolvedUrl && (
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#3B82F6] px-4 py-2 text-xs font-medium text-white hover:bg-[#2563EB]"
              >
                Open in New Tab
                <ExternalLink size={14} />
              </a>
            )}

            {item.verifyLink && (
              <a
                href={item.verifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-white hover:border-white/30"
              >
                Verify Credential
                <ExternalLink size={14} />
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/15 px-4 py-2 text-xs font-medium text-[#F1F3F8] hover:border-white/30"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Main certifications section */

interface CertificationsProps {
  onSelectCertificate: (item: CertificateItem) => void;
}

export default function Certifications({
  onSelectCertificate,
}: CertificationsProps) {
  const categories = [
    'All',
    ...Array.from(new Set(certificates.map((c) => c.category))),
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  const filtered = certificates.filter(
    (item) =>
      selectedCategory === 'All' ||
      item.category === selectedCategory
  );

  const safeIndex =
    spotlightIndex < filtered.length ? spotlightIndex : 0;

  const featured = filtered[safeIndex];

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setSpotlightIndex(0);
  };

  const handlePrev = () => {
    setSpotlightIndex(
      (prev) => (prev - 1 + filtered.length) % filtered.length
    );
  };

  const handleNext = () => {
    setSpotlightIndex(
      (prev) => (prev + 1) % filtered.length
    );
  };

  return (
    <section
      id="certifications"
      className="relative z-10 mx-auto max-w-[1200px] border-t border-white/[0.08] px-6 py-20 lg:py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <p className="text-sm font-medium text-[#60A5FA]">
            Certifications
          </p>

          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
            Learning, Verified.
          </h2>
        </div>

        <p className="font-mono text-xs text-[#8C95A8] tabular-nums">
          {filtered.length}{' '}
          {filtered.length === 1 ? 'credential' : 'credentials'} shown
        </p>
      </motion.div>

      {/* Category filters */}

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Filter certifications by category"
      >
        {categories.map((cat) => {
          const count =
            cat === 'All'
              ? certificates.length
              : certificates.filter(
                  (c) => c.category === cat
                ).length;

          const isSelected = selectedCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => handleCategoryChange(cat)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                isSelected
                  ? 'bg-[#3B82F6] text-white'
                  : 'border border-white/[0.08] bg-[#0B0E15] text-[#9CA3B4] hover:border-white/20 hover:text-white'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Featured certificate */}

      {featured && (
        <AnimatePresence mode="wait">
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0B0E15] p-6 sm:p-8"
          >
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-xs font-medium text-[#60A5FA]">
                  {[
                    featured.category,
                    featured.subcategory,
                    featured.issuer,
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>

                <h3 className="mt-2 font-display text-2xl font-bold text-[#F8FAFC]">
                  {featured.name}
                </h3>

                {featured.description && (
                  <p className="mt-2.5 text-sm leading-relaxed text-[#A2AAB9]">
                    {featured.description}
                  </p>
                )}

                {featured.skills && (
                  <p className="mt-3 text-xs text-[#CBD2E1]">
                    <span className="text-[#7E889C]">
                      Skills:{' '}
                    </span>
                    {featured.skills}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    onSelectCertificate(featured)
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-[#3B82F6] px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-[#2563EB] whitespace-nowrap shrink-0"
                >
                  <FileText size={15} />
                  Inspect Certificate
                </button>

                {filtered.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      aria-label="Previous certificate"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#D1D5E0] hover:border-white/25 hover:text-white"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <span className="min-w-[48px] text-center font-mono text-xs text-[#8C95A8] tabular-nums">
                      {safeIndex + 1} / {filtered.length}
                    </span>

                    <button
                      type="button"
                      onClick={handleNext}
                      aria-label="Next certificate"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#D1D5E0] hover:border-white/25 hover:text-white"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Certificate cards */}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, idx) => {
          const isSpotlight = idx === safeIndex;

          return (
            <motion.button
              key={item.id}
              type="button"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.16 }}
              onClick={() => {
                setSpotlightIndex(idx);
                onSelectCertificate(item);
              }}
              className={`group flex flex-col justify-between rounded-xl border p-5 text-left transition-colors duration-150 ${
                isSpotlight
                  ? 'border-[#3B82F6]/50 bg-[#0F1523]'
                  : 'border-white/[0.08] bg-[#0B0E15] hover:border-white/[0.18]'
              }`}
            >
              <div className="w-full">
                <CertificateThumbnail
                  file={item.file}
                  preview={item.preview}
                  name={item.name}
                />

                <p className="text-xs text-[#8C95A8]">
                  {[item.category, item.issuer]
                    .filter(Boolean)
                    .join(' · ')}
                </p>

                <h4 className="mt-1.5 font-display text-base font-semibold text-[#F8FAFC] transition-colors group-hover:text-[#93C5FD]">
                  {item.name}
                </h4>

                {item.description && (
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#9CA3B4]">
                    {item.description}
                  </p>
                )}
              </div>

              <div className="mt-4 flex w-full items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-[#60A5FA]">
                <span>
                  {item.subcategory || item.category}
                </span>

                <span className="font-medium group-hover:underline">
                  View
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
