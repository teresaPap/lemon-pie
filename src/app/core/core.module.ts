import { NgModule } from '@angular/core';
import { FirebaseApiService } from './services/firebase-api.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
	providers: [
		FirebaseApiService,
		AuthGuard,
	]
})

export class CoreModule { }
