export interface Sport {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  createdAt: string;
  updatedAt: string;
  governingBodyCount?: number;
  organizationCount?: number;
  teamCount?: number;
  participantCount?: number;
}

export interface SportInput {
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface CatalogueTotals {
  sports: number | null;
  governingBodies: number | null;
  organisations: number | null;
  participants: number | null;
}
