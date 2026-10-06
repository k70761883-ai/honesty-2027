import { beforeEach, describe, expect, it, vi } from 'vitest';

const fromMock = vi.fn();
let profileRow: Record<string, any>;

vi.mock('../../lib/supabaseClient', () => ({
  default: {
    from: fromMock,
  },
}));

const templateEnvelope = {
  bookingFormTemplate: 'Halo {leadName}: {bookingFormLink}',
  billingTemplates: [{ id: 'billing-1', title: 'Tagihan', template: '{portalLink}' }],
  invoiceShareTemplate: 'Invoice {invoiceLink}',
};

describe('profile booking template envelope', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    profileRow = {
      id: 'profile-1',
      booking_form_template: JSON.stringify(templateEnvelope),
    };

    fromMock.mockImplementation(() => ({
      select: (columns: string) => {
        if (columns === 'booking_form_template') {
          return {
            eq: () => ({
              maybeSingle: async () => ({
                data: { booking_form_template: profileRow.booking_form_template },
                error: null as Error | null,
              }),
            }),
          };
        }
        return {
          limit: () => ({
            maybeSingle: async () => ({ data: profileRow, error: null as Error | null }),
          }),
          eq: () => ({
            single: async () => ({ data: profileRow, error: null as Error | null }),
          }),
        };
      },
      update: (updates: Record<string, any>) => ({
        eq: async () => {
          profileRow = { ...profileRow, ...updates };
          return { error: null as Error | null };
        },
      }),
    }));
  });

  it('loads the booking template separately from other saved templates', async () => {
    const { getProfile } = await import('../profile');
    const profile = await getProfile();

    expect(profile?.bookingFormTemplate).toBe(templateEnvelope.bookingFormTemplate);
    expect(profile?.billingTemplates).toEqual(templateEnvelope.billingTemplates);
    expect(profile?.invoiceShareTemplate).toBe(templateEnvelope.invoiceShareTemplate);
  });

  it('saves booking edits while preserving the other templates in the envelope', async () => {
    const { upsertProfile } = await import('../profile');
    const profile = await upsertProfile({ id: 'profile-1', bookingFormTemplate: 'New {bookingFormLink}' });
    const savedEnvelope = JSON.parse(profileRow.booking_form_template);

    expect(profile.bookingFormTemplate).toBe('New {bookingFormLink}');
    expect(savedEnvelope).toEqual({
      ...templateEnvelope,
      bookingFormTemplate: 'New {bookingFormLink}',
    });
  });

  it('continues to read legacy plain-text booking templates', async () => {
    profileRow.booking_form_template = 'Legacy booking text';
    const { getProfile } = await import('../profile');
    const profile = await getProfile();

    expect(profile?.bookingFormTemplate).toBe('Legacy booking text');
  });
});