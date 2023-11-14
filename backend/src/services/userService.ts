import { PrismaClient, User, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (input: Prisma.UserCreateInput) => {
  return (await prisma.user.create({
    data: input,
  })) as User;
};
export const findUser = async (where: Prisma.UserWhereUniqueInput) => {
  where.active = true;
  return await prisma.user.findUnique({ where });
};

export const findUserByEmailOrUsername = async (userInput: string) => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email: userInput }, { username: userInput }],
      AND: [{ active: true }],
    },
  });
};

export const updateUser = async (
  where: Prisma.UserWhereUniqueInput,
  input: Prisma.UserUpdateInput
) => {
  return await prisma.user.update({ where, data: input });
};
