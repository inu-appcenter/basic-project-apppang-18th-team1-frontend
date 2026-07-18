import { Outlet } from 'react-router-dom';
import NavigationBar from '@/components/NavigationBar';

function CommonLayoutNoNavigationBar() {
  return (
    <div className="flex min-h-screen justify-center">
      <div className="flex h-screen w-full max-w-120 flex-col bg-white">
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CommonLayoutNoNavigationBar;
