import { Injectable } from '@angular/core';
import { Observable, forkJoin, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AuthService } from '../../core/services/auth.service';
import * as firebase from 'firebase/app';
import {IProject, IProjectPreview} from '../interfaces/IProject';
import {IFile} from "../interfaces/IFile";
import {FilesService} from "./files.service";

@Injectable()
export class ProjectsService {
	public uid: string = this.authService.getCurrentUserId();

	constructor(
		public fileCtrl: FilesService,
		public firestore: AngularFirestore,
		private authService: AuthService ) {
	}

	public create(project: IProject): Observable<void> {
		console.log('About to create a new project', project);

		const projectsCollectionRef: AngularFirestoreCollection = this.firestore.collection('projects');
		const userIdDocumentRef: AngularFirestoreDocument = this.firestore.doc(`users/${this.uid}`);

		const action = projectsCollectionRef.add({
			name: project.name,
			description: project.description,
			createdOn: new Date(Date.now())
		}).then((documentRef: firebase.firestore.DocumentReference) => {
			userIdDocumentRef.update({
				'projects': firebase.firestore.FieldValue.arrayUnion(documentRef)
			});
		}).catch(error => {
			throw console.warn(error);
			// TODO: Handle error
		});

		return from(action);
	}

	public readAllProjectsForActiveUser(): Observable<IProjectPreview[]> {
		return this.firestore.doc(`users/${this.uid}`).get().pipe(
			// Read projects[] from given uid
			map((user: firebase.firestore.DocumentData) => user.data().projects
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
					if (elem.files && elem.files.length) {
						elem.preview = this.getFile(elem.files[0]);
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
