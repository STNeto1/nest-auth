import { Injectable } from '@nestjs/common'
import { SendEmailCommand, SESv2Client } from '@aws-sdk/client-sesv2'
import { ConfigService } from '@nestjs/config'

import { User } from '../user/entities/user.entity'

@Injectable()
export class MailService {
  private client: SESv2Client

  constructor(private configService: ConfigService) {
    this.client = new SESv2Client({
      region: configService.get('SES_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS_SECRET_KEY')
      }
    })
  }

  async sendRegisterEmail(user: User): Promise<void> {
    const command = new SendEmailCommand({
      Destination: {
        ToAddresses: [user.email]
      },
      Content: {
        Simple: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: `Welcome, ${user.name}`
            },
            Text: {
              Charset: 'UTF-8',
              Data: `Welcome, ${user.name}`
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: 'Welcome!'
          }
        }
      },
      FromEmailAddress: this.configService.get('SES_SOURCE_MAIL')
    })

    try {
      const data = await this.client.send(command)
      if (data.$metadata.httpStatusCode !== 200) {
        return await this.sendRegisterEmail(user)
      }
    } catch (_) {}
  }
}
