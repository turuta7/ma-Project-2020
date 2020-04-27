exports.up = (knex) => {
  return knex.schema.table('users', (table) => {
    table
      .string('homeAddress')
      .notNullable()
      .defaultTo('');
    table
      .string('workAddress')
      .notNullable()
      .defaultTo('');
  });
};

exports.down = (knex) => {
  return knex.schema.table('users', (table) => {
    table.dropColumn('homeAddress');
    table.dropColumn('workAddress');
  });
};
