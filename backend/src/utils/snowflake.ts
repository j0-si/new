const { Snowflake } = require('@sapphire/snowflake');

const epoch = new Date('2025-09-31T15:00:00.000Z');

export const snowflake = new Snowflake(epoch);