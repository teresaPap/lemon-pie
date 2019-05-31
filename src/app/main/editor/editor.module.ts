import { NgModule } from "@angular/core";
import { AsideComponent } from './aside/aside.component';
import { SharedModule } from '../../shared/shared.module';
import { LibraryComponent } from './library/library.component';
import { EditorRoutingModule } from './editor-routing.module';

@NgModule({
    declarations: [
        AsideComponent,
        LibraryComponent
    ],
    imports: [
        SharedModule,
        EditorRoutingModule
    ]
})
export class EditorModule { }