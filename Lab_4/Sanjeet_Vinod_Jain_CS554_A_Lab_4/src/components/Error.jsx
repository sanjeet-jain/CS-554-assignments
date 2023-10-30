import { useParams } from "react-router-dom";

function Home() {
  const { status } = useParams();
  console.log(status);
  return (
    <div>
      <p>
        {(status == 404 || !status) && "404 Not Found "}
        {status == 400 && "400 Bad Input "}
      </p>
    </div>
  );
}

export default Home;
