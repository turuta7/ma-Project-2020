exports.up = (knex) => {
  return knex.schema
    .createTable('trips', (table) => {
      table.increments('id').primary();
      table
        .timestamp('departureTime')
        .notNullable()
        .defaultTo(knex.fn.now(6));
      table
        .bigInteger('driverId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
        .defaultTo(0);
      table
        .decimal('startLatitude', 6, 4)
        .notNullable()
        .defaultTo(0);
      table
        .decimal('startLongitude', 7, 4)
        .notNullable()
        .defaultTo(0);
      table
        .integer('seatsTotal')
        .notNullable()
        .defaultTo(0);
      table
        .bigInteger('carId')
        .references('id')
        .inTable('cars')
        .onDelete('CASCADE')
        .notNullable()
        .defaultTo(0);
      table
        .text('route')
        .notNullable()
        .defaultTo('');
    })
    .createTable('passengers', (table) => {
      table.increments('id').primary();
      table
        .bigInteger('tripId')
        .references('id')
        .inTable('trips')
        .onDelete('CASCADE')
        .notNullable()
        .defaultTo(0);
      table
        .bigInteger('passengerId')
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
        .notNullable()
        .defaultTo(0);
      table
        .decimal('waypoint', 7, 4)
        .notNullable()
        .defaultTo(0);
    });
};

exports.down = (knex) => {
  return knex.schema.dropTable('passengers').dropTable('trips');
};
