import dataProviderHasura, {
  GraphQLClient,
  type HasuraDataProviderOptions,
} from '@refinedev/hasura';

// Points at our own /api/graphql proxy (see src/app/api/graphql/route.ts),
// never at Hasura directly — HASURA_ADMIN_SECRET stays server-side there.
const client = new GraphQLClient('/api/graphql');

const hasuraProviderOptions: HasuraDataProviderOptions = {
  idType: 'Int',
  namingConvention: 'hasura-default',
};

const dataProvider = dataProviderHasura(client, hasuraProviderOptions);

export default dataProvider;
