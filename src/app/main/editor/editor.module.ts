import { NgModule } from "@angular/core";
import { AsideComponent } from './aside/aside.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [
        AsideComponent
    ],
    imports: [
        SharedModule
    ]
})
export class EditorModule { }