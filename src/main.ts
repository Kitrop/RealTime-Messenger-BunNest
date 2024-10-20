import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { AppModule } from './app.module.js'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser())
	app.useGlobalPipes(new ValidationPipe())

	await app.listen(3000)
}
bootstrap()
