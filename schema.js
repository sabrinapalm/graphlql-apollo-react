const fetch = require('cross-fetch');

const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema
} = require('graphql');

const LaunchType = new GraphQLObjectType({
  name: 'Launch',
  fields: () => ({
    flight_id: { type: GraphQLString },
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType }
  })
});

const RocketType = new GraphQLObjectType({
  name: 'Rocket',
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    launches: {
      type: new GraphQLList(LaunchType),
      async resolve(parent, args) {
        try {
          const url = 'https://api.spacexdata.com/v3/launches?limit=20';
          const res = await fetch(url);
          const data = await res.json();
          return data;
        } catch {
          return [];
        }
      }
    },
    launch: {
      type: LaunchType,
      args: {
        flight_number: { type: GraphQLInt }
      },
      async resolve(parent, args) {
        const url = `https://api.spacexdata.com/v3/launches/${args.flight_number}`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
      }
    },
    rockets: {
      type: new GraphQLList(RocketType),
      async resolve(parent, args) {
        try {
          const url = 'https://api.spacexdata.com/v3/rockets';
          const res = await fetch(url);
          const data = await res.json();
          return data;
        } catch {
          return [];
        }
      }
    },
    rocket: {
      type: RocketType,
      args: {
        id: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const url = `https://api.spacexdata.com/v3/rockets/${args.id}`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
      }
    }
  }
});

module.exports = new GraphQLSchema({ query: RootQuery });
