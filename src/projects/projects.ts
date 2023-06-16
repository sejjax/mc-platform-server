import { Levels } from '../users/consts';

export enum ProjectTypes {
  Staking = 'staking',
  Investment = 'investment',
  InvestmentPRO = 'investmentPro',
}

export const ProjectLimits = {
  [ProjectTypes.Staking]: {
    [Levels.Level1]: 500,
  },
  [ProjectTypes.Investment]: null,
  [ProjectTypes.InvestmentPRO]: {
    [Levels.Level4]: 5000,
  },
};

export const ProjectAvailable = {
  [ProjectTypes.Staking]: null,
  [ProjectTypes.Investment]: {
    [Levels.Level3]: true,
    [Levels.Level4]: true,
  },
  [ProjectTypes.InvestmentPRO]: {
    [Levels.Level4]: true,
  },
};
