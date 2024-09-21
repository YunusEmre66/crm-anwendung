import { AuthController } from "./controller/AuthController"
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
}]