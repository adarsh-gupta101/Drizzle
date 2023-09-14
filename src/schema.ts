import {
  integer,
  pgEnum,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { InferModel, relations } from "drizzle-orm";

// declaring enum in database
export const popularityEnum = pgEnum("popularity", [
  "unknown",
  "known",
  "popular",
]);

export const countries = pgTable(
  "countries",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
  },
  (countries) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(countries.name),
    };
  }
);

export const countriesRelations = relations(countries, ({ many }) => ({
  cities: many(cities),
}));

export const cities = pgTable("cities", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
  countryId: integer("country_id")
    .references(() => countries.id)
    .notNull(),
  popularity: popularityEnum("popularity"),
});

export const citiesRelations = relations(cities, ({ one }) => ({
  country: one(countries, {
    fields: [cities.countryId],
    references: [countries.id],
  }),
}));

// new relation state
export const states = pgTable(
  "states",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    countryId: integer("country_id")
      .references(() => countries.id)
      .notNull(),
  },
);

export const statesRelations = relations(states, ({ one }) => ({
  country: one(countries, {
    fields: [states.countryId],
    references: [countries.id],
  }),
}));

// new user
export const users = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    email: varchar("email", { length: 256 }),
    password: varchar("password", { length: 256 }),
    countryId: integer("country_id")
      .references(() => countries.id)
      .notNull(),
    stateId: integer("state_id")
      .references(() => states.id)
      .notNull(),
    cityId: integer("city_id")
      .references(() => cities.id)
      .notNull(),
  },
);

export const usersRelations = relations(users, ({ one }) => ({
  country: one(countries, {
    fields: [users.countryId],
    references: [countries.id],
  }),
  state: one(states, {
    fields: [users.stateId],
    references: [states.id],
  }),
  city: one(cities, {
    fields: [users.cityId],
    references: [cities.id],
  }),
}));


export type City = InferModel<typeof cities>;
export type Country = InferModel<typeof countries>;
export type State = InferModel<typeof states>;
