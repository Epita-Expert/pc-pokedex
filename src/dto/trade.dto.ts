export class CreateTradeDto {
	recipientId: number
	pokemons: { id: number; sent: boolean }[]
}
