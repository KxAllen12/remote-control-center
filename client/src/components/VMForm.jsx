"use client";

export default function VMForm({ newVM, handleInputChange, handleAddVM }) {
  return (
    <form
      onSubmit={handleAddVM}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm"
    >
      {[
        { name: "name", label: "Name" },
        { name: "host", label: "Host" },
        { name: "username", label: "Username" },
        { name: "password", label: "Password", type: "password" },
        { name: "port", label: "Port", type: "number" },
        { name: "tags", label: "Tags (comma-separated)" },
        { name: "notes", label: "Notes" },
      ].map(({ name, label, type = "text" }) => (
        <div key={name} className="flex flex-col">
          <label className="text-gray-300 mb-1">{label}</label>
          <input
            type={type}
            name={name}
            value={newVM[name]}
            onChange={handleInputChange}
            className="rounded-md p-2 bg-gray-700 text-white"
          />
        </div>
      ))}
      <button
        type="submit"
        // className="sm:col-span-2 mt-4 bg-green-600 hover:bg-green-800 text-white font-semibold py-2 px-4 rounded-lg transition"
        className={`sm:col-span-2 mt-4 font-semibold py-2 px-4 rounded-lg transition 
          ${
            !newVM.name ||
            !newVM.host ||
            !newVM.username ||
            !newVM.password ||
            !newVM.port
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-green-600 hover:bg-green-800 text-white"
          }`}
      >
        Add VM
      </button>
    </form>
  );
}
