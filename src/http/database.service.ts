import { Injectable, type OnModuleInit, type OnApplicationShutdown } from '@nestjs/common';
import { migrateDatabase, closeDatabase, run, syncTools } from '../lib/db';
import { apps } from '../lib/apps';
@Injectable()
export class DatabaseService implements OnModuleInit, OnApplicationShutdown {
  private expiryTimer?: ReturnType<typeof setInterval>;
  async onModuleInit() {
    await migrateDatabase();
    await syncTools(apps);
    this.expiryTimer = setInterval(
      () => void this.expire().catch(() => console.error('session_cleanup_failed')),
      15 * 60 * 1000,
    );
    this.expiryTimer.unref();
  }
  private async expire() {
    await run('DELETE FROM sessions WHERE expires<?', Date.now());
    await run('DELETE FROM auth_tokens WHERE expires<?', Date.now());
  }
  async onApplicationShutdown() {
    clearInterval(this.expiryTimer);
    await closeDatabase();
  }
}
