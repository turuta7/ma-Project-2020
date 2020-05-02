exports.up = (knex) => {
  return knex.schema.table('passengers', (table) => {
    table.dropColumn('waypoint');
  });
};

exports.down = (knex) => {
  return knex.schema.table('passengers', (table) => {
    table
      .decimal('waypoint', 7, 4)
      .notNullable()
      .defaultTo(0);
  });
};
