import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  createManyUsers,
  findProfile,
  findUser,
} from '../services/userService';
import { InternalServerError, NotFoundError } from '../utils/AppError';
import { profile } from 'console';

export const getCurrentUserHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, username, email, profilePhoto, id } = res.locals.user;

  const user = {
    fullName,
    username,
    email,
    profilePhoto,
    id,
  };

  res.status(200).json({ user });
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findProfile(req.params.username);
    if (!user) {
      return next(
        new NotFoundError(
          `User with the username ${req.params.username} not found`
        )
      );
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return next(
      new InternalServerError(
        'Something went wrong when trying the get the user'
      )
    );
  }
};

export const createManyUsersHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users: Prisma.UserCreateManyInput[] = req.body.users;

    const usersToInsert = users.map((user) => {
      const hashedPassword = bcrypt.hashSync(user.password, 12);

      return { ...user, password: hashedPassword };
    });

    createManyUsers(usersToInsert);

    res.status(201).json({
      status: 'success',
      message: 'Users created successfully',
      users,
    });
  } catch (error) {
    console.log(error);
    return next(
      new InternalServerError('Something went wrong when creating the users')
    );
  }
};
