import { Response } from 'express';

export function setTokenCookie(res: Response, token: string) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction,               // 🔹 HTTPS solo en producción
    sameSite: isProduction ? 'none' : 'lax', 
    maxAge: 1000 * 60 * 60 * 24,       // 1 día
  });
}

export function clearTokenCookie(res: Response) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
}
