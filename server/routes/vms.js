"use server";

// Import required modules
import express from "express";
import { NodeSSH } from "node-ssh";
import getDb from "../db.js";

// Define a route module
const router = express.Router();

// Function to get VM by ID
const getVMById = async (vmId) => {
  const db = await getDb();
  return db.get("SELECT * FROM vms WHERE id = ?", vmId);
};

// Connects to a VM using SSH and executes a command
const executeSSHCommand = async (vm, command = "uptime") => {
  const ssh = new NodeSSH();
  try {
    await ssh.connect({
      // pull from db
      host: vm.host,
      username: vm.username,
      password: vm.password,
    });
    return await ssh.execCommand(command);
  } finally {
    ssh.dispose(); // Ensure the SSH connection is closed
  }
};

/*
 * GET /ssh/:vmId
 * Handles SSH command execution for a specific VM
 * - Looks up the VM by ID
 * - If found connects via SSH and runs the command
 * - Returns the command output and VM details
 * - Responds with 404 if VM not found, or 500 on error
 */
router.get("/ssh/:vmId", async (req, res) => {
  try {
    // get vm with selected id
    const vm = await getVMById(req.params.vmId);
    // No vm found
    if (!vm) return res.status(404).json({ error: "VM not found" });
    // execute the command
    const result = await executeSSHCommand(vm);
    // Send back the output and any errors
    res.json({
      sshOutput: result.stdout,
      sshError: result.stderr,
      selectedVM: vm, // return the VM selected
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
 * GET /vms
 * Returns a list of all VMs from the database
 * - Fetches all VM records and returns them as JSON
 * - Responds with 500 on database errors
 */
router.get("/vms", async (req, res) => {
  try {
    const db = await getDb();
    const vms = await db.all("SELECT * FROM vms");
    res.json(vms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
 * POST /vms
 * Creates a new VM entry in the database
 * - Expects JSON body with VM details
 * Validates required fields (name, host, username, password)
 * Inserts the new VM into the database
 * Returns the created VM details on success
 * Responds with 400 if required fields are missing
 */

router.post("/vms", async (req, res) => {
  const {
    name,
    host,
    username,
    password,
    port = 22,
    tags = "",
    notes = "",
  } = req.body;

  // Validate required fields
  if (!name || !host || !username || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const db = await getDb();
    // Insert new VM into the database
    const result = await db.run(
      "INSERT INTO vms (name, host, username, password, port, tags, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, host, username, password, port, tags, notes]
    );
    const newVM = await getVMById(result.lastID); // Fetch the newly created VM
    res.status(201).json(newVM); // Respond with the new VM details
  } catch (error) {
    console.error("Error creating VM:", error);
    res.status(500).json({ error: "Failed to create VM" });
  }
});

/*
 * DELETE /vms/:id
 * Deletes a VM entry by ID
 * - Expects the VM ID in the URL parameter
 * - Deletes the VM from the database
 * - Returns a success message or 404 if not found
 */

router.delete("/vms/:id", async (req, res) => {
  try {
    const db = await getDb();
    const result = await db.run("DELETE FROM vms WHERE id = ?", req.params.id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "VM not found" });
    }
    // Respond with success message
    res.json({ message: "VM deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete VM" });
  }
});

export default router;
