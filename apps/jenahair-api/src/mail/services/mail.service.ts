import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { PrismaService } from 'src/prisma/prisma.service';

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private prismaService: PrismaService) {}

  private async getTransporter() {
    const smtpConfig = await this.prismaService.smtpConfig.findFirst();

    if (!smtpConfig) {
      this.logger.warn('SMTP config not found');
      return null;
    }

    return nodemailer.createTransport({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.secure,
      auth: {
        user: smtpConfig.username,
        pass: smtpConfig.password,
      },
    });
  }

  private async getSmtpConfig() {
    return this.prismaService.smtpConfig.findFirst();
  }

  async sendMail(options: SendMailOptions): Promise<boolean> {
    try {
      const transporter = await this.getTransporter();
      const smtpConfig = await this.getSmtpConfig();

      if (!transporter || !smtpConfig) {
        this.logger.warn('Cannot send email: SMTP not configured');
        return false;
      }

      await transporter.sendMail({
        from: `"${smtpConfig.fromName}" <${smtpConfig.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      this.logger.log(`Email sent to ${options.to}`);
      return true;
    } catch (error) {
      this.logger.error('Failed to send email', error);
      return false;
    }
  }

  async sendBookingConfirmation(booking: {
    customerName: string;
    customerEmail: string;
    tourTitle: string;
    adultCount: number;
    childCount: number;
    totalPrice: number;
  }): Promise<boolean> {
    const html = `
      <h2>Booking Confirmation</h2>
      <p>Dear ${booking.customerName},</p>
      <p>Thank you for your booking! Here are the details:</p>
      <ul>
        <li><strong>Tour:</strong> ${booking.tourTitle}</li>
        <li><strong>Adults:</strong> ${booking.adultCount}</li>
        <li><strong>Children:</strong> ${booking.childCount}</li>
        <li><strong>Total Price:</strong> $${booking.totalPrice}</li>
      </ul>
      <p>We will contact you shortly to confirm your booking.</p>
      <p>Best regards,<br>Jena Hair</p>
    `;

    return this.sendMail({
      to: booking.customerEmail,
      subject: `Booking Confirmation - ${booking.tourTitle}`,
      html,
    });
  }

  async sendBookingNotificationToAdmin(booking: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNotes?: string | null;
    tourTitle: string;
    adultCount: number;
    childCount: number;
    totalPrice: number;
  }): Promise<boolean> {
    const smtpConfig = await this.getSmtpConfig();

    if (!smtpConfig?.receiveEmail) {
      this.logger.warn('Admin email not configured');
      return false;
    }

    const html = `
      <h2>New Booking Received</h2>
      <h3>Customer Information</h3>
      <ul>
        <li><strong>Name:</strong> ${booking.customerName}</li>
        <li><strong>Email:</strong> ${booking.customerEmail}</li>
        <li><strong>Phone:</strong> ${booking.customerPhone}</li>
        <li><strong>Notes:</strong> ${booking.customerNotes || 'N/A'}</li>
      </ul>
      <h3>Booking Details</h3>
      <ul>
        <li><strong>Tour:</strong> ${booking.tourTitle}</li>
        <li><strong>Adults:</strong> ${booking.adultCount}</li>
        <li><strong>Children:</strong> ${booking.childCount}</li>
        <li><strong>Total Price:</strong> $${booking.totalPrice}</li>
      </ul>
    `;

    return this.sendMail({
      to: smtpConfig.receiveEmail,
      subject: `New Booking - ${booking.tourTitle}`,
      html,
    });
  }

  async sendCustomTourRequestNotification(request: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerNotes?: string | null;
    startDate: Date;
    endDate: Date;
    adultCount: number;
    childCount: number;
    destinations: string[];
  }): Promise<boolean> {
    const smtpConfig = await this.getSmtpConfig();

    if (!smtpConfig?.receiveEmail) {
      this.logger.warn('Admin email not configured');
      return false;
    }

    const html = `
      <h2>New Custom Tour Request</h2>
      <h3>Customer Information</h3>
      <ul>
        <li><strong>Name:</strong> ${request.customerName}</li>
        <li><strong>Email:</strong> ${request.customerEmail}</li>
        <li><strong>Phone:</strong> ${request.customerPhone}</li>
        <li><strong>Notes:</strong> ${request.customerNotes || 'N/A'}</li>
      </ul>
      <h3>Request Details</h3>
      <ul>
        <li><strong>Start Date:</strong> ${request.startDate.toLocaleDateString()}</li>
        <li><strong>End Date:</strong> ${request.endDate.toLocaleDateString()}</li>
        <li><strong>Adults:</strong> ${request.adultCount}</li>
        <li><strong>Children:</strong> ${request.childCount}</li>
        <li><strong>Destinations:</strong> ${request.destinations.join(', ')}</li>
      </ul>
    `;

    return this.sendMail({
      to: smtpConfig.receiveEmail,
      subject: `New Custom Tour Request from ${request.customerName}`,
      html,
    });
  }

  async sendContactNotification(contact: {
    name: string;
    email: string;
    phone: string;
    notes?: string | null;
  }): Promise<boolean> {
    const smtpConfig = await this.getSmtpConfig();

    if (!smtpConfig?.receiveEmail) {
      this.logger.warn('Admin email not configured');
      return false;
    }

    const html = `
      <h2>New Contact Form Submission</h2>
      <ul>
        <li><strong>Name:</strong> ${contact.name}</li>
        <li><strong>Email:</strong> ${contact.email}</li>
        <li><strong>Phone:</strong> ${contact.phone}</li>
        <li><strong>Message:</strong> ${contact.notes || 'N/A'}</li>
      </ul>
    `;

    return this.sendMail({
      to: smtpConfig.receiveEmail,
      subject: `New Contact from ${contact.name}`,
      html,
    });
  }
}
