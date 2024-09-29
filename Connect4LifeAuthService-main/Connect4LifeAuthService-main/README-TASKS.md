## Connect4Life Tasks Service

### Introduction

- The service is responisble for manging the blood collection tasks and their status,notify collectors of changes in tasks' status and enabling statistics

### TASK_OBJ

    {
        _id: mongo unique identifier
        taskStatus: required (enum),
        taskAddress: required,
        taskArea: required,
        taskPhoneNumber: required
        issuedAt:required (Date, default by db to insertion time),
        lastUpdatedAt:required (Date, default by db to insertion time),
        closedAt: (Date),
        collectorId: default empty
        collectorName: default empty
        isEquipment: boolean default False
    }

### API's

- <b> GET /api/v1/tasks?id= <TASK_ID> &taskStatus=<Task_Status> &taskArea=<Task_Area> &issuedAt=<Issue_Date> &closedAt=<Issue_Date>&collectorUsername=<CollectorId> </b>

  requiredPermission = ['getTasks']
  returns 200 and list of tasks

- <b> GET /api/v1/tasks/myTasks?id= <TASK_ID> &taskStatus=<Task_Status> &taskArea=<Task_Area> &issuedAt=<Issue_Date> &closedAt=<Issue_Date> </b>

  requiredPermission = ['getMyTasks']
  returns 200 and list of tasks

- <b> POST /api/v1/task {<TASK_OBJ>} </b>

  requiredPermission = ['postTask']
  returns 201 if successful, 400 for bad request of 403 for access forbidden. this endpoind will enclude the logic of distributing the task to the relevant users (notifyUsers())

- <b> DELETE /api/v1/task/id<TASK_ID> </b>

  requiredPermission = ['deleteTask']
  returns 200 if successful, 400 for bad request of 403 for access forbidden.

- <b> PATCH /api/v1/task

  body:{taskId:<TASK_ID> required,
  taskAddress: optional,
  taskArea: optional,
  taskPhoneNumber:optional
  } </b>

  requiredPermission: ["patchTaskDetails"]

  Returns 200 OK if the task is updated successfully, otherwise return 400 (or 401/403 for authentication/authorization problem).

- <b> PATCH /api/v1/task/claimTask

  body:{taskId:<TASK_ID> required,
  } </b>

  requiredPermission: ["patchTaskState"]

  Returns 200 OK if the task is claimed successfully, otherwise return 400 (or 401/403 for authentication/authorization problem).

- <b> PATCH /api/v1/task/releaseTask

  body:{taskId:<TASK_ID> required,
  } </b>

  requiredPermission: ["patchTaskState"]

  Returns 200 OK if the task is released successfully, otherwise return 400 (or 401/403 for authentication/authorization problem).

- <b> PATCH /api/v1/task/finishTask

  body:{taskId:<TASK_ID> required,
  } </b>

  requiredPermission: ["patchTaskState"]

  Returns 200 OK if the task is finished successfully, otherwise return 400 (or 401/403 for authentication/authorization problem).

connect for lift is greadt!!
