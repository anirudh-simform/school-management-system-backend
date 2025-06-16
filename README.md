# School Management System Backend

This is project is a multi-tenant School Management System (SMS) that is designed to streamline the operations of educational institutions by providing an integrated solution for managing classes, assignments, exams, attendance, and communication between teachers, students, and administrators. The system features dedicated accounts for Admins, Teachers, and Students, with specific functionality tailored to each group’s needs. It also allows for seamless communication, assignment management, and class scheduling.

Target Users:

- Admins

- Teachers

- Students

## Project Structure

The source folder is segregated into the following folders: -

- Controllers: Contains files that contain the actual logic of the application.

- Routes: Contains files corresponding to various routes that are supported by the application, all the routes are defined in this folder.

- Errors: Contains custom error classes that inherit from the built in Error class.

- Middlewares: Contains generic middleware functions that cannot be categorized as a controller.

- Validation: Contains validation functions that validate request body.

- Authentication: Contains functions related to user authentication.

- Logging: Contains instance and configuration of logger.

> Some folders also contain a `utilityMethods` folder which contains helper functions used commonly across files in that folder.

## Current Implementation:

The features that the current implementation has are:-

- SuperAdmin registration and login
- User Authentication
- Course CRUD operations
- Program CRUD operations
- Users CRUD operations
- Student Batch CRUD operations
- Instructor Department CRUD operations
- Grade Level CRUD operations

## Links

- [ER Diagram](https://app.eraser.io/workspace/KJCnjMn0I22424ffcXX0?origin=share)
- [Project Proposal](https://simformsolutionspvtltd-my.sharepoint.com/:w:/r/personal/anirudh_nair_simformsolutions_com/Documents/Anirudh-Muraleedharan-Nair-School-Management-System.docx?d=w00068d3c8a28420395c6d906bbf369fc&csf=1&web=1&e=IsphDo)
