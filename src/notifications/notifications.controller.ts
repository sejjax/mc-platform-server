import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { AuthUser } from 'src/utils/decorators/auth-user.decorator';
import { User } from 'src/users/user.entity';
import { CreateNotificationDto } from './dto/create-notifcation.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { DeleteNotificationDto } from './dto/delete-notification.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/consts';
import { RoleGuard } from 'src/roles/roles.guard';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Notifications')
@ApiBearerAuth()
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) {}

  @Get('/')
  // : Promise<NotificationsDto[]>
    getNotifications(@AuthUser() user: User) {
        return this.notificationsService.getNotifications(user.id);
    }

  @Get('/all')
  @Roles(Role.notifications)
  @UseGuards(RoleGuard)
  getAllNotifications() {
      return this.notificationsService.getAllNotifications();
  }

  @Get('/types')
  @Roles(Role.notifications)
  @UseGuards(RoleGuard)
  getNotificationsTypes() {
      return this.notificationsService.getNotificationsType();
  }

  @Get('/:notificationId')
  @Roles(Role.notifications)
  @UseGuards(RoleGuard)
  getOneNotification(@Param('notificationId') notificationId: string) {
      return this.notificationsService.getOneNotification(+notificationId);
  }

  @Roles(Role.notifications)
  @UseGuards(RoleGuard)
  @Post()
  addNotification(@Body() body: CreateNotificationDto) {
      return this.notificationsService.addNotification(body);
  }

  @Roles(Role.notifications)
  @UseGuards(RoleGuard)
  @Put()
  editNotification(@Body() body: UpdateNotificationDto) {
      return this.notificationsService.editNotification(body);
  }

  @Roles(Role.notifications)
  @UseGuards(RoleGuard)
  @Delete()
  deleteNotification(@Body() body: DeleteNotificationDto) {
      return this.notificationsService.deleteNotification(body);
  }
}
