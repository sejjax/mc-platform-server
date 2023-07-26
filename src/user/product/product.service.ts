import {Product} from "./product.entity";
import { HttpService } from "@nestjs/axios"
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { ConsoleLogger, Inject, Injectable, LoggerService } from "@nestjs/common";
import { Locale } from "../../classes/locale";

@Injectable()
export class ProductService {
    private readonly strapiUrl: string
    constructor(
        // private readonly httpService: HttpService,
        // @Inject(ConfigService)
        // private readonly configService: ConfigService,
        // @Inject(ConsoleLogger)
        // private readonly loggerService: LoggerService,
        // @Inject(ProjectsRepo)
        // private readonly projectsRepo: ProjectsRepo,
    ) {
        // this.strapiUrl = this.configService.get<string>('strapi.apiUrl')
    }
    async fetchProjects(locale: Locale=Locale.EN): Promise<Product[]> {
        // const res = await firstValueFrom(
        //     this.httpService.get<Project[]>(
        //         `${this.strapiUrl}/projects`,
        //         {params: {"_locale": locale}}
        //     )
        //         .pipe(catchError((error) => {
        //             // this.loggerService.error(error)
        //             throw 'Failed to fetch projects from strapi'
        //         }))
        // )
        // return res.data
        return []
    }

    async fetchAndStoreProjects(locale: Locale=Locale.EN): Promise<Product[]> {
        const projects = await this.fetchProjects(locale)
        // this.projectsRepo.addMany(projects)
        // return this.projectsRepo.getAll()
        return []
    }

    async reFetchAndStoreProjects(locale: Locale=Locale.EN): Promise<Product[]> {
        // this.projectsRepo.clear()
        // return this.fetchAndStoreProjects(locale)
        return []
    }

    async getAllProjects(): Promise<Product[]> {
        // if(isEmpty(this.projectsRepo.getAll()))
        //     return this.fetchAndStoreProjects()
        // return this.projectsRepo.getAll()
        return []
    }

    async findBySlug(slug: string): Promise<Product | undefined> {
        return (await this.getAllProjects()).find(it => it.slug === slug)
    }
}