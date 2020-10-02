import React from 'react';
import './App.css';
import { useQuery, gql } from '@apollo/client';

const EXCHANGE_RATES = gql`
  query jsRepos {
    search(query: "created:>2020-09-02 language:JavaScript sort:stars-desc", type: REPOSITORY, first: 10) {
      repositoryCount
      nodes {
        ... on Repository {
          id
          name
          owner {
            avatarUrl
          }
          description
          stargazerCount
          url
        }
      }
    }
  }
`;

const App: React.FC = () => {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.search.nodes.map(({ id, name }: { id: string; name: string }) => (
    <div key={id}>
      <p>{name}</p>
    </div>
  ));
};

export default App;
