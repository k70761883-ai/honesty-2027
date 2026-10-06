import React, { useState, useMemo, useEffect } from 'react';
import { Check, ArrowRight, MessageCircle } from 'lucide-react';
import { LeadStatus, ContactChannel, PublicLeadFormProps, ViewType } from '../../../types';
import { createLead } from '../../../services/leads';
import { cleanPhoneNumber } from '../../../constants';

const PublicLeadForm: React.FC<PublicLeadFormProps> = ({ setLeads, userProfile, showNotification, addNotification }) => {
    const referralCode = useMemo(() => {
        const hash = window.location.hash || '';
        const parts = hash.split('/public-lead-form/');
        return parts[1] ? decodeURIComponent(parts[1].split(/[?#]/)[0]).trim() : '';
    }, []);

    const serviceOptions = useMemo(() => {
        if (userProfile.projectTypes && userProfile.projectTypes.length > 0) {
            return userProfile.projectTypes;
        }
        return ['Wedding Day', 'Prewedding', 'Engagement / Lamaran', 'Lainnya'];
    }, [userProfile.projectTypes]);

    const [formState, setFormState] = useState({
        name: '',
        whatsapp: '',
        serviceType: serviceOptions[0] || 'Wedding Day',
        eventLocation: '',
        eventDate: '',
        notes: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    useEffect(() => {
        const title = userProfile.companyName || 'Weddfin';
        document.title = `Inquiry | ${title}`;
    }, [userProfile.companyName]);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const cleanWa = cleanPhoneNumber(formState.whatsapp);
        const notesParts = [
            `Layanan: ${formState.serviceType}`,
            formState.eventDate ? `Tanggal: ${formState.eventDate}` : null,
            `Lokasi: ${formState.eventLocation}`,
            referralCode ? `Ref: ${referralCode}` : null,
            formState.notes ? `Pesan: "${formState.notes.trim()}"` : null,
        ].filter(Boolean);

        try {
            const created = await createLead({
                name: formState.name.trim(),
                whatsapp: cleanWa || formState.whatsapp.trim(),
                contactChannel: ContactChannel.WEBSITE,
                location: formState.eventLocation.trim(),
                status: LeadStatus.DISCUSSION,
                date: new Date().toISOString(),
                notes: notesParts.join(' | '),
                eventDate: formState.eventDate || undefined,
            });

            setLeads(prev => [created, ...prev]);
            setIsSubmitted(true);

            if (addNotification) {
                addNotification({
                    title: 'Inquiry Baru',
                    message: `${formState.name} mengirim formulir konsultasi.`,
                    icon: 'lead',
                    link: { view: ViewType['Calon Pengantin'] }
                });
            } else if ((window as any).addNotification) {
                (window as any).addNotification({
                    title: 'Inquiry Baru',
                    message: `${formState.name} mengirim formulir konsultasi.`,
                    icon: 'lead',
                    link: { view: ViewType['Calon Pengantin'] }
                });
            }

            showNotification('Terima kasih, pesan Anda telah kami terima.');
        } catch (err: any) {
            console.error('Submit error:', err);
            alert('Gagal mengirim formulir. Silakan coba lagi atau hubungi via WhatsApp.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const targetPhone = cleanPhoneNumber(userProfile.phone) || '628123456789';
    const waDirectUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(
        `Halo ${userProfile.companyName || 'Weddfin'}, saya ingin konsultasi mengenai pricelist & dokumentasi acara.`
    )}`;

    // ── SUCCESS CONFIRMATION (HITAM PUTIH) ──────────────────────────────────
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center p-4 sm:p-6">
                <div className="max-w-md w-full bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl p-8 sm:p-10 text-center">
                    <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-white text-zinc-950 flex items-center justify-center">
                        <Check className="w-6 h-6 stroke-[2.5]" />
                    </div>

                    <h1 className="text-xl font-serif text-white mb-2 tracking-wide">Terima Kasih</h1>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-8 max-w-xs mx-auto">
                        Pesan Anda telah kami terima. Tim kami akan segera menghubungi nomor WhatsApp Anda.
                    </p>

                    <div className="space-y-2.5">
                        <a
                            href={`https://wa.me/${targetPhone}?text=${encodeURIComponent(
                                `Halo ${userProfile.companyName || 'Weddfin'}, saya ${formState.name}. Saya baru saja mengisi formulir konsultasi.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-white hover:bg-zinc-200 text-zinc-950 text-xs font-semibold rounded-xl transition-all shadow-sm"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Chat WhatsApp
                        </a>

                        <button
                            type="button"
                            onClick={() => {
                                setIsSubmitted(false);
                                setFormState({
                                    name: '',
                                    whatsapp: '',
                                    serviceType: serviceOptions[0] || 'Wedding Day',
                                    eventLocation: '',
                                    eventDate: '',
                                    notes: '',
                                });
                            }}
                            className="w-full py-2.5 text-xs text-zinc-400 hover:text-white transition-colors"
                        >
                            Kirim form baru
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── MAIN MINIMAL FORM (HITAM PUTIH) ───────────────────────────────────
    return (
        <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-lg bg-zinc-950 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
                <div className="w-full h-32 sm:h-44 md:h-52 overflow-hidden">
                    <img
                        src={userProfile.publicPageConfig?.backgroundImages?.leadForm || userProfile.publicPageConfig?.backgroundImages?.bookingForm || '/assets/images/backgrounds/detail-acara-pernikahan.jpg'}
                        alt="Background form inquiry"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Minimal Header */}
                <div className="pt-9 pb-6 px-6 sm:px-10 text-center">
                    <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-400 font-medium mb-1.5">
                        Inquiry
                    </p>
                    <h1 className="text-2xl font-serif text-white tracking-wider font-normal">
                        {userProfile.companyName || 'Weddfin'}
                    </h1>
                    <div className="w-10 h-px bg-zinc-800 mx-auto mt-4" />
                </div>

                {/* Form Body */}
                <div className="px-6 sm:px-10 pb-9">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">
                                Nama
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formState.name}
                                onChange={handleFormChange}
                                required
                                placeholder="Nama Anda"
                                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm focus:outline-none focus:border-white transition-all placeholder:text-zinc-600"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div>
                            <label htmlFor="whatsapp" className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">
                                WhatsApp
                            </label>
                            <div className="flex rounded-lg border border-zinc-700 bg-zinc-900 focus-within:border-white transition-all overflow-hidden">
                                <span className="px-3 py-2 text-xs text-zinc-400 bg-zinc-800 border-r border-zinc-700 select-none">
                                    +62
                                </span>
                                <input
                                    type="tel"
                                    id="whatsapp"
                                    name="whatsapp"
                                    value={formState.whatsapp}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="812 3456 7890"
                                    className="flex-1 px-3 py-2 bg-zinc-900 text-white text-sm focus:outline-none placeholder:text-zinc-600"
                                />
                            </div>
                        </div>

                        {/* Service Type */}
                        <div>
                            <label htmlFor="serviceType" className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">
                                Layanan
                            </label>
                            <select
                                id="serviceType"
                                name="serviceType"
                                value={formState.serviceType}
                                onChange={handleFormChange}
                                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm focus:outline-none focus:border-white transition-all cursor-pointer"
                            >
                                {serviceOptions.map(opt => (
                                    <option key={opt} value={opt} className="bg-zinc-800">{opt}</option>
                                ))}
                            </select>
                        </div>

                        {/* Location & Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="eventLocation" className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">
                                    Lokasi
                                </label>
                                <input
                                    type="text"
                                    id="eventLocation"
                                    name="eventLocation"
                                    value={formState.eventLocation}
                                    onChange={handleFormChange}
                                    required
                                    placeholder="Kota / Venue"
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm focus:outline-none focus:border-white transition-all placeholder:text-zinc-600"
                                />
                            </div>
                            <div>
                                <label htmlFor="eventDate" className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">
                                    Tanggal
                                </label>
                                <input
                                    type="date"
                                    id="eventDate"
                                    name="eventDate"
                                    value={formState.eventDate}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm focus:outline-none focus:border-white transition-all"
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label htmlFor="notes" className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-widest">
                                Catatan
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={2}
                                value={formState.notes}
                                onChange={handleFormChange}
                                placeholder="Pesan tambahan (opsional)"
                                className="w-full px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-900 text-white text-sm focus:outline-none focus:border-white transition-all placeholder:text-zinc-600 resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white hover:bg-zinc-200 text-zinc-950 py-2.5 px-4 rounded-lg font-bold text-[10px] tracking-wider uppercase transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
                            </button>
                        </div>
                    </form>

                    {/* WhatsApp Quick Link */}
                    <div className="mt-6 pt-5 border-t border-zinc-800/80 text-center">
                        <a
                            href={waDirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-zinc-400 hover:text-white transition-colors"
                        >
                            <span>Atau chat via WhatsApp</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicLeadForm;
