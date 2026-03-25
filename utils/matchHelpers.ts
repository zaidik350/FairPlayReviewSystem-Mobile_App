/**
 * Match-related helpers — status colours, labels, etc.
 */

import Colors from '@/constants/colors';

export type MatchStatus = 'live' | 'upcoming' | 'completed';

export function getStatusColor(status: MatchStatus): string {
  switch (status) {
    case 'live': return Colors.live;
    case 'upcoming': return Colors.primary;
    case 'completed': return Colors.textSecondary;
  }
}

export function getStatusLabel(status: MatchStatus): string {
  switch (status) {
    case 'live': return 'LIVE';
    case 'upcoming': return 'UPCOMING';
    case 'completed': return 'COMPLETED';
  }
}
