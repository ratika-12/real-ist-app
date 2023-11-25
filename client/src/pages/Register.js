import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API } from "../config";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]= useState("");
  //hooks
const navigate= useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      const { data } = await axios.post(`/pre-register`, {
        email,
        password,
      });
      if (data?.error) {
        toast.error(data.error)
        setLoading(false)
      }else{
        setLoading(true)
        toast.success("please check your email to activate your account")
        navigate("/")
      }
      console.log(data);
    } catch (err) {
      console.log(err);
      setLoading(false)
      toast.error("Something went wrong please try again...")
    }
  };

  return (
    <div>
      <h1 className="display-3 bg-primary text-light ">Register</h1>

      <div className="container">
        <div className="row">
          <div className="col-md-4 offset-md-4 mt-5">
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your email"
                className="form-control mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                required
                autoFocus
              />

              <input
                type="password"
                placeholder="Enter your password"
                className="form-control mb-4"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

<button className="btn btn-primary col-12 mb-4" disabled={loading}>
  {loading ? "Waiting..." : "Register"}
</button>
            </form>

            {/* <a className="text-danger pointer">Forgot Password</a> */}
          </div>
        </div>
      </div>
    </div>
  );
}