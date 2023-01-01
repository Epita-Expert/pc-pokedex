import { prismaMock } from '../client/prisma.singleton'
import LogService from '../services/log.service'

describe('LogService', () => {
	it('should create a log', async () => {
		const message = 'test message'
		const logSpy = jest.spyOn(LogService, 'log')
		// prismaMock.logs.create.mockResolvedValueOnce(log);
		//   const result = await prismaMock.logs.create({ data: { message } });
		await LogService.log(message)
		expect(logSpy).toHaveBeenCalledWith(message)
		logSpy.mockClear()
	})

	it('should get all logs', async () => {
		const logs = [
			{
				id: 1,
				message: 'test message',
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			},
			{
				id: 2,
				message: 'test message 2',
				createdAt: new Date(),
				updatedAt: new Date(),
				deletedAt: null,
			},
		]
		prismaMock.log.findMany.mockResolvedValueOnce(logs)
		await expect(LogService.getLogs()).resolves.toEqual(logs)
	})
})
