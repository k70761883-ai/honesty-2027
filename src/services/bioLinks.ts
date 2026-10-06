import { supabase } from '../lib/supabaseClient';
import { BioLinkPage } from '../types';

type BioLinkPageInput = Omit<BioLinkPage, 'id' | 'updated_at'>;

export const DEFAULT_BIO_LINK_PAGE: BioLinkPageInput = {
  slug: 'link-bisnis',
  title: '',
  subtitle: '',
  whatsapp_number: '',
  whatsapp_label: 'WhatsApp',
  avatar_url: '',
  cover_url: '',
  links: [],
  is_published: true,
};

export async function getBioLinkPage(slug?: string): Promise<BioLinkPage | null> {
  let query = supabase.from('bio_link_pages').select('*');
  query = slug ? query.eq('slug', slug) : query.eq('is_primary', true);

  const { data, error } = await query.maybeSingle();
  if (error) {
    console.error('[bioLinks] Failed to load public link page:', error);
    throw new Error('Gagal memuat halaman link publik. Pastikan tabel bio_link_pages sudah dibuat.');
  }

  return data as BioLinkPage | null;
}

export async function saveBioLinkPage(
  input: BioLinkPageInput,
): Promise<BioLinkPage> {
  const { data: existing, error: lookupError } = await supabase
    .from('bio_link_pages')
    .select('id')
    .eq('is_primary', true)
    .maybeSingle();

  if (lookupError) {
    console.error('[bioLinks] Failed to find link page for update:', lookupError);
    throw new Error('Gagal memeriksa halaman link. Pastikan migrasi SQL sudah dijalankan.');
  }

  const result = existing
    ? await supabase.from('bio_link_pages').update(input).eq('id', existing.id).select().single()
    : await supabase.from('bio_link_pages').insert(input).select().single();

  if (result.error) {
    console.error('[bioLinks] Failed to save link page:', result.error);
    if (result.error.code === '23505') {
      throw new Error('Link publik ini sudah digunakan. Silakan pilih nama link yang lain.');
    }
    throw new Error('Gagal menyimpan halaman link publik. Periksa koneksi dan kebijakan tabel Supabase.');
  }

  return result.data as BioLinkPage;
}
