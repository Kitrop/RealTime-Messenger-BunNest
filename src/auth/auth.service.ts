import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcrypt'
import type { CreateUserDto, LoginUserDto, PayloadDto } from 'src/dto/auth.dto'
import { PrismaService } from 'src/prisma.service.js'

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
		private readonly configService: ConfigService
	) {}

	async checkUniq(email: string, username: string) {
		const findByUsername = await this.prisma.user.findUnique({
			where: {
				username,
			},
		})

		const findByEmail = await this.prisma.user.findUnique({
			where: {
				email,
			},
		})

		if (findByUsername) {
			return {
				statusCode: 400,
				data: {
					message: 'user with this username is already exist',
				},
			}
		}

		if (findByEmail) {
			return {
				statusCode: 400,
				data: {
					message: 'user with this email is already exist',
				},
			}
		}

		return true
	}

	async createUser(createUser: CreateUserDto) {
		const checkUniq = await this.checkUniq(createUser.email, createUser.username)

		if (checkUniq !== true) {
			return checkUniq
		}

		const hashPassword = await hash(createUser.password, 7)

		const newUser = await this.prisma.user.create({
			data: {
				username: createUser.username,
				email: createUser.email,
				password: hashPassword,
			},
		})

		const jwt = this.createJWT({
			id: newUser.id,
			username: newUser.username,
			email: newUser.email,
		})

		return {
			statusCode: 201,
			data: {
				user: {
					id: newUser.id,
					username: newUser.username,
					email: newUser.email,
				},
				accessToken: jwt,
			},
		}
	}

	async loginUser(loginUser: LoginUserDto) {
		const findUser = await this.prisma.user.findUnique({
			where: {
				username: loginUser.username,
			},
		})

		if (!findUser) {
			return {
				statusCode: 404,
				data: {
					message: 'user not found',
				},
			}
		}

		const comparePassword = compare(loginUser.password, findUser.password)

		if (!comparePassword) {
			return {
				statusCode: 400,
				data: {
					message: 'invalid password',
				},
			}
		}

		const jwt = this.createJWT({
			id: findUser.id,
			username: findUser.username,
			email: findUser.email,
		})

		return {
			statusCode: 200,
			data: {
				user: {
					id: findUser.id,
					username: findUser.username,
					email: findUser.email,
				},
				accessToken: jwt,
			},
		}
	}

	createJWT(payload: PayloadDto) {
		return this.jwtService.sign(payload, { secret: this.configService.get('SECRET_KEY') })
	}

	verifyJWT(jwt: string): boolean {
		try {
			this.jwtService.verify(jwt, { secret: this.configService.get('SECRET_KEY') })
			return true
		} catch (e) {
			return false
		}
	}

	getDataJWT(jwt: string) {
		const data = this.jwtService.decode(jwt)

		return data
	}

	allUsers() {
		const data = this.prisma.user.findMany()

		return data
	}
}