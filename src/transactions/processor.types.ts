export interface IProject {
  payment_period_in_weeks: string;
  invest_period_in_weeks: string;
  name: string;
  payment_period: string;
  apy: number;
  invest_period: string;
  min_amount: string;
  service_name: string;
  slug: string;
}

export interface IProjects {
  [key: string]: IProject;
}

export interface IProjectsListItem {
  id: number;
  name: string;
  slug: string;
  risk: null;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface IProjectsItem extends IProjectsListItem {
  projects: IProject[];
}

export interface ICreateDepositFromTransaction {
  currency_amount: number;
  wallet_addr: string;
  userId: number;
  product: string;
  product_service_description: string;
  apy: string;
  payment_period: string;
  referals_array: string;
  investment_period: string;
  ip_wks: string;
  pp_wks: string;
  earn_amount: number;
}
