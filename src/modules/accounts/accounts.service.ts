import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { AccountLevel } from 'src/common/enums/account-level.enum';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ) { }

    async create(
        companyId: string,
        createAccountDto: CreateAccountDto,
    ): Promise<Account> {
        const { code, parentId, level, isPosting } = createAccountDto;

        // Check code uniqueness
        const existingAccount = await this.accountRepository.findOne({
            where: { companyId, code },
        });
        if (existingAccount) {
            throw new BadRequestException('Account code already exists');
        }

        // Validate hierarchy
        if (level === AccountLevel.LEVEL_1) {
            if (parentId) {
                throw new BadRequestException('Level 1 account cannot have a parent');
            }
        } else {
            if (!parentId) {
                throw new BadRequestException(
                    `Level ${level} account must have a parent`,
                );
            }
            const parent = await this.findOne(parentId, companyId);

            // Validate parent level
            const expectedParentLevel = (parseInt(level) - 1).toString();
            if (parent.level !== expectedParentLevel) {
                throw new BadRequestException(
                    `Parent of Level ${level} account must be Level ${expectedParentLevel}`,
                );
            }

            // Parent must not be posting
            if (parent.isPosting) {
                throw new BadRequestException(
                    'Parent account cannot be a posting account',
                );
            }
        }

        // Validate posting
        if (isPosting && level !== AccountLevel.LEVEL_4) {
            throw new BadRequestException(
                'Only Level 4 accounts can be posting accounts',
            );
        }

        if (level === AccountLevel.LEVEL_4 && !isPosting) {
            throw new BadRequestException(
                'Level 4 accounts must be posting accounts',
            );
        }

        const account = this.accountRepository.create({
            ...createAccountDto,
            companyId,
        });

        return this.accountRepository.save(account);
    }

    async findAll(companyId: string): Promise<Account[]> {
        // Return empty array if no company is assigned
        if (!companyId) {
            return [];
        }

        return this.accountRepository.find({
            where: { companyId },
            order: { code: 'ASC' },
        });
    }

    async findOne(id: string, companyId: string): Promise<Account> {
        const account = await this.accountRepository.findOne({
            where: { id, companyId },
            relations: ['parent', 'children'],
        });
        if (!account) {
            throw new NotFoundException(`Account with ID ${id} not found`);
        }
        return account;
    }
}
