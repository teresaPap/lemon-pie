import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseApiService } from '../../core/services/firebase-api.service';
import { IProject, IProjectPreview } from '../interfaces/IProject';


@Injectable({
	providedIn: 'root'
})
export class ProjectsService {

	private activeProjectSource = new BehaviorSubject<IProject>({} as IProject);

	public activeProjectChanges$ = this.activeProjectSource.asObservable();

	constructor(
		private authService: AuthService,
		private apiService: FirebaseApiService ) {
	}

	public changeActiveProject(activeProject: IProject): void {
		this.activeProjectSource.next(activeProject);
	}

	public create(project: IProject): Observable<IProject|any> {
		return this.apiService.createDocument(project,'projects',`users/${this.authService.getCurrentUserId()}`).pipe(
			tap( res => this.changeActiveProject(res) )
		);
	}

	public readAllProjectsForActiveUser(): Observable<IProjectPreview[]|any> {
		return this.apiService.readDocumentChildReferences(`users/${this.authService.getCurrentUserId()}`);
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
		return this.apiService.deleteDocument(`projects/${projectId}`, `users/${this.authService.getCurrentUserId()}`).pipe(
			tap( () => this.changeActiveProject({} as IProject) )
		);
	}


}
