import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'
import { AuthGuard } from './auth.guard.js'
import {
  AuthService,
  type ICreateUser,
  type ILoginUser,
} from './auth.service.js'
import { NoAuthGuard } from './noAuth.guard.js'

@Controller('auth')
export default class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(NoAuthGuard)
	@Post('signUp')
	async createUser(
		@Body() createUser: ICreateUser,
		@Res() res: Response
	) {
		const result = await this.authService.createUser(createUser)

		if (result.statusCode === 201) {
			// @ts-ignore
			res.cookie('accessToken', result.data.accessToken)
		}

		res.status(result.statusCode).send(result.data)
	}

	@UseGuards(NoAuthGuard)
	@Post('signIn')
	async loginUser(
		@Body() loginUser: ILoginUser,
		@Res() res: Response
	) {
		const result = await this.authService.loginUser(loginUser)

		if (result.statusCode === 200) {
			// @ts-ignore
			res.cookie('accessToken', result.data.accessToken)
		}

		res.status(result.statusCode).send(result.data)
	}

	@UseGuards(AuthGuard)
	@Get('logout')
	async logoutUser(@Res() res: Response) {
		res.clearCookie('accessToken')
		res.status(204).send()
	}
}
