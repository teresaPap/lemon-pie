import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {IProjectResolved} from "../../../shared/interfaces/IProject";
import {Observable, of} from "rxjs";
import {ProjectsService} from "../../../shared/data-services/projects.service";
import {catchError, map} from "rxjs/operators";

@Injectable({
	providedIn: 'root'
})
export class ProjectResolver implements Resolve<IProjectResolved> {

	constructor( private projectCtrl: ProjectsService) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IProjectResolved> {
		const projectId = route.paramMap.get('id');
		console.log(projectId);

		return this.projectCtrl.readSingleProject(projectId).pipe(
			map( res => ({project: res}) ),
			catchError( err => {
				console.error('Project retrieval error: ', err );
				return of({project: null, error: err.message})
			})
		);
	}


}
