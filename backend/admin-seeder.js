const adminDetails = require("./models/details/admin-details.model");
const connectToMongo = require("./database/db");
const mongoose = require("mongoose");

const seedData = async () => {
    try {
        await connectToMongo();
        await adminDetails.deleteMany({});

        const password = "admin321";
        const employeeId = 123457;

        const adminDetail = {
            employeeId: employeeId,
            firstName: "Faiz",
            middleName: "Ullah",
            lastName: "Khan",
            email: "[EMAIL_ADDRESS]",
            phone: "3328753452",
            profile: "Faculty_Profile_123456.jpg",
            address: "Fazal Shah Mitha Khel",
            city: "Bannu",
            state: "Khyber Pakhtunkhwa",
            pincode: "28100",
            country: "Pakistan",
            gender: "male",
            dob: new Date("2004-12-28"),
            designation: "System Administrator",
            joiningDate: new Date(),
            salary: 100000,
            status: "active",
            isSuperAdmin: true,
            emergencyContact: {
                name: "Faiz Ullah Khan",
                relationship: "second Number",
                phone: "3317947676",
            },
            bloodGroup: "B+",
            password: password,
        };

        await adminDetails.create(adminDetail);

        console.log("\n=== Admin Credentials ===");
        console.log("Employee ID:", employeeId);
        console.log("Password:", password);
        console.log("Email:", adminDetail.email);
        console.log("=======================\n");
        console.log("Seeding completed successfully!");
    } catch (error) {
        console.error("Error while seeding:", error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

seedData();
