import { AddressController } from "./controller/AddressController";
import { AuthController } from "./controller/AuthController"
import { CalenderController } from "./controller/CalenderController";
import { CityController } from "./controller/CityController";
import { CountryController } from "./controller/CountryController";
import { DistrictController } from "./controller/DistrictController";
import { EmailController } from "./controller/EmailController";
import { EnumController } from "./controller/EnumController";
import { FileController } from "./controller/FileController";
import { PhoneController } from "./controller/PhoneController"
import { SearchController } from "./controller/SearchController";
import { TaskController } from "./controller/TaskController";
import { TownController } from "./controller/TownController";
import { UserController } from "./controller/UserController"

export const Routes = [{

    //! USER
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
    method: "post",
    route: "/new-user",
    controller: UserController,
    action: "newUser"
}, {
    method: "put",
    route: "/users/:id",
    controller: UserController,
    action: "update"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, 
 //! AUTH
{
    method: "post",  //! daima postda olur login işlemi get de olmaz.
    route: "/login",
    controller: AuthController, 
    action: "login" 
}, {
    method: "post",
    route: "/register",
    controller: AuthController,
    action: "register"
}, {
    method: "put",
    route: "/user/update",
    controller: AuthController,
    action: "update"
}, {
    method: "put",
    route: "/user/change-password",
    controller: AuthController,
    action: "changePassword"
}, 
//! PHONE

{
    method: "get",
    route: "/phones",
    controller: PhoneController,
    action: "all"
}, {
    method: "get",
    route: "/phones/:id",
    controller: PhoneController,
    action: "one"
}, {
    method: "post",
    route: "/phones",
    controller: PhoneController,
    action: "save"
}, {
    method: "put",
    route: "/phones/:id",
    controller: PhoneController,
    action: "update"
}, {
    method: "delete",
    route: "/phones/:id",
    controller: PhoneController,
    action: "remove"
}, 
 //! EMAIL

{
    method: "get",
    route: "/email",
    controller: EmailController,
    action: "all"
}, {
    method: "get",
    route: "/email/:id",
    controller: EmailController,
    action: "one"
}, {
    method: "post",
    route: "/email",
    controller: EmailController,
    action: "save"
}, {
    method: "put",
    route: "/email/:id",
    controller: EmailController,
    action: "update"
}, {
    method: "delete",
    route: "/email/:id",
    controller: EmailController,
    action: "remove"
}, 
 //! ADDRESS

{
    method: "get",
    route: "/addresses",
    controller: AddressController,
    action: "all"
}, {
    method: "get",
    route: "/addresses/:id",
    controller: AddressController,
    action: "one"
}, {
    method: "post",
    route: "/addresses",
    controller: AddressController,
    action: "save"
}, {
    method: "put",
    route: "/addresses/:id",
    controller: AddressController,
    action: "update"
}, {
    method: "delete",
    route: "/addresses/:id",
    controller: AddressController,
    action: "remove"
}, 
 //! TASK

{
    method: "get",
    route: "/tasks",
    controller: TaskController,
    action: "all"
}, {
    method: "get",
    route: "/tasks/:id",
    controller: TaskController,
    action: "one"
}, {
    method: "post",
    route: "/tasks",
    controller: TaskController,
    action: "save"
}, {
    method: "put",
    route: "/tasks/:id",
    controller: TaskController,
    action: "update"
}, {
    method: "put",
    route: "/tasks/:id/next",
    controller: TaskController,
    action: "next"
}, {
    method: "delete",
    route: "/tasks/:id",
    controller: TaskController,
    action: "remove"
},
 //! CALENDER


{
    method: "get",
    route: "/calenders",
    controller: CalenderController,
    action: "all"
}, {
    method: "get",
    route: "/calenders/:id",
    controller: CalenderController,
    action: "one"
}, {
    method: "post",
    route: "/calenders",
    controller: CalenderController,
    action: "save"
}, {
    method: "put",
    route: "/calenders/:id",
    controller: CalenderController,
    action: "update"
}, {
    method: "delete",
    route: "/calenders/:id",
    controller: CalenderController,
    action: "remove"
}, 
 //! ENUM

{
    method: "get",
    route: "/enum/task",
    controller: EnumController,
    action: "task"
}, {
    method: "get",
    route: "/enum/calender",
    controller: EnumController,
    action: "calender"
}, {
    method: "get",
    route: "/enum/contact",
    controller: EnumController,
    action: "contact"
}, {
    method: "get",
    route: "/enum/log",
    controller: EnumController,
    action: "log"
}, {
    method: "get",
    route: "/enum/task-status",
    controller: EnumController,
    action: "taskStatus"
}, {
    method: "get",
    route: "/enum/confirm",
    controller: EnumController,
    action: "confirm"
}, {
    method: "get",
    route: "/enum/users-role",
    controller: EnumController,
    action: "usersRole"
}, 
 //! FileController, CountryController,CityController,DistrictController,TownController,SearchController
{
    method: "get",
    route: "/file-read",
    controller: FileController,
    action: "all"
}, {
    method: "get",
    route: "/country",
    controller: CountryController,
    action: "all"
}, {
    method: "get",
    route: "/city",
    controller: CityController,
    action: "all"
}, {
    method: "get",
    route: "/district",
    controller: DistrictController,
    action: "all"
}, {
    method: "get",
    route: "/town",
    controller: TownController,
    action: "all"
}, {
    method: "get",
    route: "/search",
    controller: SearchController,
    action: "all"
}];