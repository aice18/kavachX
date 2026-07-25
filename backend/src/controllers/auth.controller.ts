import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'kavachx-secret-key-for-prototype';

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    // In production, use bcrypt.compare(password, user.password_hash)
    if (user.password_hash !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: user.email, role: user.role, id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('auth_token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ success: true, token, user: { email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.json({ success: true });
};

export const verify = (req: Request, res: Response) => {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ authenticated: false });
  }
};
