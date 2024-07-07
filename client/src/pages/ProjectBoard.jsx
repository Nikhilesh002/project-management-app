import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useLocation } from "react-router-dom";
import { axiosWithToken } from "../axioswithtoken/axiosWithToken";
import toast, { Toaster } from "react-hot-toast";

function ProjectBoard() {
  const location = useLocation();
  const projectId = location.state;
  const [tickets, setTickets] = useState([]);
  const [project, setProject] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newTicket, setNewTicket] = useState({
    type: "",
    raisedOn: "",
    deadline: "",
    createdBy: "",
    assignedTo: "",
    status: "todo",
    title: "",
    description: "",
    priority: "medium",
    image: "",
    tags: [],
    subtasks: []
  });

  // get project tickets
  const getProject = async () => {
    try {
      const response = await axiosWithToken.get(
        `http://localhost:4000/project/${projectId}`
      );
      setProject(response.data.payload);
      setTickets(response.data.payload.tickets);
      setSelectedStatus(response.data.payload.status);
    } catch (error) {
      console.error("Error fetching project:", error);
    }
  };

  useEffect(() => {
    getProject();
  }, [projectId]);

  // handle drag end event
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    const updatedTickets = Array.from(tickets);
    const movedTicket = updatedTickets.find(
      (ticket) => ticket.id === draggableId
    );

    if (movedTicket) {
      movedTicket.status = destination.droppableId;
      setTickets(updatedTickets);

      try {
        await axiosWithToken.put("http://localhost:4000/ticket/change-status", {
          projectId,
          ticketId: draggableId,
          newStatus: destination.droppableId,
        });
      } catch (error) {
        console.error("Error updating ticket status:", error);
      }
    }
  };

  // handle project status change
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // save project status change
  const saveStatusChange = async () => {
    try {
      await axiosWithToken.put("http://localhost:4000/project/change-status", {
        projectId,
        newStatus: selectedStatus,
      });
      toast.success("Status Updated");
      getProject(); // refresh the project data
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  // defining columns based on ticket status
  const columns = {
    todo: {
      title: "To Do",
      items: tickets.filter((ticket) => ticket.status === "todo"),
    },
    inprogress: {
      title: "In Progress",
      items: tickets.filter((ticket) => ticket.status === "inprogress"),
    },
    done: {
      title: "Done",
      items: tickets.filter((ticket) => ticket.status === "done"),
    },
  };

  const handleAddTicket = async () => {
    try {
      const ticketWithProjectId = { ...newTicket, projectId,raisedOn: Date.now() };
      const response = await axiosWithToken.post(
        `http://localhost:4000/project/new-ticket`,
        ticketWithProjectId
      );
      if (response.data.message === "Ticket added successfully") {
        setTickets([...tickets, { ...newTicket, id: response.data.ticketId }]);
        setShowModal(false);
        toast.success("Ticket added successfully");
      } else {
        toast.error("Ticket addition failed");
      }
    } catch (error) {
      console.error("Error adding ticket:", error);
      toast.error("Error adding ticket");
    }
  };

  return (
    <>
      {project && (
        <div className="w-100 mb-5 p-4 bg-gray-200 rounded">
          <Toaster position="top-right" />
          <div className="flex gap-1 w-full">
            <div className="w-1/2">
              <h1 className="text-4xl font-bold mb-2">{project.name}</h1>
              <p className="mb-2">
                <strong>Description:</strong> {project.description}
              </p>
              <p className="mb-2">
                <strong>Tech Stack:</strong> {project.tech.join(", ")}
              </p>
              <p className="mb-2">
                <strong>Team Members:</strong> {project.accessibleTo.join(", ")}
              </p>
            </div>
            <div className="m-auto w-1/2 flex justify-center items-center">
              <button
                type="submit"
                className="px-2 py-1 bg-green-500 rounded border"
                onClick={() => setShowModal(true)}
              >
                Add new ticket
              </button>
            </div>
          </div>
          <div className="mb-2">
            <strong>Status:</strong>
            <select
              className="ml-2 p-1 border rounded"
              value={selectedStatus}
              onChange={handleStatusChange}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button
              className="ml-2 p-1 bg-blue-500 text-white rounded"
              onClick={saveStatusChange}
            >
              Save
            </button>
          </div>
        </div>
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="bg-gray-200 text-center">
          <h1 className="font-bold text-xl">Project Board</h1>
          <div className="grid grid-cols-3 gap-4 p-4 text-gray-800">
            {Object.entries(columns).map(([columnId, column]) => (
              <Droppable key={columnId} droppableId={columnId}>
                {(provided) => (
                  <div
                    className="bg-gray-300 rounded p-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <h2 className="text-lg font-semibold mb-2">
                      {column.title}
                    </h2>
                    {column.items.map((ticket, index) => (
                      <Draggable
                        key={ticket.id}
                        draggableId={ticket.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="bg-gray-400 rounded p-2 mb-2"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <p className="text-sm">{ticket.title}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>
      </DragDropContext>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black  bg-opacity-50">
          <div className="bg-white p-5 rounded w-1/2">
            <h2 className="text-lg font-semibold mb-4">Add New Ticket</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddTicket();
              }}
            >
              <input
                type="text"
                placeholder="Title"
                value={newTicket.title}
                onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                className="mb-2 p-1 border rounded w-full"
                required
              />
              <input
                placeholder="Description"
                value={newTicket.description}
                onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                className="mb-2 p-1 border rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Type"
                value={newTicket.type}
                onChange={(e) => setNewTicket({ ...newTicket, type: e.target.value })}
                className="mb-2 p-1 border rounded w-full"
                required
              />
              <input
                type="date"
                placeholder="Deadline"
                value={newTicket.deadline}
                onChange={(e) => setNewTicket({ ...newTicket, deadline: e.target.value })}
                className="mb-2 p-1 border rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Assigned To"
                value={newTicket.assignedTo}
                onChange={(e) => setNewTicket({ ...newTicket, assignedTo: e.target.value })}
                className="mb-2 p-1 border rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={newTicket.tags.join(", ")}
                onChange={(e) => setNewTicket({ ...newTicket, tags: e.target.value.split(", ") })}
                className="mb-2 p-1 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Subtasks (comma separated)"
                value={newTicket.subtasks.join(", ")}
                onChange={(e) => setNewTicket({ ...newTicket, subtasks: e.target.value.split(", ") })}
                className="mb-2 p-1 border rounded w-full"
              />
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                className="mb-2 p-1 border rounded w-full"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <button
                type="submit"
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Add Ticket
              </button>
              <button
                type="button"
                className="px-2 py-1 bg-red-500 text-white rounded ml-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default ProjectBoard;
