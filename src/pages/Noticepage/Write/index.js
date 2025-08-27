import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // 오늘 날짜 및 자동 번호 설정
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];

    // LocalStorage에서 저장된 글 가져오기
    const storedPosts = JSON.parse(localStorage.getItem('notices')) || [];
    const nextId = storedPosts.length > 0 
      ? Math.max(...storedPosts.map(post => post.noticeId)) + 1 
      : 1;

    setForm(prev => ({
      ...prev,
      date: today,
      noticeId: nextId
    }));
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // 제출 시 저장 + 알림
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('📄 작성된 글:', form);

    // 기존 글 저장
    const storedPosts = JSON.parse(localStorage.getItem('notices')) || [];
    const updatedPosts = [...storedPosts, form];
    localStorage.setItem('notices', JSON.stringify(updatedPosts));

    
    alert('글이 성공적으로 작성되었습니다!');
    navigate('/notice')
  };

  return (
    <div className="write-container">
      <h2 className="write-title">NOTICE 작성하기</h2>
      <form className="write-form" onSubmit={handleSubmit}>
        <div className="meta-block">
          <span className="meta-text">NO. {form.noticeId}</span><br />
          <span className="meta-text">DATE&nbsp;:&nbsp;{form.date}</span>
        </div>

        <label htmlFor="title">TITLE</label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <label htmlFor="author">WRITER</label>
        <input
          type="text"
          id="author"
          name="author"
          value={form.author}
          onChange={handleChange}
          required
        />

        <label htmlFor="content">CONTENT</label>
        <textarea
          id="content"
          name="content"
          rows={10}
          value={form.content}
          onChange={handleChange}
          required
        />

        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
};

export default Write;
