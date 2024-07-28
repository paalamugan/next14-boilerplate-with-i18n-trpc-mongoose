import type { IUserSchema } from '../model/user.model';
import type { CreateUserInputSchema, UpdateUserInputSchema } from '../user.input';

export type GetUserByIdOptions<T extends boolean> = {
  includeSensitiveInfo?: T;
  bypassCache?: boolean;
};

export type UpdateUserPhoneNumParams = {
  userId: IUserSchema['id'];
  phoneNumber: string;
};

export type CreateUserParams = {
  data: CreateUserInputSchema;
};

export type UpdateUserParams = {
  userId: IUserSchema['id'];
  data: UpdateUserInputSchema['data'];
};
