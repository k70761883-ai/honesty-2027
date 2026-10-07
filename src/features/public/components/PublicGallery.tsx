import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CalendarDays, Image as ImageIcon, X } from 'lucide-react';
import { Gallery, GalleryImage, Profile } from '../../../types';
import { getPublicGallery } from '../../../services/galleries';
import { getProfile } from '../../../services/profile';
import { cleanPhoneNumber } from '../../../constants';

interface PublicGalleryProps {
    galleryId: string;
}

// Sanitize image URLs to prevent XSS attacks
const sanitizeImageUrl = (url: string): string => {
    try {
        const parsed = new URL(url);
        // Only allow HTTP(S) protocols
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            console.warn('[Security] Blocked non-HTTP(S) image URL:', url);
            return '/placeholder-image.jpg';
        }
        return url;
    } catch (error) {
        console.warn('[Security] Invalid image URL:', url);
        return '/placeholder-image.jpg';
    }
};

const PublicGallery: React.FC<PublicGalleryProps> = ({ galleryId }) => {
    const [gallery, setGallery] = useState<Gallery | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

    useEffect(() => {
        loadGalleryData();
    }, [galleryId]);

    const loadGalleryData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const [galleryData, profileData] = await Promise.all([
                getPublicGallery(galleryId).catch((err): null => {
                    console.error('Error fetching gallery:', err);
                    return null;
                }),
                getProfile().catch((): null => null)
            ]);

            if (!galleryData) {
                setError('Pricelist tidak ditemukan atau link sudah tidak aktif');
            } else {
                setGallery(galleryData);
            }
            setProfile(profileData);
        } catch (error) {
            console.error('Error loading gallery:', error);
            setError('Pricelist tidak dapat diakses saat ini');
        } finally {
            setIsLoading(false);
        }
    };

    const openLightbox = (image: GalleryImage, index: number) => {
        setSelectedImage(image);
        setCurrentImageIndex(index);
    };

    const handleDownloadPdf = async () => {
        if (!gallery?.pdf_url || isDownloadingPdf) return;

        setIsDownloadingPdf(true);
        try {
            const response = await fetch(gallery.pdf_url);
            if (!response.ok) {
                throw new Error(`PDF download failed with status ${response.status}`);
            }

            const pdfBlob = await response.blob();
            const downloadUrl = URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            const fileName = gallery.pdf_name?.trim() || 'Pricelist';
            link.href = downloadUrl;
            link.download = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        } catch (downloadError) {
            console.error('Error downloading gallery PDF:', downloadError);
            alert('Gagal mengunduh PDF. Silakan coba lagi.');
        } finally {
            setIsDownloadingPdf(false);
        }
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const navigateImage = useCallback((direction: 'prev' | 'next') => {
        if (!gallery) return;

        setCurrentImageIndex(prevIndex => {
            let newIndex = prevIndex;
            if (direction === 'prev') {
                newIndex = prevIndex > 0 ? prevIndex - 1 : gallery.images.length - 1;
            } else {
                newIndex = prevIndex < gallery.images.length - 1 ? prevIndex + 1 : 0;
            }
            setSelectedImage(gallery.images[newIndex]);
            return newIndex;
        });
    }, [gallery]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
        if (e.key === 'ArrowLeft') {
            navigateImage('prev');
        }
        if (e.key === 'ArrowRight') {
            navigateImage('next');
        }
    }, [navigateImage]);

    useEffect(() => {
        if (selectedImage) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedImage, handleKeyDown]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Tenor Sans', sans-serif" }}>
                <div className="text-center p-8">
                    <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Memuat Pricelist...</p>
                </div>
            </div>
        );
    }

    if (error || !gallery) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100" style={{ fontFamily: "'Tenor Sans', sans-serif" }}>
                <div className="text-center p-8 max-w-lg mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-red-100 to-red-200 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Pricelist Tidak Ditemukan</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
                    <div className="flex justify-center gap-3">
                        <button
                            onClick={() => loadGalleryData()}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium cursor-pointer"
                        >
                            Coba Lagi
                        </button>
                        <a
                            href="#/home"
                            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-full transition-all duration-200 font-medium"
                        >
                            Ke Beranda
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const displayCoverImage = gallery.cover_image_url || gallery.images?.[0]?.url;
    const bookingHref = gallery.booking_link?.trim()
        || `#/public-booking${gallery.region ? `?region=${encodeURIComponent(String(gallery.region).toLowerCase())}` : ''}`;
    const opensExternalBooking = bookingHref.startsWith('http');

    return (
        <div className="min-h-screen bg-black" style={{ fontFamily: "'Tenor Sans', sans-serif" }}>
            {/* Gallery Content */}
            <main className="max-w-7xl mx-auto px-0 py-0">
                {(displayCoverImage || gallery.title) && (
                    <div className="bg-white px-3 pt-4 pb-2 sm:px-4 sm:pt-6 sm:pb-3">
                        <div className="max-w-6xl mx-auto">
                            <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12)] border border-slate-200">
                                {displayCoverImage ? (
                                    <img
                                        src={sanitizeImageUrl(displayCoverImage)}
                                        alt={gallery.title}
                                        className="h-[240px] w-full object-cover object-center sm:h-[290px] lg:h-[360px]"
                                        style={{ objectFit: 'cover', width: '100%' }}
                                    />
                                ) : (
                                    <div className="h-[240px] w-full bg-gradient-to-br from-slate-900 via-slate-700 to-blue-900 sm:h-[290px] lg:h-[360px]" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 lg:p-8">
                                    <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/75 sm:text-[10px]">
                                        Pricelist
                                    </p>
                                    <div className="flex items-end justify-between gap-3">
                                        <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
                                            {gallery.title}
                                        </h2>

                                        {gallery.pdf_url && (
                                            <button
                                                type="button"
                                                onClick={() => void handleDownloadPdf()}
                                                disabled={isDownloadingPdf}
                                                aria-busy={isDownloadingPdf}
                                                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2 text-[10px] font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-100 disabled:cursor-wait disabled:opacity-70 sm:px-4 sm:text-xs"
                                            >
                                                <span className="inline-flex shrink-0" aria-hidden="true">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 text-slate-900 sm:h-4 sm:w-4">
                                                        <path d="M14 3v4a2 2 0 0 0 2 2h4" />
                                                        <path d="M5 12V5a2 2 0 0 1 2-2h8l5 5v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-5" />
                                                        <path d="M9 17h6" />
                                                        <path d="M9 13h6" />
                                                    </svg>
                                                </span>
                                                {isDownloadingPdf ? 'Mengunduh PDF...' : 'Download Pricelist PDF'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!gallery.images || gallery.images.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Pricelist Kosong</h3>
                        <p className="text-gray-600 text-lg">Belum ada foto yang diupload ke Pricelist ini</p>
                    </div>
                ) : (
                    <div className="pt-6 sm:pt-8">
                        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-0">
                            {gallery.images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className="break-inside-avoid cursor-pointer group overflow-hidden relative bg-gray-100"
                                    onClick={() => openLightbox(image, index)}
                                >
                                    <img
                                        src={sanitizeImageUrl(image.thumbnailUrl || image.url)}
                                        alt={image.caption || `Foto ${index + 1}`}
                                        className="w-full h-auto object-cover transition-opacity duration-300"
                                        loading={index < 8 ? "eager" : "lazy"}
                                        decoding="async"
                                        onLoad={(e) => {
                                            e.currentTarget.style.opacity = '1';
                                        }}
                                        style={{ opacity: 0 }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Booking CTA & Admin Help */}
                        <div className="px-4 py-10 bg-white">
                            <div className="max-w-3xl mx-auto text-center space-y-4">
                                <p className="text-gray-700">Tertarik dengan layanan kami?</p>
                                <a
                                    href={bookingHref}
                                    target={opensExternalBooking ? '_blank' : undefined}
                                    rel={opensExternalBooking ? 'noopener noreferrer' : undefined}
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-black text-white font-semibold shadow hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
                                >
                                    Booking Sekarang
                                </a>

                                {profile?.phone && (
                                    <div className="pt-4">
                                        <h4 className="text-sm font-semibold text-gray-900">Butuh Bantuan?</h4>
                                        <p className="text-xs text-gray-600 mt-1">
                                            Jika ada pertanyaan atau butuh bantuan dalam pengisian formulir, jangan ragu untuk menghubungi admin kami melalui WhatsApp.
                                        </p>
                                        <a
                                            href={`https://wa.me/${cleanPhoneNumber(profile.phone)}?text=${encodeURIComponent('Halo Admin, saya butuh bantuan pengisian formulir.')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center mt-2 px-3 py-1.5 rounded-md bg-black text-white text-xs font-medium shadow hover:bg-gray-900 transition-colors duration-200"
                                        >
                                            Hubungi Admin ({profile.phone})
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <a
                href={bookingHref}
                target={opensExternalBooking ? '_blank' : undefined}
                rel={opensExternalBooking ? 'noopener noreferrer' : undefined}
                className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-white/30 transition-colors hover:bg-gray-800 sm:bottom-6 sm:right-6"
                aria-label="Booking Sekarang"
            >
                <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                Booking Sekarang
            </a>

            {/* Lightbox */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ fontFamily: "'Tenor Sans', sans-serif" }}>
                    <div className="relative w-full h-full max-w-6xl max-h-full flex items-center justify-center">
                        <button
                            onClick={closeLightbox}
                            className="absolute top-6 right-6 z-20 p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200"
                        >
                            <X className="w-6 h-6" />
                        </button>


                        <div className="relative flex items-center justify-center w-full h-full">
                            <img
                                src={sanitizeImageUrl(selectedImage.url)}
                                alt={selectedImage.caption || 'Foto'}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        </div>

                        {selectedImage.caption && (
                            <div className="absolute bottom-6 left-6 right-6 z-20">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <p className="text-white text-lg font-medium text-center">{selectedImage.caption}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
};

export default PublicGallery;
