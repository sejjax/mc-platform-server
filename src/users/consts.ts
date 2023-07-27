export const Packages = [0, 200, 500, 1000, 5000];

export const Accruals = [
    [], // Level0 - no accruals
    [5], // Level1 - first line only
    [5, 3, 1, 1],
    [7, 5, 3, 1],
    [7, 6, 5, 4, 3],
];

export enum InvestorLevel {
  Level0 = 0,
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
  Level5 = 5,
}
export enum Levels {
  Level0 = 0,
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
  Level5 = 5,
}

export enum UserLevels {
  Level0 = 0,
  Level1 = 1,
  Level2 = 2,
  Level3 = 3,
  Level4 = 4,
  Level5 = 5,
  Level6 = 6,
  Level7 = 7,
  Level8 = 8,
  Level9 = 9,
}

export enum Statuses {
  active = 'active',
  suspended = 'suspended',
}

export enum Lines {
  Line1 = 0,
  Line2 = 1,
  Line3 = 2,
  Line4 = 3,
  Line5 = 4,
}
