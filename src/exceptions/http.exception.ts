import { ErrorCode } from '../constant'

class HttpException extends Error {
	status: number
	message: ErrorCode
	constructor(status: number, message: ErrorCode) {
		super(message)
		this.status = status
		this.message = message
	}
}

export default HttpException
