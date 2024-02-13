import {
  HttpEvent,

  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';


export class AuthInterceptorService implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const modefiedReq = req.clone({
      headers: req.headers.append('auth', 'xyz'),
    });
    return next.handle(modefiedReq)
  }
}
