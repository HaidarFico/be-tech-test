import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigration1741544225984 implements MigrationInterface {
    name = 'NewMigration1741544225984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`link\` (\`id\` varchar(36) NOT NULL, \`longUrl\` varchar(255) NOT NULL, \`shortUrl\` varchar(255) NOT NULL, \`urlCode\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`expiredAt\` datetime NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`link\``);
    }

}
