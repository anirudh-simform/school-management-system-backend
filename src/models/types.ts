export type User = {
    firstname: string;
    lastname: string;
    department?: string;
    dob: string;
    phone: string;
    email: string;
    password: string;
    gender: "Male" | "Female";
    role: "Admin" | "Instructor" | "Student";
    address: string;
};
