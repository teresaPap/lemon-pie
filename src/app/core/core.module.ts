import { NgModule } from '@angular/core';
import { ApiService } from './services/api.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

@NgModule({
	imports: [ ],
	providers: [
		ApiService,
		AuthService,
		AuthGuard,
	]
})

export class CoreModule { }
