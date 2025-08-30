import { Response } from 'express';

export function setTokenCookie(res: Response, token: string) {
 

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,               // 🔹 HTTPS solo en producción
    sameSite: 'none', 
    maxAge: 1000 * 60 * 60 * 24,       // 1 día
  });
}

export function clearTokenCookie(res: Response) {
  const isProduction = process.env.NODE_ENV === 'production';

  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite:'none',
  });
}
