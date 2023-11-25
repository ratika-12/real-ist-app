import { useState, useEffect } from "react";
import axios from "axios";
import UserCard from "../component/cards/UserCard";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data } = await axios.get("/agents");
      setAgents(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ marginTop: "-7%" }}
      >
        <div className="display-1">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="display-1 bg-primary text-light p-2">Agents</h2>
      <div className="container">
        <div className="row">
          {agents?.map((user) => (
            <UserCard user={user} key={user._id} />
          ))}
        </div>
      </div>
    </div>
  );
}
