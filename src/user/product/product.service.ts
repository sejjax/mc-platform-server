import {Product} from "./product.entity";
import { HttpService } from "@nestjs/axios"
import { ConfigService } from "@nestjs/config";
import { catchError, firstValueFrom } from "rxjs";
import { ConsoleLogger, HttpStatus, Inject, Injectable, LoggerService } from "@nestjs/common";
import { Locale } from "../../classes/locale";
import { ProductRepo } from "./projects.repo";
import axios from "axios"
import { isEmpty } from "../../helpers/isEmpty";

@Injectable()
export class ProductService {
    private readonly strapiUrl: string
    private readonly productRepo: ProductRepo
    constructor() {
        this.productRepo = new ProductRepo()
        this.strapiUrl = process.env.STRAPI_API_URL
    }
    async fetchProjects(locale: Locale=Locale.EN): Promise<Product[]> {
        const res = await axios.get<Product[]>(
                `${this.strapiUrl}/projects`,
                {params: {"_locale": locale}}
        )
        if(res.status !== HttpStatus.OK)
             throw Error("Failed projects request")
        return res.data

    }

    async fetchAndStoreProjects(locale: Locale=Locale.EN): Promise<Product[]> {
        const projects = await this.fetchProjects(locale)
        this.productRepo.addMany(projects)
        return this.productRepo.getAll()
    }

    async reFetchAndStoreProjects(locale: Locale=Locale.EN): Promise<Product[]> {
        this.productRepo.clear()
        return this.fetchAndStoreProjects(locale)
    }

    async getAllProjects(): Promise<Product[]> {
        if(isEmpty(this.productRepo.getAll()))
            return this.fetchAndStoreProjects()
        return this.productRepo.getAll()
    }

    async findBySlug(slug: string): Promise<Product | undefined> {
        return (await this.getAllProjects()).find(it => it.slug === slug)
    }
}