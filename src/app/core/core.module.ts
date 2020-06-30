import { NgModule } from '@angular/core';
import { FirebaseApiService } from './services/firebase-api.service';

@NgModule({
	providers: [
		FirebaseApiService,
	]
})

export class CoreModule { }
