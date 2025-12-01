import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';
import { validate } from 'uuid';

@Injectable()
export class ParseUUIDPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string {
        if (!validate(value)) {
            throw new BadRequestException(
                `Validation failed: "${value}" is not a valid UUID`,
            );
        }
        return value;
    }
}
