import { Observable } from 'rxjs';
import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class WorkerRoutesGuard implements CanActivate {
    private readonly options;
    constructor(options?: {
        allowedPaths: string[];
    });
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
}
