import Backbutton from "@/components/features/Backbutton";

export default function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <main>{children}</main>
      <nav className="text-center p-4">
        <Backbutton />
      </nav>
    </section>
  );
}
