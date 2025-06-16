export default function SectionCard({ title, children }) {
  return (
    <section className="bg-gray-800/60 rounded-xl shadow p-6 mb-10">
      <h2 className="font-semibold text-xl text-white text-center mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}
