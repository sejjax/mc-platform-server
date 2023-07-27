import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Role as RoleEntity } from '../users/roles.entity';
import { Role } from './consts';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
    private reflector: Reflector,
    @InjectRepository(User) private userRepo: Repository<User>,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }

        const { user }: { user: User } = context.switchToHttp().getRequest();
        const userRole: { id: number; role: RoleEntity } = await this.userRepo
            .createQueryBuilder('user')
            .select('user.id')
            .leftJoinAndSelect('user.role', 'role')
            .where('user.id = :id', { id: user.id })
            .getOne();

        if (!userRole.role) return false;
        const accessArray = JSON.parse(userRole.role.access) as string[];

        for (const requiredRole of requiredRoles) {
            if (!accessArray.includes(requiredRole)) return false;
        }
        return true;
    }
}
