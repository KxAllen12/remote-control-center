"use client";

export default function VMCard({ vm, onClick, onDelete }) {
  return (
    <div
      onClick={() => onClick(vm.id)}
      className="flex items-center w-full bg-teal-600/50 hover:bg-teal-800/60 px-6 py-4 rounded-2xl transition duration-200 group"
    >
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">
          {vm.name} — {vm.host} ({vm.username})
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent card click
          onDelete(vm.id);
        }}
        className="ml-4 p-2 text-white"
        title="Delete VM"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-6"
        >
          <path
            fillRule="evenodd"
            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
