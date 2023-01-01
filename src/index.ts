import prisma from './client/prisma.client'
import app from './app'
const port = process.env.PORT

app.listen(port || 3001, async () => {
	try {
		console.log(
			`[Server]: ⚡️Server is running at http://localhost:${port || 3001}`
		)
		await prisma.$disconnect()
	} catch (e) {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	}
})
