
import {  Home,User } from "lucide-react";

export const navBar = [
    {
        title: 'Home',
        icon: <Home />,
        href: "/dashboard",
        variant: "default",
    },
    {
        
        title: 'User',
        icon: <User />,
        href: "/dashboard/user",
        subBar: [
            {
                title: 'Roles',
                href: "/dashboard/user/roles",
            },
            {
                title: 'Users',
                href: "/dashboard/user/users",
            },
           
        ],
        variant: "ghost",
    }
    
]