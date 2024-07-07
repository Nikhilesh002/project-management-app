import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import { axiosWithToken } from "../axioswithtoken/axiosWithToken";
import { useNavigate } from "react-router-dom";

function CreateProject() {
  const [users, setUsers] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectDesc, setProjectDesc] = useState("");
  const [status, setStatus] = useState("inprogress");
  const [tech, setTech] = useState([]);
  const [team, setTeam] = useState([]);
  const techs = [
    "react",
    "nextjs",
    "javascript",
    "typescript",
    "mongodb",
    "tailwind",
    "bootstrap",
  ];
  const navigate=useNavigate();

  useEffect(() => {
    // Fetch users
    axiosWithToken
      .get("http://localhost:4000/users")
      .then((response) => {
        setUsers(
          response.data.payload.map((user) => ({
            value: user.username,
            label: user.username,
          }))
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      name: projectName,
      description: projectDesc,
      tech,
      accessibleTo: team.map((user) => user.value),
      status,
      tickets: [],
    };

    axiosWithToken
      .post("http://localhost:4000/projects/new-project", newProject)
      .then((response) => {
        if (response.data.message === "Project added successfully") {
          toast.success("Project added successfully");
          navigate("/projects");
        } else {
          toast.error("Project addition failed");
        }
      })
      .catch((error) => {
        console.error("There was an error creating the project!", error);
      });
  };

  const handleTechChange = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setTech([...tech, value]);
    } else {
      setTech(tech.filter((item) => item !== value));
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      <form
        onSubmit={handleSubmit}
        className="max-w-sm mx-auto bg-gray-700 p-6 rounded-lg mt-10"
      >
        <div className="mb-5">
          <label
            htmlFor="projectName"
            className="block mb-2 text-sm font-medium text-white"
          >
            Project Name
          </label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Project Name"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="projectDesc"
            className="block mb-2 text-sm font-medium text-white"
          >
            Project Description
          </label>
          <input
            type="text"
            id="projectDesc"
            value={projectDesc}
            onChange={(e) => setProjectDesc(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Project Description"
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="status"
            className="block mb-2 text-sm font-medium text-white"
          >
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          >
            <option value="done">Done</option>
            <option value="inprogress">In Progress</option>
            <option value="todo">To Do</option>
          </select>
        </div>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-medium text-white">
            Technologies
          </label>
          <div className="flex flex-wrap gap-2">
            {techs.map((tech) => (
              <div className="flex items-start mb-2" key={tech}>
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    value={tech}
                    id={tech}
                    onChange={handleTechChange}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  />
                </div>
                <label
                  htmlFor={tech}
                  className="ml-2 text-sm font-medium text-white"
                >
                  {tech}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-5">
          <label
            htmlFor="team"
            className="block mb-2 text-sm font-medium text-white"
          >
            Accessible To
          </label>
          <Select
            id="team"
            isMulti
            options={users}
            value={team}
            onChange={setTeam}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select team members"
          />
        </div>
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default CreateProject;
