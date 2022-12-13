import { Logs } from "@prisma/client";
import prisma from "../client/prisma.client";

export class LogService {
  private static instance: LogService;
  constructor() {}

  public static getInstance(): LogService {
    if (!LogService.instance) {
      LogService.instance = new LogService();
    }
    return LogService.instance;
  }

  public async log(message: string): Promise<void> {
    await prisma.logs.create({
      data: {
        message,
      },
    });
    return;
  }

  public async getLogs(): Promise<Logs[]> {
    return await prisma.logs.findMany();
  }
}
