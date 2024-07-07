import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { userLoginThunk } from "../redux/slices/userSlice";
import toast, { Toaster } from 'react-hot-toast';

function SignIn() {
  let dispatch = useDispatch();
  let { loginUserStatus, currentUser, errorOccured, errMsg } = useSelector(
    (state) => state.userLoginReducer
  );
  const { register, handleSubmit,formState: { errors } } = useForm();
  let navigate = useNavigate();

  async function signin(data) {    
    dispatch(userLoginThunk(data));
  }

  function validate(){
    if (errors.username) {
      toast.error("Username must be between 7 to 20 characters");
      console.log(errMsg,"  ",errorOccured);
    }
    if (errors.password) {
      toast.error("Password must be between 7 to 15 characters");
    }
    return;
  }

  useEffect(() => {
    if (loginUserStatus === true) {
      navigate(`/${currentUser.userType}-profile`);
    }
  }, [loginUserStatus, currentUser.userType, navigate]);

  
  return (
    <div className="bg-gray-300 py-16">
      <div><Toaster/></div>
      <div className="m-auto  w-80 lg:w-1/3  rounded-lg shadow-2xl px-2 py-4 bg-white ">
        <form onSubmit={handleSubmit(signin)} className="px-5 py-2">
          <h1 className="mb-3 text-3xl font-bold font-mono text-center">
            Sign-In
          </h1>

          <div className="flex flex-col gap-5 my-5">
            <input
              className="border-black border-2 rounded-md px-2 py-1 text-center text-lg"
              type="text"
              placeholder="Username"
              {...register("username", { required: true, minLength: 7, maxLength: 20 })}
            />

            <input
              className="border-black border-2 rounded-md px-2 py-1 text-center text-lg"
              type="password"
              placeholder="Password"
              {...register("password", { required: true, minLength: 7, maxLength: 15 })}
            />
          </div>

          <button
            type="submit" onClick={validate}
            className="block mx-auto mt-4 w-32 h-10 border-2 border-gray-800 rounded-full transition-all duration-300 cursor-pointer bg-slate-300 text-lg font-semibold font-montserrat hover:bg-gray-800 hover:text-white hover:text-xl"
          >
            Sign-In
          </button>
        </form>
        
          <p className=" text-right pe-5">
            New User? <Link className="text-blue-500 hover:underline" to="/signup">{" "}Sign-Up here</Link>
          </p>
        
      </div>
    </div>
  );
}

export default SignIn;