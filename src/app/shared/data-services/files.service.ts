import { Injectable } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import { Observable, forkJoin } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable()
export class FilesService {

	constructor(
		public firestore: AngularFirestore
	) { }

	public read(projectId:string): Observable<any[]> {
		const action = this.firestore.doc(`projects/${projectId}`).get().pipe(
			// Read files[] from given projectId
			map((project: firebase.firestore.DocumentData) => {
				if (project.data().files) 
					return project.data().files;
				else 
					// TODO: handle no projects error! Escape pipe and return empty []
					throw 'no files for this project!';
			}),
			// For each of the files referenced by this project, get the actual document
			switchMap((projects: firebase.firestore.DocumentReference[]) => {
				const referencesToGet = [];
				projects.forEach((documentRef: firebase.firestore.DocumentReference) => {
					referencesToGet.push(this.firestore.doc( documentRef.path ).get())
				});
				return forkJoin(referencesToGet);
			}),
			// Map the DocumentData to the actual json data and return them to the component
			map((project: firebase.firestore.DocumentData) => {
				const projectData = [];
				project.forEach(documentSnapsot =>
					projectData.push({ id: documentSnapsot.id, ...documentSnapsot.data() })
				);
				return projectData;
			})
		)

		return action;
	}

	public getFile( ref ) {
		return this.firestore.doc( ref ).get().pipe(
			map( file => file.data() )
		);
	}

}
