import nodemailer, {
  Transporter,
  SendMailOptions,
  SentMessageInfo,
} from 'nodemailer'

class Email {
  private static instance: Email
  private transporter: Transporter

  private constructor() {
    if (!process.env.EMAIL_ADDRESS || !process.env.EMAIL_PASSWORD) {
      throw new Error(
        'Email address or password not defined in environment variables.',
      )
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      tls: {
        ciphers: 'SSLv3',
      },
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  }

  public static getInstance(): Email {
    if (!Email.instance) {
      Email.instance = new Email()
    }
    return Email.instance
  }

  public async sendEmail(options: SendMailOptions): Promise<SentMessageInfo> {
    try {
      return await this.transporter.sendMail(options)
    } catch (error: unknown) {
      throw new Error(error as string)
    }
  }

  public emailOptions(
    from: string,
    to: string,
    subject: string,
    text: string,
    attachments?: { filename: string; path: string }[]
  ): SendMailOptions {
    const mailOptions: SendMailOptions = {
      from: from ?? process.env.EMAIL_ADDRESS,
      to: to,
      subject: subject,
      text: text,
    };

    if (attachments) {
      mailOptions.attachments = attachments;
    }

    return mailOptions;
  }
}

export default Email
