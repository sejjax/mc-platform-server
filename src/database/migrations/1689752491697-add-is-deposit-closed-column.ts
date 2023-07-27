import {MigrationInterface, QueryRunner} from 'typeorm';

export class addIsDepositClosedColumn1689752491697 implements MigrationInterface {
    name = 'addIsDepositClosedColumn1689752491697';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            create function is_deposit_closed(d deposit)
                returns bool as
                $$
                begin
                    return now() > d."date" + interval '1 week' * d."ip_wks"::int;
                end
                $$
                language plpgsql;
            
            create function update_deposit_is_closed()
                returns trigger as
                $$
                begin
                    new."isClosed" := is_deposit_closed(new);
                    return new;
                end
                $$
                language plpgsql;
            
            alter table deposit add column "isClosed" boolean not null default true;
            update deposit d set "isClosed"=is_deposit_closed(d);
            create trigger update_deposit_is_closed
                before insert or update of "date", "ip_wks"
                on deposit
            for each row
            execute function update_deposit_is_closed();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            alter table deposit drop column "isClosed";
            drop trigger update_deposit_is_closed on deposit;
            drop function update_deposit_is_closed;
            drop function is_deposit_closed;
        `);
    }

}
