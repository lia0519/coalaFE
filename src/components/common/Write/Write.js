import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Write.css';

const Write = () => {
    const navigate = useNavigate();

  const [form, setForm] = useState({
    noticeId: '',
    title: '',
    author: '',
    date: '',
    content: ''
  });

  // 오늘 날짜 자동 설정
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setForm((prev) => ({ ...prev, date: today }));
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 제출 이벤트
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📄 작성된 글:', form);
    alert('글이 작성되었습니다!');
  };

  return (
    <div className="write-container">
      <h2 className="write-title">📝 COALA 글쓰기</h2>
      <form className="write-form" onSubmit={handleSubmit}>
        <label>글 번호</label>
        <input type="number" name="noticeId" value={form.noticeId} onChange={handleChange} required />

        <label>제목</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} required />

        <label>작성자</label>
        <input type="text" name="author" value={form.author} onChange={handleChange} required />

        <label>작성일</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />

        <label>내용</label>
        <textarea name="content" rows={10} value={form.content} onChange={handleChange} required />

        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
};

export default Write;
