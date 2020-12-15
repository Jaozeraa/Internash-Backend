import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createProjects1605206807184 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'projects',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true,
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'owner_id',
                    type: 'uuid',
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'description',
                    type: 'varchar'
                },
                {
                    name: 'image',
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
                    name: 'Owner',
                    referencedTableName: 'users',
                    referencedColumnNames: ['id'],
                    columnNames: ['owner_id'],
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('projects')
    }

}
