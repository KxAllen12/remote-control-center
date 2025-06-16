# Remote Control Center

---

## Table of Contents

- [Overview](#overview)
- [Quickstart](#quickstart)
- [Styling](#styling)

---

## Overview

**Remote Control Center** is a personal project and proof-of-concept web application for managing and connecting to remote virtual machines (VMs) via SSH.  
The goal is to provide a simple interface for adding, viewing, and removing VMs, and to execute commands on them from a web UI.

**Key Features:**

- Full-stack app using React (frontend) and Express (backend)
- Stores VM connection info in a SQLite database
- Executes SSH commands from the backend

**Current Limitations:**

- No authentication or user separation: all VM data is shared among all users
- Not intended for production or real-world use
- Sensitive information should not be stored in the database in this state

**Future Plans:**

- Implement user authentication and per-user data separation
- Improve security and error handling

---

## Quickstart

This project is not yet ready for general use or deployment.  
The following steps are for documentation and development reference only.

### Project Structure

- `/client` — React frontend (UI for managing VMs)
- `/server` — Express backend (API, SSH logic, database)
- `/server/vms.sqlite` — SQLite database (stores VM info)

### How It Works

1. The backend provides API endpoints for managing VMs and executing SSH commands.
2. The frontend allows users to add, view, and delete VMs.
3. All VM data is stored in a single SQLite database on the server.
4. **Currently, all users share the same data.**

---

## Styling

The frontend uses [Tailwind CSS](https://tailwindcss.com/) for styling.  
Styles can be customized in `client/src/app/globals.css` or by editing Tailwind classes in the React components.

---

## Disclaimer

This project is for educational and demonstration purposes only.  
It is not secure for real-world use and should not be used to store or manage sensitive information.  
User authentication and improved security are planned
