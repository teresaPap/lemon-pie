import { NgModule } from '@angular/core';
import { FirebaseApiService } from './services/firebase-api.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';

@NgModule({
	imports: [ ],
	providers: [
		FirebaseApiService,
		AuthGuard,
	]
})

export class CoreModule { }
