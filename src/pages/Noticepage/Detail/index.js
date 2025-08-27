import './Detail.css';

const Detail = () => {
  return (
    <div className="detail-container">
      <h2 className="detail-title">Notice</h2>

      <table className="detail-table">
        <tbody>
          <tr>
            <td className="id-cell">404</td>
            <td>[Notice] June Club Meeting & Summer Project Kickoff</td>
            <td>aaaa</td>
            <td>2025.04.04</td>
          </tr>
        </tbody>
      </table>

      {/* ✅ 글 본문 */}
      <pre className="detail-content">
{`
[Notice] June Club Meeting & Summer Project Kickoff

Dear Members,
We hope you are all doing well. Our next official club meeting will take place on Monday, June 3rd
at 5:00 PM in Room 204. This meeting will be especially important, as we will be launching our
summer project and setting clear goals for the upcoming months.

During the session, we will introduce the project theme, explain the timeline, and divide into
smaller teams based on your interests and skills. If you have any ideas or suggestions, feel free to
prepare a short presentation or bring them up during the discussion.

Attendance is strongly encouraged, as this meeting will help set the direction for our club’s
activities over the summer. Please arrive on time and come prepared to participate actively.

Thank you, and we look forward to seeing you all there!

Best regards,
The Club Executive Team
`}
      </pre>

      {/* ✅ 댓글 */}
      <hr />
      <div className="comment-section">
        <h3>comment</h3>
        <div className="comment-input">
          <input type="text" placeholder="Type your comment" />
          <button>submit</button>
        </div>
        <div className="comment-list">
          <div className="comment-item">
            <strong>name</strong> example comment example comment example comment
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;
