import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { FilesService } from './files.service';
import { IProject, IProjectPreview } from '../interfaces/IProject';
import {IUser, IUserData} from "../interfaces/IUser";


@Injectable()
export class ProjectsService {
	public uid: string = this.authService.getCurrentUserId();

	constructor(
		public fileCtrl: FilesService,
		public firestore: AngularFirestore,
		private authService: AuthService,
		private apiService: FirebaseApiService ) {
	}



	public create(project: IProject): Observable<IProject|any> {
		return this.apiService.createDocument(project,'projects',`users/${this.uid}`);
	}

	public readAllProjectsForActiveUser(): Observable<IProject[]> {
		return this.apiService.readDocumentChildReferences(`users/${this.uid}`);
	}

	public readSingleProject(projectId: string): Observable<IProject> {
		return this.apiService.readDocument(`projects/${projectId}`);
	}

	public delete(projectId: string) {
		return this.apiService.deleteDocument(`projects/${projectId}`);
	}


}
