import FormCalender from "@/components/form-calender";
import Menu from "@/components/menu";
import { calender } from "@/configs/calender";
import { useGetCalendersQuery } from "@/services/calender";
import React, { useState } from "react";


const Calender = () => {
    const { data: calenders }
        = useGetCalendersQuery(calender.allCalender);


    //* state
    const [defaultValues, setDefaultValues] = useState({
        id: 0,
        calenderType: "",
        title: "",
        description: "",
        user: {
            id: "",
            firstName: "",
            lastName: "",

        },
        participants: [{
            id: "",
            firstName: "",
            lastName: "",

        }]
    })

    function handleEdit(calender: any) {
        console.log(calender);

        setDefaultValues({
            id: calender.id,
            calenderType: calender.calenderType,
            title: calender.title,
            description: calender.description,
            user: {
                id: calender.user.id,
                firstName: calender.user.firstName,
                lastName: calender.user.lastName,
            },
            participants: calender.participantsUser?.map((k: any) => {
                return { id: k.id, firstName: k.firstName, lastName: k.lastName }
            })
        })
    }

    return (
        <>
            <Menu />
            <FormCalender data={defaultValues} id={defaultValues.id} />
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>title</th>
                            <th>description</th>
                            <th>type</th>
                            <th>User</th>
                            <th>Participants</th>
                            <th>Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {calenders?.data.map((calender: any, index: number) => {
                            return (
                                <tr key={index}>
                                    <td>{calender.title}</td>
                                    <td>{calender.description}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>

                                </tr>
                            )
                        })}



                    </tbody>
                </table>
            </div>
        </>
    )



}

