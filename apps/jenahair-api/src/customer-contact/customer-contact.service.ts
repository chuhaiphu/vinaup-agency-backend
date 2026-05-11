import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/services/mail.service';
import { CreateCustomerContactRequestDto } from 'src/customer-contact/dtos/create-customer-contact.request.dto';
import { CustomerContactResponseDto } from 'src/customer-contact/dtos/customer-contact.response.dto';
import { RecaptchaService } from 'src/recaptcha/recaptcha.service';

@Injectable()
export class CustomerContactService {
  constructor(
    private prismaService: PrismaService,
    private mailService: MailService,
    private recaptchaService: RecaptchaService
  ) {}

  async create(dto: CreateCustomerContactRequestDto) {
    if (dto.recaptchaToken) {
      const isValid = await this.recaptchaService.verifyToken(
        dto.recaptchaToken,
        'contact_form_submit'
      );
      if (!isValid) {
        throw new BadRequestException('Invalid reCAPTCHA');
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { recaptchaToken, ...contactData } = dto;

    const contact = await this.prismaService.customerContact.create({
      data: contactData,
    });

    // Send notification to admin (non-blocking)
    void this.mailService.sendContactNotification({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      notes: contact.notes,
    });

    return contact;
  }

  async findAll(): Promise<CustomerContactResponseDto[]> {
    const contacts = await this.prismaService.customerContact.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return contacts;
  }

  async findById(id: string): Promise<CustomerContactResponseDto> {
    const contact = await this.prismaService.customerContact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Customer contact not found');
    }

    return contact;
  }

  async delete(id: string) {
    const contact = await this.prismaService.customerContact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException('Customer contact not found');
    }

    await this.prismaService.customerContact.delete({
      where: { id },
    });
  }
}
