import { Outlet } from 'react-router-dom';
import { BackGround, Container, Navbar, Sidebar } from './components';
import { useState } from 'react';

export default function Layout() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Container>
      <Navbar setSearchTerm={setSearchTerm} />
      <div className="flex flex-1">
        <div className="sticky top-0 flex-[0_0_20%]">
          <Sidebar />
        </div>
        <div className="relative w-full flex-1">
          <BackGround />
          <div
            className="relative h-[calc(100vh-4rem)] w-full overflow-y-auto overscroll-contain p-3 antialiased"
            id="outlet-div"
          >
            <Outlet context={{ searchTerm }} />
          </div>
        </div>
      </div>
    </Container>
  );
}
