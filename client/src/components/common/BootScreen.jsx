/** Layar tunggu awal; memakai <main> dan <h1> agar tetap memenuhi aksesibilitas. */
export default function BootScreen() {
  return (
    <main className="boot-screen">
      <span className="brand-mark">
        <span className="pulse-dot" />
      </span>
      <h1>Preparing your campus...</h1>
    </main>
  );
}
