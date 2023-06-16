export const isBasicDeposit = (projectName: string): boolean =>
  projectName.includes('basic') && !projectName.includes('investor');

export const isInvestorDeposit = (projectName: string) => projectName.includes('investor');

export const isInvestorProDeposit = (projectName: string) => projectName.includes('investor_pro');
