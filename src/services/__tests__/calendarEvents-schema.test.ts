import { beforeEach, describe, expect, it, vi } from 'vitest';

const fromMock = vi.fn();
const insertMock = vi.fn();
const selectMock = vi.fn();
const singleMock = vi.fn();

vi.mock('../../lib/supabaseClient', () => ({
  default: {
    from: fromMock,
  },
}));

describe('calendar event database schema mapping', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    fromMock.mockReturnValue({
      insert: insertMock,
    });
    insertMock.mockReturnValue({
      select: selectMock,
    });
    selectMock.mockReturnValue({
      single: singleMock,
    });
    singleMock.mockResolvedValue({
      data: {
        id: 'event-1',
        title: 'Rapat tim',
        event_type: 'Internal',
        date: '2026-10-05',
        start_time: '00:00:00',
        end_time: '23:59:00',
        team: [{ memberId: 'member-1' }],
        location: 'Studio',
        notes: 'Persiapan',
        tasks: [],
        created_at: '2026-10-05T00:00:00Z',
      },
      error: null,
    });
  });

  describe('project meeting calendar metadata', () => {
    it('round-trips meeting metadata without requiring new calendar table columns', async () => {
      const { encodeProjectMeetingNotes, parseProjectMeetingNotes } = await import('../calendarEvents');
      const metadata = {
        projectId: 'project-1',
        kind: 'zoom' as const,
        zoomUrl: 'https://zoom.us/j/123',
        location: '',
        resultNotes: 'Setujui konsep dekorasi',
      };

      expect(parseProjectMeetingNotes(encodeProjectMeetingNotes(metadata))).toEqual(metadata);
    });

    it('does not treat regular calendar notes as project meeting metadata', async () => {
      const { parseProjectMeetingNotes } = await import('../calendarEvents');
      expect(parseProjectMeetingNotes('Catatan agenda biasa')).toBeNull();
    });
  });

  it('writes only columns available in calendar_events and normalizes the returned row', async () => {
    const { createCalendarEvent } = await import('../calendarEvents');

    const event = await createCalendarEvent({
      title: 'Rapat tim',
      eventType: 'Internal',
      date: '2026-10-05',
      startAt: '2026-10-05T00:00:00',
      endAt: '2026-10-05T23:59:00',
      allDay: true,
      teamMemberId: 'member-1',
      projectId: 'project-1',
      location: 'Studio',
      notes: 'Persiapan',
      tasks: [],
    });

    expect(fromMock).toHaveBeenCalledWith('calendar_events');
    expect(insertMock).toHaveBeenCalledWith([{
      title: 'Rapat tim',
      event_type: 'Internal',
      date: '2026-10-05',
      start_time: '00:00:00',
      end_time: '23:59:00',
      team: [{ memberId: 'member-1' }],
      location: 'Studio',
      notes: 'Persiapan',
      tasks: [],
    }]);
    expect(event).toMatchObject({
      id: 'event-1',
      title: 'Rapat tim',
      date: '2026-10-05',
      startAt: '2026-10-05T00:00:00',
      endAt: '2026-10-05T23:59:00',
      allDay: true,
      teamMemberId: 'member-1',
    });
  });
});
