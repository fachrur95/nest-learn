import { Global, Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
// import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.getOrThrow('SMTP_USER'),
            pass: configService.getOrThrow('SMTP_PASSWORD'),
            // type: 'OAUTH2',
            // clientId: configService.getOrThrow('GOOGLE_CLIENT_ID'),
            // clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
            // refreshToken: configService
            //   .getOrThrow('GOOGLE_REFRESH_TOKEN')
            //   .replace(/\\n/g, '\n'),
          },
        },
        defaults: {
          from: `"No Reply" <${configService.getOrThrow('SMTP_USER')}>`,
        },
        template: {
          dir: join(__dirname, 'notifications/email/templates'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
