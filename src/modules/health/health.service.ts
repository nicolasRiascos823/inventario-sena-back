import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /** Comprueba que la conexión a PostgreSQL responde. */
  async checkDatabase(): Promise<void> {
    await this.dataSource.query('SELECT 1');
  }

  /**
   * Cada 10 min: petición HTTP a la URL pública del servicio (Render define `RENDER_EXTERNAL_URL`)
   * para generar tráfico entrante y evitar spin-down en el plan Free. En local, solo toca la BD.
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async scheduledKeepAlive(): Promise<void> {
    const base = (
      process.env.RENDER_EXTERNAL_URL ??
      process.env.SELF_PING_BASE_URL ??
      ''
    ).replace(/\/$/, '');
    if (base) {
      const url = `${base}/api/health`;
      try {
        const res = await fetch(url, {
          method: 'GET',
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(25_000),
        });
        if (!res.ok) {
          this.logger.warn(`Auto-ping HTTP ${res.status} en ${url}`);
        }
      } catch (err) {
        this.logger.warn(
          `Auto-ping HTTP falló: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
      return;
    }
    try {
      await this.dataSource.query('SELECT 1');
    } catch (err) {
      this.logger.warn(
        `Ping local a la BD falló: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
