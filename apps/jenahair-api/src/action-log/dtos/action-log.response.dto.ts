import { User } from 'src/prisma/generated/client';

export class ActionLogResponseDto {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress: string | null;
  createdAt: Date;
  user?: Pick<User, 'id' | 'name' | 'email'> | null;
}
