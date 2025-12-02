import { DataSource } from 'typeorm';

export async function seedVoucherTypes(
    dataSource: DataSource,
    companyId: string,
): Promise<void> {
    const voucherTypes = [
        {
            code: 'PV',
            name: 'Payment Voucher',
            nature: 'payment',
            prefix: 'PV',
            auto_numbering: true,
            next_sequence: 1,
            reset_frequency: 'yearly',
            requires_approval: true,
            is_active: true,
        },
        {
            code: 'RV',
            name: 'Receipt Voucher',
            nature: 'receipt',
            prefix: 'RV',
            auto_numbering: true,
            next_sequence: 1,
            reset_frequency: 'yearly',
            requires_approval: true,
            is_active: true,
        },
        {
            code: 'JV',
            name: 'Journal Voucher',
            nature: 'journal',
            prefix: 'JV',
            auto_numbering: true,
            next_sequence: 1,
            reset_frequency: 'yearly',
            requires_approval: true,
            is_active: true,
        },
        {
            code: 'CV',
            name: 'Contra Voucher',
            nature: 'contra',
            prefix: 'CV',
            auto_numbering: true,
            next_sequence: 1,
            reset_frequency: 'yearly',
            requires_approval: false,
            is_active: true,
        },
        {
            code: 'SV',
            name: 'Sales Voucher',
            nature: 'sales',
            prefix: 'SV',
            auto_numbering: true,
            next_sequence: 1,
            reset_frequency: 'monthly',
            requires_approval: false,
            is_active: true,
        },
        {
            code: 'PUR',
            name: 'Purchase Voucher',
            nature: 'purchase',
            prefix: 'PUR',
            auto_numbering: true,
            next_sequence: 1,
            reset_frequency: 'monthly',
            requires_approval: false,
            is_active: true,
        },
    ];

    let created = 0;
    let skipped = 0;

    for (const vt of voucherTypes) {
        // Check if exists using raw query
        const existing = await dataSource.query(
            `SELECT id FROM voucher_types WHERE company_id = $1 AND code = $2 AND deleted_at IS NULL LIMIT 1`,
            [companyId, vt.code],
        );

        if (existing.length > 0) {
            skipped++;
            continue;
        }

        // Insert using raw query
        await dataSource.query(
            `INSERT INTO voucher_types (
        id, company_id, code, name, nature, auto_numbering, prefix, 
        next_sequence, reset_frequency, requires_approval, is_active, created_at
      ) VALUES (
        gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW()
      )`,
            [
                companyId,
                vt.code,
                vt.name,
                vt.nature,
                vt.auto_numbering,
                vt.prefix,
                vt.next_sequence,
                vt.reset_frequency,
                vt.requires_approval,
                vt.is_active,
            ],
        );
        created++;
    }

    console.log(`  ✅ Created ${created} voucher types, skipped ${skipped} existing`);
}
