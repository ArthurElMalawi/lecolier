export function Footer() {
  return (
    <footer className="w-full border-t bg-white py-6 text-center text-sm text-zinc-500">
      <div className="mx-auto max-w-6xl px-6">
        <p>&copy; {new Date().getFullYear()} L'écolier. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
