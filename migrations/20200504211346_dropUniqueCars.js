exports.up = (knex) => {
  return knex.schema.table('cars', (table) => {
    table.dropUnique(['model', 'license']);
  });
};

exports.down = (knex) => {
  return knex.schema.table('cars', (table) => {
    table.unique(['model', 'license']);
  });
};
