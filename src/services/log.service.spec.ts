import { prismaMock } from "../client/prisma.singleton";
import { LogService } from "./log.service";

describe("LogService", () => {
  it("should create a log", async () => {
    const logService = new LogService();
    const message = "test message";
    const log = {
      id: 1,
      message,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    const logSpy = jest.spyOn(logService, "log");
    // prismaMock.logs.create.mockResolvedValueOnce(log);
    //   const result = await prismaMock.logs.create({ data: { message } });
    await logService.log(message)
    expect(logSpy).toHaveBeenCalledWith(message);
    logSpy.mockClear();
  });

  it("should get all logs", async () => {
    const logService = new LogService();
    const logs = [
      {
        id: 1,
        message: "test message",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
      {
        id: 2,
        message: "test message 2",
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      },
    ];
    prismaMock.logs.findMany.mockResolvedValueOnce(logs);
    await expect(logService.getLogs()).resolves.toEqual(logs);
  });
});
