import { AddressController } from "./controller/AddressController"
import { AuthController } from "./controller/AuthController"
import { LogController } from "./controller/LogController"
import { UserController } from "./controller/UserController"

export const Routes = [
    //!usercontroller
    {
        method: "get",
        route: "/users",
        controller: UserController,
        action: "all"
    }, {
        method: "get",
        route: "/users/:id",
        controller: UserController,
        action: "one"
    }, {
        method: "post",
        route: "/users",
        controller: UserController,
        action: "save"
    }, {
        method: "delete",
        route: "/users/:id",
        controller: UserController,
        action: "remove"
    }, {
        method: "post",
        route: "/new-user",
        controller: UserController,
        action: "newUser",
    }, , {
        method: "put",
        route: "/users/:id",
        controller: UserController,
        action: "update"
    },
    //! authcontroller
    {
        method: "post",
        route: "/register",
        controller: AuthController,
        action: "register"
    }, {
        method: "post",
        route: "/login",
        controller: AuthController,
        action: "login"
    },
    //! addressController 

    {
        method: "get",
        route: "/addresses",
        controller: AddressController,
        action: "all"
    }, {
        method: "post",
        route: "/addresses",
        controller: AddressController,
        action: "save"
    }, //! LogController 
    {
        method: "get",
        route: "/logs",
        controller: LogController,
        action: "all"
    },
    {
        method: "get",
        route: "/logs/:id",
        controller: LogController,
        action: "one"
    },
    {
        method: "post",
        route: "/logs",
        controller: LogController,
        action: "save"
    },
    {
        method: "put",
        route: "/logs/:id",
        controller: LogController,
        action: "update"
    },
    {
        method: "delete",
        route: "/logs/:id",
        controller: LogController,
        action: "remove"
    }]


