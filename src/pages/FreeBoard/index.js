import React from 'react';
import Board from '../../components/common/Board/Board';

const posts = Array.from({ length: 9 }).map((_, i) => ({
  no: 404,
  title: 'sample1',
  writer: 'aaa',
  date: '05.04',
}));

const FreePage = () => {
  return <Board posts={posts} title="Board" baseUrl="/free" />;
};

export default FreePage;
