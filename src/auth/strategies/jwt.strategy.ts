import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { User } from 'src/users/user.entity';
import { ConfigService } from '@nestjs/config';

type JwtPayload = User & { iat: number; exp: number };

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('auth.secret'),
        });
    }

    public validate(payload: JwtPayload) {
        if (!payload.id) {
            throw new UnauthorizedException();
        }

        return payload;
    }
}
