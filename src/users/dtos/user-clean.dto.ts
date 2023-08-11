import {Expose} from "class-transformer";

export class UserCleanDto {
    @Expose()
    id: number

    @Expose()
    email: string
}