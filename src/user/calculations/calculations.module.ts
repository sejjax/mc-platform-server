import { Module } from '@nestjs/common';
import { CalculationsService } from "./calculations.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Calculation } from "./entities/calculation.entity";
import { ProductService } from "../product/product.service";
import { ProductModule } from "../product/product.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Calculation]),
        ProductModule
    ],
    providers: [CalculationsService, ProductService],
    exports: [CalculationsService]
})
export class CalculationsModule {}
