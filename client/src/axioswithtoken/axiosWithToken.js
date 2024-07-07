import axios from "axios";

// const token=localStorage.getItem("token");

export const axiosWithToken=axios.create({
  headers:{Authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5payIsImlhdCI6MTcyMDMzMzE3MywiZXhwIjoxNzIwNDE5NTczfQ.Zp7bhT4FqHZXenG2VSo3Q9ymE7XeOubovA_ByJ35AOU"}
  // headers:{Authorization:`Bearer ${token}`}
});
