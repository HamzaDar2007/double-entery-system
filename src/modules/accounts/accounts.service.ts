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
import { AccountBalanceRollupService } from './services/account-balance-rollup.service';

@Injectable()
export class AccountsService {
    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        private rollupService: AccountBalanceRollupService,
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

    /**
     * Get account hierarchy for Chart of Accounts display (L1 → L2 → L3 → L4)
     */
    async getHierarchy(companyId: string): Promise<Account[]> {
        if (!companyId) {
            return [];
        }
        return this.rollupService.getAccountHierarchy(companyId);
    }

    /**
     * Get only posting accounts (L4 accounts)
     */
    async getPostingAccounts(companyId: string): Promise<Account[]> {
        if (!companyId) {
            return [];
        }
        return this.rollupService.getPostingAccounts(companyId);
    }

    /**
     * Update account balance and rollup to parents (L4 → L3 → L2 → L1)
     * Called after a transaction is posted
     */
    async updateAccountBalance(accountId: string, amount: number, type: 'debit' | 'credit'): Promise<void> {
        const account = await this.accountRepository.findOne({
            where: { id: accountId },
        });

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        // Validate that this is a posting account
        const isAllowed = await this.rollupService.validatePostingAccount(accountId);
        if (!isAllowed) {
            throw new BadRequestException('Transactions can only be posted to Level 4 accounts');
        }

        // Update the account balance
        const currentBalance = Number(account.currentBalance || 0);
        const newBalance = type === 'debit'
            ? currentBalance + amount
            : currentBalance - amount;

        await this.accountRepository.update(accountId, {
            currentBalance: newBalance,
        });

        // Rollup to parent accounts
        await this.rollupService.rollupAccountPath(accountId);
    }

    /**
     * Rollup all balances for a company (useful for periodic reconciliation)
     */
    async rollupAllBalances(companyId: string): Promise<void> {
        await this.rollupService.rollupBalances(companyId);
    }

    /**
     * Get account with calculated balance including rollup
     */
    async getAccountWithBalance(accountId: string): Promise<{ account: Account; calculatedBalance: number }> {
        const account = await this.accountRepository.findOne({
            where: { id: accountId },
        });

        if (!account) {
            throw new NotFoundException('Account not found');
        }

        const calculatedBalance = await this.rollupService.getAccountBalanceWithRollup(accountId);

        return { account, calculatedBalance };
    }
}
