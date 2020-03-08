exports.up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table
      .string('fullname', 255)
      .notNullable()
      .defaultTo('');
    table
      .string('email', 255)
      .notNullable()
      .defaultTo('');
    table
      .string('password', 255)
      .notNullable()
      .defaultTo('');
    table
      .decimal('homeLatitude', 6, 4)
      .notNullable()
      .defaultTo(0);
    table
      .decimal('homeLongitude', 7, 4)
      .notNullable()
      .defaultTo(0);
    table
      .decimal('workLatitude', 6, 4)
      .notNullable()
      .defaultTo(0);
    table
      .decimal('workLongitude', 7, 4)
      .notNullable()
      .defaultTo(0);
    table.timestamps(true, true);
    table.unique(['fullname']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('users');
};

exports.config = { transaction: false };
