export class ProjectEntity {}

export class Project {
    constructor(
        private _projects: ProjectEntity[] = []
    ) {}
    getAll(): ProjectEntity[] {
        return this._projects
    }

    add(project: ProjectEntity) {
        this._projects.push(project)
    }

    addMany(projects: ProjectEntity[]) {
        this._projects = [...this._projects, ...projects]
    }

    delete(project: ProjectEntity) {
        this._projects.splice(this._projects.indexOf(project), 1)
    }

    clear() {
        this._projects = []
    }
}