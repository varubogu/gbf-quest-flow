export interface OrganizationSettings {
  job: {
    abilities: number;
  };
  member: {
    front: number;
    back: number;
  };
  weapon: {
    main: number;
    other: number;
    additional: number;
  };
  summon: {
    main: number;
    friend: number;
    other: number;
    sub: number;
  };
}