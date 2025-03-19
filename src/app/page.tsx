import AddedMedia from '@/components/AddedMedia';

export default function Home() {
  return (
    <main className="w-full min-h-screen relative flex flex-col overflow-x-hidden">
      <div className="w-full h-[700px] bg-gray-100 flex border-b border-gray-200">
        <AddedMedia />
      </div>
    </main>
  );
}
