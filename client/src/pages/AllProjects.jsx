import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosWithToken } from "../axioswithtoken/axiosWithToken";

function AllProjects() {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  async function getProjects() {
    const dbRes = await axiosWithToken.get("http://localhost:4000/projects");
    setProjects(dbRes.data.payload);
  }

  useEffect(() => {
    getProjects();
  }, []);

  const handleProjectClick = (project) => {
    navigate("/project-board", { state: project });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-300 h-96">
      {projects.map((proj, index) => (
        <div
          key={index}
          className="border h-52 w-64 text-center rounded-lg shadow-lg cursor-pointer transition transform hover:scale-105 block max-w-sm p-6 bg-gray-800 border-gray-700 hover:bg-gray-700"
          onClick={() => handleProjectClick(proj._id)}
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
            {proj.name}
          </h5>
          <p className="font-normal text-gray-400">{proj.description}</p>
          <p className="font-normal text-gray-400"><span className="text-white">Status : </span>{proj.status}</p>
        </div>
      ))}
    </div>
  );
}

export default AllProjects;
