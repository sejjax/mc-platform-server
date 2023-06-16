import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailData } from 'src/mail/interfaces/mail-data.interface';
import * as path from 'path';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  async confirmEmailProxy(data: { to: string; hash: string }): Promise<void> {
    return await this.httpService.axiosRef.post(this.getMailProxyAddress('/confirm-email'), data);
  }

  async confirmEmail(mailData: MailData<{ hash: string }>) {
    const title = 'Подтвердите email';
    const url = new URL(
      path.join('confirm-email', mailData.data.hash),
      this.configService.get('frontend.baseUrl'),
    );

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: title,
      text: `${title} ${url.toString()}`,
      template: 'confirm-email',
      context: {
        title: title,
        url: url.toString(),
        actionTitle: title,
        appName: this.configService.get('app.name'),
      },
    });
  }

  async forgotPasswordProxy(data: { to: string; hash: string }): Promise<void> {
    return await this.httpService.axiosRef.post(this.getMailProxyAddress('/forgot-password'), data);
  }

  async forgotPassword(mailData: MailData<{ hash: string }>) {
    const title = 'Сброс пароля';
    const url = new URL(
      path.join('password-change', mailData.data.hash),
      this.configService.get('frontend.baseUrl'),
    );

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: title,
      text: `${title} ${url.toString()}`,
      template: 'reset-password',
      context: {
        title: title,
        url: url.toString(),
        actionTitle: title,
        appName: this.configService.get('app.name'),
      },
    });
  }

  async changeWalletAddrProxy(data: {
    hash: string;
    old_wallet: string;
    new_wallet: string;
    to: string;
  }): Promise<void> {
    return await this.httpService.axiosRef.post(this.getMailProxyAddress('/confirm-change-default-wallet'), data);
  }

  async changeWalletAddr(
    mailData: MailData<{ hash: string; old_wallet: string; new_wallet: string }>,
  ) {
    const title = 'Смена кошелька по умолчанию';
    const url = new URL(
      path.join('change-default-wallet', mailData.data.hash),
      this.configService.get('frontend.baseUrl'),
    );

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: title,
      text: `${title} ${url.toString()}`,
      template: 'confirm-wallet',
      context: {
        title: title,
        old_wallet: mailData.data.old_wallet,
        new_wallet: mailData.data.new_wallet,
        url: url.toString(),
        actionTitle: title,
        appName: this.configService.get('app.name'),
      },
    });
  }

  private getMailProxyAddress(route: string): string {
    const host = this.configService.get('mail.proxyHost');
    const port = this.configService.get('mail.proxyPort');
    const key = this.configService.get('mail.proxySecretKey');
    if (!host || !port || !key) {
      throw new Error('YOU SHOULD SPECIFY MAIL PROXY DATA');
    }
    return `http://${host}:${port}${route}?key=${key}`;
  }
}
