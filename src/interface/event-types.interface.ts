import { VerifyEmailDto } from 'src/notifications/dto/verify-email.dto';

export interface EventPayloads {
  'notification.welcome': { name: string; email: string };
  'notification.forgot-password': { name: string; email: string; link: string };
  'notification.verify-email': VerifyEmailDto;
}
