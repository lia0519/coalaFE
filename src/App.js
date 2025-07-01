import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FreePage from './pages/FreeBoard';
import FreeDetail from './pages/FreeBoard/Detail';
import NavBar from './components/common/NavBar/NavBar';
import PromoBanner from './components/common/PromoBanner/PromoBanner';
import NoticePage from './pages/Noticepage';
import NoticeDetail from './pages/Noticepage/Detail';
import EventPage from './pages/Eventpage';
import EventDetail from './pages/Eventpage/Detail';

const banners = [
  { text: '2025 여름 해커톤 모집 중!', link: '/event' },
  { text: '코알라 부원 모집 중!', link: '/recruit' },
  { text: '자유게시판 글쓰기 이벤트 진행 중', link: '/board' },
];

function App() {
  return (
    <Router>
      <NavBar />
      <PromoBanner items={banners} />
      <div style={{ paddingTop: '60px' }}>
        <Routes>
          <Route path="/board" element={<FreePage />} />
          <Route path="/board/detail/:id" element={<FreeDetail />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/notice/detail/:id" element={<NoticeDetail />} />
          <Route path="/event" element={<EventPage />} />
          <Route path="/event/detail/:id" element={<EventDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;