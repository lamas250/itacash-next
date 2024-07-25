

export default function Sidebar() {
  return (
    <aside className="flex flex-col items-center justify-between w-64 bg-gray-800 text-white p-4">
      <nav>
        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/dashboard/settings">Settings</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}