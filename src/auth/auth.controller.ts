import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService, ICreateUser, ILoginUser } from './auth.service'
import { Response } from 'express'
import { AuthGuard } from './auth.guard'
import { NoAuthGuard } from './noAuth.guard'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(NoAuthGuard)
	@Post('signUp')
	async createUser(@Body() createUser: ICreateUser, @Res() res: Response) {
		const result = await this.authService.createUser(createUser)

		if (result.statusCode === 201) {
			// @ts-ignore
			res.cookie('accessToken', result.data.accessToken)
		}
		
		res.status(result.statusCode).send(result.data)
	}
	
	@UseGuards(NoAuthGuard)
	@Post('signIn')
	async loginUser(@Body() loginUser: ILoginUser, @Res() res: Response) {
		const result = await this.authService.loginUser(loginUser)

		if (result.statusCode === 200) {
			// @ts-ignore
			res.cookie('accessToken', result.data.accessToken)
		}
		
		res.status(result.statusCode).send(result.data)
	}

	@UseGuards(AuthGuard)
	@Post('logout')
	async logoutUser(@Res() res: Response) {
		res.clearCookie('accessToken')
		res.status(204)
	}
}
