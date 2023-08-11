import {Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards} from '@nestjs/common';
import {ReportsService} from "./reports.service";
import {CreateReportDto} from "./dtos/create-report.dto";
import {CurrentUser} from "../auth/decorators/current-user.decorator";
import {User} from "../users/users.entity";
import {JwtAccessGuard} from "../auth/guards/jwt-access.guard";
import {ApproveReportDto} from "./dtos/approve-report.dto";
import {AdminGuard} from "../guards/admin.guard";
import {GetEstimateDto} from "./dtos/get-estimate.dto";

@Controller('reports')
export class ReportsController {
    constructor(
        private readonly reportsService: ReportsService
    ) {}

    @Get()
    async getEstimate(@Query() getEstimateQuery: GetEstimateDto) {
        return await this.reportsService.createEstimate(getEstimateQuery)
    }

    @Post()
    @UseGuards(JwtAccessGuard)
    async create(@Body() createReportDto: CreateReportDto, @CurrentUser() currentUser: User) {
        return await this.reportsService.createOne(createReportDto, currentUser)
    }

    @UseGuards(JwtAccessGuard)
    @UseGuards(AdminGuard)
    @Patch(':id/approve')
    async approveReport(@Body() approveDto: ApproveReportDto, @Param('id', ParseIntPipe) id: number) {
        return await this.reportsService.changeApproved(id, approveDto.approved)
    }
}
