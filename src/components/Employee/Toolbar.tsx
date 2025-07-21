import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

type Props = {
  total: number;
  loading: boolean;
  onOpenModal: () => void;
  onSearch: (keyword: string) => void;
};

export default function Toolbar({ total, loading, onOpenModal, onSearch }: Props) {
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearch(keyword);
    onSearch(keyword);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
      <div className="flex flex-col">
        <span className="text-lg font-medium">
          {loading ? 'Loading...' : `${total} Employee`}
        </span>
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={handleSearch}
          className="mt-2 w-full md:w-64"
        />
      </div>
      <div className="flex gap-2">
        <Button className="bg-blue-500 text-white" onClick={onOpenModal}>
          + Create Employee
        </Button>
        <Button variant="outline" disabled>
          Filter
        </Button>
      </div>
    </div>
  );
}
