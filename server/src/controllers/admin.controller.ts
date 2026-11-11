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
      actorRole: req.user!.role,
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
      actorRole: req.user!.role,
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

export const resetUserPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { password } = req.body;
    const data = await AdminService.resetPassword(id, password, req.user!.id, req.ip);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AdminService.getAuditLogs({
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
      search: typeof req.query.search === 'string' ? req.query.search : undefined,
      module: typeof req.query.module === 'string' ? req.query.module : undefined,
      action: typeof req.query.action === 'string' ? req.query.action : undefined,
      userId: typeof req.query.userId === 'string' ? req.query.userId : undefined,
      startDate: typeof req.query.startDate === 'string' ? req.query.startDate : undefined,
      endDate: typeof req.query.endDate === 'string' ? req.query.endDate : undefined,
    });

    res.status(200).json({
      success: true,
      data: result.logs,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const getHospitalsController = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await AdminService.getHospitals();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const createHospitalController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = await AdminService.createHospital(req.body);
    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHospitalController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await AdminService.updateHospital(id, req.body);
    res.status(200).json({
      success: true,
      message: 'Hospital details updated successfully',
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHospitalController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const data = await AdminService.deleteHospital(id);
    res.status(200).json({
      success: true,
      message: 'Hospital removed from directory',
      data,
    });
  } catch (error) {
    next(error);
  }
};
