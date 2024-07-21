import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: any;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendWelcomeEmail(email: string, name: string, verificationlink: any) {
    // Replace with your welcome URL
    const mailOptions = {
      from: '"Your App Name" <your-email-address>', // Replace with your app name and email
      to: email,
      subject: 'Welcome to Your App!',
      html: `<h1>Welcome, ${name}!</h1>
              <p>We're excited to have you join our community.</p>
              <a href={"${verificationlink}"}>Click here to verify your account: ${verificationlink}</a>
              <p>Thank you,</p>
              <p>The Your App Team</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully');
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendResetPasswordEmail(email: string, token: string) {
    // Replace with your reset password URL
    const resetLink = `http://yourapp.com/reset-password?token=${token}`;
    const mailOptions = {
      from: '"invoice gen" <support@invoicegen.com>', // Replace with your app name and email
      to: email,
      subject: 'Reset Your Password',
      html: `<h1>Click the link below to reset your password:</h1>
              <a href="${resetLink}">reset password</a>
              <p>This link will expire in 1 hour.</p>
              <p>Thank you,</p>
              <p>The Your App Team</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Reset password email sent successfully');
    } catch (error) {
      console.error('Error sending reset password email:', error);
    }
  }
}
