import React from 'react';
import './App.css';
import { useQuery, gql } from '@apollo/client';

type Repository = {
  id: string;
  description: string;
  stargazerCount: number;
  url: string;
  nameWithOwner: string;
  licenseInfo?: {
    name: string;
  };
};

type SearchResult = {
  search: {
    repositoryCount: number;
    nodes: Repository[];
  };
};

const GET_REPOITORIES = gql`
  query GetRepositories($query: String!) {
    search(query: $query, type: REPOSITORY, first: 10) {
      repositoryCount
      nodes {
        ... on Repository {
          id
          description
          stargazerCount
          url
          nameWithOwner
          licenseInfo {
            name
          }
        }
      }
    }
  }
`;

const monthAgoDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const monthAgoISOString = monthAgoDate.toISOString().split('T')[0]; // Hate native date

const App: React.FC = () => {
  const { loading, error, data } = useQuery<SearchResult>(GET_REPOITORIES, {
    variables: { query: `created:>${monthAgoISOString} language:JavaScript sort:stars-desc` },
  });

  if (loading) return <div className="App">Loading...</div>;
  if (error) return <div className="App">Error :(</div>;

  return (
    <div className="App">
      <div className="Total">{data?.search.repositoryCount || 0} repository results</div>

      {data?.search.nodes.map(({ id, nameWithOwner, url, description, stargazerCount, licenseInfo }) => (
        <div className="Repository" key={id}>
          <a href={url}>{nameWithOwner}</a>
          <p>{description}</p>
          <div className="info">
            <span>☆ {stargazerCount}</span>
            <span>{licenseInfo && licenseInfo.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
