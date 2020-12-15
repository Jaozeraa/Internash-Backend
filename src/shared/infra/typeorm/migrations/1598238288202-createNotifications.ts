import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createNotifications1598238288202 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'notifications',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'description',
                    type: 'varchar',
                },
                {
                    name: 'recipient_id',
                    type: 'uuid'
                },
                {
                    name: 'read',
                    type: 'boolean',
                    default: false
                },
                {
                    name: 'image_url',
                    type: 'varchar'
                },
                {
                    name: 'title',
                    type: 'varchar'
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'now()'
                },
            ],
            foreignKeys: [
                {
                    name: 'Recipient',
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['recipient_id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('notifications')
    }

}
