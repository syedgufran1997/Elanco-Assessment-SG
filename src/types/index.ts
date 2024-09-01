// types.ts
export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital: [];
  continents: [];
  region: string;
  subregion: string;
  languages: { [key: string]: string };
  population: number;
  flags: {
    png: string;
    svg: string;
  };
  currencies: {
    CHF: {
      name: string;
      symbol: string;
    };
  };
  timezones: [];
}
