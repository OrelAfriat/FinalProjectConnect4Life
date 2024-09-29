## Connect4Life Authentication Service

### Introductionn

- The service is responisble for manging the application users, and producing valid tokens for all other services, including relevant permissions.

### Permissions

- The user can have 1 of the following permissions: "U" (User), "A" (Admin)

- The service will predefined user name named "admin" with password "admin", and permissions of "A".

- Passwords will be stored encrypted in the DB

- PERMISSIONS:

1. postUser - A
2. patchUser - A / U
3. getUser - A
4. promoteUser - A
5. deleteUser - A
6. postTask - A
7. patchTaskDetails - A
8. deleteTask - A
9. getTasks - A
10. getMyTasks - U
11. patchTaskState - A / U
<!-- 12. getUserStatistics - U
12. getStatistics - A -->

### USER_OBJ

    {
        _id: mongo unique identifier
        username :required,
        password :required,
        firstName :required,
        lastName :required,
        email :required,
        livingArea: required
        areasOfIntrests:required
        phoneNumber: required,
        permissions: default, "U"
    }

### API's

*  <b> GET /api/v1/users?id= <USER_ID> &username=<USER_NAME> </b> DONE

  requiredPermission = ['getUser']
  returns 200 and the username of the user and the permissions letter

* <b> POST /api/v1/signup {USER_OBJ} </b> DONE
    
    Returns: 201 CREATED in case of successfull signup, 400 for invalid input.
    The created user will be with permission of "U".

* <b>POST /api/v1/login {"username": <USER_NAME>, "password": <USER_PASSWORD>} </b> DONE

  Returns 200 OK and {"token": <USER_TOKEN>} in case of successfull login, otherwise 400.

  The <USER_TOKEN> will be JWT token with the following structure:

  {

        "username": <USER_NAME>,
        "permissions": <PERMISSIONS>


  }

  The expiration date will be <b>10 minutes</b> larger the token issue date.

- <b> GET /api/v1/users?areaOfIntrest= <Area_Of_Intrest> &livingArea=<Living_Area></b>

  requiredPermission = ['getUser']
  returns 200 if successful, else 403 (forbidden).
  return:[<USER_OBJ>]


* <b> POST /api/v1/refreshToken </b> DONE
    
    Protected by JWT verification (expiration time larger than the current time).

  Returns 200 OK and {"token": <USER_TOKEN>} in case of successfull refresh, with new token expiration.

* <b> PUT /api/v1/promoteUser { "username": <USER_NAME>, "userType": <USER_TYPE> } </b> DONE

  Protected by JWT verification (expiration time larger than the current time).

  Returns 200 OK if the user updated successfully, otherwise return 400 (or 401 for authentication problem).

  If the requested USER_NAME is "admin" or the user itself, 400 will be responeded.

- <b> PATCH /api/v1/user {userId:<USER_ID>,<ONE_OR_MORE_FROM_USER_FIELDS>} </b>

  requiredPermission: ["patchUser"]

  Returns 200 OK if the user updated successfully, otherwise return 400 (or 401 for authentication problem).

- <b> Delete /api/v1/user {userId:<USER_ID>} </b>

  requiredPermission: ["deleteUser"]

  Returns 200 OK if the user updated successfully, otherwise return 400 (or 401 for authentication problem).
