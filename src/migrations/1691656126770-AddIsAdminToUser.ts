import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsAdminToUser1691656126770 implements MigrationInterface {
    name = 'AddIsAdminToUser1691656126770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "isAdmin" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isAdmin"`);
    }

}
