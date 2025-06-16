"use client";

import { useEffect, useState } from "react";
import {
  VMCard,
  VMDetailsCard,
  VMForm,
  LoadingCard,
  ErrorMessage,
  SectionCard,
} from "../utilities/index";

export default function Home() {
  const [selectedVM, setSelectedVM] = useState(null);
  const [vmList, setVMList] = useState([]);
  const [output, setOutput] = useState({ stdout: "", stderr: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [newVM, setNewVM] = useState({
    name: "",
    host: "",
    username: "",
    password: "",
    port: 22,
    tags: "",
    notes: "",
  });

  // Fetch the list of VMs from the backend API when the component loads
  useEffect(() => {
    fetch("http://localhost:8080/vms")
      .then((res) => res.json()) // Parse the JSON response
      .then(setVMList) // Save the VM list to state
      .catch((err) => setError(`Failed to fetch VMs: ${err.message}`)); // Handle fetch errors
  }, []);

  // Effect to clear the error message after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [error]); // Clear error after 3 seconds Error is the dependency

  // Success messages
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [success]); // Clear success message after 3 seconds

  // Handler for when a VM is clicked
  const handleVMClick = async (vmId) => {
    setLoading(true); // Loading to get VM information
    setError(""); // Clear any previous error messages
    setOutput({ stdout: "", stderr: "" }); // Clear previous output if any
    setSelectedVM(null); // Clear previously selected VM

    // Fetch SSH output for the selected VM from the backend
    try {
      const res = await fetch(`http://localhost:8080/ssh/${vmId}`);
      const data = await res.json(); // Parse the JSON response

      if (data.error) throw new Error(data.error); // If backend returns an error, throw it

      // Save SSH command output and error to state
      setOutput({
        stdout: data.sshOutput,
        stderr: data.sshError,
      });

      // Save selected VM data to state
      setSelectedVM(data.selectedVM);
    } catch (err) {
      setError(`Failed to execute SSH command: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for input changes in the new VM form
  const handleInputChange = (data) => {
    const { name, value } = data.target;
    // Update the new VM form state with the input value
    setNewVM((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to add a new VM to the database
  const handleAddVM = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      const res = await fetch("http://localhost:8080/vms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVM),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // Add the new VM to the list
      setVMList((prev) => [...prev, data]);
      // Clear the form fields
      setNewVM({
        name: "",
        host: "",
        username: "",
        password: "",
        port: 22,
        tags: "",
        notes: "",
      });
      setSuccess("VM added successfully!");
    } catch (err) {
      setError(`Failed to add VM: ${err.message}`);
    }
  };

  // Function to delete a VM from the list
  const handleDeleteVM = async (vmId) => {
    try {
      const res = await fetch(`http://localhost:8080/vms/${vmId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`Failed to delete VM with ID ${vmId}`);
      }
      // Remove the deleted VM from the list
      setVMList((prev) => prev.filter((vm) => vm.id !== vmId));
      setSuccess("VM deleted successfully!");
    } catch (err) {
      setError(`Failed to delete VM: ${err.message}`);
    }
  };

  // Render the SSH page UI
  return (
    <>
      <nav className="text-xl bg-gray-800/60 text-green-500 p-4"> HI </nav>
      <main className="min-h-screen flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl">
          {/* Page title */}
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold text-center text-green-500 mb-4">
              Remote Control Center
            </h1>
            {/* Description text */}
            <p className="text-violet-400 mt-2">
              Select a VM below to connect and view its details and output.
            </p>
          </header>
          {/* Form to add a new VM */}
          <SectionCard title={"Add new VM"} className="bg-red-500">
            <VMForm
              newVM={newVM}
              handleInputChange={handleInputChange}
              handleAddVM={handleAddVM}
            />
          </SectionCard>

          {/* Section: List all available VMs */}
          <SectionCard title={"Available VMs"}>
            {/* Render each VM as a button */}
            {vmList.length === 0 ? (
              <p className="text-violet-400 text-center">
                No VMs available. Please add some VMs to the database.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vmList.map((vm) => (
                  <VMCard
                    key={vm.id}
                    vm={vm}
                    onClick={() => handleVMClick(vm.id)}
                    onDelete={() => handleDeleteVM(vm.id)}
                  />
                ))}
              </div>
            )}
          </SectionCard>

          {/* loading indicator while connecting to VM */}
          {loading && <LoadingCard text="Connecting to VM..." />}

          {/* Show selected VM details if available */}
          {selectedVM && <VMDetailsCard vm={selectedVM} output={output} />}

          {/* Show success messages */}
          {success && (
            <div className="my-2 text-green-500 text-center font-semibold">
              {success}
            </div>
          )}

          {/* Show any error messages */}
          {error && <ErrorMessage message={error} />}
        </div>

        {/* Footer with copyright notice */}
        <footer className="mt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Allan Perez. All rights reserved.
        </footer>
      </main>
    </>
  );
}
