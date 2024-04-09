import { NestFactory } from '@nestjs/core';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { AppModule } from './app.module';

const configClient = {
  getConnection: async () => {
    return {
      address: '/Users/Jouni/Code/diograph-cli/tests/demo-content-room/source',
      contentClientType: 'LocalClient',
      contentUrls: {
        bafkreieytmbbc6h7gz4qkcqo6323mdkzcjocuudovum7zsk4tltmeol5yi:
          'subsource/some-audio.m4a',
        bafkreiaeiw7j723fgzl2h5udldir42sszpjmrtxbrub43mpkbkzxhtcaxm:
          'subsource/some-document.pdf',
        bafkreibmmzu26ak6fu24st2yofgulmv6heqwoqhrwewyfs3wcv25psk2cq:
          'subsource/some-document.odt',
        bafkreihoednm4s2g4vpame3mweewfq5of3hks2mbmkvoksxg3z4rhmweeu:
          'subsource/one-test-image.jpg',
        bafkreihkqxpj4iwdw32vshr47qjme3fm3alwnar6ltngwscypf4jtpff6q:
          'subsource/some-image.jpg',
        bafkreia2c44rszqme57sao4ydipv3xtwfoigag7b2lzfeuwtunctzfdx4a:
          'subsource/some-video.mp4',
        bafkreihvgvtqocownctpbskgrwsdtr3l6z3yp4w2rirs32ny2u7epz7ona:
          'demo-content.png',
      },
    };
  },
};

export async function bootstrap(configClient: any) {
  const app = await NestFactory.create(AppModule.forRoot(configClient));

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(3000);
}

bootstrap(configClient);
