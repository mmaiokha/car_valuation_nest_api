import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateReportDto} from "./dtos/create-report.dto";
import {Report} from "./reports.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../users/users.entity";
import {GetEstimateDto} from "./dtos/get-estimate.dto";

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepository: Repository<Report>
    ) {
    }

    createEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
        return this.reportRepository
            .createQueryBuilder()
            .select('AVG(price)', 'price')
            .where('make = :make', { make })
            .andWhere('model = :model', { model })
            .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
            .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
            .andWhere('year - :year BETWEEN -3 AND 3', { year })
            .andWhere('approved IS TRUE')
            .orderBy('ABS(mileage - :mileage)', 'DESC')
            .setParameters({ mileage })
            .limit(3)
            .getRawOne();
    }

    async createOne(createReportDto: CreateReportDto, user: User): Promise<Report> {
        const report = await this.reportRepository.create(createReportDto)
        report.user = user
        return await this.reportRepository.save(report)
    }

    async getOne(id: number): Promise<Report> {
        const report = await this.reportRepository.findOneBy({id})
        if(!report) {
            throw new HttpException('Report not found', HttpStatus.NOT_FOUND)
        }
        return report
    }

    async changeApproved(id: number, approved: boolean): Promise<Report> {
        const report = await this.getOne(id)
        report.approved = approved
        return await this.reportRepository.save(report)
    }
}
