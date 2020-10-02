import React, { useState, useCallback } from 'react';
import './App.css';
import { useQuery, gql } from '@apollo/client';

import Filter from './Filter';

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

type QueryParams = {
  fromDate: string;
  name?: string;
  license?: string;
};

const GET_REPOITORIES = gql`
  query GetRepositories($query: String!, $count: Int = 10) {
    search(query: $query, type: REPOSITORY, first: $count) {
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

// Right now exactly 30 days, change it if you need calendar month
const monthAgoDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
const fromDate = monthAgoDate.toISOString().split('T')[0]; // Hate native Date

function getQuery({ fromDate, name, license }: QueryParams): string {
  let query = `created:>${fromDate} language:JavaScript sort:stars-desc`;

  if (name) query += ` ${name} in:name`;
  if (license) query += ` license:${license}`;

  return query;
}

const App: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [license, setLicense] = useState<string>('');
  const { loading, error, data } = useQuery<SearchResult>(GET_REPOITORIES, {
    variables: { query: getQuery({ fromDate, name, license }), count: 100 },
  });

  const handleSubmit = useCallback((name, license) => {
    setName(name);
    setLicense(license);
  }, []);

  if (loading) return <div className="App">Loading...</div>;
  if (error) return <div className="App">Error :(</div>;

  return (
    <div className="App">
      <div className="Total">{data?.search.repositoryCount || 0} repository results</div>
      <Filter name={name} license={license} onSubmit={handleSubmit} />

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
