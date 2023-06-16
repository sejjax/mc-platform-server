import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccrualType, Status } from 'src/user/calculations/calculations.types';
import { Calculation } from 'src/user/calculations/entities/calculation.entity';
import { Deposit } from 'src/user/deposit/entities/deposit.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { GetReferralsUserFromCustomQueryWithRefs } from 'src/users/users.types';
import { getCalculationsPaymentDateFormat, getToday } from 'src/utils/helpers/dates';
import { Repository } from 'typeorm';
import {
  CalculationWithServiceName,
  differenceInDay,
  differenceInMonth,
  differenceInWeek,
  differenceInYear,
  IMetricsPartnerItem,
  IMetricsProjectItem,
  IMetricsResponse,
  IProject,
  ISortedItem,
  ISortedItems,
  ISortedItemsMerged,
} from './metrics.types';
import * as crypto from 'crypto';
import { encrypt } from 'src/utils/crypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MetricsService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Deposit) private depositRepo: Repository<Deposit>,
    @InjectRepository(Calculation) private calculationRepo: Repository<Calculation>,
    private usersService: UsersService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  private async getUsersData() {
    const allUsers = await this.userRepo.find();
    const activeUsersCount = await this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.deposits', 'deposit')
      .getCount();
    const inactiveUsersCount = allUsers.length - activeUsersCount;
    return { activeUsersCount, inactiveUsersCount, allUsers };
  }

  private async getSumAllAccruals(): Promise<number> {
    const { amount } = (await this.depositRepo
      .createQueryBuilder('deposit')
      .select('sum (earn_amount) as amount')
      .getRawOne()) as { amount: string };
    return +amount;
  }

  private async getDepositsByStatus(status: Status): Promise<Deposit[]> {
    const result = await this.depositRepo
      .createQueryBuilder('deposit')
      .leftJoinAndSelect('deposit.calculations', 'calculation', 'calculation.status = :status', {
        status,
      })
      .leftJoinAndSelect('calculation.user', 'calculationUser')
      .leftJoinAndSelect('deposit.user', 'user')
      .where('deposit.user.id not in(64,65)')
      .select([
        'deposit.id',
        'deposit.product_service_description',
        'deposit.currency_amount',
        'deposit.date',
        'calculationUser.id',
        'calculation.payment_date',
        'calculation.id',
        'calculation.status',
        'calculation.accrual_type',
        'calculation.amount',
        'user.id',
      ])
      .getMany();
    return result;
  }

  private async getAccrualsInTheNext7Days(): Promise<number> {
    const today = new Date();
    const nextSevenDays = new Date(today.getTime() + differenceInWeek);
    const { sum } = (await this.calculationRepo
      .createQueryBuilder('calculation')
      .where(`payment_date between :firstDate and :secondDate and status != 'nulled'`, {
        firstDate: today.toISOString(),
        secondDate: nextSevenDays.toISOString(),
      })
      .select('SUM(amount)')
      .getRawOne()) as { sum: string };
    return +sum;
  }

  private async getAllProjectsFromStrapi(): Promise<IProject[]> {
    const response = await this.httpService.axiosRef.get(
      `${process.env.REACT_APP_STRAPI_PLATFORM_URL}/projects`,
    );
    return response.data;
  }

  private sortSendedDepositsByDate(deposits: Deposit[]): ISortedItemsMerged {
    const sortedDeposits: ISortedItems<Deposit> = {
      day: [],
      week: [],
      month: [],
      year: [],
    };
    const sortedCalculations: ISortedItems<CalculationWithServiceName> = {
      day: [],
      week: [],
      month: [],
      year: [],
    };
    const today = getToday();
    for (const deposit of deposits) {
      const depositDate = new Date(deposit.date).getTime();
      const depositDifference = today - depositDate;
      if (depositDifference <= 0) continue;
      if (differenceInDay >= depositDifference) sortedDeposits.day.push(deposit);
      if (differenceInWeek >= depositDifference) sortedDeposits.week.push(deposit);
      if (differenceInMonth >= depositDifference) sortedDeposits.month.push(deposit);
      if (differenceInYear >= depositDifference) sortedDeposits.year.push(deposit);
      for (const calculation of deposit.calculations) {
        const calculationWithServiceName: CalculationWithServiceName = {
          ...calculation,
          service_name: deposit.product_service_description,
        };
        const calculationDate = new Date(calculation.payment_date).getTime();
        const calculationDifference = today - calculationDate;
        if (calculationDifference <= 0) continue;
        if (differenceInDay >= calculationDifference)
          sortedCalculations.day.push(calculationWithServiceName);
        if (differenceInWeek >= calculationDifference)
          sortedCalculations.week.push(calculationWithServiceName);
        if (differenceInMonth >= calculationDifference)
          sortedCalculations.month.push(calculationWithServiceName);
        if (differenceInYear >= calculationDifference)
          sortedCalculations.year.push(calculationWithServiceName);
      }
    }
    return { sortedDeposits, sortedCalculations };
  }

  private sortedWaitingDepositsByDate(deposits: Deposit[]): ISortedItemsMerged {
    const sortedDeposits: ISortedItems<Deposit> = {
      day: [],
      week: [],
      month: [],
      year: [],
    };
    const sortedCalculations: ISortedItems<CalculationWithServiceName> = {
      day: [],
      week: [],
      month: [],
      year: [],
    };
    const today = getToday();
    for (const deposit of deposits) {
      const depositDate = new Date(deposit.date).getTime();
      const depositDifference = depositDate - today;
      if (differenceInDay >= depositDifference) sortedDeposits.day.push(deposit);
      if (differenceInWeek >= depositDifference) sortedDeposits.week.push(deposit);
      if (differenceInMonth >= depositDifference) sortedDeposits.month.push(deposit);
      if (differenceInYear >= depositDifference) sortedDeposits.year.push(deposit);
      for (const calculation of deposit.calculations) {
        const calculationWithServiceName: CalculationWithServiceName = {
          ...calculation,
          service_name: deposit.product_service_description,
        };
        const calculationDate = new Date(calculation.payment_date).getTime();
        const calculationDifference = calculationDate - today;
        if (calculationDifference < 0) continue;
        if (differenceInDay >= calculationDifference)
          sortedCalculations.day.push(calculationWithServiceName);
        if (differenceInWeek >= calculationDifference)
          sortedCalculations.week.push(calculationWithServiceName);
        if (differenceInMonth >= calculationDifference)
          sortedCalculations.month.push(calculationWithServiceName);
        if (differenceInYear >= calculationDifference)
          sortedCalculations.year.push(calculationWithServiceName);
      }
    }
    return { sortedDeposits, sortedCalculations };
  }

  private sortItemsToDatesByField<Item>(items: Item[], dataField: keyof Item): ISortedItems<Item> {
    const result: ISortedItems<Item> = { day: [], week: [], month: [], year: [] };
    const today = getToday();
    for (const item of items) {
      const isItemString = item[dataField];
      if (isItemString instanceof Date) {
        const itemDate = new Date(isItemString).getTime();
        const itemDifference = today - itemDate;
        if (itemDifference <= 0) continue;
        if (differenceInDay >= itemDifference) result.day.push(item);
        if (differenceInWeek >= itemDifference) result.week.push(item);
        if (differenceInMonth >= itemDifference) result.month.push(item);
        if (differenceInYear >= itemDifference) result.year.push(item);
      }
    }
    return result;
  }

  private async getTotalPlatformIncome() {
    const { sum } = (await this.depositRepo
      .createQueryBuilder('deposit')
      .select('SUM(deposit.currency_amount)')
      .where('deposit.user.id not in(64,65)')
      .getRawOne()) as { sum: string };
    return +sum;
  }

  private async getProjectsRateData(
    sortedSendedDeposits: ISortedItemsMerged,
    projects: IProject[],
  ) {
    const result: ISortedItems<IMetricsProjectItem> = {
      day: [],
      week: [],
      month: [],
      year: [],
    };
    const allWaitingDeposits = await this.getDepositsByStatus(Status.waiting);
    const sortedWaitingDeposits = this.sortedWaitingDepositsByDate(allWaitingDeposits);
    for (const project of projects) {
      const title = project.name;
      const id = project.id;

      const sortDataByProject = this.sortDataByProject(
        sortedSendedDeposits,
        sortedWaitingDeposits,
        project,
      );
      Object.entries(sortDataByProject).forEach(
        ([key, [projectIncome, projectPayments, depositCount, amountToPay]]) => {
          const item: IMetricsProjectItem = {
            id,
            title,
            projectIncome,
            projectPayments,
            depositCount,
            amountToPay,
          };
          result[key].push(item);
        },
      );
    }
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const items = result[key];
        const sortedItems = items.sort((a: IMetricsProjectItem, b: IMetricsProjectItem) => {
          const aSum = a.projectIncome;
          const bSum = b.projectIncome;
          if (aSum > bSum) return -1;
          if (bSum > aSum) return 1;
          return 0;
        });
        result[key] = sortedItems;
      }
    }
    return result;
  }

  // private async getUserPartnersRefByDifferenceInDate() {}

  private async addToUsersRefs(users: User[]): Promise<GetReferralsUserFromCustomQueryWithRefs[]> {
    const newUsers: GetReferralsUserFromCustomQueryWithRefs[] = [];
    for (const user of users) {
      const userRefs = await this.usersService.getReferrals(user.partnerId);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      newUsers.push({ ...user, referrals: userRefs });
    }
    return newUsers;
  }

  private sortDataByProject(
    {
      sortedCalculations: sortedSendedCalculations,
      sortedDeposits: sortedSendedDeposits,
    }: ISortedItemsMerged,
    { sortedCalculations: sortedWaitingCalculations }: ISortedItemsMerged,
    project: IProject,
  ): {
    day: [number, number, number, number];
    week: [number, number, number, number];
    month: [number, number, number, number];
    year: [number, number, number, number];
  } {
    const result: {
      day: [number, number, number, number];
      week: [number, number, number, number];
      month: [number, number, number, number];
      year: [number, number, number, number];
    } = {
      day: [0, 0, 0, 0],
      week: [0, 0, 0, 0],
      month: [0, 0, 0, 0],
      year: [0, 0, 0, 0],
    };
    Object.entries(sortedWaitingCalculations).forEach(
      ([key, sortedCalculations]: [string, CalculationWithServiceName[]]) => {
        sortedCalculations.forEach((sortedCalculation) => {
          if (
            sortedCalculation.service_name === project.service_name &&
            sortedCalculation.accrual_type === AccrualType.product
          ) {
            result[key][3] += +sortedCalculation.amount;
          }
        });
      },
    );
    Object.entries(sortedSendedDeposits).forEach(([key, sortedDeposits]: [string, Deposit[]]) => {
      sortedDeposits.forEach((sortedDeposit) => {
        if (sortedDeposit.product_service_description === project.service_name) {
          result[key][0] += +sortedDeposit.currency_amount;
          result[key][2]++;
        }
      });
    });
    Object.entries(sortedSendedCalculations).forEach(
      ([key, sortedCalculations]: [string, CalculationWithServiceName[]]) => {
        sortedCalculations.forEach((sortedCalculation) => {
          if (
            sortedCalculation.service_name === project.service_name &&
            sortedCalculation.accrual_type !== AccrualType.referral &&
            sortedCalculation.accrual_type !== AccrualType.passive
          ) {
            result[key][1] += +sortedCalculation.amount;
          }
        });
      },
    );
    return result;
  }

  private async getRatedUserData(
    user: GetReferralsUserFromCustomQueryWithRefs,
    { sortedCalculations, sortedDeposits }: ISortedItemsMerged,
  ): Promise<ISortedItem<IMetricsPartnerItem>> {
    const result: ISortedItem<IMetricsPartnerItem> = {
      day: null,
      month: null,
      week: null,
      year: null,
    };
    const userProductIncome = this.getRatedUserProductIncome(sortedCalculations, user.id);
    const userRefsIncome = this.getRatedUserRefsIncome(sortedCalculations, user.id);
    const { refsCount, teamDeposit } = this.getRatedUserRefs(user, sortedDeposits);
    const userDeposits = this.getRatedUserProductDeposit(sortedDeposits, user.id);
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const data: IMetricsPartnerItem = {
          country: user.country,
          fio: user.fullName,
          id: user.id,
          mobile: user.mobile,
          productIncome: userProductIncome[key],
          referralsCount: refsCount[key],
          referralsIncome: userRefsIncome[key],
          depositAmount: userDeposits[key],
          teamDeposit: teamDeposit[key],
        };
        result[key] = data;
      }
    }
    return result;
  }

  private getRatedUserProductDeposit(
    sortedDeposits: ISortedItems<Deposit>,
    userId: number,
  ): ISortedItem<number> {
    const result: ISortedItem<number> = {
      day: 0,
      week: 0,
      month: 0,
      year: 0,
    };
    Object.entries(sortedDeposits).forEach(
      ([key, deposits]: [keyof ISortedItems<Deposit>, Deposit[]]) => {
        for (const deposit of deposits) {
          if (deposit.user.id === userId) {
            result[key] += +deposit.currency_amount;
          }
        }
      },
    );
    return result;
  }

  private getRatedUserProductIncome(
    allCalculations: ISortedItems<CalculationWithServiceName>,
    userId: number,
  ): ISortedItem<number> {
    const result: ISortedItem<number> = {
      day: 0,
      week: 0,
      month: 0,
      year: 0,
    };

    Object.entries(allCalculations).forEach(
      ([key, calculations]: [string, CalculationWithServiceName[]]) => {
        const sum = calculations.reduce((prevValue, calculation) => {
          if (
            calculation.user.id === userId &&
            (calculation.accrual_type === AccrualType.product ||
              calculation.accrual_type === AccrualType.upgrade)
          )
            return prevValue + +calculation.amount;
          return prevValue;
        }, 0);
        result[key] = sum;
      },
    );
    return result;
  }

  private getRatedUserRefsIncome(
    allCalculations: ISortedItems<CalculationWithServiceName>,
    userId: number,
  ) {
    const result: ISortedItem<number> = {
      day: 0,
      week: 0,
      month: 0,
      year: 0,
    };
    Object.entries(allCalculations).forEach(
      ([key, calculations]: [string, CalculationWithServiceName[]]) => {
        const sum = calculations.reduce((prevValue, calculation) => {
          if (
            calculation.user.id === userId &&
            (calculation.accrual_type === AccrualType.passive ||
              calculation.accrual_type === AccrualType.referral)
          )
            return prevValue + +calculation.amount;
          return prevValue;
        }, 0);
        result[key] = sum;
      },
    );
    return result;
  }

  private getRatedUserRefs(
    user: GetReferralsUserFromCustomQueryWithRefs,
    sortedDeposits: ISortedItems<Deposit>,
  ): { refsCount: ISortedItem<number>; teamDeposit: ISortedItem<number> } {
    const refsCount: ISortedItem<number> = {
      day: 0,
      week: 0,
      month: 0,
      year: 0,
    };
    const teamDeposit: ISortedItem<number> = {
      day: 0,
      week: 0,
      month: 0,
      year: 0,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const sortedUserRefs = this.sortItemsToDatesByField<User>(user.referrals, 'createdAt');
    Object.entries(sortedUserRefs).forEach(
      ([key, userRefs]: [keyof typeof sortedUserRefs, User[]]) => {
        refsCount[key] = userRefs.length;
        const depositsByKey = sortedDeposits[key];
        for (const user of userRefs) {
          for (const deposit of depositsByKey) {
            if (deposit.user.id === user.id) {
              teamDeposit[key] += +deposit.currency_amount;
            }
          }
        }
      },
    );
    return { refsCount, teamDeposit };
  }

  private async getRatedUsersData(
    usersWithRefs: GetReferralsUserFromCustomQueryWithRefs[],
    sortedItems: ISortedItemsMerged,
  ): Promise<ISortedItems<IMetricsPartnerItem>> {
    const result: ISortedItems<IMetricsPartnerItem> = {
      day: [],
      month: [],
      week: [],
      year: [],
    };
    for (const user of usersWithRefs) {
      const userResult = await this.getRatedUserData(user, sortedItems);
      for (const key in result) {
        if (Object.prototype.hasOwnProperty.call(result, key)) {
          const elements = userResult[key];
          result[key] = [...result[key], elements];
        }
      }
    }
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const items = result[key];
        const sortedItems = items.sort((a, b) => {
          if (a.productIncome > b.productIncome) return -1;
          if (b.productIncome > a.productIncome) return 1;
          return 0;
        });
        result[key] = sortedItems;
      }
    }
    return result;
  }

  private getSumAllSendedCalculationsByType(
    depositsWithCalclations: Deposit[],
    type: 'referral' | 'product',
  ): number {
    let sum = 0;
    for (const deposit of depositsWithCalclations) {
      for (const calculation of deposit.calculations) {
        if (type === 'product') {
          if (
            calculation.accrual_type === AccrualType.product ||
            calculation.accrual_type === AccrualType.upgrade
          ) {
            sum += +calculation.amount;
          }
        }
        if (type === 'referral') {
          if (
            calculation.accrual_type === AccrualType.referral ||
            calculation.accrual_type === AccrualType.passive
          ) {
            sum += +calculation.amount;
          }
        }
      }
    }
    return sum;
  }

  async getMetricsData(): Promise<IMetricsResponse> {
    const usersData = await this.getUsersData();
    const totalIncome = await this.getTotalPlatformIncome();
    const sendedRepositsWithCalculations = await this.getDepositsByStatus(Status.sent);
    const sortedItems = this.sortSendedDepositsByDate(sendedRepositsWithCalculations);
    const projects = await this.getAllProjectsFromStrapi();
    const projectsData = await this.getProjectsRateData(sortedItems, projects);
    const usersWithRefs = await this.addToUsersRefs(usersData.allUsers);
    const ratedUsersData = await this.getRatedUsersData(usersWithRefs, sortedItems);
    const accrualsInTheNext7Days = await this.getAccrualsInTheNext7Days();
    const sumAllSendedProducts = this.getSumAllSendedCalculationsByType(
      sendedRepositsWithCalculations,
      'product',
    );
    const allAccruals = await this.getSumAllAccruals();
    const sumAllSendedReferrals = this.getSumAllSendedCalculationsByType(
      sendedRepositsWithCalculations,
      'referral',
    );
    return {
      allAccruals,
      sumAccrualsInTheNextSevenDays: accrualsInTheNext7Days,
      sumAllSendedProducts: sumAllSendedProducts,
      sumAllSendedReferrals: sumAllSendedReferrals,
      activeUsers: usersData.activeUsersCount,
      inactiveUsers: usersData.inactiveUsersCount,
      partnerRates: ratedUsersData,
      platformIncome: totalIncome,
      projectRates: projectsData,
    };
  }

  async getTomorrowPayments() {
    let tomorrow: string | Date = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow = tomorrow.toISOString().slice(0, 10);
    const query = `SELECT sum(c.amount) from public.calculation c where c.payment_date = '${tomorrow}' and c.status != '${Status.nulled}'`;
    const data = (await this.calculationRepo.query(query)) as [{ sum: number }];
    const key = this.configService.get('auth.secret');
    const hashedKey = crypto
      .createHash('sha256')
      .update(String(key))
      .digest('base64')
      .substring(0, 32);
    console.log('hashedKey', hashedKey);
    return encrypt(data[0].sum.toString(), hashedKey);
  }

  async getNextPaymentsByDays(days: number): Promise<string | number> {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    const end = new Date(start);
    end.setDate(end.getDate() + days - 1);
    const formatedStart = getCalculationsPaymentDateFormat(start);
    const formatedEnd = getCalculationsPaymentDateFormat(end);
    const query = `SELECT sum(c.amount) from public.calculation c where c.payment_date between '${formatedStart}' and '${formatedEnd}' and c.status != '${Status.nulled}'`;
    const data = (await this.calculationRepo.query(query)) as [{ sum: string }];
    return data[0].sum;
  }
}
