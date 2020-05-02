exports.up = (knex) => {
  return knex.schema.table('passengers', (table) => {
    table
      .string('waypoint')
      .notNullable()
      .defaultTo('');
  });
};

exports.down = (knex) => {
  return knex.schema.table('passengers', (table) => {
    table.dropColumn('waypoint');
  });
};
