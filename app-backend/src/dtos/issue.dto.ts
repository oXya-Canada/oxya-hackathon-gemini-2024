import { IsString } from 'class-validator';

export class CreateIssueDto {
  @IsString()
  public title: string;

  @IsString()
  public body: string;

  @IsString()
  public label: string;
}
