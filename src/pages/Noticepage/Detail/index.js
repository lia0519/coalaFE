import '../../../components/common/Detail/Detail.css';

const Detail = () => {
  return (
    <div className="detail-container">
      <h2 className="detail-title">Notice</h2>
      <table className="detail-table">
        <tbody>
          <tr>
            <td className="id-cell">404</td>
            <td>[Notice] June Meeting</td>
            <td>aaaa</td>
            <td>2025.04.04</td>
          </tr>
        </tbody>
      </table>
      <pre className="detail-content">
        This is a test post to check if CSS is applied correctly.
      </pre>

      <hr />
      <div className="comment-section">
        <h3>comment</h3>
        <div className="comment-input">
          <input type="text" placeholder="Type your comment" />
          <button>submit</button>
        </div>
        <div className="comment-list">
          <div className="comment-item">
            <strong>name</strong> example comment
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
