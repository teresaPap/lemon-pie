import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IProjectResolved } from '../../../shared/interfaces/IProject';
import {forkJoin, Observable, of} from 'rxjs';
import { ProjectsService } from '../../../shared/data-services/projects.service';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {FilesService} from "../../../shared/data-services/files.service";

@Injectable({
	providedIn: 'root'
})
export class ProjectResolver implements Resolve<IProjectResolved> {

	constructor(
		private projectCtrl: ProjectsService,
		private fileCtrl: FilesService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProjectResolved> {
		const projectId = route.paramMap.get('id');

		return forkJoin([
			this.projectCtrl.readSingleProject(projectId),
			this.fileCtrl.readAllFiles(projectId)
		]).pipe(
			map((res: any[]) => ({
					project: res[0],
					files: res[1]
				})
			),
			catchError( err => {
				console.error('Project retrieval error: ', err );
				return of({project: null, files: null, error: err.message})
			})
		);

	}

}
