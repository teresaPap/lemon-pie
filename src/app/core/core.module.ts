import { NgModule } from "@angular/core";
import { ApiService } from "./services/api.service";
import { TokenHelperService } from "./services/token-helper.service";
import { AuthGuard } from "./guards/auth.guard";
import { AuthService } from "./services/auth.service";


@NgModule({
    imports: [
    ],
    providers: [
        ApiService,
        TokenHelperService,
        AuthService,
        AuthGuard
    ]
})
export class CoreModule { }