import { NgModule } from "@angular/core";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [ 
        LoginComponent, 
        RegisterComponent 
    ],
    imports: [ 
        SharedModule 
    ],
    providers: [ ]
})
export class AccountModule { }