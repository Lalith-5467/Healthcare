import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { statusUpdateSchema, roleUpdateSchema } from '../utils/validators';

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AdminService.getUsers({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      role: typeof req.query.role === 'string' ? req.query.role : undefined,
      status: typeof req.query.status === 'string' ? req.query.status : undefined,
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
    });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await AdminService.getUserById(id);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = statusUpdateSchema.parse(req.body);
    const data = await AdminService.updateUserStatus(
      id,
      status,
      req.user!.id,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: `User account status updated to ${data.status}`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { role } = roleUpdateSchema.parse(req.body);
    const data = await AdminService.updateUserRole(
      id,
      role,
      req.user!.role,
      req.user!.id,
      req.ip
    );

    res.status(200).json({
      success: true,
      message: `User role updated successfully to ${data.role}`,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await AdminService.createUser({
      ...req.body,
      actorId: req.user!.id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await AdminService.updateUser(id, {
      ...req.body,
      actorId: req.user!.id,
      ipAddress: req.ip,
    });

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await AdminService.deleteUser(id, req.user!.id, req.ip);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};
