import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateCustomerDto {
    @IsString()
    ci: string;

    @IsOptional()
    @IsString()
    fullName?: string;

}
