import { User } from 'src/users/user.entity';
import { getPromotionDates } from './promotion';

export interface TeamTreeQueryItem
  extends Pick<
    User,
    'fullName' | 'email' | 'country' | 'agreement' | 'mobile' | 'partnerId' | 'referrerId' | 'id'
  > {
  createdAt: Date | string;
  level: string;
  ref_level: number;
  deposit_amount: number;
  firstReferrals: number;
  teamDeposit: string | null;
}

export const getTeamTreeQuery = (partnerId: string) =>
  `with recursive users_tree as(
    select 
      u.id,
      u."fullName",
      u.email,
      u."mobile",
      u."partnerId",
      u."referrerId",
      u."createdAt" ,
      u.level,
      u.agreement,
      u.country,
      0 as ref_level
    from "user" u
    where u."partnerId" = '${partnerId}'
    union all 
    select 
      u2.id,
      u2."fullName",
      u2.email,
      u2."mobile",
      u2."partnerId",
      u2."referrerId", 
      u2."createdAt" ,
      u2."level" ,
      u2.agreement,
      u2.country,
      ref_level+1
    from "user" u2 
    join users_tree et on et."partnerId" = u2."referrerId"
    ) select   ut.id,
      ut."fullName",
      ut.email,
      ut.level,
      ut."mobile",
      ut.agreement,
      ut.country,
      ut.ref_level,
      ut."partnerId",
      ut."referrerId",
      ut."createdAt",t."firstReferrals", t."teamDeposit" ,coalesce(sum(d.currency_amount) , 0)  as deposit_amount  from users_tree ut left join public.team t on ut.id = t."userId"  left join public.deposit d on ut.id = d."userId" where ut."partnerId" != '${partnerId}' group by  ut.id,
      ut."fullName",
      ut.email,
      ut."mobile",
      ut.agreement,
      ut."partnerId",
      ut.ref_level,
      ut."referrerId",
      ut.level,
      ut.country,
      ut."createdAt",t."firstReferrals",t."teamDeposit"
`;

export const getTeamTreeQueryWithDepositAmount = (partnerId: string) =>
  `with recursive users_tree as(
        select 
          u.id,
          u."fullName",
          u.email,
          u."mobile",
          u."partnerId",
          u."referrerId",
          u."createdAt" ,
          u.level,
          u.country,
          0 as ref_level
        from "user" u
        where u."partnerId" = '${partnerId}'
        union all 
        select 
          u2.id,
          u2."fullName",
          u2.email,
          u2."mobile",
          u2."partnerId",
          u2."referrerId", 
          u2."createdAt" ,
          u2."level" ,
          u2.country,
          ref_level+1
        from "user" u2 
        join users_tree et on et."partnerId" = u2."referrerId"
        ) select   ut.id,
          ut."fullName",
          ut.email,
          ut.level,
          ut."mobile",
          ut.country,
          ut."partnerId",
          ut."referrerId",
          ut."createdAt",t."firstReferrals", t."teamDeposit" ,coalesce(sum(d.currency_amount) , 0)  as deposit_amount  from users_tree ut left join public.team t on ut.id = t."userId"  left join public.deposit d on ut.id = d."userId" where ut."partnerId" != '${partnerId}' group by  ut.id,
          ut."fullName",
          ut.email,
          ut."mobile",
          ut."partnerId",
          ut."referrerId",
          ut.level,
          ut.country,
          ut."createdAt",t."firstReferrals",t."teamDeposit"
`;

/** Promotion get all users structure deposits between 1 January 2023 and 30 April 2023
 * Also take only all basic(1-5) deposits and investor gold
 * Usage: dataSource/manager.query(query, [partnerId, firstDate, lastDate])
 */
export const getPromotionTeamStructureQuery = (): string =>
  `
  WITH RECURSIVE cte AS (
  select u.id,u."fullName", u."partnerId", u."referrerId" , 0 as "refLevel" 
  from public."user" u
  where u."partnerId" = $1
  union all
  select u2.id, u2."fullName",u2."partnerId", u2."referrerId", "refLevel" + 1
  from public."user" u2
  join cte on cte."partnerId" = u2."referrerId"),
  ${getNotConsideredDepositsCte(false)}

  select cte.id, cte."fullName",cte."partnerId", cte."referrerId", coalesce(sum(d.currency_amount),0) as "depositAmount" ,cte."refLevel" from cte left join public.deposit d on cte.id = d."userId" and d."createdAt" between $2 and $3 and d.id not in (select id from not_considered_deposits) group by cte.id,cte."partnerId", cte."referrerId", cte."refLevel", cte."fullName" order by cte."refLevel" desc`;

/** Return query which calculate sum of first strcture amount
 * without investor basic,silver and all pro investor.
 * also select only between promotion dates(currenly 1 May 2023 - 31 August 2023)
 */
export const getPromotionFirstStructureAmount = () =>
  `
  ${getNotConsideredDepositsCte()}
  select cast(coalesce(sum(d.currency_amount), 0) as int) as sum from public.user u left join public.deposit d on u.id = d."userId" AND d."createdAt" between $2 and $3 AND d.id NOT IN (SELECT id FROM not_considered_deposits) where u."referrerId" = $1`;

export const getNotConsideredDepositsCte = (
  withWith = true,
  [firstDateParam, lastDateParam] = ['$2', '$3'],
) => `
${withWith ? 'with' : ''} not_considered_deposits as (
  select d.id from public.deposit d join public.calculation c on c."productId" = d.id and c.accrual_type = 'upgrade' 
  where d."createdAt" between ${firstDateParam} and ${lastDateParam}
  union distinct
  select d.id from public.deposit d where (d.product_service_description in ('investor_basic','investor_silver') or d.product_service_description like 'investor_pro%') and d."createdAt" between ${firstDateParam} and ${lastDateParam}
)`;
