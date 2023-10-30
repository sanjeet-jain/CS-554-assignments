import { Link } from "react-router-dom";
function Home() {
  return (
    <div>
      <p>
        Welcome to the Metropolitan Museum of Art API Single Page Application
        using React
      </p>
      <Link className="showlink" to="/collection/page/1">
        Collections
      </Link>
    </div>
  );
}

export default Home;
