import {Product} from './product.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Locale } from '../../classes/locale';
import axios from 'axios';

@Injectable()
export class ProductService {
    private readonly strapiUrl: string;
    constructor() {
        this.strapiUrl = process.env.STRAPI_API_URL;
    }
    async fetchProjects(locale: Locale=Locale.EN): Promise<Product[]> {
        const res = await axios.get<Product[]>(
            `${this.strapiUrl}/projects`,
            {params: {'_locale': locale}}
        );
        if(res.status !== HttpStatus.OK)
            throw Error('Failed projects request');
        return res.data;

    }
}