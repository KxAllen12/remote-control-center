export default function ErrorMessage({ message }) {
  return (
    <p className="text-red-500 text-center font-semibold">Error: {message}</p>
  );
}
