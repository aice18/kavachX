/**
 * @fileoverview Stub for Role-Based Access Control Middleware.
 * Enforces enterprise-grade security for Analyst actions.
 */

import { Request, Response, NextFunction } from 'express';

export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // In a real application, this reads from the verified JWT (e.g., req.user.role)
    const userRole = req.headers['x-user-role'] as string || 'l1_analyst';
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: `Action requires one of: ${allowedRoles.join(', ')}` 
      });
    }
    next();
  };
};
