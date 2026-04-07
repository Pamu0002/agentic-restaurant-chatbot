// Extend Express Request type to include userId from JWT
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: any;
    }
  }
}

export { };

