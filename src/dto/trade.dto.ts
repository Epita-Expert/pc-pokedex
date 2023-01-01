import { TradeStatus } from '@prisma/client'

export class CreateTradeDto {
	recipientId: number
	pokemons: { id: number, sent: boolean }[]
}

export class UpdateTradeDto {
	status: TradeStatus
}