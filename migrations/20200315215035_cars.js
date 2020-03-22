exports.up = (knex) => {
  return knex.schema.createTable('cars', (table) => {
    table.increments('id').primary();
    table
      .string('model', 100)
      .notNullable()
      .defaultTo('');
    table
      .string('license', 100)
      .notNullable()
      .defaultTo('');
    table
      .bigInteger('userId')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable(0);
    table.timestamps(true, true);
    table.unique(['model', 'license']);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('cars');
};
