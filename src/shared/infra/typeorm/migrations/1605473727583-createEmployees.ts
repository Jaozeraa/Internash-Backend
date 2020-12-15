import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createEmployees1605473727583 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'employees',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'user_id',
                    type: 'uuid',
                },
                {
                    name: 'project_id',
                    type: 'uuid',
                },
                {
                    name: 'payment',
                    type: 'decimal',
                },
                {
                    name: 'status',
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
                    name: 'Project',
                    referencedTableName: 'projects',
                    referencedColumnNames: ['id'],
                    columnNames: ['project_id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                },
                {
                    name: 'User',
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['user_id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('employees')
    }

}
