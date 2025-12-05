import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { AccountLevel } from '../../../common/enums/account-level.enum';

@Injectable()
export class AccountBalanceRollupService {
    private readonly logger = new Logger(AccountBalanceRollupService.name);

    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
    ) { }

    /**
     * Calculate and update rolled-up balances for all accounts in a company
     * Bottom-up approach: L4 → L3 → L2 → L1
     */
    async rollupBalances(companyId: string): Promise<void> {
        this.logger.log(`Starting balance rollup for company ${companyId}`);

        // Process from L4 to L1 (bottom-up)
        await this.rollupLevel(companyId, AccountLevel.LEVEL_4);
        await this.rollupLevel(companyId, AccountLevel.LEVEL_3);
        await this.rollupLevel(companyId, AccountLevel.LEVEL_2);
        await this.rollupLevel(companyId, AccountLevel.LEVEL_1);

        this.logger.log(`Balance rollup completed for company ${companyId}`);
    }

    /**
     * Rollup balances for a specific account level
     */
    private async rollupLevel(companyId: string, level: AccountLevel): Promise<void> {
        const accounts = await this.accountRepository.find({
            where: { companyId, level },
            relations: ['children'],
        });

        for (const account of accounts) {
            await this.updateAccountBalance(account);
        }
    }

    /**
     * Update an account's balance by summing its children's balances
     * For L4 accounts, balance comes from transactions (already set)
     * For L1-L3, balance is sum of children
     */
    private async updateAccountBalance(account: Account): Promise<void> {
        // L4 (leaf) accounts get their balance from transactions - skip rollup
        if (account.level === AccountLevel.LEVEL_4) {
            return;
        }

        // For parent accounts (L1-L3), sum children balances
        const children = await this.accountRepository.find({
            where: { parentId: account.id },
        });

        const balance = children.reduce(
            (sum, child) => sum + Number(child.currentBalance || 0),
            0,
        );

        // Update the account balance
        await this.accountRepository.update(account.id, {
            currentBalance: balance,
        });

        this.logger.debug(
            `Updated ${account.code} ${account.name}: ${balance}`,
        );
    }

    /**
     * Rollup balances for a specific account and its ancestors
     * Used when a transaction is posted to an L4 account
     */
    async rollupAccountPath(accountId: string): Promise<void> {
        const account = await this.accountRepository.findOne({
            where: { id: accountId },
            relations: ['parent'],
        });

        if (!account) {
            return;
        }

        // Rollup current account's parent
        if (account.parent) {
            await this.updateAccountBalance(account.parent);

            // Recursively rollup grandparent
            await this.rollupAccountPath(account.parent.id);
        }
    }

    /**
     * Get the full account hierarchy for a company
     */
    async getAccountHierarchy(companyId: string): Promise<Account[]> {
        // Get all L1 accounts (top level)
        const l1Accounts = await this.accountRepository.find({
            where: {
                companyId,
                level: AccountLevel.LEVEL_1
            },
            order: { code: 'ASC' },
        });

        // Recursively load children for each L1 account
        const hierarchy = await Promise.all(
            l1Accounts.map(account => this.loadAccountWithChildren(account)),
        );

        return hierarchy;
    }

    /**
     * Recursively load an account with all its children
     */
    private async loadAccountWithChildren(account: Account): Promise<Account> {
        const children = await this.accountRepository.find({
            where: { parentId: account.id },
            order: { code: 'ASC' },
        });

        account.children = await Promise.all(
            children.map(child => this.loadAccountWithChildren(child)),
        );

        return account;
    }

    /**
     * Validate that only L4 (leaf) accounts can have transactions
     */
    async validatePostingAccount(accountId: string): Promise<boolean> {
        const account = await this.accountRepository.findOne({
            where: { id: accountId },
        });

        if (!account) {
            return false;
        }

        // Only L4 accounts with isPosting=true can have transactions
        return account.level === AccountLevel.LEVEL_4 && account.isPosting;
    }

    /**
     * Get all posting accounts (L4 accounts that can have transactions)
     */
    async getPostingAccounts(companyId: string): Promise<Account[]> {
        return this.accountRepository.find({
            where: {
                companyId,
                level: AccountLevel.LEVEL_4,
                isPosting: true,
                isActive: true,
            },
            order: { code: 'ASC' },
        });
    }

    /**
     * Get account balance with rollup calculation
     */
    async getAccountBalanceWithRollup(accountId: string): Promise<number> {
        const account = await this.accountRepository.findOne({
            where: { id: accountId },
        });

        if (!account) {
            return 0;
        }

        // If L4 account, return its balance directly
        if (account.level === AccountLevel.LEVEL_4) {
            return Number(account.currentBalance || 0);
        }

        // For parent accounts, sum children balances
        const children = await this.accountRepository.find({
            where: { parentId: accountId },
        });

        return children.reduce(
            (sum, child) => sum + Number(child.currentBalance || 0),
            0,
        );
    }
}
