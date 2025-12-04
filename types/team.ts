export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  founded: number;
  clubColors: string;
  venue: string;
  website: string;
  area: {
    name: string;
    flag: string;
  };
}