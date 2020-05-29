import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { IProject } from '../interfaces/IProject';


@Injectable({
	providedIn: 'root'
})
export class ProjectsService {

	private activeProjectSource = new BehaviorSubject<IProject|null>({} as IProject);

	// Observable: any component can subscribe to this observable and receive notifications when the active project changes (eg name is updated)
	public activeProjectChanges$ = this.activeProjectSource.asObservable();

	public uid: string = this.authService.getCurrentUserId();

	constructor(
		public firestore: AngularFirestore,
		private authService: AuthService,
		private apiService: FirebaseApiService ) {
	}

	public changeActiveProject(activeProject: IProject): void {
		console.log('changeActiveProject $', activeProject);
		// Observer function: any component can push a new value to the activeProjectChanges$ observable.
		this.activeProjectSource.next(activeProject);
	}


	public readAllProjectsForActiveUser(): Observable<IProject[]> {
		return this.apiService.readDocumentChildReferences(`users/${this.uid}`);
	}


	public create(project: IProject): Observable<IProject|any> {
		return this.apiService.createDocument(project,'projects',`users/${this.uid}`).pipe(
			tap( res => this.changeActiveProject(res) )
		);
	}

	public readSingleProject(projectId: string): Observable<IProject> {
		return this.apiService.readDocument(`projects/${projectId}`).pipe(
			tap( res => this.changeActiveProject(res) )
		);
	}

	public update(projectId: string, fields: any) {
		return this.apiService.updateDocument(`projects/${projectId}`, fields).pipe(
			tap(() => this.changeActiveProject({ ...fields, id: projectId} ))
		);
	}

	public delete(projectId: string) {
		return this.apiService.deleteDocument(`projects/${projectId}`).pipe(
			tap( () => this.changeActiveProject(null) )
		);
	}


}
