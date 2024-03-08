import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordEmailDto } from './dto/forgot-password-email.dto';
import { WelcomeEmailDto } from './dto/welcome-email.dto';
// import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  protected readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly mailerService: MailerService) {}

  /* private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAUTH2',
      user: this.configService.getOrThrow('SMTP_USER'),
      clientId: this.configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
      refreshToken: this.configService.getOrThrow('GOOGLE_REFRESH_TOKEN'),
    },
  }); */

  @OnEvent('notification.welcome', { async: true })
  public async notifyEmailWelcome({ email, name }: WelcomeEmailDto) {
    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'Welcome | Bank Raya',
        template: './welcome',
        context: {
          name,
        },
      })
      .then(() => {
        return {
          message: `Welcome email has been sent successfully to ${email}`,
        };
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });
  }

  @OnEvent('notification.verify-email', { async: true })
  public async notifyEmailVerification({ email, name, otp }: VerifyEmailDto) {
    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'Verify Email | Bank Raya',
        template: './verify-email',
        context: {
          name,
          otp,
        },
        priority: 'high',
      })
      .then(() => {
        return {
          message: `Verification email has been sent successfully to ${email}`,
        };
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });
  }

  @OnEvent('notification.forgot-password', { async: true })
  public async notifyEmailForgotPassword({
    email,
    name,
    link,
  }: ForgotPasswordEmailDto) {
    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'Forgot Password | Bank Raya',
        template: './forgot-password',
        context: {
          name,
          link,
        },
      })
      .then(() => {
        return {
          message: `Forgot password email has been sent successfully to ${email}`,
        };
      })
      .catch((error) => {
        throw new InternalServerErrorException(error);
      });
  }
}
