import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpParams
} from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { take, exhaustMap } from "rxjs/operators";

import { AuthService } from "./auth.service";
import { AuthResponseData } from "src/models/auth-model.temp";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authSrv: AuthService) {}

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<AuthResponseData>> {
        /*
            Do not configure a continuous subscription.
            Manage the subscription, give me the last user and cancel
        */

        return this.authSrv.user.pipe(
            take(1),

            // TODO: Channel the two observable --the user and the observable http

            exhaustMap(user => {
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set("auth", user.token)
                });
                return next.handle(modifiedReq);
            })
        );
    }
}
