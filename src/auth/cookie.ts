import { Response } from 'express';

export function setTokenCookie(res: Response, token: string) {
  res.cookie('token', token, {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
    maxAge: 1000 * 60 * 60 * 24,
  });
}


export function clearTokenCookie(res: Response) {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false,
    sameSite: 'none',
  });
}


//si es de subir a internet es nesesario cambiar de (secure:true)