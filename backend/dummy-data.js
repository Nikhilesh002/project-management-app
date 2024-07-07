{
  projects: [
    {
      name: "zomato app",
      description: "This is a clone of zomato app",
      tech: ["react","mongodb"],
			team:["nik","kinni","kin","nikki"],
			status: "todo", // inprogress, done, todo
      tickets: [
        {
          id: "8am4fg4t8gm",
          type:"bug",   // TODO
          raisedOn: "02-06-2024",
          deadline: "02-07-2024",
          createdBy: "Nik",
          assignedTo: "Kin",
          status: "todo", // inprogress, done, todo
          title: "Admin Panel Front-end",
          description: "Lorem ipsum dolor sit amet ..",
          priority: "medium", // low medium high
          image: "taskImage2",
          tags: [
            { title: "Test", color: "text-red-500" },
            { title: "Front", color: "text-pink-400" }
          ],
          subtasks: [
            { subTask: "add header", isFinished: 1 },
            { subTask: "make responsive", isFinished: 0 }
          ]
        }
      ]
    },
    {
      name: "zomato app",
      description: "This is a clone of zomato app",
      tech: ["react","mongodb"],
			team:["nik","kinni","kin","nikki"],
			status: "backlog", // inprogress, done, todo
      tickets: [
        {
          id: "8am4fg4t8gm",
          type:"bug",   // TODO
          raisedOn: "02-06-2024",
          deadline: "02-07-2024",
          createdBy: "Nik",
          assignedTo: "Kin",
          status: "backlog", // inprogress, done, todo
          title: "Admin Panel Front-end",
          description: "Lorem ipsum dolor sit amet ..",
          priority: "medium", // low medium high
          image: "taskImage2",
          tags: [
            { title: "Test", color: "text-red-500" },
            { title: "Front", color: "text-pink-400" }
          ],
          subtasks: [
            { subTask: "add header", isFinished: 1 },
            { subTask: "make responsive", isFinished: 0 }
          ]
        }
      ]
    },
    {
      "_id": "668aac2d99978b47afec7b99",
      "name": "Ola Cabs",
      "description": "I am making ola cabs",
      "tech": [
        "react",
        "typescript",
        "javascript",
        "mongodb"
      ],
      "accessibleTo": [
        ""
      ],
      "status": "inprogress",
      "tickets": []
    }
  ]
}


{
	users:[
		{
			username:"nik",
			password:"nik123",
      email:"nik@gmail.com",
      role:"admin",
		}
	]
}