"use client";

export default function VMDetailsCard({ vm, output }) {
  return (
    <div>
      <section className="bg-gray-800 rounded-xl shadow p-5 mb-6 text-gray-300 space-y-1">
        <div>
          <span className="text-teal-400 font-semibold">VM:</span> {vm.name}
        </div>
        <div>
          <span className="text-teal-400 font-semibold">Host:</span> {vm.host}
        </div>
        <div>
          <span className="text-teal-400 font-semibold">User:</span>{" "}
          {vm.username}
        </div>
      </section>

      {output.stdout && (
        <div className="mt-4 bg-black rounded-md p-4 font-mono text-sm text-white whitespace-pre-wrap">
          <p className="text-teal-300 font-semibold">Output:</p>
          <pre>{output.stdout}</pre>
        </div>
      )}

      {output.stderr && (
        <div className="mt-4 bg-gray-950 border border-yellow-500 text-yellow-400 font-mono p-4 rounded-md text-sm">
          <p className="text-yellow-300 font-semibold">Error Output:</p>
          <pre>{output.stderr}</pre>
        </div>
      )}
    </div>
  );
}
