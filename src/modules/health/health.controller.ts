import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  /** Público: sirve para monitoreo y para pings externos (p. ej. cron cada 10 min en Render Free). */
  @Public()
  @Get()
  async getHealth() {
    try {
      await this.health.checkDatabase();
      return {
        status: 'ok',
        database: 'up',
        at: new Date().toISOString(),
      };
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'down',
        at: new Date().toISOString(),
      });
    }
  }
}
