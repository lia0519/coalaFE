import React from 'react';
import './Board.css';
import { Link } from 'react-router-dom';

const Board = ({ posts, title, baseUrl }) => {
  return (
    <div className="board-wrapper">
      <h2 className="board-title">{title}</h2>

      <div className="board-title-bar">
        <div className="board-total">total {posts.length}</div>
      <div className="board-search">
        <input type="text" placeholder=" " />
        <button>search</button>
      </div>
    </div>

    <table className="board-table">
      <thead>
        <tr>
          <th>no.</th>
          <th>title</th>
          <th>writer</th>
          <th>date</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, idx) => (
          <tr key={idx}>
            <td>{post.no}</td>
            <td>
              <Link to={`${baseUrl}/detail/${post.no}`} className="board-link">
                {post.title}
              </Link>
            </td>
            <td>{post.writer}</td>
            <td>{post.date}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="board-footer">
      <div className="pagination-center">
        <div className="pagination">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n}>{n}</button>
          ))}
        </div>
      </div>

      <div className="write-button-wrapper">
        <Link to={`${baseUrl}/write`} className="write-button">
          글쓰기
        </Link>
      </div>
    </div>
  </div>
  );
};

export default Board;
