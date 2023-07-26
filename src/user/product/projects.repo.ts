
import { Injectable } from "@nestjs/common";
import { Product } from "./product.entity";

@Injectable()
export class ProductRepo {
    constructor(
        private _projects: Product[] = []
    ) {}
    getAll(): Product[] {
        return this._projects
    }

    add(project: Product) {
        this._projects.push(project)
    }

    addMany(projects: Product[]) {
        this._projects = [...this._projects, ...projects]
    }

    delete(project: Product) {
        this._projects.splice(this._projects.indexOf(project), 1)
    }

    clear() {
        this._projects = []
    }
}