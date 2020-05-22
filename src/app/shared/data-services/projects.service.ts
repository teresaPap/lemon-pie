import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { FilesService } from './files.service';
import { IProject, IProjectPreview } from '../interfaces/IProject';


@Injectable()
export class ProjectsService {
	public uid: string = this.authService.getCurrentUserId();

	constructor(
		public fileCtrl: FilesService,
		public firestore: AngularFirestore,
		private authService: AuthService,
		private apiService: FirebaseApiService ) {
	}


	public delete(projectId: string) {
		return this.apiService.deleteDocument(`projects/${projectId}`);
	}


	public create(project: IProject): Observable<IProject|any> {
		return this.apiService.createDocument(project,'projects',`users/${this.uid}`);
	}

	public readAllProjectsForActiveUser(): Observable<IProjectPreview[]> {
		return this.firestore.doc(`users/${this.uid}`).get().pipe(
			// Read projects[] from given uid
			map((user: firebase.firestore.DocumentData) => user.data().references
			),
			// For each of the projects referenced by this user, get the actual document
			switchMap((projects: firebase.firestore.DocumentReference[]) => {
				const referencesToGet = [];
				projects.forEach((documentRef: firebase.firestore.DocumentReference) => {
					referencesToGet.push(this.firestore.doc(documentRef.path).get())
				});
				return forkJoin(referencesToGet);
			}),
			// Map the DocumentData to the actual json data and return them to the component
			map((projects: firebase.firestore.DocumentData) => {
				const projectData = [];
				projects.forEach(documentSnapsot =>
					projectData.push({id: documentSnapsot.id, ...documentSnapsot.data()})
				);
				return projectData;
			}),
			map((projectData: IProjectPreview[]) => {
				projectData.forEach(elem => {
					if (elem.references && elem.references.length) {
						elem.preview = this.getFile(elem.references[0]);
					}
				});
				return projectData;
			})
		);
	}

	public readSingle(projectId: string): Observable<firebase.firestore.DocumentSnapshot> {
		return this.firestore.doc(`projects/${projectId}`).get();
	}

	private getFile(ref) {
		return this.firestore.doc(ref).get().pipe(
			map(file => file.data())
		);
	}

}
