import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <a href="https://meilisearch.com" target="_blank">
          <img src={`/meili-logo.svg`} className={'logo h-20 p-3'} alt="Meili logo" />
        </a>
      </div>
      <h1 className={`text-brand-2`}>Dashboard</h1>
    </div>
  );
}

export default Dashboard;
