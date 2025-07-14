import { parse } from "cookie";

const BASE_URL = "http://localhost:8080";

// Add super admin
async function initializeScript() {
    const response = await fetch(`${BASE_URL}/superAdmin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            firstname: "Super",
            lastname: "admin",
            dob: "1996-03-25",
            phone: "9877898895",
            email: "superAdmin@gmail.com",
            password: "password",
        }),
    });

    if (response.ok) {
        console.log("super admin registered with the following credentials");
        const data = await response.json();
        console.log(data, "\n");
    } else {
        console.log("An error occured \n");
    }

    // Login superAdmin
    let accessToken;
    const loginResponse = await fetch(`${BASE_URL}/superAdmin/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: "superAdmin@gmail.com",
            password: "password",
        }),
    });

    if (loginResponse.ok) {
        console.log("super admin logged in \n");

        const data = await loginResponse.json();
        accessToken = data["accessToken"];

        console.log("accessToken: ", accessToken, "\n");
    } else {
        console.log("An error occured while logging in");
    }

    // Add School
    if (accessToken) {
        const addSchoolResponse = await fetch(`${BASE_URL}/superAdmin/school`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${String(accessToken)}`,
            },
            body: JSON.stringify({
                name: "New School",
                address: "New School Address",
            }),
        });

        if (addSchoolResponse.ok) {
            console.log("school added with the following details");
            const data = await addSchoolResponse.json();
            console.log(data, "\n");
        } else {
            console.log("An error occured while adding school \n");
        }

        // Add School Super Admin
        const addSchoolSuperAdminResponse = await fetch(
            `${BASE_URL}/superAdmin/ssadmin`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${String(accessToken)}`,
                },
                body: JSON.stringify({
                    firstname: "John",
                    lastname: "David",
                    email: "jd@gmail.com",
                    password: "password",
                    dob: "1995-11-02",
                    gender: "Male",
                    phone: "8998677656",
                    schoolId: "1",
                }),
            }
        );

        if (addSchoolSuperAdminResponse.ok) {
            console.log("School super admin added \n");
            return { email: "jd@gmail.com", password: "password" };
        }
    } else {
        console.log("No access token recieved from the server \n");
    }
}

initializeScript()
    .then((x) => {
        console.log("initialization successful \n");
        console.log(
            "Use the following credentials to login as a school super admin: \n"
        );

        console.log("email: ", x?.email);
        console.log("password: ", x?.password);
    })
    .catch((x) => {
        console.log("Some error occurred", x);
    });
