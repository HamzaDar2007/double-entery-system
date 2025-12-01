import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggers1700000000018 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Function to validate journal entry balance
        await queryRunner.query(`
      CREATE OR REPLACE FUNCTION validate_journal_entry_balance()
      RETURNS TRIGGER AS $$
      DECLARE
        debit_total NUMERIC(18, 2);
        credit_total NUMERIC(18, 2);
      BEGIN
        IF NEW.posted = TRUE THEN
          SELECT
            COALESCE(SUM(debit), 0),
            COALESCE(SUM(credit), 0)
          INTO debit_total, credit_total
          FROM journal_entry_lines
          WHERE journal_entry_id = NEW.id;

          IF debit_total != credit_total THEN
            RAISE EXCEPTION 'Journal entry not balanced: Debit % != Credit %',
              debit_total, credit_total;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

        // Trigger for validation
        await queryRunner.query(`
      CREATE TRIGGER trg_validate_balance
      BEFORE UPDATE ON journal_entries
      FOR EACH ROW
      WHEN (NEW.posted = TRUE AND OLD.posted = FALSE)
      EXECUTE FUNCTION validate_journal_entry_balance();
    `);

        // Function to generate voucher number
        await queryRunner.query(`
      CREATE OR REPLACE FUNCTION generate_voucher_number(
        p_company_id UUID,
        p_voucher_type_id UUID,
        p_entry_date DATE
      ) RETURNS VARCHAR AS $$
      DECLARE
        v_prefix VARCHAR;
        v_next_seq BIGINT;
        v_reset_freq VARCHAR;
        v_voucher_no VARCHAR;
      BEGIN
        SELECT prefix, next_sequence, reset_frequency
        INTO v_prefix, v_next_seq, v_reset_freq
        FROM voucher_types
        WHERE id = p_voucher_type_id AND company_id = p_company_id;

        -- Format: PREFIX-YYYY-MM-NNNN or PREFIX-YYYY-NNNN
        IF v_reset_freq = 'monthly' THEN
          v_voucher_no := v_prefix || '-' ||
            TO_CHAR(p_entry_date, 'YYYY-MM') || '-' ||
            LPAD(v_next_seq::TEXT, 4, '0');
        ELSE
          v_voucher_no := v_prefix || '-' ||
            TO_CHAR(p_entry_date, 'YYYY') || '-' ||
            LPAD(v_next_seq::TEXT, 4, '0');
        END IF;

        UPDATE voucher_types
        SET next_sequence = next_sequence + 1
        WHERE id = p_voucher_type_id;

        RETURN v_voucher_no;
      END;
      $$ LANGUAGE plpgsql;
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TRIGGER IF EXISTS trg_validate_balance ON journal_entries`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS validate_journal_entry_balance`);
        await queryRunner.query(`DROP FUNCTION IF EXISTS generate_voucher_number`);
    }
}
